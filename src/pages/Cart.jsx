import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight, X, Trash2, Loader2 } from 'lucide-react';
import { useState } from 'react';

const Cart = () => {
    const { cart, loading, removeItem } = useCart();
    const navigate = useNavigate();
    const [removingItem, setRemovingItem] = useState(null);

    // Safely get price (some backends nest price under product)
    const getItemPrice = (it) => {
        const p = it?.price ?? it?.product?.price ?? 0;
        const n = typeof p === 'string' ? parseFloat(p) : Number(p);
        return Number.isFinite(n) ? n : 0;
    };

    const handleRemoveItem = async (itemId) => {
        if (!cart?.id) return;
        
        try {
            setRemovingItem(itemId);
            await removeItem(itemId);
        } catch (error) {
            console.error('Error removing item:', error);
            // You might want to show an error toast here
        } finally {
            setRemovingItem(null);
        }
    };

    const handleCheckout = () => {
        if (cart && cart.id) {
            navigate(`/invoice/${cart.id}`);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (!cart || !cart.items || cart.items.length === 0) {
        return (
            <div className="max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8 text-center">
                <div className="mx-auto h-24 w-24 text-gray-300 mb-6">
                    <ShoppingBag className="h-full w-full" />
                </div>
                <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Your cart is empty</h2>
                <p className="text-lg text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
                <button
                    onClick={() => navigate('/products')}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors"
                >
                    Start Shopping
                </button>
            </div>
        );
    }

    const totalQuantity = cart.items.reduce((acc, item) => acc + (item.quantity || 0), 0);
    const totalPrice = cart.items.reduce((total, item) => total + getItemPrice(item) * (item.quantity || 0), 0);

    return (
        <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
                <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
                    <ul className="divide-y divide-gray-200">
                        {cart.items.map((item, index) => (
                            <li key={item.id || index} className="px-6 py-5 grid grid-cols-12 gap-4 items-center hover:bg-gray-50 transition-colors group">
                                <div className="col-span-12 sm:col-span-8 flex items-center">
                                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center">
                                        {item.product?.image || item.image ? (
                                            <img src={item.product?.image || item.image} alt={item.product?.title || item.name || 'Product'} className="h-full w-full object-cover" />
                                        ) : (
                                            <ShoppingBag className="h-8 w-8 text-gray-400" />
                                        )}
                                    </div>
                                    <div className="ml-6">
                                        <h3 className="text-lg font-medium text-gray-900">
                                            {item.name || item.product?.title || `Product ${item.product?.id ?? ''}`}
                                        </h3>
                                        <p className="mt-1 text-sm text-gray-500">
                                            Qty: {item.quantity} • ${ (getItemPrice(item) * (item.quantity || 0)).toFixed(2) }
                                        </p>
                                    </div>
                                </div>
                                <div className="col-span-12 sm:col-span-4 flex items-center justify-between sm:justify-end space-x-4">
                                    <div className="text-lg font-semibold text-gray-900 tabular-nums">
                                        ${ (getItemPrice(item) * (item.quantity || 0)).toFixed(2) }
                                    </div>
                                    <button
                                        onClick={() => handleRemoveItem( item.product?.id)}
                                        disabled={removingItem === ( item.product?.id)}
                                        className="p-2 rounded-full text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        aria-label="Remove item"
                                    >
                                        {removingItem === ( item.product?.id) ? (
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                        ) : (
                                            <Trash2 className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div className="px-6 py-6 bg-gray-50 flex flex-col sm:flex-row justify-between items-center border-t border-gray-200 space-y-4 sm:space-y-0">
                        <div className="space-y-1">
                            <div className="text-lg font-medium text-gray-900">
                                Total Items: <span className="font-bold text-primary-600">{totalQuantity}</span>
                            </div>
                            <div className="text-xl font-bold text-gray-900">
                                Total: <span className="text-green-600 tabular-nums">${ totalPrice.toFixed(2) }</span>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                            <button
                                onClick={() => navigate('/products')}
                                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all"
                            >
                                Continue Shopping
                            </button>
                            <button
                                onClick={handleCheckout}
                                disabled={loading || cart.items.length === 0}
                                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        Proceed to Checkout
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
