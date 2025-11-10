import React, { useState, useRef, useEffect } from 'react';
import { Send, FileText, Upload, AtSign, X, Loader2 } from 'lucide-react';
import { Document, Chat } from '@/types';
import MessageComponent from './Message';
import TypingIndicator from './TypingIndicator';
import DocumentSelector from './DocumentSelector';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FileUploader } from './UploadScreen';
import { FcGoogle } from 'react-icons/fc';
import { useSession, signIn, signOut } from "next-auth/react";

interface ChatInterfaceProps {
    messages: Chat[];
    documents: Document[];
    onSendMessage: (spaceId: string, content: string, documentIds: string[]) => void;
    onUploadDocument: (file: File) => void;
    isTyping: boolean;
    spaceName: string;
    isSendDisabled: boolean;
    spaceId: string;
    onSendGmailMessage: (spaceId: string, prompt: string, accessToken: string) => void;
}

export default function ChatInterface({
    messages,
    spaceName,
    documents,
    onSendMessage,
    onUploadDocument,
    isTyping,
    isSendDisabled,
    spaceId,
    onSendGmailMessage,
}: ChatInterfaceProps) {
    const [inputValue, setInputValue] = useState('');
    const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
    const [showDocumentSelector, setShowDocumentSelector] = useState(false);
    const [selectorPosition, setSelectorPosition] = useState({ x: 0, y: 0 });
    const [atPosition, setAtPosition] = useState(-1);
    const [loading, setLoading] = useState(false);
    const [isSigningIn, setIsSigningIn] = useState(false);
    const [isGmailConnected, setIsGmailConnected] = useState(false);
    const { data: session, status } = useSession();

    const handleSignOut = async () => {
        await signOut({ callbackUrl: '/dashboard' });
    };

    const handleGoogleSignIn = async () => {
        try {
            setIsSigningIn(true);

            const result = await signIn('google', {
                redirect: false,
                callbackUrl: '/dashboard',
            });

            if (result?.ok) {
                setIsGmailConnected(true);
            } else {
                console.error('Google sign-in failed:', result?.error);
            }
        } catch (err) {
            console.error('Google sign-in failed:', err);
            setIsGmailConnected(false);
        } finally {
            setIsSigningIn(false);
        }
    };

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        const cursorPosition = e.target.selectionStart;

        setInputValue(value);

        const atIndex = value.lastIndexOf('@', cursorPosition - 1);
        if (atIndex !== -1 && (atIndex === 0 || value[atIndex - 1] === ' ')) {
            const textAfterAt = value.substring(atIndex + 1, cursorPosition);
            if (!textAfterAt.includes(' ')) {
                setAtPosition(atIndex);

                const rect = inputRef.current?.getBoundingClientRect();
                if (rect) {
                    setSelectorPosition({
                        x: rect.left,
                        y: rect.top - 10
                    });
                }
                setShowDocumentSelector(true);
            } else {
                setShowDocumentSelector(false);
                setAtPosition(-1);
            }
        } else {
            setShowDocumentSelector(false);
            setAtPosition(-1);
        }
    };

    const handleDocumentSelect = (documentId: string) => {
        if (!selectedDocuments.includes(documentId)) {
            setSelectedDocuments([...selectedDocuments, documentId]);
        }

        if (atPosition !== -1) {
            const document = documents.find(d => d.id === documentId);
            if (document) {
                const beforeAt = inputValue.substring(0, atPosition);
                const afterMention = inputValue.substring(inputValue.indexOf(' ', atPosition) !== -1 ? inputValue.indexOf(' ', atPosition) : inputValue.length);
                setInputValue(`${beforeAt}@${document.name}${afterMention}`);
            }
        }

        setShowDocumentSelector(false);
        setAtPosition(-1);
        inputRef.current?.focus();
    };

    const handleDocumentDeselect = (documentId: string) => {
        setSelectedDocuments(selectedDocuments.filter(id => id !== documentId));
    };

    const handleSendMessage = async () => {
        if (!inputValue.trim()) return;

        let result;
        if (inputValue.startsWith("/gmail")) {
            if (!session?.accessToken) {
                console.error("No Gmail access token available");
                return;
            }
            const prompt = inputValue.replace("/gmail", "").trim();

            console.log("prompt", prompt);
            console.log("session", session);

            onSendGmailMessage(spaceId, prompt, session?.accessToken);
            return;
        }

        onSendMessage(spaceId, JSON.stringify(result?.data || inputValue.trim()), selectedDocuments);
        setInputValue("");
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (!showDocumentSelector) handleSendMessage();
        }
        if (e.key === 'Escape') {
            setShowDocumentSelector(false);
            setAtPosition(-1);
        }
    };

    const handleCheckEmails = async () => {
        if (!session?.accessToken) {
            console.error("No Gmail access token available");
            return;
        }

        try {
            const res = await fetch(
                "https://gmail.googleapis.com/gmail/v1/users/me/messages",
                {
                    headers: {
                        Authorization: `Bearer ${session.accessToken}`,
                    },
                }
            );

            const data = await res.json();
            console.log("Gmail messages:", data);
        } catch (err) {
            console.error("Error fetching emails:", err);
        }
    };

    const getSelectedDocumentNames = () =>
        selectedDocuments.map(id => documents.find(d => d.id === id)?.name).filter(Boolean);


    return (
        <div className="flex flex-col h-full max-h-screen bg-gray-50">

            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900">
                            {spaceName}
                        </h1>
                        {selectedDocuments.length > 0 && (
                            <div className="flex items-center space-x-2 mt-2">
                                <span className="text-sm text-gray-500">Chatting with:</span>
                                <div className="flex flex-wrap gap-2">
                                    {getSelectedDocumentNames().map((name, index) => (
                                        <span
                                            key={index}
                                            className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
                                        >
                                            <FileText className="w-3 h-3 mr-1" />
                                            {name}
                                            <button
                                                onClick={() => handleDocumentDeselect(selectedDocuments[index])}
                                                className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    <FileUploader
                        onUploadDocument={onUploadDocument}
                    />
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 scroll-pb-36">
                <div className="max-w-4xl mx-auto">
                    {messages.length === 0 ? (
                        <div className="text-center py-12 space-y-6">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                                <FileText className="w-8 h-8 text-blue-600" />
                            </div>

                            <h3 className="text-xl font-semibold text-gray-900">
                                Start a conversation
                            </h3>

                            {documents.length === 0 ? (
                                <>

                                    <Button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="text-base px-6 py-3"
                                    >
                                        Upload Your First Document
                                    </Button>
                                </>
                            ) : (
                                <p className="text-base font-medium text-gray-600">
                                    Open a Space and Start Chatting
                                </p>
                            )}

                            <p className="text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
                                Upload documents and ask questions, or type <code className="font-mono">@</code> to select specific documents to chat with.
                            </p>
                        </div>
                    ) : (
                        <>
                            {messages.map((message) => (
                                <MessageComponent
                                    key={message.id}
                                    message={message} />
                            ))}
                            {isTyping && <TypingIndicator />}
                        </>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Chat Input - Resized and Centered */}
            <div className="w-full flex justify-center px-4 py-4">
                <div className="w-full max-w-3xl bg-zinc-900 text-white p-3 rounded-2xl shadow-md border border-zinc-700">
                    <div className="flex items-end gap-3">
                        <div className="flex-1 relative"> {/* Make this relative */}
                            <Textarea
                                ref={inputRef}
                                value={inputValue}
                                onChange={handleInputChange}
                                onKeyDown={handleKeyPress}
                                placeholder="Ask a question about your documents... (Type @ to select specific documents)"
                                className="w-full min-h-[48px] max-h-[140px] resize-none bg-zinc-800 text-white placeholder:text-zinc-400 border border-zinc-600 focus-visible:ring-blue-500 rounded-xl"
                                disabled={isTyping}
                            />
                        </div>

                        <Button
                            onClick={handleSendMessage}
                            disabled={!inputValue.trim() || isTyping || isSendDisabled}
                            className="rounded-xl p-3 h-auto disabled:opacity-50 bg-blue-600 hover:bg-blue-700 text-white"
                            size="icon"
                        >
                            <Send className="w-5 h-5" />
                        </Button>
                    </div>

                    <div className="flex flex-col text-xs text-zinc-400 mt-2 px-1 gap-1">
                        <p className="break-words">
                            Press <kbd className="font-semibold">Enter</kbd> to send,&nbsp;
                            <kbd className="font-semibold">Shift+Enter</kbd> for newline,&nbsp;
                            <kbd className="font-semibold">@</kbd> to mention documents
                            For connecting to gmail use <kbd className="font-semibold">/gmail</kbd> in prompt
                        </p>

                        {inputValue.includes("/gmail") && session?.accessToken && (
                            <div className="flex items-center gap-2 px-3 py-1 bg-white text-gray-800 rounded-lg shadow-md mt-1">
                                <FcGoogle size={20} />
                                <span className="text-sm font-medium">Gmail mode active</span>
                            </div>
                        )}


                        {selectedDocuments.length > 0 && (
                            <div className="flex items-center space-x-1 text-blue-400 mt-1">
                                <AtSign className="w-3 h-3" />
                                <span>
                                    {selectedDocuments.length} document
                                    {selectedDocuments.length > 1 ? 's' : ''} selected
                                </span>
                            </div>
                        )}
                    </div>



                </div>
            </div>

            {/* <div className="w-full flex justify-center py-6">
                {status === "authenticated" ? (
                    <div className="flex items-center gap-6">
                        <span className="flex items-center gap-4 px-6 py-3 rounded-lg bg-blue-100 text-blue-800 font-medium shadow-sm">
                            <FcGoogle size={22} />
                            Connected as {session.user?.email}
                        </span>

                        <Button
                            onClick={handleSignOut}
                            className="cursor-pointer h-full px-5 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-md transition-colors duration-200"
                        >
                            Logout
                        </Button>
                    </div>
                ) : (
                    <button
                        onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                        disabled={status === "loading"}
                        className="flex items-center gap-2 w-fit px-6 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 font-medium hover:bg-gray-50 shadow-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {status === "loading" ? (
                            <Loader2 className="animate-spin h-4 w-4" />
                        ) : (
                            <FcGoogle size={22} />
                        )}
                        {status === "loading" ? "Connecting..." : "Connect your Gmail Account"}
                    </button>
                )}
            </div> */}




            <DocumentSelector
                documents={documents}
                selectedDocuments={selectedDocuments}
                onDocumentSelect={handleDocumentSelect}
                onDocumentDeselect={handleDocumentDeselect}
                isVisible={showDocumentSelector}
                onClose={() => {
                    setShowDocumentSelector(false);
                    setAtPosition(-1);
                }}
                position={selectorPosition}
            />
        </div >
    );
}

