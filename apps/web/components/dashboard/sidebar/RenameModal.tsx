"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface RenameModalProps {
    type: "bin" | "space" | null;
    id: string | null;
    defaultValue: string;
    onSubmit: (newName: string) => void;
    onClose: () => void;
}

export default function RenameModal({
    type,
    id,
    defaultValue,
    onSubmit,
    onClose,
}: RenameModalProps) {
    const [newName, setNewName] = useState(defaultValue);

    useEffect(() => {
        setNewName(defaultValue);
    }, [defaultValue]);

    const handleSubmit = () => {
        if (newName.trim()) {
            onSubmit(newName.trim());
        }
    };

    return (
        <Dialog open={!!type && !!id} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Rename {type === "bin" ? "Bin" : "Space"}</DialogTitle>
                </DialogHeader>
                <Input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder={`Enter new ${type} name`}
                />
                <DialogFooter className="mt-4">
                    <Button variant="ghost" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit}>Rename</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
