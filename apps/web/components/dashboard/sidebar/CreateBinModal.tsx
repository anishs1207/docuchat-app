"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface NewBinDialogProps {
    onAddBin: (name: string, color: string) => void;
}

export default function NewBinDialog({ onAddBin }: NewBinDialogProps) {
    const [openDialog, setOpenDialog] = useState(false);
    const [newBinName, setNewBinName] = useState("");
    const [newBinColor, setNewBinColor] = useState("#000000");

    const handleAddNewBin = () => {
        if (!newBinName.trim()) return;
        onAddBin(newBinName, newBinColor);
        setNewBinName("");
        setNewBinColor("#000000");
        setOpenDialog(false);
    };

    return (
        <div className="p-4 border-b space-y-3">
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogTrigger asChild>
                    <Button
                        className="cursor-pointer w-full flex text-xs items-center gap-2 bg-black text-white hover:bg-neutral-800 border border-white"
                    >
                        <Plus className="w-4 h-4" />
                        New Bin
                    </Button>

                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create New Bin</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="binName">Bin Name</Label>
                            <Input
                                id="binName"
                                value={newBinName}
                                onChange={(e) => setNewBinName(e.target.value)}
                                placeholder="e.g. Work"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="color">Color</Label>
                            <Input
                                id="color"
                                type="color"
                                value={newBinColor}
                                onChange={(e) => setNewBinColor(e.target.value)}
                                className="w-16 h-10 p-1"
                            />
                        </div>
                        <Button onClick={handleAddNewBin} className="w-full">
                            Create Bin
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}