import { useCart } from '../context/CartContext';
import { addToCart } from '../api/api';
import { useState } from 'react';
import { Plus, Check } from 'lucide-react';

const ProductCard = ({ product }) => {
    const { initCart, fetchCart } = useCart();
    const [adding, setAdding] = useState(false);
    const [added, setAdded] = useState(false);

    const handleAddToCart = async () => {
        try {
            setAdding(true);
            const cartId = await initCart();
            await addToCart(cartId, product.id, 1);
            await fetchCart(cartId);
            setAdded(true);
            setTimeout(() => setAdded(false), 2000);
        } catch (error) {
            console.error("Failed to add to cart", error);
            alert("Failed to add to cart");
        } finally {
            setAdding(false);
        }
    };

    return (
        <div className="bg-white overflow-hidden shadow-sm rounded-xl hover:shadow-lg transition-all duration-300 flex flex-col h-full border border-gray-100 group">
            <div className="p-6 flex-1 flex flex-col">
                <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 truncate group-hover:text-primary-600 transition-colors" title={product.title}>{product.title}</h3>
                    <p className="mt-2 text-sm text-gray-500">Category IDs: {product.categoryIds?.join(', ') || 'None'}</p>
                </div>
                <div className="mt-6 flex items-center justify-between">
                    <span className="text-2xl font-bold text-gray-900">${Number(product.price).toFixed(2)}</span>
                    <button
                        onClick={handleAddToCart}
                        disabled={adding}
                        className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200 transform active:scale-95 ${added ? 'bg-green-500 hover:bg-green-600' : 'bg-primary-600 hover:bg-primary-700'
                            }`}
                    >
                        {adding ? (
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : added ? (
                            <>
                                <Check className="w-4 h-4 mr-2" />
                                Added
                            </>
                        ) : (
                            <>
                                <Plus className="w-4 h-4 mr-2" />
                                Add
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
