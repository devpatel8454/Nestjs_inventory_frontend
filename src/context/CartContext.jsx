import { createContext, useState, useEffect, useContext } from 'react';
import { createCart, getCart, removeFromCart } from '../api/api';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartId, setCartId] = useState(localStorage.getItem('cartId'));
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (cartId) {
            localStorage.setItem('cartId', cartId);
            fetchCart(cartId);
        }
    }, [cartId]);

    const fetchCart = async (id) => {
        try {
            setLoading(true);
            const res = await getCart(id);
            const data = res.data || {};
            const items = Array.isArray(data.items) ? data.items : [];
            // Normalize each item to always have an 'id' we can use as the cart line identifier
            const normalizedItems = items.map((it, index) => ({
                ...it,
                id: it.id ?? it.itemId ?? it.itemid ?? it.cartItemId ?? it.cart_item_id ?? it.lineId ?? it.line_id ?? it.productid ?? index,
            }));
            setCart({ ...data, items: normalizedItems });
        } catch (error) {
            console.error("Failed to fetch cart", error);
            if (error.response && error.response.status === 404) {
                setCartId(null);
                localStorage.removeItem('cartId');
                setCart(null);
            }
        } finally {
            setLoading(false);
        }
    };

    const initCart = async () => {
        if (!cartId) {
            try {
                const res = await createCart();
                const newCartId = res.data.id || res.data;
                setCartId(newCartId);
                return newCartId;
            } catch (e) {
                console.error("Failed to create cart", e);
                throw e;
            }
        }
        return cartId;
    };

    const removeItem = async (itemId) => {
        if (!cartId) return;
        
        try {
            setLoading(true);
            await removeFromCart(cartId, itemId);
            // Refresh the cart after removal
            await fetchCart(cartId);
        } catch (error) {
            console.error("Failed to remove item from cart", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return (
        <CartContext.Provider value={{ 
            cartId, 
            cart, 
            setCartId, 
            initCart, 
            fetchCart, 
            removeItem,
            loading 
        }}>
            {children}
        </CartContext.Provider>
    );
};
