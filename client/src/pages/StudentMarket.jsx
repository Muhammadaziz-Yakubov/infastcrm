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
  X
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
    // Clean up backend URL: remove trailing /api and trailing slash
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
    if (!dateStr) return 'No date';
    const date = new Date(dateStr);
    if (!isValid(date)) return 'Invalid date';
    return format(date, formatStr, { locale: uz });
  };

  const getStatusBadge = (status) => {
    const badges = {
      'PENDING': { color: 'text-amber-500 bg-amber-50 dark:bg-amber-500/10', icon: Clock, label: 'Kutilmoqda' },
      'CONFIRMED': { color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10', icon: CheckCircle, label: 'Berildi' },
      'CANCELLED': { color: 'text-rose-500 bg-rose-50 dark:bg-rose-500/10', icon: XCircle, label: 'Bekor qilindi' }
    };
    const badge = badges[status] || badges['PENDING'];
    const Icon = badge.icon;
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider ${badge.color}`}>
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
        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Market yuklanmoqda...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 md:space-y-8 animate-in fade-in duration-500 px-2 sm:px-0">

      {/* Refined Header - More Compact on Mobile */}
      <div className="relative overflow-hidden rounded-[2rem] md:rounded-[2.5rem] bg-indigo-600 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 opacity-95"></div>
        <div className="relative z-10 p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
            <div className="w-14 h-14 md:w-20 md:h-20 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner shrink-0 scale-90 md:scale-100">
              <ShoppingBag className="text-white" size={28} md:size={40} />
            </div>
            <div>
              <h1 className="text-2xl md:text-4xl font-black text-white uppercase italic tracking-tight">Market</h1>
              <p className="text-indigo-100 font-bold text-xs md:text-sm mt-1">O'zingizga kerakli narsalarni harid qiling</p>
            </div>
          </div>

          <div className="bg-black/10 backdrop-blur-xl border border-white/10 rounded-2xl px-6 md:px-8 py-4 md:py-6 flex flex-col items-center md:items-end w-full md:w-auto">
            <span className="text-white/60 font-black text-[9px] md:text-[10px] uppercase tracking-widest mb-1">Jami Tangalar</span>
            <div className="flex items-center gap-2 md:gap-3 text-3xl md:text-5xl font-black text-white tabular-nums">
              <Coins className="text-yellow-400" size={24} md:size={40} />
              {(balance ?? 0).toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Simplified Navigation - Stacked on tiny mobile */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4 md:gap-6 bg-white dark:bg-gray-800/50 p-3 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-2xl w-full lg:w-auto overflow-x-auto no-scrollbar">
          {[
            { id: 'shop', label: 'Do\'kon' },
            { id: 'orders', label: 'Buyurtmalar' },
            { id: 'history', label: 'Tarix' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[100px] px-4 md:px-8 py-2.5 md:py-3 rounded-xl font-bold text-xs md:text-sm transition-all ${activeTab === tab.id
                  ? 'bg-white dark:bg-gray-700 text-indigo-600 shadow-sm'
                  : 'text-gray-400 hover:text-gray-700 dark:text-gray-500'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'shop' && (
          <div className="relative w-full lg:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Qidirish..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl pl-11 pr-4 py-2.5 text-xs md:text-sm focus:ring-2 ring-indigo-500/50 transition-all dark:text-white"
            />
          </div>
        )}
      </div>

      {/* Content Grid */}
      <div className="min-h-[300px] pb-10">
        {activeTab === 'shop' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {filteredItems.map(item => {
              const canAfford = balance >= item.price;
              const isOutOfStock = item.stock === 0;
              return (
                <div key={item._id} className="group bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden relative">
                  <div className="h-40 md:h-48 relative overflow-hidden bg-gray-50 dark:bg-gray-900/50 flex items-center justify-center shrink-0">
                    {item.image ? (
                      <img src={getImageUrl(item.image)} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <Gift size={40} md:size={48} className="text-gray-200 dark:text-gray-700" />
                    )}

                    {item.stock !== -1 && item.stock <= 5 && !isOutOfStock && (
                      <div className="absolute top-3 right-3 bg-rose-500 text-white text-[8px] md:text-[9px] font-black px-2 py-1 rounded-lg uppercase tracking-wider animate-pulse border border-white/20">
                        Soni: {item.stock} ta
                      </div>
                    )}

                    {isOutOfStock && (
                      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-[2px] z-10 flex items-center justify-center">
                        <span className="bg-white/10 text-white px-6 py-2 rounded-full border border-white/20 font-black uppercase tracking-widest text-[10px] scale-90">Tugagan 🚫</span>
                      </div>
                    )}
                  </div>

                  <div className="p-5 md:p-6 space-y-4 flex flex-col flex-1">
                    <div className="flex-1 min-h-[5rem]">
                      <h3 className="text-base md:text-lg font-black text-gray-900 dark:text-white uppercase italic leading-tight line-clamp-1">{item.name}</h3>
                      <p className="text-[10px] md:text-xs text-gray-400 font-medium line-clamp-2 mt-2 leading-relaxed">{item.description || 'Mahsulot haqida malumot mavjud emas'}</p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-gray-700/50">
                      <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-black italic">
                        <Coins size={16} className="text-yellow-500" />
                        <span className="text-base md:text-lg">{(item.price ?? 0).toLocaleString()}</span>
                      </div>
                      <button
                        onClick={() => setShowConfirmModal(item)}
                        disabled={!canAfford || isOutOfStock}
                        className={`px-4 py-2 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all ${canAfford && !isOutOfStock
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
              <div className="col-span-full py-20 text-center bg-white dark:bg-gray-800/30 rounded-[2.5rem] border border-dashed border-gray-100 dark:border-gray-700">
                <Tag size={40} className="mx-auto text-gray-200 dark:text-gray-700 mb-4" />
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Mahsulotlar topilmadi</p>
              </div>
            )}
          </div>
        ) : activeTab === 'orders' ? (
          <div className="grid grid-cols-1 gap-4">
            {orders.map(order => (
              <div key={order._id} className="bg-white dark:bg-gray-800 p-5 md:p-6 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-5 transition-all hover:border-indigo-100 dark:hover:border-indigo-900/30">
                <div className="flex items-center gap-4 md:gap-6 w-full sm:w-auto">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-500 shrink-0 border border-indigo-100/50 dark:border-indigo-800/30 shadow-inner">
                    <Package size={24} md:size={28} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-black text-gray-900 dark:text-white uppercase italic text-sm md:text-base tracking-tight">{order.item_name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock size={10} className="text-gray-300" />
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{formatDateSafely(order.createdAt, 'dd MMMM, HH:mm')}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-gray-50 dark:border-gray-700/50">
                  <div className="flex items-center gap-1.5 font-black text-indigo-600 dark:text-indigo-400 italic">
                    <Coins size={14} md:size={16} className="text-yellow-500" />
                    <span className="text-sm md:text-base">{(order.item_price ?? 0).toLocaleString()}</span>
                  </div>
                  {getStatusBadge(order.status)}
                </div>
              </div>
            ))}
            {orders.length === 0 && (
              <div className="py-24 text-center bg-white dark:bg-gray-800/30 rounded-[2.5rem] border border-dashed border-gray-200 dark:border-gray-700">
                <Package size={48} className="mx-auto text-gray-200 dark:text-gray-700 mb-4" />
                <p className="text-gray-400 font-black uppercase tracking-widest text-xs">Buyurtmalar mavjud emas</p>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-[2rem] md:rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="divide-y divide-gray-50 dark:divide-gray-700/50">
              {history.map(item => (
                <div key={item._id} className="p-5 md:p-6 flex flex-col md:flex-row items-center justify-between gap-5 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center shrink-0 border transition-all ${item.amount > 0 ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 border-emerald-100 dark:border-emerald-500/20' : 'bg-rose-50 dark:bg-rose-500/10 text-rose-500 border-rose-100 dark:border-rose-500/20'}`}>
                      {item.amount > 0 ? <TrendingUp size={20} md:size={24} /> : <TrendingDown size={20} md:size={24} />}
                    </div>
                    <div className="flex-1">
                      <p className="font-black text-sm md:text-base text-gray-900 dark:text-white uppercase italic tracking-tight">{item.reason}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest italic">{formatDateSafely(item.createdAt, 'dd.MM.yyyy HH:mm')}</span>
                        <div className="w-1 h-1 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                        <span className="text-[9px] text-indigo-500 font-black uppercase tracking-wider">{getReasonTypeLabel(item.reason_type)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-gray-50 dark:border-gray-700/50">
                    <div className="text-center md:text-right">
                      <p className={`font-black text-lg md:text-2xl tabular-nums italic ${item.amount > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {item.amount > 0 ? '+' : ''}{(item.amount ?? 0).toLocaleString()}
                      </p>
                      <p className="text-[9px] md:text-[10px] text-gray-400 uppercase font-black tracking-widest">Xisob: {(item.balance_after ?? 0).toLocaleString()}</p>
                    </div>
                    <div className="w-10 h-10 bg-gray-50 dark:bg-gray-900 rounded-xl flex items-center justify-center text-gray-300 dark:text-gray-600">
                      <ChevronRight size={18} />
                    </div>
                  </div>
                </div>
              ))}
              {history.length === 0 && (
                <div className="text-center py-24 bg-white dark:bg-gray-800/30">
                  <History className="w-12 h-12 text-gray-100 dark:text-gray-700 mx-auto mb-4" />
                  <p className="text-gray-300 dark:text-gray-600 font-black uppercase tracking-widest text-xs">History is empty</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal - Optimized for Mobile */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white dark:bg-gray-800 w-full max-w-sm rounded-[2.5rem] p-8 md:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.3)] animate-in zoom-in-95 relative border border-white/5">
            <button onClick={() => setShowConfirmModal(null)} className="absolute top-6 right-6 text-gray-300 hover:text-gray-500 transition-colors">
              <X size={20} />
            </button>

            <div className="w-16 h-16 bg-yellow-400/10 rounded-2xl flex items-center justify-center text-yellow-500 mb-6 mx-auto">
              <ShoppingBag size={32} />
            </div>

            <h3 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white uppercase italic text-center mb-4 tracking-tighter">Sotib olish</h3>

            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-8 text-center italic font-medium">
              "<span className="font-bold text-gray-900 dark:text-white not-italic">{showConfirmModal.name}</span>" mahsulotini
              <span className="text-indigo-600 font-black ml-1">{(showConfirmModal.price ?? 0).toLocaleString()}</span> tangaga olasizmi?
            </p>

            <div className="grid grid-cols-1 gap-3">
              <button
                onClick={() => handlePurchase(showConfirmModal._id)}
                disabled={purchasing}
                className="w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
              >
                {purchasing ? <Loader2 size={16} className="animate-spin" /> : <>TASDIQLASH <CheckCircle size={16} /></>}
              </button>
              <button onClick={() => setShowConfirmModal(null)} className="w-full py-4 rounded-2xl font-bold text-xs uppercase tracking-widest text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-all">Bekor qilish</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
