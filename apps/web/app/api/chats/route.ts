import {NextResponse, NextRequest} from "next/server";
import prisma from "@/lib/db";
import {z} from "zod";

const chatSchema = z.object({
    writtenAtTime: z.string().regex(/^(0?[1-9]|1[0-2]):[0-5][0-9](am|pm)$/i,  "Time must be in the format h:mmam or h:mmpm"),
    messageContent: z.string().min(1, "Must be atleast 1 character"),
    writtenBy: z.enum(["ai", "user"]),
    documentAssociatedName: z.array(z.string()),
});

// POST new-chat (user or ai);
export async function POST(req: NextRequest) {
    try {
        const spaceId = req.headers.get('spaceId');
        
        if (!spaceId) {
            return NextResponse.json({error: "Missing spapceId"}, {status: 400});
        }


        console.log("1")

        const {
            writtenBy,
            messageContent,
            writtenAtTime,
            documentAssociatedName,
        } = await req.json();

         console.log("1")


        const chatToBeChecked = {
            writtenAtTime,
            messageContent,
            writtenBy,
            documentAssociatedName,
        }

        console.log(chatToBeChecked);

         console.log("1");

         console.log(writtenAtTime);


        const valid = chatSchema.safeParse(chatToBeChecked);

         console.log("1")


        if (!valid.success) {
            console.log("not valid")
            return NextResponse.json({
                error: "Invalid chatSchema format",
                details: valid.error.format()
            }, {status: 400})
        }

        console.log("1")


        const chat = await prisma.chat.create({
            data: {
                ...valid.data,
                spaceId,
            }
        })

         console.log("1")


        return NextResponse.json({data: chat, message: "Chat added to db successfully"}, {status: 201});

    } catch(error) {
        console.log("Error POST /chats : Adding Chats to DB")
        return NextResponse.json(
            {error: "Error : POST /api/chats"}, 
            {status: 500}
        )
    }
}
