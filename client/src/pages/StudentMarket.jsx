import { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import {
  ShoppingBag,
  Coins,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  History,
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  Gift,
  Search,
  ChevronRight,
  Zap,
  Tag,
  Loader2,
  X,
  CreditCard,
  Award
} from 'lucide-react';
import { format, isValid } from 'date-fns';
import { uz } from 'date-fns/locale';

import { Helmet } from 'react-helmet-async';

export default function StudentMarket() {
  const [activeTab, setActiveTab] = useState('shop');
  const [items, setItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [history, setHistory] = useState([]);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(null);

  const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http') || url.startsWith('data:')) return url;
    const backendUrl = import.meta.env.VITE_API_URL || 'https://infastcrm-0b2r.onrender.com';
    const base = backendUrl.replace(/\/api\/?$/, '').replace(/\/+$/, '');
    const cleanUrl = url.startsWith('/') ? url.slice(1) : url;
    return `${base}/${cleanUrl}`;
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const balanceRes = await api.get('/market/balance');
      setBalance(balanceRes.data.balance ?? 0);

      if (activeTab === 'shop') {
        const res = await api.get('/market/items');
        setItems(Array.isArray(res.data) ? res.data : []);
      } else if (activeTab === 'orders') {
        const res = await api.get('/market/orders');
        setOrders(Array.isArray(res.data) ? res.data : []);
      } else {
        const res = await api.get('/market/history');
        setHistory(Array.isArray(res.data) ? res.data : []);
      }
    } catch (error) {
      console.error('Error fetching market data:', error);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handlePurchase = async (itemId) => {
    if (!itemId) return;
    const item = items.find(i => i._id === itemId);
    if (!item || balance < item.price) return;

    setPurchasing(itemId);
    try {
      const response = await api.post(`/market/purchase/${itemId}`);
      setBalance(response.data?.balance ?? balance - item.price);
      setShowConfirmModal(null);
      fetchData();
    } catch (error) {
      console.error('Purchase error:', error);
      alert(error.response?.data?.message || 'Sotib olishda xatolik yuz berdi');
    } finally {
      setPurchasing(null);
    }
  };

  const filteredItems = items.filter(item =>
    item?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDateSafely = (dateStr, formatStr) => {
    if (!dateStr) return 'Sana yo\'q';
    const date = new Date(dateStr);
    if (!isValid(date)) return 'Noto\'g\'ri sana';
    return format(date, formatStr, { locale: uz });
  };

  const getStatusBadge = (status) => {
    const badges = {
      'PENDING': { color: 'text-amber-600 bg-amber-50', icon: Clock, label: 'Kutilmoqda' },
      'CONFIRMED': { color: 'text-emerald-600 bg-emerald-50', icon: CheckCircle, label: 'Berildi' },
      'CANCELLED': { color: 'text-rose-600 bg-rose-50', icon: XCircle, label: 'Bekor qilindi' }
    };
    const badge = badges[status] || badges['PENDING'];
    const Icon = badge.icon;
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider ${badge.color}`}>
        <Icon size={14} />
        {badge.label}
      </span>
    );
  };

  const getReasonTypeLabel = (type) => {
    const labels = {
      'ATTENDANCE_PRESENT': 'Darsga keldi',
      'ATTENDANCE_ABSENT': 'Darsga kelmadi',
      'HOMEWORK_SUBMITTED': 'Vazifa topshirdi',
      'HOMEWORK_NOT_SUBMITTED': 'Vazifa topshirmadi',
      'QUIZ_COMPLETED': 'Quiz bajarildi',
      'QUIZ_NOT_COMPLETED': 'Quiz bajarilmadi',
      'ADMIN_MANUAL': 'Admin tomonidan',
      'MARKET_PURCHASE': 'Mahsulot sotib oldi',
      'ORDER_CANCELLED': 'Buyurtma bekor qilindi'
    };
    return labels[type] || type;
  };

  if (loading && items.length === 0 && orders.length === 0 && history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
        <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Market yuklanmoqda...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20 px-4 md:px-0">
      <Helmet>
        <title>Market | InFast Academy</title>
        <meta name="description" content="Coinlaringizni ajoyib sovg'alarga almashtiring. InFast Academy Marketi." />
      </Helmet>
      {/* 🚀 Clean & Professional Header */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-indigo-600 shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-700 opacity-90"></div>
        <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-inner">
              <ShoppingBag className="text-white" size={32} md:size={40} />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-white uppercase italic tracking-tight">Market</h1>
              <p className="text-indigo-100 font-bold text-sm">Tangalaringizni orzularga almashtiring</p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl px-10 py-6 flex flex-col items-center md:items-end min-w-[240px]">
            <span className="text-white/70 font-black text-[10px] uppercase tracking-[0.2em] mb-1">SIZNING COINLARINGIZ</span>
            <div className="flex items-center gap-3 text-4xl md:text-6xl font-black text-white tabular-nums italic">
              <Coins className="text-yellow-400" size={32} md:size={48} />
              {(balance ?? 0).toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* 🧭 Solid Navigation */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="flex bg-gray-100 dark:bg-gray-800 p-1.5 rounded-2xl w-full lg:w-auto shadow-inner">
          {[
            { id: 'shop', label: 'Do\'kon' },
            { id: 'orders', label: 'Buyurtmalar' },
            { id: 'history', label: 'Coin Tarixi' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-8 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${activeTab === tab.id
                ? 'bg-white dark:bg-gray-700 text-indigo-600 shadow-lg scale-105'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'shop' && (
          <div className="relative w-full lg:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
            <input
              type="text"
              placeholder="Mahsulotlarni izlash..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-white dark:bg-gray-800 border-2 border-transparent rounded-2xl pl-12 pr-4 py-3.5 text-sm font-bold focus:ring-0 focus:border-indigo-500/50 transition-all dark:text-white shadow-sm"
            />
          </div>
        )}
      </div>

      {/* 📦 Main Content Grid */}
      <div className="min-h-[400px]">
        {activeTab === 'shop' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {filteredItems.map(item => {
              const canAfford = balance >= item.price;
              const isOutOfStock = item.stock === 0;
              return (
                <div key={item._id} className="group bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col overflow-hidden relative">
                  <div className="h-52 relative overflow-hidden bg-gray-50 dark:bg-gray-900 flex items-center justify-center shrink-0">
                    {item.image ? (
                      <img src={getImageUrl(item.image)} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full bg-indigo-50 dark:bg-indigo-900/10 flex items-center justify-center">
                        <Gift size={48} className="text-indigo-200 dark:text-indigo-800" />
                      </div>
                    )}

                    {item.stock !== -1 && item.stock <= 5 && !isOutOfStock && (
                      <div className="absolute top-4 right-4 bg-rose-500 text-white text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-wider animate-pulse border border-white/20">
                        {item.stock} ta qoldi
                      </div>
                    )}

                    {isOutOfStock && (
                      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-10 flex items-center justify-center">
                        <span className="bg-white/10 text-white px-6 py-2 rounded-full border border-white/20 font-black uppercase tracking-widest text-[10px] rotate-[-12deg]">TUGADI 🚫</span>
                      </div>
                    )}
                  </div>

                  <div className="p-7 space-y-4 flex flex-col flex-1">
                    <div className="flex-1 space-y-2">
                      <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase italic leading-tight line-clamp-1">{item.name}</h3>
                      <p className="text-xs text-gray-400 font-medium line-clamp-2 leading-relaxed">{item.description || 'Bu mahsulot haqida qo\'shimcha ma\'lumot mavjud emas'}</p>
                    </div>

                    <div className="flex items-center justify-between pt-5 border-t border-gray-50 dark:border-gray-700/50">
                      <div className="flex flex-col">
                        <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">NARXI</span>
                        <div className="flex items-center gap-2 text-xl font-black text-indigo-600 dark:text-indigo-400 tabular-nums italic">
                          <Coins size={18} className="text-yellow-500" />
                          {(item.price ?? 0).toLocaleString()} <span className="text-[10px] ml-1">COIN</span>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowConfirmModal(item)}
                        disabled={!canAfford || isOutOfStock}
                        className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${canAfford && !isOutOfStock
                          ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 active:scale-95'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                          }`}
                      >
                        Sotib olish
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
            {filteredItems.length === 0 && (
              <div className="col-span-full py-20 text-center bg-gray-50 dark:bg-gray-800/50 rounded-[2.5rem] border-4 border-dashed border-gray-100 dark:border-gray-700">
                <Tag size={48} className="mx-auto text-gray-200 dark:text-gray-700 mb-4" />
                <p className="text-gray-400 font-black uppercase tracking-widest text-xs">Mahsulotlar topilmadi</p>
              </div>
            )}
          </div>
        ) : activeTab === 'orders' ? (
          <div className="grid grid-cols-1 gap-4">
            {orders.map(order => (
              <div key={order._id} className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row items-center justify-between gap-6 group hover:border-indigo-500/30 transition-all">
                <div className="flex items-center gap-6 w-full md:w-auto">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-500 shrink-0 border border-indigo-100/50 dark:border-indigo-800/30 shadow-inner group-hover:scale-110 transition-transform">
                    <Package size={28} />
                  </div>
                  <div>
                    <h3 className="font-black text-gray-900 dark:text-white uppercase italic text-base tracking-tight">{order.item_name}</h3>
                    <div className="flex items-center gap-2 mt-1.5">
                      <Clock size={12} className="text-gray-400" />
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{formatDateSafely(order.createdAt, 'dd MMMM, HH:mm')}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between md:justify-end gap-10 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-gray-50 dark:border-gray-700/50">
                  <div className="flex items-center gap-2 font-black text-indigo-600 dark:text-indigo-400 italic">
                    <Coins size={18} className="text-yellow-500" />
                    <span className="text-lg">{(order.item_price ?? 0).toLocaleString()} <span className="text-[10px] ml-1">COIN</span></span>
                  </div>
                  {getStatusBadge(order.status)}
                </div>
              </div>
            ))}
            {orders.length === 0 && (
              <div className="py-24 text-center bg-gray-50 dark:bg-gray-800/50 rounded-[2.5rem] border-4 border-dashed border-gray-100 dark:border-gray-700">
                <Package size={56} className="mx-auto text-gray-200 dark:text-gray-700 mb-4" />
                <p className="text-gray-400 font-black uppercase tracking-widest text-xs">Buyurtmalar hozircha yo'q</p>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="divide-y divide-gray-50 dark:divide-gray-700/50">
              {history.map(item => (
                <div key={item._id} className="p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors group">
                  <div className="flex items-center gap-6 w-full md:w-auto">
                    <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center shrink-0 border transition-all ${item.amount > 0 ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 border-emerald-100 dark:border-emerald-500/20' : 'bg-rose-50 dark:bg-rose-500/10 text-rose-500 border-rose-100 dark:border-rose-500/20'}`}>
                      {item.amount > 0 ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
                    </div>
                    <div>
                      <p className="font-black text-base md:text-lg text-gray-900 dark:text-white uppercase italic tracking-tight group-hover:text-indigo-600 transition-colors">{item.reason}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{formatDateSafely(item.createdAt, 'dd.MM.yyyy HH:mm')}</span>
                        <div className="w-1 h-1 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                        <span className="text-[10px] text-indigo-500 font-black uppercase tracking-wider italic">{getReasonTypeLabel(item.reason_type)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between md:justify-end gap-10 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-gray-50 dark:border-gray-700/50">
                    <div className="text-center md:text-right">
                      <p className={`font-black text-xl md:text-3xl tabular-nums italic ${item.amount > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {item.amount > 0 ? '+' : ''}{(item.amount ?? 0).toLocaleString()} <span className="text-xs ml-1">Coin</span>
                      </p>
                      <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mt-1 opacity-70">Xisobingizda: {(item.balance_after ?? 0).toLocaleString()}</p>
                    </div>
                    <div className="w-10 h-10 bg-gray-50 dark:bg-gray-900 rounded-xl flex items-center justify-center text-gray-300 dark:text-gray-600 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                      <ChevronRight size={20} />
                    </div>
                  </div>
                </div>
              ))}
              {history.length === 0 && (
                <div className="text-center py-24 bg-white dark:bg-gray-800">
                  <History className="w-16 h-16 text-gray-100 dark:text-gray-700 mx-auto mb-4" />
                  <p className="text-gray-300 dark:text-gray-600 font-black uppercase tracking-widest text-xs">Tarix bo'sh</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 🚀 Clean Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in-95 relative border border-gray-100 dark:border-gray-700">
            <button onClick={() => setShowConfirmModal(null)} className="absolute top-8 right-8 text-gray-400 hover:text-rose-500 transition-all scale-110">
              <X size={24} />
            </button>

            <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-500 mb-6 mx-auto border border-indigo-100 dark:border-indigo-800/30">
              <ShoppingBag size={32} />
            </div>

            <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase italic text-center mb-4 tracking-tighter">Sotib olish</h3>

            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-10 text-center italic font-medium px-4">
              Haqiqatdan ham "<span className="font-black text-gray-900 dark:text-white not-italic">{showConfirmModal.name}</span>" mahsulotini
              <span className="text-indigo-600 font-black ml-1 inline-flex items-center gap-1 underline underline-offset-4 decoration-indigo-600/20 italic">
                {(showConfirmModal.price ?? 0).toLocaleString()} <Coins size={14} className="text-yellow-500" />
              </span>
              ga harid qilasizmi?
            </p>

            <div className="grid grid-cols-1 gap-3">
              <button
                onClick={() => handlePurchase(showConfirmModal._id)}
                disabled={purchasing}
                className="w-full py-5 rounded-2xl font-black text-xs uppercase tracking-widest bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50"
              >
                {purchasing ? <Loader2 size={18} className="animate-spin" /> : <>TASDIQLASH <CheckCircle size={18} /></>}
              </button>
              <button onClick={() => setShowConfirmModal(null)} className="w-full py-4 rounded-2xl font-bold text-xs uppercase tracking-widest text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-all">Bekor qilish</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
