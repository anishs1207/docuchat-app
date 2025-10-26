import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { DynamicTool } from "langchain/tools";
import { AgentExecutor, createToolCallingAgent } from "langchain/agents";
import { ChatPromptTemplate } from "@langchain/core/prompts";

// Helper for Gmail's URL-safe base64 encoding
function base64Encode(str: string) {
  return Buffer.from(str)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query, accessToken } = body;

    console.log("Received request:", {
      query: query?.substring(0, 100),
      hasToken: !!accessToken,
    });

    if (!query || !accessToken) {
      return NextResponse.json(
        { error: "query and accessToken are required" },
        { status: 400 },
      );
    }

    if (!process.env.GOOGLE_API_KEY) {
      console.error("GOOGLE_API_KEY environment variable is not set");
      return NextResponse.json(
        { error: "Server configuration error: Missing API key" },
        { status: 500 },
      );
    }

    // Gmail API setup
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI,
    );

    oauth2Client.setCredentials({ access_token: accessToken });
    const gmail = google.gmail({ version: "v1", auth: oauth2Client });

    // Test Gmail connection
    try {
      const profile = await gmail.users.getProfile({ userId: "me" });
      console.log("Gmail connection successful:", profile.data.emailAddress);
    } catch (authError) {
      console.error("Gmail authentication failed:", authError);
      return NextResponse.json(
        { error: "Invalid or expired access token" },
        { status: 401 },
      );
    }

    // --- Tools (readEmails, sendEmail, deleteEmail, draftEmail) ---
    const readEmails = new DynamicTool({
      name: "readEmails",
      description:
        "Reads Gmail messages. Expects JSON input with optional 'count' (default 5) and 'q' (query, default 'is:unread')",
      func: async (input: string) => {
        try {
          let params = { count: 5, q: "is:unread" };
          if (input && input.trim()) {
            try {
              params = { ...params, ...JSON.parse(input) };
            } catch {
              params.q = input;
            }
          }

          const listRes = await gmail.users.messages.list({
            userId: "me",
            maxResults: params.count,
            q: params.q,
          });

          const messages = listRes.data.messages || [];
          if (messages.length === 0) {
            return JSON.stringify({
              message: "No emails found",
              count: 0,
              emails: [],
            });
          }

          const detailed = await Promise.all(
            messages.map(async (msg) => {
              try {
                const full = await gmail.users.messages.get({
                  userId: "me",
                  id: msg.id!,
                });
                const headers = full.data.payload?.headers || [];
                return {
                  id: msg.id,
                  snippet: full.data.snippet,
                  subject:
                    headers.find((h) => h.name === "Subject")?.value ||
                    "No Subject",
                  from:
                    headers.find((h) => h.name === "From")?.value ||
                    "Unknown Sender",
                  date: headers.find((h) => h.name === "Date")?.value || "",
                };
              } catch (msgError) {
                return { id: msg.id, error: "Failed to fetch message details" };
              }
            }),
          );

          return JSON.stringify({ count: detailed.length, emails: detailed });
        } catch (error) {
          return JSON.stringify({
            error: "Failed to read emails",
            details: (error as Error).message,
          });
        }
      },
    });

    const sendEmail = new DynamicTool({
      name: "sendEmail",
      description:
        "Sends an email. Expects JSON input: { recipient, subject, body }. If any field is missing, returns a prompt asking for more details.",
      func: async (input: string) => {
        let data;
        try {
          data = JSON.parse(input);
        } catch {
          return JSON.stringify({
            needsMoreInfo: true,
            message:
              "Invalid JSON. Please provide recipient, subject, and body.",
          });
        }

        const missingFields = [];
        if (!data.recipient) missingFields.push("recipient");
        if (!data.subject) missingFields.push("subject");
        if (!data.body) missingFields.push("body");

        if (missingFields.length > 0) {
          return JSON.stringify({
            needsMoreInfo: true,
            message: `Missing fields: ${missingFields.join(
              ", ",
            )}. Please provide them to send the email.`,
          });
        }

        // All info is present, proceed to send email
        try {
          const emailContent = [
            `To: ${data.recipient}`,
            `Subject: ${data.subject}`,
            `Content-Type: text/plain; charset="UTF-8"`,
            ``,
            data.body,
          ].join("\r\n");

          const raw = base64Encode(emailContent);

          const result = await gmail.users.messages.send({
            userId: "me",
            requestBody: { raw },
          });

          return JSON.stringify({
            success: true,
            messageId: result.data.id,
            message: `Email sent to ${data.recipient}`,
          });
        } catch (error) {
          return JSON.stringify({
            error: "Failed to send email",
            details: (error as Error).message,
          });
        }
      },
    });

    const deleteEmail = new DynamicTool({
      name: "deleteEmail",
      description: "Deletes an email. Expects JSON input: { messageId }",
      func: async (input: string) => {
        try {
          const { messageId } = JSON.parse(input);
          if (!messageId)
            return JSON.stringify({ error: "messageId is required" });

          await gmail.users.messages.delete({ userId: "me", id: messageId });
          return JSON.stringify({ success: true, deletedId: messageId });
        } catch (error) {
          return JSON.stringify({
            error: "Failed to delete email",
            details: (error as Error).message,
          });
        }
      },
    });

    const draftEmail = new DynamicTool({
      name: "draftEmail",
      description:
        "Creates a draft email. Expects JSON input: { recipient, subject, body }",
      func: async (input: string) => {
        try {
          const { recipient, subject, body } = JSON.parse(input);
          if (!recipient || !subject || !body) {
            return JSON.stringify({
              error: "recipient, subject, and body are required",
            });
          }

          const emailContent = [
            `To: ${recipient}`,
            `Subject: ${subject}`,
            `Content-Type: text/plain; charset="UTF-8"`,
            ``,
            body,
          ].join("\r\n");

          const raw = base64Encode(emailContent);

          const result = await gmail.users.drafts.create({
            userId: "me",
            requestBody: { message: { raw } },
          });

          return JSON.stringify({
            success: true,
            draftId: result.data.id,
            message: `Draft created for ${recipient}`,
          });
        } catch (error) {
          return JSON.stringify({
            error: "Failed to create draft",
            details: (error as Error).message,
          });
        }
      },
    });

    // --- LLM ---
    const llm = new ChatGoogleGenerativeAI({
      model: "gemini-2.0-flash-exp",
      temperature: 0.1,
      apiKey: process.env.GOOGLE_API_KEY,
    });

    // --- Prompt ---
    const prompt = ChatPromptTemplate.fromMessages([
      [
        "system",
        "You are a helpful Gmail assistant. Use the tools provided to manage emails.",
      ],
      ["human", "{input}"],
      ["placeholder", "{agent_scratchpad}"],
    ]);

    console.log("Initializing new agent executor...");

    // --- New agent setup ---
    const agent = createToolCallingAgent({
      llm,
      tools: [readEmails, sendEmail, deleteEmail, draftEmail],
      prompt,
    });

    const executor = new AgentExecutor({
      agent,
      tools: [readEmails, sendEmail, deleteEmail, draftEmail],
      returnIntermediateSteps: true,
      maxIterations: 5,
      verbose: true,
    });

    console.log("Running agent with query:", query);

    const result = await Promise.race([
      executor.invoke({ input: query }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Agent execution timeout")), 60000),
      ),
    ]);

    console.log("Agent result:", result);

    return NextResponse.json({
      success: true,
      data: result.output,
      intermediateSteps: result.intermediateSteps || [],
    });
  } catch (err) {
    console.error("Main error:", err);
    return NextResponse.json(
      {
        error: "Failed to process Gmail request",
        details: err instanceof Error ? err.message : String(err),
        stack:
          process.env.NODE_ENV === "development"
            ? (err as Error).stack
            : undefined,
      },
      { status: 500 },
    );
  }
}
