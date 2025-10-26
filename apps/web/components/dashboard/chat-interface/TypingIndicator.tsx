import { Bot } from 'lucide-react';

export default function TypingIndicator() {
    return (
        <div className="flex justify-start mb-6">
            <div className="flex max-w-[80%]">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                    <Bot className="w-5 h-5 text-gray-600" />
                </div>

                <div className="rounded-2xl rounded-bl-md px-6 py-4 bg-white border border-gray-200 shadow-sm">
                    <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
}