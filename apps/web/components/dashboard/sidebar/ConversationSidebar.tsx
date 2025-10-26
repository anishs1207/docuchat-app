"use client";

import {
    ChevronLeft,
    ChevronRight,
    Folder,
    ChevronDown,
    MessageCircle,
    Search,
    MoreHorizontal,
    Plus,
    Pencil,
    Trash2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bin, Document, Space } from "@/types";
import UserSection from "./UserSection";
import NewBinDialog from "./CreateBinModal";
import RenameModal from "./RenameModal";
import UploadedDocsList from "./UploadedDocsList";

interface ConversationSidebarProps {
    bins: Bin[],
    spaces: Space[],
    onAddBin: (newBinName: string, newBinColor: string) => void,
    onDeleteBin: (binId: string) => void,
    onRenameBin: (binId: string, newBinName: string) => void,
    onAddSpace: (binId: string) => void,
    onDeleteSpace: (spaceId: string) => void,
    onRenameSpace: (spaceId: string, newSpaceName: string) => void,
    onMoveSpaceToNewBin: () => void,
    onSpaceSelect: (spaceId: string) => void,
    isCollapsed: any,
    setIsCollapsed: any,
    documents: Document[],
    isLoadingDocs: any,
    loadingBins: boolean,
}

export default function ConversationSidebar({
    documents,
    isLoadingDocs,
    bins,
    onDeleteBin,
    onRenameBin,
    onAddSpace,
    onDeleteSpace,
    onRenameSpace,
    onSpaceSelect,
    onAddBin,
    loadingBins,
    isCollapsed,
    setIsCollapsed,

}: ConversationSidebarProps) {

    const [activeBin, setActiveBin] = useState<string | null>(null);
    const [activeSpace, setActiveSpace] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [showUploadedDocs, setShowUploadedDocs] = useState(true);
    const [renameModalOpen, setRenameModalOpen] = useState(false);
    const [renameType, setRenameType] = useState<"bin" | "space" | null>(null);
    const [renameId, setRenameId] = useState<string | null>(null);
    const [renameDefaultValue, setRenameDefaultValue] = useState<string>("");
    const [showBins, setShowBins] = useState(true)

    const onBinSelect = (binId: string) => {
        setActiveBin((prev) => (prev === binId ? null : binId));
    };

    const handleRenameBin = (binId: string, binName: string) => {
        setRenameType("bin");
        setRenameId(binId);
        setRenameDefaultValue(binName);
        setRenameModalOpen(true);
    };


    const handleRenameSpace = (spaceId: string, spaceName: string) => {
        setRenameType("space");
        setRenameId(spaceId);
        setRenameDefaultValue(spaceName);
        setRenameModalOpen(true);
    };

    return (
        <div className={`h-full border-r transition-all duration-300 flex flex-col ${isCollapsed ? "w-16" : "w-70"}`}>
            <div className="p-2 border-b flex justify-end ">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="cursor-pointer"
                >
                    {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                </Button>
            </div>

            {!isCollapsed && (
                <>
                    <NewBinDialog onAddBin={onAddBin} />
                    {renameModalOpen && (
                        <RenameModal
                            type={renameType}
                            id={renameId}
                            defaultValue={renameDefaultValue}
                            onClose={() => setRenameModalOpen(false)}
                            onSubmit={(newName) => {
                                if (renameType === "bin" && renameId) {
                                    onRenameBin(renameId, newName);
                                } else if (renameType === "space" && renameId) {
                                    onRenameSpace(renameId, newName);
                                }
                                setRenameModalOpen(false);
                            }}
                        />
                    )}

                    {/* Fixed search + scrollable middle section + sticky user section */}
                    <div className="flex  bg-zinc-00 flex-col flex-1 overflow-hidden">
                        {/* Search */}
                        <div className="px-4 py-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3" />
                                <Input
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 text-sm"
                                />
                            </div>
                        </div>

                        {/* Scrollable content: Bins + Recent uploads */}
                        <h2
                            onClick={() => setShowBins(!showBins)}
                            className="flex items-center justify-between text-xs font-semibold text-gray-500 uppercase tracking-wide px-2 mb-1 mt-2 cursor-pointer select-none"
                        >
                            <span>Workspace Bins</span>
                            {showBins ? (
                                <ChevronDown size={14} className="text-gray-500" />
                            ) : (
                                <ChevronRight size={14} className="text-gray-500" />
                            )}
                        </h2>
                        <ScrollArea className="flex-1 overflow-auto px-2 py-1">
                            {/* Bins List */}
                            <AnimatePresence mode="wait">
                                {loadingBins ? (
                                    <motion.div
                                        key="bins-loading"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="space-y-2"
                                    >
                                        {[...Array(3)].map((_, i) => (
                                            <div
                                                key={i}
                                                className="bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 animate-pulse"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-3 h-3 rounded-full bg-gray-300" />
                                                    <div className="flex flex-col space-y-2 w-full">
                                                        <div className="h-3 w-2/3 bg-gray-300 rounded" />
                                                        <div className="h-2 w-1/2 bg-gray-200 rounded" />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </motion.div>
                                ) : (
                                    showBins && (
                                        bins
                                            .filter((bin: Bin) =>
                                                bin.name.toLowerCase().includes(searchQuery.toLowerCase())
                                            )
                                            .map((bin: Bin) => (
                                                <motion.div
                                                    key={bin.id}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="group"
                                                >
                                                    {/* Bin Header */}
                                                    <div
                                                        onClick={() => onBinSelect(bin.id)}
                                                        className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition hover:bg-white/50 ${activeBin === bin.id ? "bg-gray-100 shadow-sm" : ""
                                                            }`}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div
                                                                className="w-3 h-3 rounded-full"
                                                                style={{ backgroundColor: bin.color }}
                                                            />
                                                            <div className="flex items-center gap-2">
                                                                <Folder size={16} className="text-gray-500" />
                                                                <span className="font-medium text-xs text-gray-800">
                                                                    {bin.name}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs text-gray-500 bg-gray-100/70 px-2 py-1 rounded-full">
                                                                {bin.spaces?.length ?? 0}
                                                            </span>
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <button
                                                                        onClick={(e) => e.stopPropagation()}
                                                                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100/70 rounded-lg transition"
                                                                    >
                                                                        <MoreHorizontal size={16} className="text-gray-500" />
                                                                    </button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end" className="w-48">
                                                                    <DropdownMenuItem
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            onAddSpace(bin.id);
                                                                        }}
                                                                    >
                                                                        <Plus size={16} className="mr-2" />
                                                                        Add Space
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handleRenameBin(bin.id, bin.name);
                                                                        }}
                                                                    >
                                                                        <Pencil size={16} className="mr-2" />
                                                                        Rename Bin
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            onDeleteBin(bin.id);
                                                                        }}
                                                                        className="text-red-600"
                                                                    >
                                                                        <Trash2 size={16} className="mr-2" />
                                                                        Delete Bin
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </div>
                                                    </div>

                                                    {/* Spaces under bin */}
                                                    {activeBin === bin.id && (
                                                        <div className="ml-6 mt-2 space-y-1">
                                                            {bin.spaces.map((space) => (
                                                                <div
                                                                    key={space.spaceId}
                                                                    className={`flex items-center justify-between gap-3 p-3 rounded-lg cursor-pointer transition hover:bg-white/50 ${activeSpace === space.spaceId
                                                                        ? "bg-blue-50 border border-blue-200/50"
                                                                        : ""
                                                                        }`}
                                                                    onClick={() => onSpaceSelect(space.spaceId)}
                                                                >
                                                                    <div className="flex items-center gap-3 overflow-hidden">
                                                                        <MessageCircle
                                                                            size={16}
                                                                            className="text-gray-400 flex-shrink-0"
                                                                        />
                                                                        <div className="min-w-0">
                                                                            <span className="font-medium text-xs text-gray-800 truncate">
                                                                                {space.spaceName}
                                                                            </span>
                                                                            <p className="text-xs text-gray-500 truncate">
                                                                                {space.lastUsedNumOfDays} Days Ago
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                    <DropdownMenu>
                                                                        <DropdownMenuTrigger asChild>
                                                                            <button
                                                                                onClick={(e) => e.stopPropagation()}
                                                                                className="p-1 rounded-md hover:bg-gray-100 transition"
                                                                            >
                                                                                <MoreHorizontal size={16} className="text-gray-500" />
                                                                            </button>
                                                                        </DropdownMenuTrigger>
                                                                        <DropdownMenuContent align="end" className="w-40">
                                                                            <DropdownMenuItem
                                                                                onClick={() =>
                                                                                    handleRenameSpace(space.spaceId, space.spaceName)
                                                                                }
                                                                            >
                                                                                <Pencil size={16} className="mr-2" />
                                                                                Rename
                                                                            </DropdownMenuItem>
                                                                            <DropdownMenuItem
                                                                                onClick={() => onDeleteSpace(space.spaceId, bin.id)}
                                                                                className="text-red-600"
                                                                            >
                                                                                <Trash2 size={16} className="mr-2" />
                                                                                Delete
                                                                            </DropdownMenuItem>
                                                                        </DropdownMenuContent>
                                                                    </DropdownMenu>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </motion.div>
                                            ))
                                    )
                                )}
                            </AnimatePresence>

                        </ScrollArea>

                        <UploadedDocsList
                            documents={documents}
                            isLoadingDocs={isLoadingDocs}
                            showUploadedDocs={showUploadedDocs}
                            toggleShowUploadedDocs={() => setShowUploadedDocs(prev => !prev)}
                        />
                        <UserSection />
                    </div>
                </>
            )}
        </div>

    );
}
