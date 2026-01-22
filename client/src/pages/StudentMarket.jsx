import { useState, useEffect } from 'react';
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
  Sparkles
} from 'lucide-react';
import { format } from 'date-fns';

export default function StudentMarket() {
  const [activeTab, setActiveTab] = useState('shop');
  const [items, setItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [history, setHistory] = useState([]);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(null);

  useEffect(() => {
    fetchBalance();
    if (activeTab === 'shop') {
      fetchItems();
    } else if (activeTab === 'orders') {
      fetchOrders();
    } else {
      fetchHistory();
    }
  }, [activeTab]);

  const fetchBalance = async () => {
    try {
      const response = await api.get('/market/balance');
      setBalance(response.data.balance);
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await api.get('/market/items');
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await api.get('/market/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const response = await api.get('/market/history');
      setHistory(response.data);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (itemId) => {
    if (purchasing) return;
    
    const item = items.find(i => i._id === itemId);
    if (!item) return;
    
    if (balance < item.price) {
      alert('Tangalar yetarli emas!');
      return;
    }

    if (!confirm(`"${item.name}" mahsulotini ${item.price} tangaga sotib olmoqchimisiz?`)) {
      return;
    }

    setPurchasing(itemId);
    try {
      const response = await api.post(`/market/purchase/${itemId}`);
      setBalance(response.data.balance);
      alert(response.data.message);
      fetchItems();
    } catch (error) {
      console.error('Error purchasing:', error);
      alert(error.response?.data?.message || 'Xatolik yuz berdi');
    } finally {
      setPurchasing(null);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      'PENDING': { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200', icon: Clock, label: 'Kutilmoqda' },
      'CONFIRMED': { color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', icon: CheckCircle, label: 'Berildi' },
      'CANCELLED': { color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200', icon: XCircle, label: 'Bekor qilindi' }
    };
    const badge = badges[status] || badges['PENDING'];
    const Icon = badge.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${badge.color}`}>
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

  const getReasonIcon = (type) => {
    if (type.includes('PRESENT') || type.includes('SUBMITTED') || type.includes('COMPLETED') || type === 'ADMIN_MANUAL' || type === 'ORDER_CANCELLED') {
      return <TrendingUp className="w-4 h-4 text-green-500" />;
    }
    return <TrendingDown className="w-4 h-4 text-red-500" />;
  };

  return (
    <div className="space-y-6">
      {/* Header with Balance */}
      <div className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <ShoppingBag className="w-8 h-8" />
              Market
            </h1>
            <p className="text-yellow-100 mt-1">Tangalaringizni sarflang!</p>
          </div>
          <div className="text-right">
            <p className="text-yellow-100 text-sm">Sizning balansingiz</p>
            <div className="flex items-center gap-2 text-3xl font-bold">
              <Coins className="w-8 h-8" />
              {balance}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
        <button
          onClick={() => setActiveTab('shop')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all ${
            activeTab === 'shop' 
              ? 'bg-white dark:bg-gray-700 text-purple-600 shadow' 
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
          }`}
        >
          <ShoppingCart className="w-5 h-5" />
          Do'kon
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all ${
            activeTab === 'orders' 
              ? 'bg-white dark:bg-gray-700 text-purple-600 shadow' 
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
          }`}
        >
          <Package className="w-5 h-5" />
          Buyurtmalarim
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all ${
            activeTab === 'history' 
              ? 'bg-white dark:bg-gray-700 text-purple-600 shadow' 
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
          }`}
        >
          <History className="w-5 h-5" />
          Tarix
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      ) : activeTab === 'shop' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map(item => (
            <div 
              key={item._id} 
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform"
            >
              <div className="h-48 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 flex items-center justify-center relative">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <Gift className="w-20 h-20 text-purple-400" />
                )}
                {item.stock !== -1 && item.stock <= 5 && (
                  <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    Faqat {item.stock} ta!
                  </span>
                )}
              </div>
              <div className="p-5">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">{item.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
                  {item.description || 'Ajoyib mahsulot!'}
                </p>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-xl font-bold text-yellow-600">
                    <Coins className="w-6 h-6" />
                    {item.price}
                  </span>
                  <button
                    onClick={() => handlePurchase(item._id)}
                    disabled={purchasing === item._id || balance < item.price || item.stock === 0}
                    className={`px-4 py-2 rounded-xl font-medium transition-all ${
                      balance >= item.price && item.stock !== 0
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {purchasing === item._id ? (
                      <span className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Sotib olinmoqda...
                      </span>
                    ) : item.stock === 0 ? (
                      'Tugadi'
                    ) : balance < item.price ? (
                      'Yetarli emas'
                    ) : (
                      'Sotib olish'
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div className="col-span-full text-center py-12">
              <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                Hozircha mahsulotlar yo'q
              </p>
              <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
                Tez orada yangi mahsulotlar qo'shiladi!
              </p>
            </div>
          )}
        </div>
      ) : activeTab === 'orders' ? (
        <div className="space-y-4">
          {orders.map(order => (
            <div 
              key={order._id} 
              className="bg-white dark:bg-gray-800 rounded-xl shadow p-5 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center">
                  <Gift className="w-8 h-8 text-purple-500" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">{order.item_name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {format(new Date(order.createdAt), 'dd.MM.yyyy HH:mm')}
                  </p>
                  <div className="flex items-center gap-1 text-yellow-600 font-medium mt-1">
                    <Coins className="w-4 h-4" />
                    {order.item_price} tanga
                  </div>
                </div>
              </div>
              <div>
                {getStatusBadge(order.status)}
              </div>
            </div>
          ))}
          {orders.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                Buyurtmalar yo'q
              </p>
              <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
                Do'kondan mahsulot sotib oling!
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {history.map(item => (
              <div key={item._id} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700">
                <div className="flex items-center gap-3">
                  {getReasonIcon(item.reason_type)}
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{item.reason}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {format(new Date(item.createdAt), 'dd.MM.yyyy HH:mm')} • {getReasonTypeLabel(item.reason_type)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`font-bold text-lg ${item.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {item.amount > 0 ? '+' : ''}{item.amount}
                  </span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Balans: {item.balance_after}
                  </p>
                </div>
              </div>
            ))}
          </div>
          {history.length === 0 && (
            <div className="text-center py-12">
              <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                Tarix bo'sh
              </p>
              <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
                Darsga qatnashing va tangalar yig'ing!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
