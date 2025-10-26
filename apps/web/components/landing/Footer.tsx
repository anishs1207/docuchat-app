import React from 'react';
import { MessageSquare, Twitter, Github, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
    const footerLinks = {
        product: [
            { name: 'Features', href: '#features' },
            { name: 'Pricing', href: '#pricing' },
            { name: 'API', href: '#api' },
            { name: 'Integrations', href: '#integrations' },
        ],
        company: [
            { name: 'About', href: '#about' },
            { name: 'Blog', href: '#blog' },
            { name: 'Careers', href: '#careers' },
            { name: 'Press', href: '#press' },
        ],
        support: [
            { name: 'Help Center', href: '#help' },
            { name: 'Documentation', href: '#docs' },
            { name: 'Contact', href: '#contact' },
            { name: 'Status', href: '#status' },
        ],
        legal: [
            { name: 'Privacy', href: '#privacy' },
            { name: 'Terms', href: '#terms' },
            { name: 'Security', href: '#security' },
            { name: 'Cookies', href: '#cookies' },
        ],
    };

    const socialLinks = [
        { name: 'Twitter', icon: Twitter, href: '#twitter' },
        { name: 'GitHub', icon: Github, href: '#github' },
        { name: 'LinkedIn', icon: Linkedin, href: '#linkedin' },
        { name: 'Email', icon: Mail, href: '#email' },
    ];

    return (
        <footer className="bg-gray-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
                    {/* Brand */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center mb-4">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                                <MessageSquare className="w-5 h-5 text-white" />
                            </div>
                            <span className="ml-2 text-xl font-bold">DocuChat</span>
                        </div>
                        <p className="text-gray-400 mb-6 max-w-md">
                            Transform your documents into intelligent conversations. Upload, chat, and discover insights with AI-powered document analysis.
                        </p>
                        <div className="flex space-x-4">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.href}
                                    className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors"
                                >
                                    <social.icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
                            Product
                        </h3>
                        <ul className="space-y-3">
                            {footerLinks.product.map((link) => (
                                <li key={link.name}>
                                    <a
                                        href={link.href}
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
                            Company
                        </h3>
                        <ul className="space-y-3">
                            {footerLinks.company.map((link) => (
                                <li key={link.name}>
                                    <a
                                        href={link.href}
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
                            Support
                        </h3>
                        <ul className="space-y-3">
                            {footerLinks.support.map((link) => (
                                <li key={link.name}>
                                    <a
                                        href={link.href}
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
                            Legal
                        </h3>
                        <ul className="space-y-3">
                            {footerLinks.legal.map((link) => (
                                <li key={link.name}>
                                    <a
                                        href={link.href}
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-12 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-gray-400 text-sm">
                            © 2025 DocuChat. All rights reserved.
                        </p>
                        <p className="text-gray-400 text-sm mt-4 md:mt-0">
                            Built with ❤️ for better document experiences
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}