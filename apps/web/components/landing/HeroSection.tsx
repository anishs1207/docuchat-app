import React from 'react';
import { ArrowRight, Play, FileText, MessageSquare, Zap } from 'lucide-react';


export default function HeroSection() {
    return (
        <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-20 pb-32 overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-full">
                    <div className="w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse absolute top-20 left-20"></div>
                    <div className="w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse absolute top-40 right-20 animation-delay-2000"></div>
                    <div className="w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse absolute bottom-20 left-1/2 transform -translate-x-1/2 animation-delay-4000"></div>
                </div>
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-8">
                        <Zap className="w-4 h-4 mr-2" />
                        AI-Powered Document Intelligence
                    </div>

                    {/* Main heading */}
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                        Chat with Your
                        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            {' '}Documents
                        </span>
                    </h1>

                    {/* Subheading */}
                    <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
                        Transform any PDF into an intelligent conversation. Upload your documents and get instant answers,
                        summaries, and insights powered by advanced AI.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                        <button
                            className="group bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                        >
                            <span>Start Chatting Free</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>

                        <button className="group flex items-center space-x-2 px-8 py-4 text-gray-700 hover:text-gray-900 transition-colors">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                                <Play className="w-5 h-5 text-blue-600 ml-1" />
                            </div>
                            <span className="text-lg font-medium">Watch Demo</span>
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-gray-900 mb-2">10M+</div>
                            <div className="text-gray-600">Documents Processed</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-gray-900 mb-2">50K+</div>
                            <div className="text-gray-600">Happy Users</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-gray-900 mb-2">99.9%</div>
                            <div className="text-gray-600">Uptime</div>
                        </div>
                    </div>
                </div>

                {/* Feature preview cards */}
                <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                            <FileText className="w-6 h-6 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Upload</h3>
                        <p className="text-gray-600">Drag & drop any PDF and watch it transform into an interactive knowledge base.</p>
                    </div>

                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                            <MessageSquare className="w-6 h-6 text-purple-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Natural Conversations</h3>
                        <p className="text-gray-600">Ask questions in plain English and get precise answers from your documents.</p>
                    </div>

                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
                        <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                            <Zap className="w-6 h-6 text-emerald-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Instant Insights</h3>
                        <p className="text-gray-600">Get summaries, key points, and deep analysis in seconds, not hours.</p>
                    </div>
                </div>
            </div>
        </section>
    );
}