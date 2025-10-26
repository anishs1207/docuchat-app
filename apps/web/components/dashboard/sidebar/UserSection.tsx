"use client";

import { LogOut, BadgePercent, UserPlus, Crown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

export default function UserSection() {
    const router = useRouter();
    const { setTheme } = useTheme();

    const user = {
        name: "Anish Sabharwal",
        email: "anish@example.com",
        image: "",
    };

    const initials = user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    const handleLogout = () => {
        router.push("/");
    };

    function handleReferFriend() {
        const randomCode = `docuchat-${Math.floor(100000 + Math.random() * 900000)}`

        navigator.clipboard.writeText(randomCode)
            .then(() => {
                toast.success(`Referral code copied: ${randomCode}`, {
                    duration: 2000
                })
            })
            .catch(() => {
                toast.error("Failed to copy referral code")
            })
    }

    return (
        <div className="border-t px-3 py-2 shrink-0">
            <div className="px-4 py-4 mt-auto space-y-4">
                <div className="flex justify-center w-full">
                    <span className="text-xs inline-flex items-center justify-center w-full gap-2 px-3 py-1 font-semibold text-white bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 rounded-full shadow-sm text-center">
                        <BadgePercent size={16} className="text-white" />
                        Free Tier
                    </span>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className="cursor-pointer w-full flex items-center justify-between hover:bg-muted rounded-md px-3 py-3 transition"
                        >
                            <div className="flex items-center gap-3">
                                <Avatar className="h-9 w-9">
                                    <AvatarImage src={user.image} alt={user.name} />
                                    <AvatarFallback className="text-xs bg-muted text-gray-600">
                                        {initials}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col text-left">
                                    <span className="text-xs font-medium">{user.name}</span>
                                    <span className="text-xs text-muted-foreground">
                                        {user.email}
                                    </span>
                                </div>
                            </div>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-[220px] mt-1">
                        <DropdownMenuItem
                            disabled
                            className="text-xs text-muted-foreground cursor-default"
                        >
                            {user.email}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={handleLogout}
                            className="cursor-pointer text-sm text-gray-700 flex items-center gap-2 hover:bg-gray-100"
                        >
                            <LogOut size={16} className="text-gray-500" />
                            Logout
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onClick={handleReferFriend}
                            className="cursor-pointer text-sm text-gray-700 flex items-center gap-2 hover:bg-gray-100"
                        >
                            <UserPlus size={16} className="text-gray-500" />
                            Refer a Friend
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={handleLogout}
                            className="cursor-pointer text-sm text-gray-700 flex items-center gap-2 hover:bg-gray-100"
                        >
                            <Crown size={16} className="text-gray-500" />
                            Upgrade
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div >
        </div >
    );
}
