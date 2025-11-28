import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { generateInvoice } from '../api/api';
import { CheckCircle, FileText, ArrowLeft } from 'lucide-react';

const Invoice = () => {
    const { cartId } = useParams();
    const [invoice, setInvoice] = useState(null);
    const [loading, setLoading] = useState(true);

    // Helpers to safely read common fields
    const getItemPrice = (it) => {
        const p = it?.price ?? it?.product?.price ?? 0;
        const n = typeof p === 'string' ? parseFloat(p) : Number(p);
        return Number.isFinite(n) ? n : 0;
    };
    const getItemTitle = (it) =>  it?.product?.title
        || it?.product?.name
        || it?.name
        || it?.title
        || `Product ${it?.product?.id ?? it?.productid ?? ''}`;
    const getItemImage = (it) => it?.image || it?.product?.image || null;

    useEffect(() => {
        if (cartId) {
            fetchInvoice();
        }
    }, [cartId]);

    const fetchInvoice = async () => {
        try {
            const res = await generateInvoice(cartId);
            setInvoice(res.data);
        } catch (error) {
            console.error("Failed to generate invoice", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (!invoice) {
        return (
            <div className="max-w-7xl mx-auto py-12 px-4 text-center">
                <h2 className="text-2xl font-bold text-red-600">Failed to load invoice</h2>
                <p className="mt-2 text-gray-500">Could not generate invoice for Cart ID: {cartId}</p>
                <Link to="/cart" className="text-primary-600 hover:text-primary-500 mt-4 inline-block">Return to Cart</Link>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-primary-600 to-secondary-600 px-6 py-8 sm:px-10 flex justify-between items-center text-white">
                    <div>
                        <h1 className="text-3xl font-bold">Invoice</h1>
                        <p className="mt-1 opacity-90">Order Confirmation</p>
                    </div>
                    <FileText className="h-12 w-12 opacity-90" />
                </div>

                <div className="px-6 py-8 sm:px-10">
                    <div className="flex items-center justify-center mb-8 bg-green-50 p-4 rounded-lg border border-green-100">
                        <div className="bg-green-100 rounded-full p-2">
                            <CheckCircle className="h-6 w-6 text-green-600" />
                        </div>
                        <h2 className="ml-3 text-lg font-semibold text-green-800">Order Successfully Placed</h2>
                    </div>

                    <div className="border-t border-gray-200 py-6">
                        <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                            <div className="sm:col-span-1">
                                <dt className="text-sm font-medium text-gray-500">Cart ID</dt>
                                <dd className="mt-1 text-sm text-gray-900 font-mono">{cartId}</dd>
                            </div>
                            {/* Render other invoice fields dynamically */}
                            {Object.entries(invoice).map(([key, value]) => {
                                if (key === 'id' || key === 'cartId' || key === 'items') return null;
                                if (typeof value === 'object') return null;
                                return (
                                    <div className="sm:col-span-1" key={key}>
                                        <dt className="text-sm font-medium text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{value}</dd>
                                    </div>
                                );
                            })}
                        </dl>
                    </div>

                    {/* Items */}
                    {invoice.items && Array.isArray(invoice.items) && (
                        <div className="mt-8">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Order Details</h3>
                            <div className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                                <ul className="divide-y divide-gray-200">
                                    {invoice.items.map((item, idx) => {
                                        const price = getItemPrice(item);
                                        const qty = item.quantity || 0;
                                        const lineTotal = price * qty;
                                        return (
                                            <li key={idx} className="px-4 py-5 grid grid-cols-12 gap-4 items-center">
                                                <div className="col-span-12 sm:col-span-8 flex items-center">
                                                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 bg-white flex items-center justify-center">
                                                        {getItemImage(item) ? (
                                                            <img src={getItemImage(item)} alt={getItemTitle(item)} className="h-full w-full object-cover" />
                                                        ) : (
                                                            <div className="text-xs text-gray-400">No Image</div>
                                                        )}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-gray-900 font-medium">{getItemTitle(item)}</div>
                                                        <div className="text-sm text-gray-500">Qty: {qty} • Unit: ${price.toFixed(2)}</div>
                                                    </div>
                                                </div>
                                                <div className="col-span-12 sm:col-span-4 flex items-center justify-between sm:justify-end">
                                                    <div className="text-base font-semibold text-gray-900 tabular-nums">${lineTotal.toFixed(2)}</div>
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </div>
                    )}

                    {/* Totals */}
                    {invoice && (
                        <div className="mt-6 flex flex-col items-end space-y-1">
                            {(() => {
                                const items = Array.isArray(invoice.items) ? invoice.items : [];
                                const subtotal = items.reduce((s, it) => s + getItemPrice(it) * (it.quantity || 0), 0);
                                const total = Number(invoice.total ?? subtotal);
                                const shipping = Number(invoice.shipping ?? 0);
                                const tax = Number(invoice.tax ?? 0);
                                const grand = Number.isFinite(invoice.total) ? Number(invoice.total) : subtotal + shipping + tax;
                                return (
                                    <div className="w-full sm:w-80">
                                        <div className="flex justify-between text-sm text-gray-600"><span>Subtotal</span><span className="tabular-nums">${subtotal.toFixed(2)}</span></div>
                                        {shipping ? <div className="flex justify-between text-sm text-gray-600"><span>Shipping</span><span className="tabular-nums">${shipping.toFixed(2)}</span></div> : null}
                                        {tax ? <div className="flex justify-between text-sm text-gray-600"><span>Tax</span><span className="tabular-nums">${tax.toFixed(2)}</span></div> : null}
                                        <div className="flex justify-between text-base font-bold text-gray-900 mt-2 border-t border-gray-200 pt-2"><span>Total</span><span className="tabular-nums">${grand.toFixed(2)}</span></div>
                                    </div>
                                );
                            })()}
                        </div>
                    )}

                    {/* Raw JSON dump for debugging/completeness if structure is unknown */}
                    <div className="mt-8">
                        <details className="text-xs text-gray-400 cursor-pointer">
                            <summary>Raw Invoice Data</summary>
                            <pre className="mt-2 bg-gray-100 p-4 rounded overflow-auto">
                                {JSON.stringify(invoice, null, 2)}
                            </pre>
                        </details>
                    </div>

                    <div className="mt-10 flex justify-center">
                        <Link to="/" className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium transition-colors">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Invoice;
