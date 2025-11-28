import { useEffect, useMemo, useState } from 'react';
import { getOrders } from '../api/api';
import { Receipt, Calendar, Package, ShoppingCart } from 'lucide-react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const currency = useMemo(() => new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }), []);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { data } = await getOrders();
        if (!active) return;
        setOrders(Array.isArray(data) ? data : (data?.items || []));
      } catch (e) {
        if (!active) return;
        const msg = e?.response?.data?.message || e.message || 'Failed to load orders';
        setError(Array.isArray(msg) ? msg.join(', ') : msg);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="animate-spin h-8 w-8 rounded-full border-4 border-gray-200 border-t-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="max-w-4xl mx-auto mt-28 p-4 bg-red-50 text-red-700 rounded">{error}</div>;
  }

  return (
    <div className="max-w-5xl mx-auto mt-28 px-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-semibold">My Orders</h1>
      </div>
      {orders.length === 0 ? (
        <div className="bg-white border rounded-xl p-10 text-center text-gray-600 shadow-sm">
          No orders found.
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((o, idx) => {
            const orderId = o.id ?? o.orderId ?? o.order_id ?? idx + 1;
            const created = o.createdAt ?? o.created_at ?? o.date ?? null;
            const items = Array.isArray(o.items) ? o.items : [];
            const total = Number(o.total ?? o.amount ?? o.grandTotal ?? items.reduce((s, it) => {
              const q = Number(it.quantity ?? it.qty ?? 0) || 0;
              const price = Number(it.price ?? it.unitPrice ?? it.product?.price ?? 0) || 0;
              const line = Number(it.total ?? it.lineTotal ?? price * q) || 0;
              return s + line;
            }, 0));

            return (
              <div key={orderId} className="bg-white border rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 border-b flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white border text-blue-600"><Receipt className="w-5 h-5" /></div>
                    <div>
                      <div className="text-sm text-gray-500">Order</div>
                      <div className="text-lg font-semibold">#{orderId}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Total</div>
                    <div className="text-lg font-semibold">{currency.format(total)}</div>
                    {created && (
                      <div className="text-xs text-gray-500 mt-1">{new Date(created).toLocaleString()}</div>
                    )}
                  </div>
                </div>

                <div className="px-6 py-4">
                  {items.length === 0 ? (
                    <div className="text-gray-500">No items.</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-sm">
                        <thead>
                          <tr className="text-left text-gray-500">
                            <th className="py-2 pr-4">Product</th>
                            <th className="py-2 pr-4">Qty</th>
                            <th className="py-2 pr-4">Unit</th>
                            <th className="py-2 pr-4">Line Total</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {items.map((it, i) => {
                            const name = it.name ?? it.product?.title ?? `Product ${it.product?.id ?? ''}`;
                            const qty = Number(it.quantity ?? it.qty ?? 0) || 0;
                            const unit = Number(it.price ?? it.unitPrice ?? it.product?.price ?? 0) || 0;
                            const line = Number(it.total ?? it.lineTotal ?? unit * qty) || 0;
                            return (
                              <tr key={it.id ?? i}>
                                <td className="py-3 pr-4">
                                  <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 flex items-center justify-center rounded-md bg-gray-100 border">
                                      <Package className="w-5 h-5 text-gray-500" />
                                    </div>
                                    <div className="font-medium text-gray-900">{name}</div>
                                  </div>
                                </td>
                                <td className="py-3 pr-4 tabular-nums">{qty}</td>
                                <td className="py-3 pr-4 tabular-nums">{currency.format(unit)}</td>
                                <td className="py-3 pr-4 tabular-nums font-medium">{currency.format(line)}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Orders;
