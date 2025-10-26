"use client"

import { useState, useEffect } from "react";
import axios from "axios";
import Header from "@/components/dashboard/navbar/NavDash";
import ConversationSidebar from "@/components/dashboard/sidebar/ConversationSidebar";
import ChatInterface from "@/components/dashboard/chat-interface/ChatInterface";
import { Document, User, Bin, Chat } from "@/types";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';

//@bigtood: once return => also set isTyping to false (to end the conversations taken palce here)
//@bigtood: error are coming in some routes here

const mockUser: User = {
    id: "1",
    name: "Anish Sabharwal",
    email: "anishs1207@gmail.com",
    plan: "pro",
};

function getFormattedDate(): string {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = String(now.getFullYear()).slice(-2); // Get last 2 digits
    return `${day}/${month}/${year}`;
}

function getFormattedTime(): string {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';

    hours = hours % 12; // Convert to 12-hour format
    hours = hours ? hours : 12; // If hour is 0, set to 12

    const minutesStr = String(minutes).padStart(2, '0');

    return `${hours}:${minutesStr}${ampm}`;
}

const userId = "anish123";

export default function Dashboard() {
    const [activeSpaceId, setActiveSpaceId] = useState<string | null>(null);
    const [documents, setDocuments] = useState<Document[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const [isUploadingDocument, setIsUploadingDocument] = useState(false);
    const [bins, setBins] = useState<Bin[]>([]);
    const [collapsed, setCollapsed] = useState(false);
    const [loadingBins, setLoadingBins] = useState(false);
    const [isLoadingDocs, setIsLoadingDocs] = useState(false);
    const [backupDeletedBins, setBackupDeletedBins] = useState<Record<string, Bin>>({});
    const [backupBinNames, setBackupBinNames] = useState<Record<string, string>>({});
    const [isSmallScreen, setIsSmallScreen] = useState<boolean>();

    const activeSpace = bins
        .flatMap(bin => bin.spaces ?? [])
        .find(space => space?.spaceId === activeSpaceId);


    //@todo- check date formating in the conversation here

    // @checked
    const fetchBinsAndSpaces = async () => {
        try {
            setLoadingBins(true);
            const response = await axios.get('/api/bins', {
                headers: {
                    'userId': 'anish123'
                }
            });

            const data = response.data;

            setBins(data);

            toast.success("Bins and Spaces fetched Successfully")
        } catch (error) {
            console.error("Failed to fetch the bins & spaces for the user", error);
            toast.error("Failed to create space");
        } finally {
            setLoadingBins(false);
        }
    };

    const fetchDocuments = async () => {
        try {
            setIsLoadingDocs(true)
            const response = await axios.get("http://localhost:8000/documents", {
                params: {
                    user_id: "anish123",
                },
            });
            const data = response.data as { available_documents: string[] };

            setDocuments(
                data.available_documents.map((name: string) => ({
                    id: name,
                    name,
                    size: 0,
                    uploadedAt: new Date(),
                    type: "application/pdf",
                }))
            );
            toast.success("Documents fetched successfully")
        } catch (err) {
            console.error("Failed to fetch documents:", err);
            toast.error("Error fetching Documents")
        } finally {
            setIsLoadingDocs(false)
        }
    };

    function handleResize() {
        setIsSmallScreen(window.innerWidth < 640);
    }

    //@checked:
    useEffect(() => {
        fetchBinsAndSpaces();
        fetchDocuments();
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);


    const handleUploadDocument = async (file: File) => {
        console.log("uploadong docs is running here")
        const formData = new FormData();
        formData.append("file", file);
        setIsUploadingDocument(true);

        console.log("File", file);

        try {
            const response = await axios.post(`http://localhost:8000/upload?user_id=${userId}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            const result = response.data;

            const newDocument: Document = {
                id: Date.now().toString(),
                name: file.name,
                size: file.size,
                uploadedAt: new Date(),
                type: file.type,
            };

            setDocuments((prev) => [newDocument, ...prev]);
            toast(result?.message);
        } catch (err) {
            console.error("Upload error:", err);
            toast("Failed to upload document");
        } finally {
            setIsUploadingDocument(false);
        }
    };

    // @checked
    const handleSendMessage = async (spaceId: string, content: string, selectedDocumentIds: string[]) => {

        if (!spaceId || !content || !selectedDocumentIds || !content.trim()) {
            throw new Error("spaceId, content, selectedDocIds are required fields")
        }

        setIsTyping(true);

        const tempUserMessageId = `temp-${uuidv4()}`;

        const tempMessage: Chat = {
            id: tempUserMessageId,
            writtenBy: "user",
            messageContent: content,
            writtenAtTime: getFormattedTime(),
            documentAssociatedName: selectedDocumentIds
        };

        setBins(prev =>
            prev.map(bin => ({
                ...bin,
                spaces: bin.spaces?.map(space => {
                    if (space.spaceId !== spaceId) return space;
                    return {
                        ...space,
                        conversations: [...(space.conversations ?? []), tempMessage as Chat]
                    };
                }) ?? []
            }))
        );

        // no need to show that it is added for ui 

        //@user message is sent to the backend
        try {
            const response = await axios.post('/api/chats', {
                writtenBy: 'user',
                messageContent: content,
                writtenAtTime: getFormattedTime(),
                documentAssociatedName: selectedDocumentIds,
            }, {
                headers: {
                    spaceId,
                }
            });

            let savedUserMessage = response.data.data;

            setBins(prev =>
                prev.map(bin => ({
                    ...bin,
                    spaces: bin.spaces?.map(space =>
                        space.spaceId === spaceId
                            ? {
                                ...space,
                                conversations: (space.conversations || []).map(msg =>
                                    msg.id === tempUserMessageId ? savedUserMessage : msg
                                )
                            }
                            : space
                    )
                }))
            );

        } catch (error) {
            console.error("Error /handleSendMessage, Error adding user message", error);

            // Rollback here:
            toast.error("Failed to send message");
            setBins(prev =>
                prev.map(bin => ({
                    ...bin,
                    spaces: bin.spaces?.map(space =>
                        space.spaceId === spaceId
                            ? {
                                ...space,
                                conversations: space.conversations.filter(msg => msg.id !== tempUserMessageId)
                            }
                            : space
                    )
                }))
            );
            return;
        }

        let aiResponse;

        //@ai message is generated from llms
        try {
            const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

            const responseAI = await axios.get(`${BASE_URL}/chat`, {
                params: {
                    query: content,
                    user_id: userId,
                    sources: selectedDocumentIds,
                },
                paramsSerializer: params => {
                    const searchParams = new URLSearchParams();
                    Object.entries(params).forEach(([key, value]) => {
                        if (Array.isArray(value)) {
                            value.forEach(v => searchParams.append(key, v));
                        } else {
                            searchParams.append(key, value as string);
                        }
                    });
                    return searchParams.toString();
                },
            });

            aiResponse = responseAI.data.answer.context || responseAI.data.answer;
            // @todo-check

            if (!aiResponse) {
                throw new Error("Error getting response from the llm")
            }

        } catch (error) {
            console.error("Chat API Error", error);

            toast.error("Failed to get response from AI");
            return;
        }

        const tempAIMessageId = `temp-ai${uuidv4()}`;

        const tempAIMessage: Chat = {
            id: tempAIMessageId,
            writtenBy: "ai",
            messageContent: aiResponse,
            writtenAtTime: getFormattedTime(),
            documentAssociatedName: selectedDocumentIds
        };

        setBins(prev =>
            prev.map(bin => ({
                ...bin,
                spaces: bin.spaces?.map(space =>
                    space.spaceId === spaceId
                        ? {
                            ...space,
                            conversations: [
                                ...(space.conversations || []), tempAIMessage as Chat
                            ]
                        }
                        : space
                )
            }))
        );

        //@ai message sent to the backend
        try {
            const responseOnAIMessageAdd = await axios.post('/api/chats', {
                writtenBy: 'ai',
                messageContent: aiResponse,
                writtenAtTime: getFormattedTime(),
                documentAssociatedName: selectedDocumentIds,
            }, {
                headers: {
                    spaceId,
                }
            });

            const savedAIMessage = responseOnAIMessageAdd.data.data;

            setBins(prev =>
                prev.map(bin => ({
                    ...bin,
                    spaces: bin.spaces?.map(space =>
                        space.spaceId === spaceId
                            ? {
                                ...space,
                                conversations: space.conversations.map(msg =>
                                    msg.id === tempAIMessageId ? savedAIMessage : msg
                                )
                            }
                            : space
                    )
                }))
            );

        } catch (error) {
            console.error("Chat API error:", error);

            // Rollback AI message
            toast.error("Failed to get AI response");

            setBins(prev =>
                prev.map(bin => ({
                    ...bin,
                    spaces: bin.spaces?.map(space =>
                        space.spaceId === spaceId
                            ? {
                                ...space,
                                conversations: space.conversations.filter(msg => msg.id !== tempAIMessageId)
                            }
                            : space
                    )
                }))
            );

        } finally {
            setIsTyping(false);
        }
    }

    /*

todo add:
- if uer types very fast => have a queue based systems which stores the message here

# Optimistic UI rollback risk
- If multiple requests run in parallel (user types fast), rollbacks may remove wrong messages because you always filter by tempUserMessageId.
- Consider using a queue or per-space concurrency lock.

# Performance
- setBins(prev => prev.map(...)) is O(n) over all bins and spaces. If bins/spaces grow large, this could be slow.
- Consider normalizing data (store conversations in a dictionary keyed by spaceId).

# Security notes
- No input sanitization before sending content → if your backend doesn’t sanitize, could be open to XSS when displaying.
- No rate limiting → spamming AI endpoint is possible.
- Hardcoded userId? I see userId used in the AI call:

    */

    const handleLogout = () => {
        window.location.reload();
    };

    //@checked: (todo add qeue here)
    const handleAddBin = async (newBinName: string, newBinColor: string) => {
        if (!userId || !newBinName || !newBinColor) {
            console.error("Missing user ID");
            return;
        }

        const tempBinId = `temp-bin-${uuidv4()}`;

        const tempBin: Bin = {
            id: tempBinId,
            name: newBinName,
            color: newBinColor,
            spaces: [],
            numOfSpaces: 0,
        };

        setBins(prev => [...prev, tempBin]);

        toast.success(`Bin ${newBinName} created !`);

        try {
            const response = await axios.post(
                '/api/bins',
                {
                    binName: newBinName,
                    color: newBinColor,
                },
                {
                    headers: {
                        'user-id': userId,
                    },
                }
            );

            const savedBin = response.data.data;

            setBins(prev =>
                prev.map(bin => bin.id === tempBinId ? savedBin : bin)
            );


            //@check-this:
            const firstSpace = savedBin.spaces?.[0];

            if (firstSpace) {
                setActiveSpaceId(firstSpace.spaceId);
            }


        } catch (error) {
            console.error("Error adding bin:", error);

            toast.success('Error creating Bin, Reverting..')

            // rollback added here:
            setBins(prev => prev.filter(bin => bin.id !== tempBinId));

        } finally {
            console.log("Add bin request finished");
        }
    };

    //@checked:
    const handleDeleteBin = async (binId: string) => {

        if (!userId || !binId) {
            console.log("Missing userId or binId");
            return;
        }

        const binToDelete = bins.find(bin => bin.id === binId);

        if (!binToDelete) {
            console.warn("Bin not found for deletion:", binId);
            toast.error("Error Deleting Bin");
            return;
        }

        // created a sort of queue here if user delets mutiple things but if fails on the backend:
        setBackupDeletedBins(prev => ({
            ...prev,
            [binId]: binToDelete,
        }));

        setBins(prev => prev.filter(bin => bin.id !== binId));
        // removed from the user interface

        toast.success(`Bin ${binToDelete.name} is Deleted`);

        try {
            await axios.delete('/api/bins', {
                headers: {
                    binId,
                },
            });

            setBackupDeletedBins(prev => {
                const updated = { ...prev };
                delete updated[binId];
                return updated;
            });

        } catch (error) {
            console.error("Error deleting bin:", error);

            toast.error("Failed to Delete bin. Restoring..");

            setBins(prev => {
                const exists = prev.some(bin => bin.id === binId);
                const backupBin = backupDeletedBins[binId];

                if (!exists && backupBin) {
                    return [...prev, backupBin];
                }
                return prev;
            });

        } finally {
            console.log("Delete bin request finished");
        }
    };

    //@checked:
    const handleRenameBin = async (binId: string, newName: string) => {

        if (!userId || !binId) {
            console.log("Error renaming Bin");
            return;
        }

        const binToRename = bins.find(bin => bin.id === binId);

        if (!binToRename) {
            console.warn("Bin not found for renaming:", binId);
            toast.error("Error Renaming Bin")
            return;
        }

        const previousName = binToRename.name;

        setBackupBinNames(prev => ({
            ...prev,
            [binId]: previousName,
        }));

        setBins(prev =>
            prev.map(bin =>
                bin.id === binId
                    ? { ...bin, name: newName }
                    : bin
            )
        );

        toast.success(`Bin Renamed to ${newName}`);

        try {
            await axios.patch(
                '/api/bins',
                { newName },
                {
                    headers: {
                        binId,
                    },
                }
            );

            setBackupBinNames(prev => {
                const updated = { ...prev };
                delete updated[binId];
                return updated;
            });

        } catch (error) {
            console.error("Error renaming bin:", error);

            setBins(prev =>
                prev.map(bin =>
                    bin.id === binId
                        ? { ...bin, name: previousName }
                        : bin
                )
            );

            toast.error("Failed to rename bin. Name restored.");
        }
    };

    //@doing: (later view)
    const handleAddSpace = async (binId: string) => {
        if (!binId) {
            console.error("Space Id is not present");
            return;
        }

        const tempSpaceId = `temp-space-${uuidv4()}`;

        const tempSpace = {
            spaceId: tempSpaceId,
            spaceName: "Untitled Space",
            binId: binId,
            conversations: [],
            lastUsedNumOfDays: 0,
        };

        const newConversationId = `conversation-${uuidv4()}`;

        //@ check if backend and frontend messages are same
        setBins(prev =>
            prev.map(bin => {
                if (bin.id !== binId) return bin;

                const newSpaceWithConversation = {
                    ...tempSpace,
                    conversations: [
                        {
                            id: newConversationId,
                            messageContent: "Hi there",
                            writtenAtTime: getFormattedTime(),
                            writtenBy: 'ai' as const,
                            spaceId: tempSpaceId,
                        }
                    ],
                };

                const updatedSpaces = [...(bin.spaces ?? []), newSpaceWithConversation];

                return {
                    ...bin,
                    spaces: updatedSpaces,
                    numOfSpaces: updatedSpaces.length,
                };
            })
        );

        toast.success("New Space is created !")

        try {
            const response = await axios.post(
                '/api/spaces',
                {
                    lastUsedDate: getFormattedDate(),
                },
                {
                    headers: {
                        binId,
                    },
                }
            );

            const savedSpace = response.data.data.space;

            //@make use a conversaton is also added in the space here (which also matches the backend)
            setBins(prev =>
                prev.map(bin =>
                    bin.id === binId
                        ? {
                            ...bin,
                            spaces: bin.spaces.map(space =>
                                space.spaceId === tempSpaceId ? savedSpace : space
                            ),
                        }
                        : bin
                )
            );

            setActiveSpaceId(savedSpace.spaceId);

        } catch (error) {
            console.error("Error creating space:", error);

            setBins(prev =>
                prev.map(bin =>
                    bin.id === binId
                        ? {
                            ...bin,
                            spaces: bin.spaces.filter(space => space.spaceId !== tempSpaceId),
                            numOfSpaces: Math.max((bin.spaces?.length || 1) - 1, 0),
                        }
                        : bin
                )
            );

            toast.error("Failed to create space. Rolled back.");
        }
    };

    //@checked:
    const handleRenameSpace = async (spaceId: string, newSpaceName: string) => {
        if (!userId || !spaceId || !newSpaceName) {
            return;
        }

        let isNameChanged = false;

        setBins(prev =>
            prev.map(bin => ({
                ...bin,
                spaces: bin.spaces?.map(space => {
                    if (space.spaceId === spaceId) {
                        if (space.spaceName !== newSpaceName) {
                            isNameChanged = true;
                            return { ...space, spaceName: newSpaceName };
                        }
                    }
                    return space;
                }),
            }))
        );

        if (!isNameChanged) return;

        toast.success("Space Renamed !");

        try {
            const response = await axios.patch('/api/spaces', {
                newSpaceName,

            }, {
                headers: {
                    spaceId,
                }
            });

            const updatedSpace = response.data.data.space;

            setBins(prev =>
                prev.map(bin => ({
                    ...bin,
                    spaces: bin.spaces?.map(space =>
                        space.spaceId === spaceId ? updatedSpace : space
                    ),
                }))
            );

        } catch (error) {
            console.error("Error renaming space:", error);

            setBins(prev =>
                prev.map(bin => ({
                    ...bin,
                    spaces: bin.spaces?.map(space =>
                        space.spaceId === spaceId
                            ? { ...space, spaceName: space.spaceName }
                            : space
                    ),
                }))
            );

            toast.error("Failed to rename space. Changes rolled back.");
        }
    };

    //@check-later
    const handleDeleteSpace = async (spaceId: string) => {
        if (!spaceId) {
            console.error("Missing spaceId");
            return;
        }

        // Save previous state for rollback
        const previousBins = [...bins];

        // Optimistically remove the space
        setBins(prev =>
            prev.map(bin => {
                const hasSpace = bin.spaces?.some(space => space.spaceId === spaceId);
                if (!hasSpace) return bin;

                return {
                    ...bin,
                    spaces: bin.spaces.filter(space => space.spaceId !== spaceId),
                    numOfSpaces: Math.max((bin.spaces?.length || 1) - 1, 0),
                };
            })
        );

        toast.info("Deleting space...");

        try {
            await axios.delete('/api/spaces', {
                headers: { spaceId },
            });

            toast.success("Space deleted successfully!");
        } catch (err) {
            console.error("Error deleting space:", err);

            // Rollback to previous state
            setBins(previousBins);

            toast.error("Failed to delete space. Changes rolled back.");
        }
    };

    //@checked:
    const handleActiveSpace = (spaceId: string) => {
        if (!spaceId) {
            return;
        }

        setActiveSpaceId(spaceId);
    };

    //@checked:
    const handleSendGmailMessage = async (spaceId: string, prompt: string, accessToken: string) => {
        if (!spaceId || !accessToken || !prompt) {
            console.error('spaceId or accessToken or prompt is missing here');
            return;
        }

        setIsTyping(true);

        const tempUserMessageId = `temp-${uuidv4()}`;

        const tempMessage: Chat = {
            id: tempUserMessageId,
            writtenBy: "user",
            messageContent: prompt,
            writtenAtTime: getFormattedTime(),
            documentAssociatedName: []
        };

        setBins(prev =>
            prev.map(bin => ({
                ...bin,
                spaces: bin.spaces?.map(space => {
                    if (space.spaceId !== spaceId) return space;
                    return {
                        ...space,
                        conversations: [...(space.conversations ?? []), tempMessage as Chat]
                    };
                }) ?? []
            }))
        );

        //@sending message for gmail to frontend:
        try {
            //@ right now the gmail and docs cannot work together but in future can be used both
            const response = await axios.post('/api/chats', {
                writtenBy: 'user',
                messageContent: prompt,
                writtenAtTime: getFormattedTime(),
                documentAssociatedName: [],
            }, {
                headers: {
                    spaceId,
                }
            });

            let savedUserMessage = response.data.data;

            setBins(prev =>
                prev.map(bin => ({
                    ...bin,
                    spaces: bin.spaces?.map(space =>
                        space.spaceId === spaceId
                            ? {
                                ...space,
                                conversations: (space.conversations || []).map(msg =>
                                    msg.id === tempUserMessageId ? savedUserMessage : msg
                                )
                            }
                            : space
                    )
                }))
            );

        } catch (err) {
            console.error("Error sending message to backend", err?.message || err);

            setBins(prev =>
                prev.map(bin => ({
                    ...bin,
                    spaces: bin.spaces?.map(space =>
                        space.spaceId === spaceId
                            ? {
                                ...space,
                                conversations: space.conversations.filter(msg => msg.id !== tempUserMessageId)
                            }
                            : space
                    )
                }))
            );

            toast.error("Failed to send message");
            return;
        }

        let gmailResponse;

        const cleanedPrompt = prompt.replace(/\/gmail/gi, "").replace(/\s+/g, " ").trim();

        //@ pass accessToken via header next time and update in the ui also
        const payload = {
            query: cleanedPrompt,
            accessToken,
        }

        // @ai message from gmail backend:
        try {
            const response = await axios.post('/api/gmail', payload);
            gmailResponse = response.data.data;

            if (!gmailResponse) {
                toast.error("Empty response from Gmail backend");
                return;
            }

        } catch (error) {
            console.log("Error getting response from gmail backend");
            return;
        }

        const tempAIMessageId = `temp-${uuidv4()}`;

        const tempAIMessage: Chat = {
            id: tempAIMessageId,
            writtenBy: "ai",
            messageContent: gmailResponse,
            writtenAtTime: getFormattedTime(),
            documentAssociatedName: []
        };

        setBins(prev =>
            prev.map(bin => ({
                ...bin,
                spaces: bin.spaces?.map(space =>
                    space.spaceId === spaceId
                        ? {
                            ...space,
                            conversations: [
                                ...(space.conversations || []),
                                tempAIMessage as Chat
                            ]
                        }
                        : space
                )
            }))
        );

        //@ai message sent to the backend:
        try {
            const response = await axios.post('/api/chats', {
                writtenBy: 'ai',
                messageContent: gmailResponse,
                writtenAtTime: getFormattedTime(),
                documentAssociatedName: [],
            }, {
                headers: {
                    spaceId,
                }
            });

            const savedAIMessage = response.data.data;

            setBins(prev =>
                prev.map(bin => ({
                    ...bin,
                    spaces: bin.spaces?.map(space =>
                        space.spaceId === spaceId
                            ? {
                                ...space,
                                conversations: space.conversations.map(msg =>
                                    msg.id === tempAIMessageId ? savedAIMessage : msg
                                )
                            }
                            : space
                    )
                }))
            );

        } catch (error) {
            console.error("Chat API error:", error);
            toast.error("Failed to get AI response");


            setBins(prev =>
                prev.map(bin => ({
                    ...bin,
                    spaces: bin.spaces?.map(space =>
                        space.spaceId === spaceId
                            ? {
                                ...space,
                                conversations: space.conversations.filter(msg => msg.id !== tempAIMessageId)
                            }
                            : space
                    )
                }))
            );
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="h-screen flex flex-col bg-gray-50 relative">
            <Header user={mockUser} onLogout={handleLogout} />

            {isUploadingDocument && (
                <div className="absolute inset-0 bg-white/80 z-50 flex flex-col items-center justify-center">
                    <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-16 w-16 mb-4 animate-spin"></div>
                    <p className="text-gray-700 text-lg font-medium">Uploading Document...</p>
                </div>
            )}

            <div className="flex-1 flex overflow-hidden">
                <div className={`
                    h-full border-r transition-all duration-300 flex flex-col
                    ${collapsed ? "w-16" : "w-70"}
                `}>
                    <ConversationSidebar
                        isCollapsed={collapsed}
                        setIsCollapsed={setCollapsed}
                        onDeleteBin={handleDeleteBin}
                        onRenameBin={handleRenameBin}
                        onAddBin={handleAddBin}
                        documents={documents}
                        onAddSpace={handleAddSpace}
                        onDeleteSpace={handleDeleteSpace}
                        onRenameSpace={handleRenameSpace}
                        onSpaceSelect={handleActiveSpace}
                        bins={bins}
                        isLoadingDocs={isLoadingDocs}
                        loadingBins={loadingBins}
                    />
                </div>

                <div className="flex flex-col flex-1 p-4 transition-all duration-300 min-w-0">
                    <ChatInterface
                        spaceName={activeSpace?.spaceName || ""}
                        spaceId={activeSpace?.spaceId || ""}
                        messages={activeSpace?.conversations || []}
                        documents={documents}
                        onSendMessage={handleSendMessage}
                        onUploadDocument={handleUploadDocument}
                        isTyping={isTyping}
                        isSendDisabled={activeSpaceId === null}
                        onSendGmailMessage={handleSendGmailMessage}
                    />
                </div>
            </div>
        </div>
    );
};