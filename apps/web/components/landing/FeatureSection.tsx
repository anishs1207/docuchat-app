import React from 'react';
import {
    MessageSquare,
    FileText,
    Zap,
    Shield,
    Globe,
    BarChart3,
    Search,
    Users,
    Clock
} from 'lucide-react';

const features = [
    {
        id: '1',
        title: 'Intelligent Document Analysis',
        description: 'Advanced AI understands context, structure, and meaning in your documents for accurate responses.',
        icon: FileText,
        color: 'blue'
    },
    {
        id: '2',
        title: 'Natural Conversations',
        description: 'Ask questions in plain English and get human-like responses with relevant citations.',
        icon: MessageSquare,
        color: 'purple'
    },
    {
        id: '3',
        title: 'Lightning Fast Processing',
        description: 'Upload and start chatting in seconds. No waiting, no complex setup required.',
        icon: Zap,
        color: 'yellow'
    },
    {
        id: '4',
        title: 'Enterprise Security',
        description: 'Bank-level encryption and privacy controls keep your sensitive documents secure.',
        icon: Shield,
        color: 'green'
    },
    {
        id: '5',
        title: 'Multi-Language Support',
        description: 'Chat with documents in 50+ languages with accurate translation and understanding.',
        icon: Globe,
        color: 'indigo'
    },
    {
        id: '6',
        title: 'Advanced Analytics',
        description: 'Track usage patterns, popular queries, and document insights with detailed analytics.',
        icon: BarChart3,
        color: 'pink'
    },
    {
        id: '7',
        title: 'Smart Search',
        description: 'Find specific information across multiple documents with semantic search capabilities.',
        icon: Search,
        color: 'orange'
    },
    {
        id: '8',
        title: 'Team Collaboration',
        description: 'Share conversations, collaborate on documents, and manage team access permissions.',
        icon: Users,
        color: 'teal'
    },
    {
        id: '9',
        title: 'Version History',
        description: 'Track document changes and conversation history with automatic versioning.',
        icon: Clock,
        color: 'red'
    }
];

const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    purple: 'bg-purple-100 text-purple-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    green: 'bg-green-100 text-green-600',
    indigo: 'bg-indigo-100 text-indigo-600',
    pink: 'bg-pink-100 text-pink-600',
    orange: 'bg-orange-100 text-orange-600',
    teal: 'bg-teal-100 text-teal-600',
    red: 'bg-red-100 text-red-600'
};

export default function FeaturesSection() {
    return (
        <section id="features" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Powerful Features for Every Use Case
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        From individual researchers to enterprise teams, DocuChat provides the tools you need to unlock insights from your documents
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature) => (
                        <div
                            key={feature.id}
                            className="group p-6 rounded-2xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-200"
                        >
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${colorClasses[feature.color as keyof typeof colorClasses]}`}>
                                <feature.icon className="w-6 h-6" />
                            </div>

                            <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                                {feature.title}
                            </h3>

                            <p className="text-gray-600 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Feature highlight */}
                <div className="mt-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 md:p-12 text-white">
                    <div className="max-w-4xl mx-auto text-center">
                        <h3 className="text-2xl md:text-3xl font-bold mb-4">
                            Ready to Transform Your Document Workflow?
                        </h3>
                        <p className="text-xl opacity-90 mb-8">
                            Join thousands of professionals who save hours every week with intelligent document conversations
                        </p>
                        <button className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
                            Start Your Free Trial
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}