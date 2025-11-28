import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Package, Home, Settings, Menu, X, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { cart } = useCart();
    const { token, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

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
        <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
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
                    
                    <div className="flex items-center space-x-2 sm:space-x-4">
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

                        {token ? (
                            <>
                                <Link
                                    to="/orders"
                                    className="hidden md:inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100"
                                >
                                    Orders
                                </Link>
                                <Link
                                    to="/profile"
                                    className="hidden md:inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100"
                                >
                                    <User className="w-4 h-4 mr-2" /> Profile
                                </Link>
                                <button
                                    onClick={() => { logout(); navigate('/login'); }}
                                    className="hidden md:inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg text-white bg-red-500 hover:bg-red-600"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="hidden md:inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="hidden md:inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                        
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
                    {token ? (
                        <>
                            <NavLink to="/orders" icon={<Package className="w-5 h-5 mr-2" />} label="Orders" />
                            <NavLink to="/profile" icon={<User className="w-5 h-5 mr-2" />} label="Profile" />
                            <button
                                onClick={() => { setIsOpen(false); logout(); navigate('/login'); }}
                                className="w-full text-left flex items-center px-4 py-3 text-sm font-medium rounded-lg text-red-600 hover:bg-red-50"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <NavLink to="/login" icon={null} label="Login" />
                            <NavLink to="/register" icon={null} label="Register" />
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
