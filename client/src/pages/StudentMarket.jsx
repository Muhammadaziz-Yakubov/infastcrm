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
      'PENDING': { color: 'text-amber-500 bg-amber-50 rounded-xl', icon: Clock, label: 'Kutilmoqda' },
      'CONFIRMED': { color: 'text-emerald-500 bg-emerald-50 rounded-xl', icon: CheckCircle, label: 'Berildi' },
      'CANCELLED': { color: 'text-rose-500 bg-rose-50 rounded-xl', icon: XCircle, label: 'Bekor qilindi' }
    };
    const badge = badges[status] || badges['PENDING'];
    const Icon = badge.icon;
    return (
      <span className={`inline-flex items-center gap-2 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider ${badge.color}`}>
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
        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Yuklanmoqda...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Refined Header */}
      <div className="relative overflow-hidden rounded-3xl bg-indigo-600 shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-700 opacity-90"></div>
        <div className="relative z-10 p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-inner">
              <ShoppingBag className="text-white" size={32} md:size={40} />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-white uppercase italic tracking-tight">Market</h1>
              <p className="text-indigo-100 font-bold text-sm">O'zingizga kerakli narsalarni harid qiling</p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-8 py-6 flex flex-col items-center md:items-end">
            <span className="text-white/70 font-black text-[10px] uppercase tracking-widest mb-1">BALANSINGIZ</span>
            <div className="flex items-center gap-3 text-4xl md:text-5xl font-black text-white tabular-nums">
              <Coins className="text-yellow-400" size={32} md:size={40} />
              {balance.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Simplified Navigation */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-2xl w-full sm:w-auto">
          {[
            { id: 'shop', label: 'Do\'kon' },
            { id: 'orders', label: 'Buyurtmalar' },
            { id: 'history', label: 'Tarix' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 sm:flex-none px-8 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === tab.id
                  ? 'bg-white dark:bg-gray-700 text-indigo-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'shop' && (
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Qidirish..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-white dark:bg-gray-800 border-none rounded-2xl pl-12 pr-4 py-3 text-sm focus:ring-2 ring-indigo-500 transition-all dark:text-white shadow-sm"
            />
          </div>
        )}
      </div>

      {/* Content Grid */}
      <div className="min-h-[300px]">
        {activeTab === 'shop' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map(item => {
              const canAfford = balance >= item.price;
              return (
                <div key={item._id} className="group bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden">
                  <div className="h-48 relative overflow-hidden bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                    {item.image ? (
                      <img src={getImageUrl(item.image)} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <Gift size={48} className="text-gray-200" />
                    )}
                    {item.stock !== -1 && item.stock <= 5 && item.stock > 0 && (
                      <span className="absolute top-4 right-4 bg-rose-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg">Kutilmoqda: {item.stock}</span>
                    )}
                    {item.stock === 0 && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white font-bold uppercase tracking-widest text-xs">Tugagan</div>
                    )}
                  </div>

                  <div className="p-6 space-y-4 flex flex-col flex-1">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-1">{item.name}</h3>
                      <p className="text-xs text-gray-400 line-clamp-2 mt-2">{item.description || 'Mahsulot haqida ma'lumot mavjud emas'}</p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-gray-700">
                      <div className="flex items-center gap-1.5 text-indigo-600 font-black">
                        <Coins size={18} className="text-yellow-500" />
                        {item.price.toLocaleString()}
                      </div>
                      <button
                        onClick={() => setShowConfirmModal(item)}
                        disabled={!canAfford || item.stock === 0}
                        className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all ${canAfford && item.stock !== 0 ? 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          }`}
                      >
                        Sotib olish
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : activeTab === 'orders' ? (
          <div className="grid grid-cols-1 gap-4">
            {orders.map(order => (
              <div key={order._id} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-500">
                    <Package size={28} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white uppercase text-sm">{order.item_name}</h3>
                    <p className="text-xs text-gray-400 mt-1">{format(new Date(order.createdAt), 'dd MMMM, HH:mm', { locale: uz })}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-1.5 font-bold text-indigo-600">
                    <Coins size={16} className="text-yellow-500" />
                    {order.item_price.toLocaleString()}
                  </div>
                  {getStatusBadge(order.status)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="divide-y divide-gray-50 dark:divide-gray-700">
              {history.map(item => (
                <div key={item._id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.amount > 0 ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'}`}>
                      {item.amount > 0 ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-gray-900 dark:text-white uppercase italic">{item.reason}</p>
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-0.5">{format(new Date(item.createdAt), 'dd.MM.yyyy HH:mm')} • {getReasonTypeLabel(item.reason_type)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-black text-lg ${item.amount > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {item.amount > 0 ? '+' : ''}{item.amount.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-gray-400 uppercase font-bold">Xisob: {item.balance_after.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-3xl p-8 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase italic mb-4">Tasdiqlash</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-8">
              "<span className="font-bold text-gray-900 dark:text-white">{showConfirmModal.name}</span>" mahsulotini {showConfirmModal.price.toLocaleString()} tangaga sotib olasizmi?
            </p>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setShowConfirmModal(null)} className="py-3 rounded-xl font-bold text-sm uppercase tracking-wider bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors">Bekor qilish</button>
              <button
                onClick={() => handlePurchase(showConfirmModal._id)}
                disabled={purchasing}
                className="py-3 rounded-xl font-bold text-sm uppercase tracking-wider bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
              >
                {purchasing ? <Loader2 size={18} className="animate-spin" /> : 'Tasdiqlash'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
