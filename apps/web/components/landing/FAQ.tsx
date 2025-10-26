export default function FAQ() {
    return (
        <section className="mt-20 mb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
                <h3 className="text-3xl font-bold text-gray-900 mb-12">
                    Frequently Asked Questions
                </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto text-left">
                <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900 text-lg">Can I change plans anytime?</h4>
                    <p className="text-gray-600 text-sm">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
                </div>
                <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900 text-lg">Is my data secure?</h4>
                    <p className="text-gray-600 text-sm">Absolutely. We use enterprise-grade encryption and never store your documents longer than necessary.</p>
                </div>
                <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900 text-lg">What file formats are supported?</h4>
                    <p className="text-gray-600 text-sm">We support PDF, Word, PowerPoint, and many other common document formats.</p>
                </div>
                <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900 text-lg">Do you offer refunds?</h4>
                    <p className="text-gray-600 text-sm">Yes, we offer a 30-day money-back guarantee for all paid plans.</p>
                </div>
            </div>
        </section>
    );
}
