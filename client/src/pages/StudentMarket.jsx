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
  Star,
  Sparkles,
  Search,
  ChevronRight,
  Zap,
  Tag,
  Loader2,
  AlertCircle,
  X,
  CreditCard,
  Gem,
  Award
} from 'lucide-react';
import { format, isValid } from 'date-fns';
import { uz } from 'date-fns/locale';

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
      'PENDING': { color: 'text-amber-400 bg-amber-400/10 border-amber-400/20', icon: Clock, label: 'Kutilmoqda' },
      'CONFIRMED': { color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20', icon: CheckCircle, label: 'Berildi' },
      'CANCELLED': { color: 'text-rose-400 bg-rose-400/10 border-rose-400/20', icon: XCircle, label: 'Bekor qilindi' }
    };
    const badge = badges[status] || badges['PENDING'];
    const Icon = badge.icon;
    return (
      <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.1em] border backdrop-blur-md ${badge.color}`}>
        <Icon size={14} strokeWidth={3} />
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
      <div className="flex flex-col items-center justify-center min-h-[50vh] relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/5 to-transparent blur-3xl rounded-full animate-pulse"></div>
        <Loader2 className="w-14 h-14 text-indigo-500 animate-spin mb-6 relative z-10" />
        <p className="text-gray-400 font-black uppercase tracking-[0.4em] text-xs animate-pulse relative z-10 italic">Elite Market yuklanmoqda...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-10 md:space-y-14 animate-in fade-in duration-1000 px-1 sm:px-0 pb-20">

      {/* 🏆 ULTRA PREMIUM HEADER */}
      <div className="relative group overflow-hidden rounded-[3rem] md:rounded-[4rem] shadow-[0_40px_100px_rgba(0,0,0,0.1)] dark:shadow-none">
        {/* Animated Background layers */}
        <div className="absolute inset-0 bg-gray-900"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-950 opacity-90 transition-all duration-700 group-hover:opacity-100"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>

        {/* Glow Spheres */}
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-yellow-500/20 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-indigo-500/20 rounded-full blur-[100px] animate-pulse"></div>

        <div className="relative z-10 p-8 md:p-14 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-12 text-center lg:text-left">
          <div className="flex flex-col lg:flex-row items-center gap-8 md:gap-10">
            <div className="relative group/icon">
              <div className="absolute inset-0 bg-yellow-400 blur-3xl opacity-30 group-hover/icon:opacity-50 transition-opacity animate-pulse"></div>
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-[2.5rem] md:rounded-[3.2rem] bg-gradient-to-br from-yellow-400 via-orange-500 to-yellow-600 flex items-center justify-center shadow-[0_20px_50px_rgba(234,179,8,0.4)] border border-white/20 relative z-10 transform group-hover/icon:rotate-12 transition-all duration-500 overflow-hidden">
                <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover/icon:translate-x-full transition-transform duration-1000"></div>
                <ShoppingBag className="text-white drop-shadow-2xl" size={48} md:size={64} strokeWidth={2.5} />
              </div>
            </div>
            <div className="space-y-2 md:space-y-4">
              <div className="flex flex-col md:flex-row items-center gap-3">
                <h1 className="text-4xl md:text-7xl font-black text-white uppercase italic tracking-tighter leading-none drop-shadow-2xl">
                  Elite Market
                </h1>
                <div className="bg-yellow-400 text-gray-950 px-4 py-1.5 rounded-2xl text-[10px] md:text-[12px] font-black uppercase tracking-widest italic shadow-xl shadow-yellow-400/20 scale-90 md:scale-100">
                  VIP ACCESS
                </div>
              </div>
              <p className="text-indigo-200/60 font-black text-xs md:text-base uppercase tracking-[0.3em] flex items-center justify-center lg:justify-start gap-4">
                <Sparkles size={18} className="text-yellow-400 animate-spin-slow" /> Tangalaringizni orzularga qaytaring
              </p>
            </div>
          </div>

          {/* 💰 VAULT DISPLAY - The Big Coin Focus */}
          <div className="flex flex-col items-center lg:items-end w-full lg:w-auto">
            <div className="relative group/vault">
              <div className="absolute -inset-8 bg-yellow-400/20 blur-[60px] opacity-0 group-hover/vault:opacity-100 transition-opacity duration-700"></div>
              <div className="bg-white/5 backdrop-blur-[40px] border border-white/10 rounded-[3rem] px-8 md:px-12 py-8 md:py-10 flex flex-col items-center lg:items-end relative z-10 shadow-2xl overflow-hidden min-w-[300px] md:min-w-[400px]">
                <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/5 rounded-full blur-3xl"></div>
                <span className="text-yellow-400/60 font-black text-[10px] md:text-[12px] uppercase tracking-[0.5em] mb-3 md:mb-5 italic">Sizning Boyligingiz</span>
                <div className="flex items-center gap-4 md:gap-6 text-6xl md:text-8xl font-black text-white tabular-nums tracking-tighter italic drop-shadow-[0_0_20px_rgba(234,179,8,0.3)]">
                  <div className="relative">
                    <div className="absolute inset-0 bg-yellow-400 blur-2xl opacity-40 animate-pulse"></div>
                    <Coins className="text-yellow-400 drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)] relative z-10" size={56} md:size={80} />
                  </div>
                  {(balance ?? 0).toLocaleString()}
                </div>
                <div className="mt-8 md:mt-10 w-full h-2 md:h-3 bg-white/5 rounded-full overflow-hidden border border-white/5 ring-4 ring-white/5">
                  <div className="h-full bg-gradient-to-r from-yellow-300 via-yellow-500 to-orange-600 animate-shimmer" style={{ width: `${Math.min((balance / 5000) * 100, 100)}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🧭 NAVIGATION & TOOLS - High Tech Glass */}
      <div className="flex flex-col xl:flex-row items-center justify-between gap-8 md:gap-10">
        <div className="flex bg-gray-900/50 p-2 rounded-[2.5rem] border border-white/5 backdrop-blur-2xl w-full xl:w-auto overflow-x-auto no-scrollbar shadow-xl ring-2 ring-black/5">
          {[
            { id: 'shop', label: 'VIP Do\'kon', icon: ShoppingCart },
            { id: 'orders', label: 'Buyurtmalar', icon: Package },
            { id: 'history', label: 'Ganjina Tarixi', icon: History }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[140px] px-6 md:px-10 py-4 md:py-5 rounded-[2rem] font-black text-[10px] md:text-xs uppercase tracking-widest transition-all duration-500 flex items-center justify-center gap-3 relative overflow-hidden group/tab ${activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-[0_15px_40px_rgba(79,70,229,0.4)] scale-105'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
            >
              <tab.icon size={18} strokeWidth={isActive ? 3 : 2} className={activeTab === tab.id ? 'animate-bounce-slow' : ''} />
              {tab.label}
              {activeTab === tab.id && <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>}
            </button>
          ))}
        </div>

        {activeTab === 'shop' && (
          <div className="relative w-full xl:w-[450px] group">
            <div className="absolute inset-0 bg-indigo-500/10 blur-2xl group-focus-within:bg-indigo-500/20 transition-all rounded-[2rem]"></div>
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-400 transition-colors" size={22} />
            <input
              type="text"
              placeholder="Ganjinalarni axtarish..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-white dark:bg-gray-900/50 border-2 border-gray-100 dark:border-white/5 rounded-[2.2rem] pl-16 pr-8 py-5 md:py-6 text-sm md:text-base font-black italic tracking-tight focus:ring-0 focus:border-indigo-500/50 transition-all dark:text-white shadow-2xl relative z-10 placeholder:text-gray-500"
            />
          </div>
        )}
      </div>

      {/* 💎 MAIN EXPERIENCE AREA */}
      <div className="min-h-[400px]">
        {activeTab === 'shop' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10">
            {filteredItems.map((item, idx) => {
              const canAfford = balance >= item.price;
              const isOutOfStock = item.stock === 0;
              return (
                <div
                  key={item._id}
                  className="group bg-white dark:bg-[#0c0e14] rounded-[3.5rem] border border-gray-100 dark:border-white/5 shadow-[0_20px_60px_rgba(0,0,0,0.02)] dark:shadow-none hover:shadow-[0_50px_100px_rgba(79,70,229,0.12)] transition-all duration-700 flex flex-col h-full overflow-hidden relative border-b-8 border-b-transparent hover:border-b-indigo-500"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="h-64 md:h-72 relative overflow-hidden shrink-0">
                    {item.image ? (
                      <img src={getImageUrl(item.image)} alt={item.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-indigo-500/20 to-purple-600/20 flex items-center justify-center">
                        <Gem size={80} className="text-indigo-500/20 group-hover:scale-125 transition-transform duration-700" strokeWidth={1} />
                      </div>
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0c0e14] via-transparent to-black/20"></div>

                    <div className="absolute top-6 left-6 z-20">
                      <div className="bg-indigo-600/90 backdrop-blur-md text-white px-5 py-2 rounded-2xl border border-white/20 shadow-xl overflow-hidden group/badge">
                        <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover/badge:translate-x-full transition-transform"></div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] italic relative z-10">Premium</span>
                      </div>
                    </div>

                    {item.stock !== -1 && item.stock <= 5 && !isOutOfStock && (
                      <div className="absolute top-6 right-6 z-20">
                        <div className="bg-rose-500 text-white text-[10px] font-black px-5 py-2 rounded-2xl shadow-xl border border-white/20 uppercase tracking-[0.15em] animate-pulse italic">
                          Limited: {item.stock} ta
                        </div>
                      </div>
                    )}

                    {isOutOfStock && (
                      <div className="absolute inset-0 bg-gray-950/80 backdrop-blur-md z-30 flex items-center justify-center">
                        <span className="bg-white/10 text-white px-10 py-4 rounded-[2rem] border-2 border-white/10 font-black uppercase tracking-[0.3em] text-xs rotate-[-12deg] shadow-2xl">
                          TUGADI 🚫
                        </span>
                      </div>
                    )}

                    {/* Elite Glow when affordable */}
                    {canAfford && !isOutOfStock && (
                      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 w-[80%] h-1 bg-yellow-400 blur-md opacity-20 group-hover:opacity-60 transition-opacity"></div>
                    )}
                  </div>

                  <div className="p-8 md:p-10 space-y-8 flex flex-col flex-1 relative z-20">
                    <div className="flex-1 space-y-4">
                      <h3 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter leading-tight group-hover:text-indigo-500 transition-colors">{item.name}</h3>
                      <p className="text-xs md:text-sm text-gray-400 dark:text-white/40 font-bold leading-relaxed line-clamp-2 md:line-clamp-3 italic">
                        {item.description || 'Bu VIP mahsulot sizga o\'zgacha imtiyozlar va bilimlar olamini taqdim etadi.'}
                      </p>
                    </div>

                    <div className="pt-8 border-t border-gray-100 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
                      <div className="flex flex-col group/coin">
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 leading-none">VIP NARXI</span>
                        <div className="flex items-center gap-3 text-3xl md:text-4xl font-black text-yellow-600 dark:text-yellow-500 tabular-nums italic drop-shadow-[0_0_10px_rgba(234,179,8,0.2)]">
                          <Coins size={30} className="text-yellow-400 group-hover/coin:rotate-12 transition-transform" strokeWidth={2.5} />
                          {(item.price ?? 0).toLocaleString()}
                        </div>
                      </div>

                      <button
                        onClick={() => setShowConfirmModal(item)}
                        disabled={!canAfford || isOutOfStock}
                        className={`w-full sm:w-auto px-10 py-5 rounded-[2rem] font-black text-[10px] md:text-xs uppercase tracking-[0.2em] italic transition-all duration-700 relative overflow-hidden group/btn ${canAfford && !isOutOfStock
                            ? 'bg-indigo-600 text-white shadow-[0_20px_50px_rgba(79,70,229,0.3)] hover:shadow-[0_30px_70px_rgba(79,70,229,0.6)] hover:-translate-y-2'
                            : 'bg-gray-100 dark:bg-white/5 text-gray-400 cursor-not-allowed border border-white/5'
                          }`}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
                        <span className="relative z-10 flex items-center justify-center gap-3">
                          {isOutOfStock ? 'YUBORILDI' : !canAfford ? 'GANJINA KAM' : 'HARID QILISH'}
                          {canAfford && !isOutOfStock && <Zap size={16} fill="white" />}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : activeTab === 'orders' ? (
          <div className="space-y-6 md:space-y-8">
            {orders.map(order => (
              <div key={order._id} className="group bg-white dark:bg-[#0c0e14] p-8 md:p-12 rounded-[3.5rem] shadow-2xl border border-gray-100 dark:border-white/5 flex flex-col lg:flex-row items-center justify-between gap-10 transition-all hover:shadow-indigo-500/10">
                <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 w-full lg:w-auto">
                  <div className="w-20 h-20 md:w-28 md:h-28 rounded-3xl md:rounded-[2.5rem] bg-indigo-600/10 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-500 shrink-0 border border-indigo-500/10 shadow-[inset_0_2px_15px_rgba(79,70,229,0.1)] group-hover:scale-110 group-hover:rotate-6 transition-all duration-700">
                    <Award size={40} md:size={56} strokeWidth={1.5} />
                  </div>
                  <div className="text-center md:text-left flex-1 space-y-3">
                    <h3 className="font-black text-2xl md:text-4xl text-gray-900 dark:text-white uppercase italic tracking-tighter group-hover:text-indigo-600 transition-colors leading-none">{order.item_name}</h3>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-5 pt-2">
                      <div className="flex items-center gap-2.5 bg-gray-50 dark:bg-white/5 px-5 py-2.5 rounded-2xl border border-gray-100 dark:border-white/5">
                        <Clock size={16} className="text-indigo-400" />
                        <p className="text-[10px] md:text-[12px] text-gray-500 font-black uppercase tracking-widest italic">{formatDateSafely(order.createdAt, 'dd MMMM, yyyy | HH:mm')}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-between lg:justify-end gap-10 w-full lg:w-auto pt-10 lg:pt-0 border-t lg:border-t-0 border-gray-100 dark:border-white/5">
                  <div className="flex flex-col items-center lg:items-end group/coinitem">
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2 italic">GANJINA SARFI</span>
                    <div className="flex items-center gap-3 font-black text-3xl md:text-5xl text-yellow-600 dark:text-yellow-500 italic drop-shadow-[0_0_10px_rgba(234,179,8,0.2)]">
                      <Coins size={28} md:size={36} className="text-yellow-400" />
                      {(order.item_price ?? 0).toLocaleString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    {getStatusBadge(order.status)}
                    <div className="w-14 h-14 bg-gray-50 dark:bg-white/5 rounded-2xl flex items-center justify-center text-gray-300 dark:text-gray-600 group-hover:bg-indigo-600 group-hover:text-white transition-all cursor-pointer shadow-xl">
                      <ChevronRight size={24} strokeWidth={3} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {orders.length === 0 && (
              <div className="py-32 text-center bg-white dark:bg-[#0c0e14] rounded-[4rem] border-4 border-dashed border-gray-100 dark:border-white/5 flex flex-col items-center justify-center">
                <Package size={80} className="text-gray-200 dark:text-white/5 mb-8 animate-bounce-slow" strokeWidth={1} />
                <h3 className="text-3xl font-black text-gray-300 dark:text-white/10 uppercase italic tracking-tighter">Hozircha buyurtmalar bo'sh</h3>
                <p className="text-gray-400/50 mt-4 font-bold uppercase tracking-[0.3em] text-xs">Marketni ko'rib chiqing va birinchi haridni amalga oshiring!</p>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white dark:bg-[#0c0e14] rounded-[3.5rem] shadow-2xl border border-gray-100 dark:border-white/5 overflow-hidden">
            <div className="p-10 md:p-14 border-b border-gray-50 dark:border-white/5 bg-gray-50/30 dark:bg-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <h3 className="font-black text-3xl md:text-4xl text-gray-900 dark:text-white italic uppercase tracking-tighter flex items-center gap-6">
                  <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-600/30">
                    <History size={24} />
                  </div>
                  Ganjina Tarixi
                </h3>
              </div>
              <div className="bg-emerald-500/10 text-emerald-500 px-6 py-3 rounded-2xl text-[10px] md:text-[12px] font-black uppercase tracking-[0.3em] italic border border-emerald-500/20 shadow-xl shadow-emerald-500/5">
                SECURE VAULT SESSION
              </div>
            </div>

            <div className="divide-y divide-gray-100 dark:divide-white/5">
              {history.map((item, idx) => (
                <div key={item._id} className="p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 hover:bg-gray-50 dark:hover:bg-white/5 transition-all duration-700 group">
                  <div className="flex items-center gap-6 md:gap-10 w-full md:w-auto">
                    <div className={`w-16 h-16 md:w-20 md:h-20 rounded-[1.8rem] flex items-center justify-center shrink-0 border-2 transition-all duration-700 group-hover:rotate-[-5deg] ${item.amount > 0 ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white' : 'bg-rose-500/10 border-rose-500/20 text-rose-500 group-hover:bg-rose-500 group-hover:text-white'}`}>
                      {item.amount > 0 ? <TrendingUp size={32} /> : <TrendingDown size={32} />}
                    </div>
                    <div className="flex-1 space-y-2">
                      <p className="font-black text-xl md:text-3xl text-gray-900 dark:text-white italic uppercase tracking-tighter group-hover:text-indigo-600 transition-colors">{item.reason}</p>
                      <div className="flex flex-wrap items-center gap-4">
                        <span className="text-[10px] md:text-[12px] text-gray-400 font-bold uppercase tracking-widest italic">{formatDateSafely(item.createdAt, 'dd.MM.yyyy | HH:mm')}</span>
                        <div className="w-2 h-2 rounded-full bg-gray-200 dark:bg-gray-800"></div>
                        <span className="text-[10px] md:text-[12px] text-indigo-500 font-black uppercase tracking-[0.2em] italic underline underline-offset-4 decoration-indigo-500/20">{getReasonTypeLabel(item.reason_type)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between md:justify-end gap-10 w-full md:w-auto pt-8 md:pt-0 border-t md:border-t-0 border-gray-100 dark:border-white/5">
                    <div className="text-center md:text-right space-y-1">
                      <p className={`font-black text-4xl md:text-6xl tabular-nums italic drop-shadow-sm ${item.amount > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {item.amount > 0 ? '+' : ''}{(item.amount ?? 0).toLocaleString()}
                        <Coins size={36} md:size={48} className="inline ml-3" strokeWidth={2.5} />
                      </p>
                      <p className="text-[10px] md:text-[12px] text-gray-400 font-black uppercase tracking-[0.4em] italic mt-2 opacity-60">XISOB: {(item.balance_after ?? 0).toLocaleString()}</p>
                    </div>
                    <ChevronRight size={32} className="text-gray-200 dark:text-white/5 group-hover:translate-x-3 group-hover:text-indigo-500 transition-all duration-500" strokeWidth={3} />
                  </div>
                </div>
              ))}
              {history.length === 0 && (
                <div className="text-center py-40 flex flex-col items-center justify-center opacity-20 hover:opacity-100 transition-opacity duration-1000">
                  <History className="w-24 h-24 mb-8" strokeWidth={1} />
                  <h3 className="text-2xl font-black uppercase tracking-[0.5em] italic">Vault is silent</h3>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 🚀 ELITE CHECKOUT MODAL */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl animate-in fade-in duration-500">
          <div className="bg-[#0c0e14] w-full max-w-xl rounded-[4rem] p-10 md:p-14 shadow-[0_0_150px_rgba(79,70,229,0.4)] animate-in zoom-in-95 relative border border-white/10 overflow-hidden">
            {/* Decorative Background for Modal */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 via-indigo-500 to-purple-600"></div>
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-indigo-600/10 rounded-full blur-[100px]"></div>

            <button onClick={() => setShowConfirmModal(null)} className="absolute top-10 right-10 text-gray-500 hover:text-rose-500 transition-all hover:rotate-90 duration-500 scale-125">
              <X size={32} strokeWidth={3} />
            </button>

            <div className="flex flex-col items-center mb-12">
              <div className="w-24 h-24 bg-yellow-400/10 rounded-[2.5rem] flex items-center justify-center text-yellow-500 mb-8 border border-yellow-400/20 shadow-[0_0_40px_rgba(234,179,8,0.1)] group transition-transform hover:rotate-12 duration-500">
                <Gem size={48} strokeWidth={2.5} className="animate-pulse" />
              </div>
              <h3 className="text-4xl md:text-5xl font-black text-white uppercase italic text-center tracking-tighter leading-none mb-4">Haridni<br />Tasdiqlash</h3>
              <div className="h-1.5 w-20 bg-indigo-600 rounded-full"></div>
            </div>

            <p className="text-gray-400 text-lg md:text-xl leading-relaxed mb-12 text-center italic font-medium max-w-sm mx-auto">
              Siz "<span className="text-white font-black not-italic">{showConfirmModal.name}</span>" VIP mahsulotini
              <span className="text-yellow-500 font-black ml-2 inline-flex items-center gap-2 underline underline-offset-8 decoration-yellow-500/20">
                <Coins size={22} /> {(showConfirmModal.price ?? 0).toLocaleString()}
              </span>
              ganjinaga harid qilmoqchimisiz?
            </p>

            <div className="flex flex-col gap-5">
              <button
                onClick={() => handlePurchase(showConfirmModal._id)}
                disabled={purchasing}
                className="w-full py-7 rounded-[2.5rem] font-black text-sm md:text-base uppercase tracking-[0.3em] bg-indigo-600 text-white hover:bg-indigo-700 shadow-[0_25px_60px_rgba(79,70,229,0.4)] hover:shadow-[0_35px_80px_rgba(79,70,229,0.6)] flex items-center justify-center gap-4 transition-all active:scale-95 disabled:opacity-50 group/buy"
              >
                {purchasing ? (
                  <Loader2 className="animate-spin" size={24} strokeWidth={3} />
                ) : (
                  <>TASDIQLASH <ArrowRight className="group-hover/buy:translate-x-3 transition-transform" size={24} strokeWidth={3} /></>
                )}
              </button>
              <button onClick={() => setShowConfirmModal(null)} className="w-full py-6 rounded-[2.5rem] font-black text-xs md:text-sm uppercase tracking-[0.3em] text-gray-500 hover:text-white transition-all hover:bg-white/5">
                BEKOR QILISH
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CSS CUSTOM CLASSES (Injecting into the same file for ease) */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(79, 70, 229, 0.1); border-radius: 20px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(79, 70, 229, 0.2); }
        
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        .animate-shimmer { background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent); background-size: 200% 100%; animation: shimmer 3s infinite linear; }
        
        .animate-spin-slow { animation: spin 8s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        
        .animate-bounce-slow { animation: bounce-custom 3s infinite; }
        @keyframes bounce-custom { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
      `}</style>
    </div>
  );
}
