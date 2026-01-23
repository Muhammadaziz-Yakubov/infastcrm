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
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
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
    return `${backendUrl.replace('/api', '')}/${url.startsWith('/') ? url.slice(1) : url}`;
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const balanceRes = await api.get('/market/balance');
      setBalance(balanceRes.data.balance);

      if (activeTab === 'shop') {
        const res = await api.get('/market/items');
        setItems(res.data);
      } else if (activeTab === 'orders') {
        const res = await api.get('/market/orders');
        setOrders(res.data);
      } else {
        const res = await api.get('/market/history');
        setHistory(res.data);
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
    const item = items.find(i => i._id === itemId);
    if (!item || balance < item.price) return;

    setPurchasing(itemId);
    try {
      const response = await api.post(`/market/purchase/${itemId}`);
      setBalance(response.data.balance);
      setShowConfirmModal(null);
      // Success toast or notification would be nice here, but we'll re-fetch
      fetchData();
    } catch (error) {
      console.error('Purchase error:', error);
      alert(error.response?.data?.message || 'Sotib olishda xatolik yuz berdi');
    } finally {
      setPurchasing(null);
    }
  };

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    const badges = {
      'PENDING': { color: 'text-amber-500 bg-amber-500/10 border-amber-500/20', icon: Clock, label: 'Kutilmoqda' },
      'CONFIRMED': { color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20', icon: CheckCircle, label: 'Berildi' },
      'CANCELLED': { color: 'text-rose-500 bg-rose-500/10 border-rose-500/20', icon: XCircle, label: 'Bekor qilindi' }
    };
    const badge = badges[status] || badges['PENDING'];
    const Icon = badge.icon;
    return (
      <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border ${badge.color} backdrop-blur-md`}>
        <Icon className="w-4 h-4" />
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
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-400 font-black uppercase tracking-[0.3em] animate-pulse">Market yuklanmoqda...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-32 animate-in fade-in duration-700">
      {/* Premium Header with Balance */}
      <div className="relative group overflow-hidden rounded-[3rem] shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 opacity-95"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>

        {/* Decorative elements */}
        <div className="absolute -top-10 -right-10 w-64 h-64 bg-yellow-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>

        <div className="relative z-10 p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex items-center gap-8">
            <div className="relative">
              <div className="absolute inset-0 bg-yellow-400 blur-2xl opacity-30 animate-pulse"></div>
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-[2.5rem] bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-2xl transform group-hover:rotate-12 transition-all duration-500 border border-white/20">
                <ShoppingBag className="text-white" size={40} md:size={48} strokeWidth={2.5} />
              </div>
            </div>
            <div>
              <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter italic uppercase drop-shadow-lg">Elite Market</h1>
              <p className="text-yellow-400 font-black uppercase tracking-[0.4em] mt-3 ml-1 flex items-center gap-2 text-xs">
                <Sparkles size={14} /> Tangalaringizni orzularga almashtiring
              </p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-3xl border border-white/20 rounded-[2.5rem] p-8 md:p-10 flex flex-col items-center md:items-end group/balance hover:scale-105 transition-all duration-500 shadow-2xl">
            <p className="text-white/60 font-black text-[10px] uppercase tracking-widest mb-2 flex items-center gap-2">
              <Zap size={12} className="text-yellow-400" /> JORIY BALANSINGIZ
            </p>
            <div className="flex items-center gap-4 text-5xl md:text-7xl font-black text-white tabular-nums drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]">
              <Coins className="text-yellow-400 animate-bounce" size={48} md:size={64} />
              {balance.toLocaleString()}
            </div>
            <div className="mt-4 w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 w-[70%]" style={{ width: `${Math.min((balance / 5000) * 100, 100)}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Navigation & Filter */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 py-2">
        <div className="flex flex-wrap gap-3 bg-gray-100 dark:bg-white/5 p-2 rounded-[2.2rem] border border-white/5 backdrop-blur-xl ring-1 ring-black/5 dark:ring-white/5">
          {[
            { id: 'shop', icon: ShoppingCart, label: 'Sotuv Markazi' },
            { id: 'orders', icon: Package, label: 'Buyurtmalarim' },
            { id: 'history', icon: History, label: 'Coin Tarixi' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 py-4 px-8 rounded-2xl font-black text-xs uppercase tracking-widest tracking-tighter transition-all duration-500 ${activeTab === tab.id
                  ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-2xl scale-105'
                  : 'text-gray-400 hover:text-gray-600 dark:hover:text-white/60'
                }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'shop' && (
          <div className="relative group lg:w-96">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
            <input
              type="text"
              placeholder="Mahsulotlarni izlash..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-white dark:bg-white/5 border-none rounded-[1.8rem] pl-14 pr-8 py-5 text-sm font-bold focus:ring-4 ring-indigo-500/10 transition-all dark:text-white shadow-xl shadow-gray-200/5 dark:shadow-none"
            />
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="min-h-[40vh]">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white dark:bg-white/5 h-[400px] rounded-[3rem] animate-pulse border border-gray-100 dark:border-white/5"></div>
            ))}
          </div>
        ) : activeTab === 'shop' ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-2">
              {filteredItems.map(item => {
                const canAfford = balance >= item.price;
                const isOutOfStock = item.stock === 0;

                return (
                  <div
                    key={item._id}
                    className="group bg-white dark:bg-[#0f111a] rounded-[3rem] border border-gray-100 dark:border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.03)] dark:shadow-none hover:shadow-[0_40px_80px_rgba(79,70,229,0.1)] transition-all duration-700 flex flex-col h-full overflow-hidden"
                  >
                    <div className="h-60 relative overflow-hidden shrink-0">
                      {item.image ? (
                        <img
                          src={getImageUrl(item.image)}
                          alt={item.name}
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white/20">
                          <Gift size={80} strokeWidth={1} />
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-[#0f111a] via-transparent to-transparent opacity-60"></div>

                      <div className="absolute top-6 left-6 z-20">
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] bg-indigo-600 text-white px-4 py-2 rounded-xl shadow-xl border border-white/20 backdrop-blur-md">
                          Elite Item
                        </span>
                      </div>

                      {item.stock !== -1 && item.stock <= 5 && item.stock > 0 && (
                        <div className="absolute top-6 right-6 z-20">
                          <span className="bg-rose-500 text-white text-[9px] font-black px-4 py-2 rounded-xl shadow-xl border border-white/20 uppercase tracking-widest animate-pulse">
                            Limited: {item.stock} ta
                          </span>
                        </div>
                      )}

                      {isOutOfStock && (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-30 flex items-center justify-center">
                          <span className="bg-white/10 text-white px-8 py-3 rounded-full border border-white/20 font-black uppercase tracking-widest rotate-[-15deg]">
                            TUGAGAN 🚫
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-8 flex flex-col flex-1">
                      <div className="flex-1">
                        <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3 tracking-tighter uppercase italic group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors">{item.name}</h3>
                        <p className="text-xs md:text-sm text-gray-400 dark:text-white/40 mb-8 font-bold line-clamp-2 leading-relaxed">
                          {item.description || 'Bu mahsulot sizning o\'quv tajribangizni yanada boyitish uchun mo\'ljallangan.'}
                        </p>
                      </div>

                      <div className="pt-8 border-t border-gray-50 dark:border-white/5 flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1 leading-none">NARXI</span>
                          <div className="flex items-center gap-2 text-2xl font-black text-yellow-600 tabular-nums italic">
                            <Coins size={20} />
                            {item.price.toLocaleString()}
                          </div>
                        </div>

                        <button
                          onClick={() => setShowConfirmModal(item)}
                          disabled={purchasing === item._id || !canAfford || isOutOfStock}
                          className={`relative py-4 px-8 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all duration-500 shadow-xl overflow-hidden group/btn ${canAfford && !isOutOfStock
                              ? 'bg-indigo-600 hover:bg-indigo-700 text-white hover:-translate-y-1 shadow-indigo-600/30 active:scale-95'
                              : 'bg-gray-100 dark:bg-white/5 text-gray-400 cursor-not-allowed'
                            }`}
                        >
                          <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
                          <span className="relative z-10 flex items-center gap-2">
                            {isOutOfStock ? 'YO\'Q' : !canAfford ? 'YETARLI EMAS' : 'HARID QILISH'}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {filteredItems.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-24 h-24 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center mb-8">
                  <Tag size={48} className="text-gray-200 dark:text-white/10" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter">Mahsulotlar topilmadi</h3>
                <p className="text-gray-400 mt-2 font-bold max-w-xs uppercase text-xs tracking-widest">Qidiruv bo'yicha hech narsa chiqmadi, boshqa nom bilan izlab ko'ring!</p>
              </div>
            )}
          </>
        ) : activeTab === 'orders' ? (
          <div className="space-y-6">
            {orders.map(order => (
              <div
                key={order._id}
                className="group bg-white dark:bg-[#0f111a] rounded-[2.5rem] p-8 border border-gray-100 dark:border-white/5 shadow-xl hover:shadow-[0_30px_60px_rgba(0,0,0,0.05)] transition-all duration-500 flex flex-col md:flex-row items-center justify-between gap-8"
              >
                <div className="flex flex-col md:flex-row items-center gap-8 w-full md:w-auto">
                  <div className="w-24 h-24 md:w-28 md:h-28 rounded-3xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center border border-indigo-100 dark:border-indigo-500/10 shadow-inner group-hover:scale-110 transition-transform duration-500 shrink-0">
                    <Gift size={48} className="text-indigo-500" />
                  </div>
                  <div className="text-center md:text-left">
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white italic uppercase tracking-tighter mb-2">{order.item_name}</h3>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-5">
                      <div className="flex items-center gap-2 text-gray-400 text-[10px] font-black uppercase tracking-widest bg-gray-50 dark:bg-white/5 px-4 py-1.5 rounded-full">
                        <Clock size={12} />
                        {format(new Date(order.createdAt), 'dd MMM, HH:mm', { locale: uz })}
                      </div>
                      <div className="flex items-center gap-2 text-yellow-600 text-[11px] font-black uppercase italic italic tracking-tighter bg-yellow-400/10 px-4 py-1.5 rounded-full">
                        <Coins size={14} />
                        {order.item_price.toLocaleString()} COINS
                      </div>
                    </div>
                  </div>
                </div>
                <div className="shrink-0 flex items-center gap-4">
                  {getStatusBadge(order.status)}
                  <div className="w-12 h-12 bg-gray-50 dark:bg-white/5 rounded-2xl flex items-center justify-center text-gray-300 group-hover:bg-indigo-600 group-hover:text-white transition-all cursor-pointer">
                    <ChevronRight size={24} strokeWidth={3} />
                  </div>
                </div>
              </div>
            ))}
            {orders.length === 0 && (
              <div className="bg-white dark:bg-white/[0.02] rounded-[3.5rem] p-20 text-center border-4 border-dashed border-gray-50 dark:border-white/5 flex flex-col items-center justify-center">
                <div className="w-24 h-24 bg-gray-50 dark:bg-white/5 rounded-[2.5rem] flex items-center justify-center mb-8 text-gray-200 dark:text-white/10 rotate-12">
                  <Package size={56} strokeWidth={1} />
                </div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter">Buyurtmalar yo'q</h3>
                <p className="text-gray-400 mt-2 font-bold max-w-xs uppercase text-xs tracking-widest">Sizda hali hech qanday buyurtma mavjud emas. Marketni ko'rib chiqing!</p>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white dark:bg-[#0f111a] rounded-[3.5rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-white/5">
            <div className="p-8 md:p-12 border-b border-gray-50 dark:border-white/5 bg-gray-50/50 dark:bg-white/5 flex items-center justify-between">
              <h3 className="font-black text-2xl text-gray-900 dark:text-white italic uppercase tracking-tighter flex items-center gap-4">
                <History className="text-indigo-600" />
                Amallar tarixi
              </h3>
              <div className="px-6 py-2 bg-indigo-600 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest shadow-xl shadow-indigo-600/30">
                Active Session
              </div>
            </div>

            <div className="divide-y divide-gray-100 dark:divide-white/5 max-h-[800px] overflow-y-auto custom-scrollbar">
              {history.map(item => (
                <div key={item._id} className="p-8 md:p-10 flex flex-col md:flex-row items-center justify-between hover:bg-gray-50 dark:hover:bg-white/5 transition-all duration-500 group">
                  <div className="flex items-center gap-6 w-full md:w-auto">
                    <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center shrink-0 border transition-all duration-500 ${item.amount > 0 ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white' : 'bg-rose-500/10 border-rose-500/20 text-rose-500 group-hover:bg-rose-500 group-hover:text-white'}`}>
                      {item.amount > 0 ? <TrendingUp size={28} /> : <TrendingDown size={28} />}
                    </div>
                    <div className="text-left flex-1">
                      <p className="text-lg md:text-xl font-black text-gray-900 dark:text-white mb-2 italic uppercase tracking-tighter group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{item.reason}</p>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 dark:bg-white/5 px-3 py-1 rounded-lg border border-gray-100 dark:border-white/10">
                          {format(new Date(item.createdAt), 'dd.MM.yyyy HH:mm', { locale: uz })}
                        </span>
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-200 dark:bg-white/10"></div>
                        <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest italic">{getReasonTypeLabel(item.reason_type)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 md:mt-0 flex flex-col items-center md:items-end shrink-0 w-full md:w-auto pt-6 md:pt-0 border-t md:border-t-0 border-gray-100 dark:border-white/5">
                    <div className={`text-3xl md:text-5xl font-black tabular-nums tracking-tighter flex items-center gap-2 ${item.amount > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {item.amount > 0 ? '+' : ''}{item.amount.toLocaleString()}
                      <Coins size={28} />
                    </div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mt-2">Xisob: {item.balance_after.toLocaleString()}</p>
                  </div>
                </div>
              ))}
              {history.length === 0 && (
                <div className="text-center py-24 px-10">
                  <History className="w-24 h-24 text-gray-100 dark:text-white/5 mx-auto mb-8" />
                  <h3 className="text-xl font-black text-gray-400 uppercase italic tracking-tighter">Hali hech qanday harakat yo'q</h3>
                  <p className="text-gray-300 mt-2 font-bold uppercase text-[10px] tracking-[0.2em] max-w-sm mx-auto">Tangalar yig'ishni davom ettiring va ularni tarixingizda ko'ring!</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Premium Confirm Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-2xl animate-in fade-in duration-500">
          <div className="bg-white dark:bg-[#0f111a] w-full max-w-lg rounded-[3.5rem] overflow-hidden shadow-[0_0_150px_rgba(0,0,0,0.8)] border border-white/5 relative animate-in zoom-in-95 duration-700 flex flex-col">
            <button onClick={() => setShowConfirmModal(null)} className="absolute top-10 right-10 w-12 h-12 flex items-center justify-center text-gray-400 hover:text-white hover:bg-rose-500 rounded-2xl transition-all z-20">
              <X size={24} />
            </button>

            <div className="p-12 text-center flex flex-col items-center">
              <div className="w-24 h-24 bg-yellow-400/10 rounded-[2rem] flex items-center justify-center text-yellow-500 mb-10 shadow-inner group transition-transform hover:scale-110 duration-500">
                <ShoppingBag size={48} strokeWidth={2.5} className=" group-hover:rotate-12 transition-transform" />
              </div>

              <h3 className="text-3xl md:text-4xl font-black dark:text-white italic uppercase tracking-tighter leading-none mb-6">Haridni<br />Tasdiqlash</h3>

              <p className="text-gray-500 dark:text-white/40 font-bold mb-10 leading-relaxed text-lg italic tracking-tight">
                "<span className="text-indigo-600 dark:text-indigo-400">{showConfirmModal.name}</span>" mahsulotini
                <span className="text-yellow-600 ml-1 inline-flex items-center gap-1 font-black underline underline-offset-8 decoration-yellow-600/30">
                  {showConfirmModal.price.toLocaleString()} tanga
                </span>
                ga sotib olmoqchimisiz?
              </p>

              <div className="flex flex-col w-full gap-4">
                <button
                  onClick={() => handlePurchase(showConfirmModal._id)}
                  disabled={purchasing}
                  className="w-full py-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[2.5rem] font-black shadow-[0_20px_50px_rgba(79,70,229,0.3)] hover:shadow-[0_30px_60px_rgba(79,70,229,0.5)] active:scale-95 transition-all flex items-center justify-center gap-4 text-xl italic uppercase tracking-[0.2em]"
                >
                  {purchasing ? (
                    <>
                      <Loader2 className="animate-spin" size={24} strokeWidth={3} />
                      YUKLANMOQDA...
                    </>
                  ) : (
                    <>
                      TASDIQLASH <CheckCircle size={24} strokeWidth={3} />
                    </>
                  )}
                </button>
                <button
                  onClick={() => setShowConfirmModal(null)}
                  disabled={purchasing}
                  className="w-full py-6 bg-gray-100 dark:bg-white/5 text-gray-400 hover:text-gray-600 dark:hover:text-white/80 rounded-[2.5rem] font-black transition-all text-sm uppercase tracking-widest disabled:opacity-50"
                >
                  BEKOR QILISH
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
