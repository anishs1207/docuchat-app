import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    ChevronDown,
    FileText,
    File,
    FileSpreadsheet,
    FileArchive,
    FileImage,
    FileAudio,
    FileVideo
} from "lucide-react";

interface Document {
    id: string;
    name: string;
    size?: number;
}

interface UploadedDocsListProps {
    documents: Document[];
    isLoadingDocs: boolean;
    showUploadedDocs: boolean;
    toggleShowUploadedDocs: () => void;
}

const UploadedDocsList: React.FC<UploadedDocsListProps> = ({
    documents,
    isLoadingDocs,
    showUploadedDocs,
    toggleShowUploadedDocs,
}) => {


    const getFileIcon = (fileName: string) => {
        const extension = fileName.split('.').pop()?.toLowerCase();

        switch (extension) {
            case 'pdf':
                return <FileText size={16} className="text-red-600" />;
            case 'doc':
            case 'docx':
                return <FileText size={16} className="text-blue-600" />;
            case 'xls':
            case 'xlsx':
            case 'csv':
                return <FileSpreadsheet size={16} className="text-green-600" />;
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
                return <FileImage size={16} className="text-blue-600" />;
            case 'zip':
            case 'rar':
                return <FileArchive size={16} className="text-gray-600" />;
            case 'mp3':
            case 'wav':
                return <FileAudio size={16} className="text-purple-600" />;
            case 'mp4':
            case 'mov':
                return <FileVideo size={16} className="text-indigo-600" />;
            default:
                return <File size={16} className="text-gray-400" />;
        }
    };

    return (
        <div className="px-1 mt-4 mb-2">
            {/* Header */}
            <div
                className="flex items-center justify-between cursor-pointer group"
                onClick={toggleShowUploadedDocs}
            >
                <h2 className="pl-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Uploaded Docs
                </h2>
                <ChevronDown
                    size={16}
                    className={`text-gray-500 transition-transform duration-300 ${showUploadedDocs ? "rotate-0" : "-rotate-90"
                        }`}
                />
            </div>
            <AnimatePresence initial={false}>
                {isLoadingDocs ? (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col gap-2 h-48 p-2"
                    >
                        {[...Array(4)].map((_, i) => (
                            <div
                                key={i}
                                className="flex items-center justify-between bg-gray-100 border border-gray-200 rounded-lg px-3 py-2 animate-pulse"
                            >
                                <div className="flex items-center gap-2 overflow-hidden">
                                    <div className="flex items-center justify-center w-8 h-8 bg-gray-300 rounded-md" />
                                    <div className="flex flex-col space-y-1 overflow-hidden">
                                        <div className="w-32 h-3 bg-gray-300 rounded" />
                                        <div className="w-24 h-2 bg-gray-200 rounded" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                ) : (
                    showUploadedDocs && (
                        <motion.div
                            key="docs"
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="overflow-hidden"
                        >
                            <ScrollArea className="h-48 rounded-md mt-2 p-2 border border-gray-200 shadow-sm">
                                <ul className="space-y-2">
                                    {documents.map((doc) => (
                                        <li
                                            key={doc.id}
                                            className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm hover:shadow transition-all"
                                        >
                                            <div className="flex items-center gap-2 overflow-hidden">
                                                <div className="flex items-center justify-center w-8 h-8 bg-red-10">
                                                    {getFileIcon(doc.name)}
                                                </div>
                                                <div className="flex flex-col overflow-hidden">
                                                    <span className="text-xs font-medium text-gray-900 truncate max-w-[120px]">
                                                        {doc.name}
                                                    </span>
                                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                                        <span>{doc.name?.split(".").pop()?.toLowerCase()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </ScrollArea>
                        </motion.div>
                    )
                )}
            </AnimatePresence>

        </div>
    );
};

export default UploadedDocsList;
