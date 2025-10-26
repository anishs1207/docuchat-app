// WorkspaceBins.tsx
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Folder,
    MessageCircle,
    MoreHorizontal,
    Plus,
    Pencil,
    Trash2,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export interface Space {
    spaceId: string;
    spaceName: string;
    lastUsedNumOfDays: number;
}

export interface Bin {
    id: string;
    name: string;
    color: string;
    spaces: Space[];
}

interface WorkspaceBinsProps {
    bins: Bin[];
    loadingBins: boolean;
    searchQuery: string;
    activeBin: string | null;
    activeSpace: string | null;
    onBinSelect: (binId: string) => void;
    onSpaceSelect: (spaceId: string) => void;
    onAddSpace: (binId: string) => void;
    handleRenameBin: (binId: string, binName: string) => void;
    handleRenameSpace: (spaceId: string, spaceName: string) => void;
    onDeleteBin: (binId: string) => void;
    onDeleteSpace: (spaceId: string) => void;
    onMoveSpaceToNewBin: (spaceId: string) => void;
}

const WorkspaceBins: React.FC<WorkspaceBinsProps> = ({
    bins,
    loadingBins,
    searchQuery,
    activeBin,
    activeSpace,
    onBinSelect,
    onSpaceSelect,
    onAddSpace,
    handleRenameBin,
    handleRenameSpace,
    onDeleteBin,
    onDeleteSpace,
    onMoveSpaceToNewBin,
}) => {
    return (
        <>
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-2 mb-1">
                Worklflows
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
                                                <span className="font-medium text-sm text-gray-800">
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
                                                            <span className="font-medium text-sm text-gray-800 truncate">
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
                                                                onClick={() => onMoveSpaceToNewBin(space.spaceId)}
                                                            >
                                                                <Folder size={16} className="mr-2" />
                                                                Move to...
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => onDeleteSpace(space.spaceId)}
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
                    )}
                </AnimatePresence>

            </ScrollArea>
        </>
    );
};

export default WorkspaceBins;
