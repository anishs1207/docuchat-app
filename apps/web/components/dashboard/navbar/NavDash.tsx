"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Menu,
    X,
    MessageSquare,
    User,
    Settings,
    LogOut,
} from "lucide-react";

interface HeaderProps {
    user: {
        name: string;
        email: string;
        avatar?: string;
    };
    onLogout: () => void;
}

export default function DashboardHeader({ user, onLogout }: HeaderProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const router = useRouter();

    const navigation = [
        { name: "Chat", path: "/chat" },
        { name: "Files", path: "/files" },
        { name: "Settings", path: "/settings" },
    ];

    return (
        <header className="bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link href="/dashboard" className="flex items-center">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                                <MessageSquare className="w-5 h-5 text-white" />
                            </div>
                            <span className="ml-2 text-xl font-bold text-gray-900">DocuChat</span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex space-x-6">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.path}
                                className="text-gray-600 hover:text-blue-700 text-sm font-medium transition-colors"
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    {/* User Menu */}
                    <div className="flex items-center space-x-4 relative">


                        {isUserMenuOpen && (
                            <div className="absolute right-0 top-12 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                                <div className="px-4 py-2 border-b border-gray-100">
                                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                    <p className="text-xs text-gray-500">{user.email}</p>
                                </div>
                                <Link
                                    href="/profile"
                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    <User className="w-4 h-4 mr-2" />
                                    Profile
                                </Link>
                                <Link
                                    href="/settings"
                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    <Settings className="w-4 h-4 mr-2" />
                                    Settings
                                </Link>
                                <button
                                    onClick={() => {
                                        setIsUserMenuOpen(false);
                                        onLogout();
                                        router.push("/");
                                    }}
                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Sign out
                                </button>
                            </div>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            {isMenuOpen ? (
                                <X className="w-5 h-5 text-gray-600" />
                            ) : (
                                <Menu className="w-5 h-5 text-gray-600" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <div className="md:hidden border-t border-gray-200 py-3 space-y-2">
                        {navigation.map((item) => (
                            <></>
                        ))}
                    </div>
                )}
            </div>
        </header>
    );
}
