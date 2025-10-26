import React, { useState, useCallback, useEffect } from 'react';
import { Upload, FileText, CheckCircle, Loader2 } from 'lucide-react';
import { Document as DocumentType } from '@/types';

// Allowed MIME types & extensions
const allowedMimeTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'video/mp4', // mp4
    'video/quicktime', // mov
    'audio/mpeg', // mp3
    'audio/mp4', // m4a, aac
    'audio/wav', // wav
];

const allowedExtensions = [
    '.pdf',
    '.doc',
    '.docx',
    '.mp4',
    '.mov',
    '.mp3',
    '.m4a',
    '.aac',
    '.wav',
];

const isFileAllowed = (file: File) => {
    const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    return allowedMimeTypes.includes(file.type) || allowedExtensions.includes(ext);
};

const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Reusable file input button
export function FileUploader({ onUploadDocument }) {
    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && isFileAllowed(file)) {
            window.dispatchEvent(new CustomEvent('file-selected', { detail: file }));
        } else if (file) {
            alert(
                'Unsupported file type. Please upload: PDF, DOC, DOCX, MP4, MOV, MP3, M4A, AAC, or WAV.'
            );
        }

        console.log("file uploader is run here");

        console.log('file', file);

        onUploadDocument(file);

        console.log("document is set to upload");

    };

    return (
        <label className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white font-medium rounded-lg cursor-pointer hover:bg-gray-800 transition-all">
            <Upload className="w-4 h-4" />
            <span className="text-sm">Select File</span>
            <input
                type="file"
                accept={allowedExtensions.join(',')}
                onChange={handleFileInput}
                className="hidden"
            />
        </label>
    );
}

export function UploadScreen({ onUploadDocument }: { onUploadDocument: (doc: DocumentType) => void }) {
    const [dragActive, setDragActive] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        const handleFileSelected = (e: Event) => {
            const customEvent = e as CustomEvent<File>;
            setSelectedFile(customEvent.detail);
        };
        window.addEventListener('file-selected', handleFileSelected);
        return () => window.removeEventListener('file-selected', handleFileSelected);
    }, []);

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(e.type === 'dragenter' || e.type === 'dragover');
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const files = Array.from(e.dataTransfer.files);
        const validFile = files.find(isFileAllowed);

        if (validFile) {
            setSelectedFile(validFile);
        } else {
            alert(
                'Unsupported file type. Please upload: PDF, DOC, DOCX, MP4, MOV, MP3, M4A, AAC, or WAV.'
            );
        }
    }, []);

    const handleUpload = async () => {
        if (!selectedFile) return;
        setIsUploading(true);

        // Simulate upload delay
        await new Promise((res) => setTimeout(res, 2000));

        const document: DocumentType = {
            id:
                typeof crypto.randomUUID === 'function'
                    ? crypto.randomUUID()
                    : Math.random().toString(36).substr(2, 9),
            name: selectedFile.name,
            size: selectedFile.size,
            type: selectedFile.type,
            uploadedAt: new Date(),
        };

        console.log('Document uploaded:', document);
        setIsUploading(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 flex items-center justify-center p-4 relative">
            {isUploading && (
                <div className="absolute inset-0 bg-white/80 z-50 flex flex-col items-center justify-center">
                    <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
                    <p className="text-lg font-semibold text-gray-700">Uploading...</p>
                </div>
            )}

            <div className="w-full max-w-2xl">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
                        <FileText className="w-10 h-10 text-blue-600" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Chat with Your Documents
                    </h1>
                    <p className="text-xl text-gray-600 max-w-lg mx-auto">
                        Upload an allowed file and ask questions about its content.
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    <div
                        className={`relative border-2 border-dashed rounded-xl p-12 transition-all duration-300 ${dragActive
                            ? 'border-blue-400 bg-blue-50'
                            : selectedFile
                                ? 'border-emerald-400 bg-emerald-50'
                                : 'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100'
                            }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    >
                        <div className="flex justify-center mb-4">
                            <FileUploader />
                        </div>

                        <div className="text-center">
                            {selectedFile ? (
                                <div className="space-y-4">
                                    <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto" />
                                    <div>
                                        <p className="text-lg font-semibold text-gray-900">
                                            {selectedFile.name}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {formatFileSize(selectedFile.size)}
                                        </p>
                                    </div>
                                    <button
                                        onClick={handleUpload}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 mx-auto"
                                    >
                                        <Upload className="w-4 h-4" />
                                        Start Chatting
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <Upload
                                        className={`w-16 h-16 mx-auto transition-colors ${dragActive ? 'text-blue-500' : 'text-gray-400'
                                            }`}
                                    />
                                    <div>
                                        <p className="text-lg font-semibold text-gray-900">
                                            {dragActive ? 'Drop your file here' : 'Drag and drop your file'}
                                        </p>
                                        <p className="text-sm text-gray-500 mt-2">
                                            or click to browse files
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-500">
                            Supported formats: PDF, DOC, DOCX, MP4, MOV, MP3, M4A, AAC, WAV
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
