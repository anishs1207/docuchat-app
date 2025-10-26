import { User, Bot, FileText } from 'lucide-react';

export default function Message({ message }) {

    return (
        <div className={`flex ${message.writtenBy === 'user' ? 'justify-end' : 'justify-start'} mb-6`}>
            <div className={`flex max-w-[80%] ${message.writtenBy === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${message.isUser ? 'bg-blue-600 ml-3' : 'bg-gray-200 mr-3'
                    }`}>
                    {message.writtenBy === 'user' ? (
                        <User className="w-5 h-5 text-gray-600" />
                    ) : (
                        <Bot className="w-5 h-5 text-gray-600" />
                    )}
                </div>

                <div className={`rounded-2xl px-6 py-4 shadow-sm ${message.writtenBy === 'user'
                    ? 'bg-blue-600 text-white rounded-br-md'
                    : 'bg-white border border-gray-200 rounded-bl-md'
                    }`}>
                    <div className="text-sm leading-relaxed whitespace-pre-wrap">
                        {message.messageContent}
                    </div>

                    {message.documentId && (
                        <div className={`flex items-center space-x-1 mt-2 pt-2 border-t ${message.writtenBy === 'user' ? 'border-blue-500' : 'border-gray-200'
                            }`}>
                            <FileText className={`w-3 h-3 ${message.writtenBy === 'user' ? 'text-blue-200' : 'text-gray-500'
                                }`} />
                            <span className={`text-xs ${message.writtenBy === 'user' ? 'text-blue-200' : 'text-gray-500'
                                }`}>
                                Referenced document
                            </span>
                        </div>
                    )}

                    <p className={`text-xs mt-2 ${message.writtenBy === 'user' ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                        {message.writtenAtTime} • Today
                    </p>
                </div>
            </div>
        </div >
    );
}