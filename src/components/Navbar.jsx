import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Package, Home, Settings, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useState, useEffect } from 'react';

const Navbar = () => {
    const { cart } = useCart();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    const itemCount = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navItems = [
        { to: "/", icon: <Home className="w-5 h-5 mr-2" />, label: "Home" },
        { to: "/products", icon: <Package className="w-5 h-5 mr-2" />, label: "Products" },
        { to: "/admin", icon: <Settings className="w-5 h-5 mr-2" />, label: "Admin" }
    ];

    const NavLink = ({ to, icon, label }) => (
        <Link
            to={to}
            onClick={() => setIsOpen(false)}
            className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                location.pathname === to 
                    ? 'text-primary-600 bg-primary-50' 
                    : 'text-gray-700 hover:bg-gray-100'
            }`}
        >
            {icon}
            {label}
        </Link>
    );

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${
            scrolled ? 'bg-white/90 backdrop-blur-md shadow-md' : 'bg-white/80 backdrop-blur-sm'
        }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link 
                            to="/" 
                            className="flex-shrink-0 flex items-center group"
                        >
                            <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                                StoreFront
                            </span>
                        </Link>
                        <div className="hidden md:ml-10 md:flex md:space-x-2">
                            {navItems.map((item) => (
                                <NavLink key={item.to} {...item} />
                            ))}
                        </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                        <Link 
                            to="/cart" 
                            className="relative p-2 rounded-full text-gray-600 hover:text-primary-600 hover:bg-gray-100 transition-colors duration-200 group"
                            aria-label="Shopping cart"
                        >
                            <ShoppingCart className="h-6 w-6" />
                            {itemCount > 0 && (
                                <span className="absolute top-0 right-0 inline-flex items-center justify-center h-5 w-5 text-xs font-bold text-white bg-red-500 rounded-full transform translate-x-1/2 -translate-y-1/2">
                                    {itemCount}
                                </span>
                            )}
                        </Link>
                        
                        <button 
                            onClick={() => setIsOpen(!isOpen)}
                            className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            aria-label="Toggle menu"
                        >
                            {isOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <div className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
                isOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
            }`}>
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    {navItems.map((item) => (
                        <NavLink key={item.to} {...item} />
                    ))}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
