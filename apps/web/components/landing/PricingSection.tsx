"use client"

import React, { useState } from 'react';
import { Check, Zap } from 'lucide-react';

const pricingPlans = [
    {
        id: 'free',
        name: 'Free',
        price: 0,
        period: 'month',
        description: 'Perfect for individuals getting started',
        features: [
            '5 documents per month',
            '100 questions per month',
            'Basic chat interface',
            'PDF support',
            'Email support'
        ],
        buttonText: 'Get Started Free',
        popular: false
    },
    {
        id: 'pro',
        name: 'Pro',
        price: 19,
        period: 'month',
        description: 'Ideal for professionals and small teams',
        features: [
            'Unlimited documents',
            'Unlimited questions',
            'Advanced chat features',
            'Multiple file formats',
            'Priority support',
            'Team collaboration',
            'Export conversations',
            'Advanced analytics'
        ],
        buttonText: 'Start Pro Trial',
        popular: true
    },
    {
        id: 'enterprise',
        name: 'Enterprise',
        price: 99,
        period: 'month',
        description: 'For large teams and organizations',
        features: [
            'Everything in Pro',
            'Custom integrations',
            'SSO authentication',
            'Advanced security',
            'Dedicated support',
            'Custom training',
            'API access',
            'White-label options'
        ],
        buttonText: 'Contact Sales',
        popular: false
    }
];

export default function PricingSection() {
    const [isAnnual, setIsAnnual] = useState(false);

    const getPrice = (price: number) => {
        if (price === 0) return 0;
        return isAnnual ? Math.floor(price * 0.8) : price;
    };

    return (
        <section id="pricing" className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Simple, Transparent Pricing
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                        Choose the plan that fits your needs. All plans include our core AI-powered document chat features.
                    </p>

                    {/* Billing toggle */}
                    <div className="flex items-center justify-center space-x-4">
                        <span className={`text-sm font-medium ${!isAnnual ? 'text-gray-900' : 'text-gray-500'}`}>
                            Monthly
                        </span>
                        <button
                            onClick={() => setIsAnnual(!isAnnual)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isAnnual ? 'bg-blue-600' : 'bg-gray-200'
                                }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isAnnual ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                            />
                        </button>
                        <span className={`text-sm font-medium ${isAnnual ? 'text-gray-900' : 'text-gray-500'}`}>
                            Annual
                        </span>
                        {isAnnual && (
                            <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                                Save 20%
                            </span>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {pricingPlans.map((plan) => (
                        <div
                            key={plan.id}
                            className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all duration-200 hover:shadow-xl ${plan.popular
                                ? 'border-blue-500 scale-105'
                                : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                    <div className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-1">
                                        <Zap className="w-4 h-4" />
                                        <span>Most Popular</span>
                                    </div>
                                </div>
                            )}

                            <div className="p-8">
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                                <p className="text-gray-600 mb-6">{plan.description}</p>

                                <div className="mb-6">
                                    <div className="flex items-baseline">
                                        <span className="text-4xl font-bold text-gray-900">
                                            ${getPrice(plan.price)}
                                        </span>
                                        <span className="text-gray-600 ml-2">/{plan.period}</span>
                                    </div>
                                    {isAnnual && plan.price > 0 && (
                                        <p className="text-sm text-gray-500 mt-1">
                                            ${plan.price}/month billed annually
                                        </p>
                                    )}
                                </div>

                                <button
                                    className={`w-full py-3 px-6 rounded-xl font-semibold transition-colors mb-8 ${plan.popular
                                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                        : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                                        }`}
                                >
                                    {plan.buttonText}
                                </button>

                                <ul className="space-y-4">
                                    {plan.features.map((feature, index) => (
                                        <li key={index} className="flex items-start space-x-3">
                                            <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                            <span className="text-gray-700">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>

                {/* FAQ */}

            </div>
        </section>
    );
}