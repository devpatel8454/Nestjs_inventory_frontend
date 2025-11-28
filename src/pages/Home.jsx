import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Shield, Truck, RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';

const Home = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Trigger animation after component mounts
        setIsVisible(true);
    }, []);

    const features = [
        {
            icon: <ShoppingBag className="h-6 w-6 text-primary-500" />,
            title: 'Premium Products',
            description: 'Handpicked selection of high-quality items'
        },
        {
            icon: <Truck className="h-6 w-6 text-primary-500" />,
            title: 'Fast Shipping',
            description: 'Free delivery on all orders over $50'
        },
        {
            icon: <Shield className="h-6 w-6 text-primary-500" />,
            title: 'Secure Checkout',
            description: 'Your payment information is always protected'
        },
        {
            icon: <RefreshCw className="h-6 w-6 text-primary-500" />,
            title: 'Easy Returns',
            description: '30-day return policy for all products'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Hero Section */}
            <div className="relative overflow-hidden pt-24 pb-16 sm:pt-32">
                <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]" />
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className={`text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                            <span className="block">Elevate Your</span>
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">Shopping Experience</span>
                        </h1>
                        <p className={`mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                            Discover our curated collection of premium products designed to enhance your lifestyle. Quality, style, and innovation in one place.
                        </p>
                        <div className={`mt-8 flex justify-center gap-4 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                            <Link
                                to="/products"
                                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
                            >
                                Shop Now
                                <ArrowRight className="ml-2 -mr-1 h-5 w-5" />
                            </Link>
                            <Link
                                to="/about"
                                className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md"
                            >
                                Learn More
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Decorative background elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-r from-primary-100 to-secondary-100 opacity-30 blur-3xl" />
                </div>
            </div>

            {/* Features Section */}
            <div className="py-12 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:text-center">
                        <h2 className="text-base font-semibold tracking-wide text-primary-600 uppercase">Features</h2>
                        <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
                            A better way to shop
                        </p>
                        <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                            We're committed to providing the best shopping experience with premium products and excellent service.
                        </p>
                    </div>

                    <div className="mt-16">
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                            {features.map((feature, index) => (
                                <div 
                                    key={index}
                                    className="pt-6"
                                >
                                    <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8 h-full transition-all duration-300 hover:shadow-md hover:border-primary-50 hover:-translate-y-1">
                                        <div className="-mt-6">
                                            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-white text-primary-500 shadow-md mx-auto">
                                                {feature.icon}
                                            </div>
                                            <h3 className="mt-6 text-lg font-medium text-gray-900 text-center">{feature.title}</h3>
                                            <p className="mt-2 text-base text-gray-500 text-center">
                                                {feature.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-primary-600 to-secondary-600">
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
                    <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                        <span className="block">Ready to dive in?</span>
                        <span className="block text-primary-200">Start shopping today.</span>
                    </h2>
                    <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
                        <div className="inline-flex rounded-md shadow">
                            <Link
                                to="/products"
                                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-gray-50 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
                            >
                                Browse Products
                                <ArrowRight className="ml-2 -mr-1 h-5 w-5" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
