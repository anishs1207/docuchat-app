import React from 'react';
import { Star, Quote } from 'lucide-react';
import { Testimonial } from '@/types';

const testimonials: Testimonial[] = [
    {
        id: '1',
        name: 'Sarah Chen',
        role: 'Research Director',
        company: 'TechCorp',
        content: 'DocuChat has revolutionized how our team processes research papers. What used to take hours now takes minutes. The AI understands context incredibly well.',
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
        rating: 5
    },
    {
        id: '2',
        name: 'Marcus Rodriguez',
        role: 'Legal Counsel',
        company: 'LawFirm Pro',
        content: 'As a lawyer, I deal with hundreds of documents daily. DocuChat helps me quickly extract key information and find relevant clauses. It\'s like having a research assistant.',
        avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
        rating: 5
    },
    {
        id: '3',
        name: 'Emily Watson',
        role: 'Product Manager',
        company: 'StartupXYZ',
        content: 'The conversation interface is so intuitive. I can upload product specs and instantly get answers about features, requirements, and technical details.',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
        rating: 5
    },
    {
        id: '4',
        name: 'David Kim',
        role: 'Financial Analyst',
        company: 'InvestCorp',
        content: 'DocuChat makes financial report analysis effortless. I can quickly identify trends, extract key metrics, and generate insights for stakeholders.',
        avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
        rating: 5
    },
    {
        id: '5',
        name: 'Lisa Thompson',
        role: 'Academic Researcher',
        company: 'University',
        content: 'Perfect for literature reviews! I can upload multiple papers and ask comparative questions. It\'s like having a conversation with the entire research field.',
        avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
        rating: 5
    },
    {
        id: '6',
        name: 'James Wilson',
        role: 'Consultant',
        company: 'Strategy Plus',
        content: 'Client presentations are so much easier now. I upload their documents and can instantly answer any questions during meetings. Impressive accuracy!',
        avatar: 'https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
        rating: 5
    }
];

export default function TestimonialsSection() {
    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
            />
        ));
    };

    return (
        <section id="testimonials" className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Loved by Professionals Worldwide
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Join thousands of professionals who have transformed their document workflow with DocuChat
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {testimonials.map((testimonial) => (
                        <div
                            key={testimonial.id}
                            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
                        >
                            <div className="flex items-center mb-4">
                                <Quote className="w-8 h-8 text-blue-600 opacity-50" />
                            </div>

                            <div className="flex mb-4">
                                {renderStars(testimonial.rating)}
                            </div>

                            <p className="text-gray-700 mb-6 leading-relaxed">
                                "{testimonial.content}"
                            </p>

                            <div className="flex items-center">
                                <img
                                    src={testimonial.avatar}
                                    alt={testimonial.name}
                                    className="w-12 h-12 rounded-full object-cover mr-4"
                                />
                                <div>
                                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                                    <p className="text-sm text-gray-600">
                                        {testimonial.role} at {testimonial.company}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Trust indicators */}
                <div className="mt-16 text-center">
                    <p className="text-gray-500 mb-8">Trusted by teams at</p>
                    <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
                        <div className="text-2xl font-bold text-gray-400">TechCorp</div>
                        <div className="text-2xl font-bold text-gray-400">LawFirm Pro</div>
                        <div className="text-2xl font-bold text-gray-400">StartupXYZ</div>
                        <div className="text-2xl font-bold text-gray-400">InvestCorp</div>
                        <div className="text-2xl font-bold text-gray-400">University</div>
                        <div className="text-2xl font-bold text-gray-400">Strategy Plus</div>
                    </div>
                </div>
            </div>
        </section>
    );
}