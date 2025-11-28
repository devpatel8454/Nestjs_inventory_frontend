import { useState, useEffect } from 'react';
import { createCategory, createProduct, getCategories } from '../api/api';

const Admin = () => {
    const [categories, setCategories] = useState([]);

    // Category Form State
    const [catName, setCatName] = useState('');
    const [catParentId, setCatParentId] = useState('');

    // Product Form State
    const [prodTitle, setProdTitle] = useState('');
    const [prodPrice, setProdPrice] = useState('');
    const [prodCategoryIds, setProdCategoryIds] = useState([]);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await getCategories();
            setCategories(res.data);
        } catch (error) {
            console.error("Failed to fetch categories", error);
        }
    };

    const handleCreateCategory = async (e) => {
        e.preventDefault();
        try {
            await createCategory({ name: catName, parentid: catParentId ? Number(catParentId) : undefined });
            alert('Category created!');
            setCatName('');
            setCatParentId('');
            fetchCategories();
        } catch (error) {
            console.error("Failed to create category", error);
            alert('Failed to create category');
        }
    };

    const handleCreateProduct = async (e) => {
        e.preventDefault();
        try {
            await createProduct({
                title: prodTitle,
                price: Number(prodPrice),
                categoryIds: prodCategoryIds.map(Number)
            });
            alert('Product created!');
            setProdTitle('');
            setProdPrice('');
            setProdCategoryIds([]);
        } catch (error) {
            console.error("Failed to create product", error);
            alert('Failed to create product');
        }
    };

    const handleCategorySelect = (e) => {
        const options = e.target.options;
        const value = [];
        for (let i = 0, l = options.length; i < l; i++) {
            if (options[i].selected) {
                value.push(options[i].value);
            }
        }
        setProdCategoryIds(value);
    };

    return (
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-10">Admin Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Create Category */}
                <div className="bg-white shadow-lg rounded-xl p-8 border border-gray-100">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">Create Category</h2>
                    <form onSubmit={handleCreateCategory} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <input
                                type="text"
                                value={catName}
                                onChange={(e) => setCatName(e.target.value)}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-shadow"
                                placeholder="e.g. Electronics"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Parent Category (Optional)</label>
                            <select
                                value={catParentId}
                                onChange={(e) => setCatParentId(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-shadow"
                            >
                                <option value="">None</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name} (ID: {cat.id})</option>
                                ))}
                            </select>
                        </div>
                        <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors">
                            Create Category
                        </button>
                    </form>
                </div>

                {/* Create Product */}
                <div className="bg-white shadow-lg rounded-xl p-8 border border-gray-100">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">Create Product</h2>
                    <form onSubmit={handleCreateProduct} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Title</label>
                            <input
                                type="text"
                                value={prodTitle}
                                onChange={(e) => setProdTitle(e.target.value)}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-shadow"
                                placeholder="e.g. Wireless Headphones"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Price</label>
                            <input
                                type="number"
                                value={prodPrice}
                                onChange={(e) => setProdPrice(e.target.value)}
                                required
                                min="0"
                                step="0.01"
                                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-shadow"
                                placeholder="0.00"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Categories (Hold Ctrl to select multiple)</label>
                            <select
                                multiple
                                value={prodCategoryIds}
                                onChange={handleCategorySelect}
                                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm h-32 transition-shadow"
                            >
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-secondary-600 hover:bg-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500 transition-colors">
                            Create Product
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Admin;
