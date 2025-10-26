import { useState, useRef, useEffect } from 'react';
import { FileText, X, Search } from 'lucide-react';
import { Document } from '@/types';
import { ScrollArea } from "@/components/ui/scroll-area";

interface DocumentSelectorProps {
    documents: Document[];
    selectedDocuments: string[];
    onDocumentSelect: (documentId: string) => void;
    onDocumentDeselect: (documentId: string) => void;
    isVisible: boolean;
    onClose: () => void;
    position: { x: number; y: number };
}

export default function DocumentSelector({
    documents,
    selectedDocuments,
    onDocumentSelect,
    onDocumentDeselect,
    isVisible,
    onClose,
    position
}: DocumentSelectorProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const selectorRef = useRef<HTMLDivElement>(null);

    const filteredDocuments = documents.filter(doc =>
        doc.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (selectorRef.current && !selectorRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        if (isVisible) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isVisible, onClose]);

    // Prevent cutoff & adjust position dynamically
    const [adjustedPosition, setAdjustedPosition] = useState({ x: position.x, y: position.y });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const maxWidth = 320;
            const maxHeight = 400;
            setAdjustedPosition({
                x: Math.min(Math.max(position.x, 10), window.innerWidth - maxWidth - 10),
                y: Math.min(Math.max(position.y, 10), window.innerHeight - maxHeight - 10),
            });
        }
    }, [position]);

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    if (!isVisible) return null;

    return (
        <div
            ref={selectorRef}
            className="fixed bg-white border border-gray-200 rounded-xl shadow-2xl z-50 w-80 max-h-[400px] flex flex-col animate-in fade-in-50 zoom-in-95 duration-150"
            style={{
                left: adjustedPosition.x,
                top: adjustedPosition.y
            }}

        >
            {/* Header */}
            <div className="p-3 border-b border-gray-200 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Select Documents</h3>
                <button
                    onClick={onClose}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <X className="w-4 h-4 text-gray-500" />
                </button>
            </div>

            {/* Search */}
            <div className="p-3 border-b border-gray-200">
                <div className="relative">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Search documents..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        autoFocus
                    />
                </div>
            </div>

            {/* Scrollable Document List */}
            <ScrollArea className="flex-1 overflow-y-auto">
                <div className="py-1">
                    {filteredDocuments.length === 0 ? (
                        <div className="p-6 text-center text-gray-500">
                            <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">No documents found</p>
                        </div>
                    ) : (
                        filteredDocuments.map((document) => {
                            const isSelected = selectedDocuments.includes(document.id);
                            return (
                                <button
                                    key={document.id}
                                    onClick={() =>
                                        isSelected
                                            ? onDocumentDeselect(document.id)
                                            : onDocumentSelect(document.id)
                                    }
                                    className={`w-full px-3 py-2 text-left flex items-center space-x-3 transition-colors rounded-md ${isSelected
                                        ? 'bg-blue-50 border-l-4 border-blue-500'
                                        : 'hover:bg-gray-50'
                                        }`}
                                >
                                    <div
                                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${isSelected ? 'bg-blue-100' : 'bg-gray-100'
                                            }`}
                                    >
                                        <FileText
                                            className={`w-4 h-4 ${isSelected ? 'text-blue-600' : 'text-gray-600'
                                                }`}
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p
                                            className={`text-sm font-medium truncate ${isSelected ? 'text-blue-900' : 'text-gray-900'
                                                }`}
                                        >
                                            {document.name}
                                        </p>
                                        <p className="text-xs text-gray-500 truncate">
                                            {formatFileSize(document.size)} •{' '}
                                            {document.uploadedAt.toLocaleDateString()}
                                        </p>
                                    </div>
                                </button>
                            );
                        })
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}
