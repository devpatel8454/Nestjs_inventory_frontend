import { useEffect, useMemo, useState } from 'react';
import { getOrders, getProfile } from '../api/api';
import { Mail, User as UserIcon, Calendar, IdCard, ChevronDown, ChevronUp, ShoppingCart, Receipt } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ordersMeta, setOrdersMeta] = useState({ count: 0, total: 0 });

  const { user } = useAuth() || {};
  const { cart } = useCart() || {};

  const currency = useMemo(() => new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }), []);

  // Normalized identity fields to handle different backend shapes
  const identity = useMemo(() => {
    const base = profile || user || {};
    const nested = base.user || {};
    const src = { ...nested, ...base };
    const id = src.id ?? src.userId ?? src.userID ?? src._id ?? src.uid ?? src.sub ?? null;
    const name = src.name ?? src.username ?? src.fullName ?? src.displayName ?? null;
    const email = src.email ?? src.emailId ?? src.userEmail ?? src.mail ?? null;
    return { id, name, email };
  }, [profile, user]);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { data } = await getProfile();
        if (!active) return;
        setProfile(data);
      } catch (e) {
        if (!active) return;
        const msg = e?.response?.data?.message || e.message || 'Failed to load profile';
        setError(Array.isArray(msg) ? msg.join(', ') : msg);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  // Compute cart totals defensively (must be before any returns)
  const cartSummary = useMemo(() => {
    const items = cart?.items || [];
    const count = items.reduce((acc, it) => acc + (Number(it.quantity) || 0), 0);
    const total = items.reduce((sum, it) => {
      const q = Number(it.quantity) || 0;
      const price = Number(it.price ?? it.product?.price ?? it.unitPrice ?? 0) || 0;
      const lineTotal = Number(it.total ?? it.lineTotal ?? price * q) || 0;
      return sum + lineTotal;
    }, 0);
    return { count, total };
  }, [cart]);

  // Prefetch orders meta (must be before any returns)
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { data } = await getOrders();
        if (!active) return;
        const arr = Array.isArray(data) ? data : (data?.items || []);
        const count = arr.length;
        const total = arr.reduce((sum, o) => sum + (Number(o.total ?? o.amount ?? o.grandTotal ?? 0) || 0), 0);
        setOrdersMeta({ count, total });
      } catch (e) {
        // ignore silently for profile view; orders list page handles its own errors
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
    return <div className="max-w-2xl mx-auto mt-28 p-4 bg-red-50 text-red-700 rounded">{error}</div>;
  }
  // Even if profile isn't loaded, render using AuthContext identity

  return (
    <div className="max-w-4xl mx-auto mt-28 px-4">
      <div className="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="relative">
          <div className="bg-gradient-to-r from-primary-600 to-secondary-600 h-32" />
          <div className="px-6 pb-6 -mt-16">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="h-24 w-24 rounded-full ring-4 ring-white bg-primary-100 flex items-center justify-center text-primary-700 text-3xl font-semibold shadow-md">
                  {String(identity.name || identity.email || 'U')
                    .split(' ')
                    .map(s => s[0])
                    .join('')
                    .slice(0,2)
                    .toUpperCase()}
                </div>
                <div className="sm:-mt-3">
                  <h1 className="text-3xl font-bold text-white flex items-center flex-wrap gap-2">
                    {identity.name || identity.email || 'User'}
                    {identity.id && (
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-white/80 text-gray-700 border shadow-sm">ID: {identity.id}</span>
                    )}
                  </h1>
                  {identity.email && (
                    <p className="text-gray-600 mt-1">{identity.email}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 sm:-mt-3">
                <Link to="/orders" className="px-3 py-2 text-sm rounded-lg border hover:bg-gray-50 flex items-center gap-2 transition-colors">
                  <Receipt className="w-4 h-4" /> View Orders
                </Link>
                <Link to="/cart" className="px-3 py-2 text-sm rounded-lg bg-primary-600 text-white hover:bg-primary-700 flex items-center gap-2 transition-colors">
                  <ShoppingCart className="w-4 h-4" /> Go to Cart
                </Link>
              </div>
            </div>

            {/* Stats row */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-xl border bg-green-50/60 hover:bg-green-50 transition shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-white/70 text-green-700 border"><ShoppingCart className="w-5 h-5" /></div>
                  <div className="flex-1">
                    <div className="text-sm text-gray-600">Cart</div>
                    <div className="mt-1 text-lg font-semibold text-gray-900">{cartSummary.count} item(s)</div>
                    <div className="text-sm text-gray-700">Total: {currency.format(cartSummary.total)}</div>
                  </div>
                </div>
              </div>
              <div className="p-5 rounded-xl border bg-blue-50/60 hover:bg-blue-50 transition shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-white/70 text-blue-700 border"><Receipt className="w-5 h-5" /></div>
                  <div className="flex-1">
                    <div className="text-sm text-gray-600">Orders</div>
                    <div className="mt-1 text-lg font-semibold text-gray-900">{ordersMeta.count} order(s)</div>
                    <div className="text-sm text-gray-700">Total spent: {currency.format(ordersMeta.total)}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Details grid */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-xl border bg-gray-50 hover:bg-white transition shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-white text-primary-600 border"><UserIcon className="w-5 h-5" /></div>
                  <div>
                    <div className="text-xs uppercase tracking-wide text-gray-500">Name</div>
                    <div className="mt-1 font-semibold text-gray-900">{identity.name || '—'}</div>
                  </div>
                </div>
              </div>
              <div className="p-5 rounded-xl border bg-gray-50 hover:bg-white transition shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-white text-primary-600 border"><Mail className="w-5 h-5" /></div>
                  <div>
                    <div className="text-xs uppercase tracking-wide text-gray-500">Email</div>
                    <div className="mt-1 font-medium text-gray-900 break-all">{identity.email || '—'}</div>
                  </div>
                </div>
              </div>
              <div className="p-5 rounded-xl border bg-gray-50 hover:bg-white transition shadow-sm sm:col-span-2">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-white text-primary-600 border"><IdCard className="w-5 h-5" /></div>
                  <div>
                    <div className="text-xs uppercase tracking-wide text-gray-500">User ID</div>
                    <div className="mt-1 font-medium text-gray-900 break-all">{identity.id || '—'}</div>
                  </div>
                </div>
              </div>

              {profile && 'createdAt' in profile && (
                <div className="p-5 rounded-xl border bg-gray-50 hover:bg-white transition shadow-sm sm:col-span-2">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-white text-primary-600 border"><Calendar className="w-5 h-5" /></div>
                    <div>
                      <div className="text-xs uppercase tracking-wide text-gray-500">Joined</div>
                      <div className="mt-1 font-medium text-gray-900">{new Date(profile.createdAt).toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Debug */}
            <details className="mt-6 group">
              <summary className="cursor-pointer select-none list-none flex items-center text-sm text-gray-600 hover:text-gray-800">
                <span className="inline-flex items-center">
                  <span className="mr-2">Debug info</span>
                  <ChevronDown className="w-4 h-4 group-open:hidden" />
                  <ChevronUp className="w-4 h-4 hidden group-open:inline" />
                </span>
              </summary>
              <pre className="mt-3 bg-gray-50 p-3 rounded text-xs overflow-auto border">{JSON.stringify(profile || user, null, 2)}</pre>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
