import { useState, useEffect } from 'react';
import api from '../utils/api';
import Modal from '../components/Modal';
import {
  ShoppingBag,
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Filter,
  Search,
  Coins,
  RefreshCw,
  Image
} from 'lucide-react';
import { format } from 'date-fns';

export default function AdminMarket() {
  const [activeTab, setActiveTab] = useState('items');
  const [items, setItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showItemModal, setShowItemModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [orderFilter, setOrderFilter] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancellingOrder, setCancellingOrder] = useState(null);
  const [cancelReason, setCancelReason] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    type: 'OTHER',
    stock: -1,
    requires_confirmation: true,
    is_active: true
  });

  const itemTypes = [
    { value: 'DISCOUNT', label: 'Chegirma' },
    { value: 'BONUS', label: 'Bonus' },
    { value: 'PREMIUM', label: 'Premium' },
    { value: 'LESSON', label: 'Dars' },
    { value: 'GIFT', label: 'Sovg\'a' },
    { value: 'OTHER', label: 'Boshqa' }
  ];

  useEffect(() => {
    if (activeTab === 'items') {
      fetchItems();
    } else {
      fetchOrders();
    }
  }, [activeTab, orderFilter]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await api.get('/market/admin/items');
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
      const params = {};
      if (orderFilter) params.status = orderFilter;

      const response = await api.get('/market/admin/orders', { params });
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitItem = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        price: parseInt(formData.price),
        stock: formData.stock === '' ? -1 : parseInt(formData.stock)
      };

      if (editingItem) {
        await api.put(`/market/admin/items/${editingItem._id}`, data);
      } else {
        await api.post('/market/admin/items', data);
      }

      setShowItemModal(false);
      setEditingItem(null);
      resetForm();
      fetchItems();
    } catch (error) {
      console.error('Error saving item:', error);
      alert('Xatolik yuz berdi');
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!confirm('Bu mahsulotni o\'chirmoqchimisiz?')) return;

    try {
      await api.delete(`/market/admin/items/${itemId}`);
      fetchItems();
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Xatolik yuz berdi');
    }
  };

  const handleConfirmOrder = async (orderId) => {
    try {
      await api.post(`/market/admin/orders/${orderId}/confirm`);
      fetchOrders();
      alert('Buyurtma tasdiqlandi!');
    } catch (error) {
      console.error('Error confirming order:', error);
      alert('Xatolik yuz berdi');
    }
  };

  const handleCancelOrder = async () => {
    if (!cancellingOrder) return;

    try {
      await api.post(`/market/admin/orders/${cancellingOrder._id}/cancel`, {
        reason: cancelReason
      });
      setShowCancelModal(false);
      setCancellingOrder(null);
      setCancelReason('');
      fetchOrders();
      alert('Buyurtma bekor qilindi va tangalar qaytarildi!');
    } catch (error) {
      console.error('Error cancelling order:', error);
      alert('Xatolik yuz berdi');
    }
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description || '',
      price: item.price.toString(),
      image: item.image || '',
      type: item.type,
      stock: item.stock === -1 ? '' : item.stock.toString(),
      requires_confirmation: item.requires_confirmation,
      is_active: item.is_active
    });
    setShowItemModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      image: '',
      type: 'OTHER',
      stock: -1,
      requires_confirmation: true,
      is_active: true
    });
  };

  const getStatusBadge = (status) => {
    const badges = {
      'PENDING': { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200', icon: Clock, label: 'Kutilmoqda' },
      'CONFIRMED': { color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', icon: CheckCircle, label: 'Tasdiqlangan' },
      'CANCELLED': { color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200', icon: XCircle, label: 'Bekor qilingan' }
    };
    const badge = badges[status] || badges['PENDING'];
    const Icon = badge.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>
        <Icon className="w-3 h-3" />
        {badge.label}
      </span>
    );
  };

  const getTypeBadge = (type) => {
    const types = {
      'DISCOUNT': 'bg-purple-100 text-purple-800',
      'BONUS': 'bg-blue-100 text-blue-800',
      'PREMIUM': 'bg-yellow-100 text-yellow-800',
      'LESSON': 'bg-green-100 text-green-800',
      'GIFT': 'bg-pink-100 text-pink-800',
      'OTHER': 'bg-gray-100 text-gray-800'
    };
    const labels = {
      'DISCOUNT': 'Chegirma',
      'BONUS': 'Bonus',
      'PREMIUM': 'Premium',
      'LESSON': 'Dars',
      'GIFT': 'Sovg\'a',
      'OTHER': 'Boshqa'
    };
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${types[type] || types['OTHER']}`}>
        {labels[type] || type}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <ShoppingBag className="w-8 h-8 text-purple-500" />
          Market Boshqaruvi
        </h1>
        {activeTab === 'items' && (
          <button
            onClick={() => { resetForm(); setEditingItem(null); setShowItemModal(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            <Plus className="w-4 h-4" />
            Mahsulot Qo'shish
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('items')}
          className={`pb-2 px-4 font-medium ${activeTab === 'items'
            ? 'text-purple-600 border-b-2 border-purple-600'
            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
        >
          <Package className="w-4 h-4 inline mr-2" />
          Mahsulotlar
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-2 px-4 font-medium ${activeTab === 'orders'
            ? 'text-purple-600 border-b-2 border-purple-600'
            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
        >
          <ShoppingBag className="w-4 h-4 inline mr-2" />
          Buyurtmalar
          {orders.filter(o => o.status === 'PENDING').length > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
              {orders.filter(o => o.status === 'PENDING').length}
            </span>
          )}
        </button>
      </div>

      {/* Filters for orders */}
      {activeTab === 'orders' && (
        <div className="flex gap-4">
          <select
            value={orderFilter}
            onChange={(e) => setOrderFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="">Barcha buyurtmalar</option>
            <option value="PENDING">Kutilmoqda</option>
            <option value="CONFIRMED">Tasdiqlangan</option>
            <option value="CANCELLED">Bekor qilingan</option>
          </select>
          <button
            onClick={fetchOrders}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            <RefreshCw className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      ) : activeTab === 'items' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map(item => (
            <div key={item._id} className={`bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden ${!item.is_active ? 'opacity-60' : ''}`}>
              <div className="h-40 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <Package className="w-16 h-16 text-gray-400" />
                )}
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-gray-900 dark:text-white">{item.name}</h3>
                  {getTypeBadge(item.type)}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
                  {item.description || 'Tavsif yo\'q'}
                </p>
                <div className="flex items-center justify-between mb-3">
                  <span className="flex items-center gap-1 text-lg font-bold text-yellow-600">
                    <Coins className="w-5 h-5" />
                    {item.price}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {item.stock === -1 ? 'Cheksiz' : `${item.stock} ta qoldi`}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(item)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                  >
                    <Edit className="w-4 h-4" />
                    Tahrirlash
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item._id)}
                    className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500 dark:text-gray-400">
              Mahsulotlar topilmadi
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Sana</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">O'quvchi</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Mahsulot</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Narx</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Holat</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {orders.map(order => (
                <tr key={order._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-sm">
                    {format(new Date(order.createdAt), 'dd.MM.yyyy HH:mm')}
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {order.student_id?.full_name || '-'}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {order.student_id?.phone || '-'}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white">
                    {order.item_name}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="flex items-center justify-end gap-1 font-bold text-yellow-600">
                      <Coins className="w-4 h-4" />
                      {order.item_price}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {order.status === 'PENDING' && (
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleConfirmOrder(order._id)}
                          className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
                          title="Tasdiqlash"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => { setCancellingOrder(order); setShowCancelModal(true); }}
                          className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                          title="Bekor qilish"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    {order.status === 'CONFIRMED' && order.confirmed_by && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {order.confirmed_by.full_name}
                      </span>
                    )}
                    {order.status === 'CANCELLED' && order.cancelled_reason && (
                      <span className="text-xs text-red-500" title={order.cancelled_reason}>
                        {order.cancelled_reason.substring(0, 20)}...
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              Buyurtmalar topilmadi
            </div>
          )}
        </div>
      )}

      {/* Item Modal */}
      <Modal
        isOpen={showItemModal}
        onClose={() => { setShowItemModal(false); setEditingItem(null); }}
        title={editingItem ? 'Mahsulotni Tahrirlash' : 'Yangi Mahsulot'}
      >
        <form onSubmit={handleSubmitItem} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nomi *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tavsif
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Narx (tanga) *
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                min="0"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Zaxira (bo'sh = cheksiz)
              </label>
              <input
                type="number"
                value={formData.stock === -1 ? '' : formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value === '' ? -1 : e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                min="0"
                placeholder="Cheksiz"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Turi
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              {itemTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Rasm (URL yoki Fayl)
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="https://..."
              />
              <label className="cursor-pointer bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 px-4 py-2 rounded-lg flex items-center justify-center border border-gray-300 dark:border-gray-600">
                <Image className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      if (file.size > 10 * 1024 * 1024) {
                        alert("Rasm hajmi juda katta!");
                        return;
                      }

                      const reader = new FileReader();
                      reader.onload = (event) => {
                        const img = new Image();
                        img.onload = () => {
                          const canvas = document.createElement('canvas');
                          let width = img.width;
                          let height = img.height;

                          // Max dimensions
                          const MAX_WIDTH = 800;
                          const MAX_HEIGHT = 800;

                          if (width > height) {
                            if (width > MAX_WIDTH) {
                              height *= MAX_WIDTH / width;
                              width = MAX_WIDTH;
                            }
                          } else {
                            if (height > MAX_HEIGHT) {
                              width *= MAX_HEIGHT / height;
                              height = MAX_HEIGHT;
                            }
                          }

                          canvas.width = width;
                          canvas.height = height;
                          const ctx = canvas.getContext('2d');
                          ctx.drawImage(img, 0, 0, width, height);

                          setFormData({ ...formData, image: canvas.toDataURL('image/jpeg', 0.7) });
                        };
                        img.src = event.target.result;
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </label>
            </div>
            {formData.image && (
              <div className="mt-2 relative w-full h-32 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
                <img src={formData.image} alt="Preview" className="w-full h-full object-contain" />
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, image: '' })}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.requires_confirmation}
                onChange={(e) => setFormData({ ...formData, requires_confirmation: e.target.checked })}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Tasdiqlash talab qilinadi</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Faol</span>
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => { setShowItemModal(false); setEditingItem(null); }}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              {editingItem ? 'Saqlash' : 'Qo\'shish'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Cancel Order Modal */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => { setShowCancelModal(false); setCancellingOrder(null); setCancelReason(''); }}
        title="Buyurtmani Bekor Qilish"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            Bu buyurtmani bekor qilmoqchimisiz? O'quvchiga tangalar qaytariladi.
          </p>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Sabab (ixtiyoriy)
            </label>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              rows={3}
              placeholder="Bekor qilish sababi..."
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => { setShowCancelModal(false); setCancellingOrder(null); setCancelReason(''); }}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Ortga
            </button>
            <button
              onClick={handleCancelOrder}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Bekor qilish
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
