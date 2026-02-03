import { useState, useEffect } from 'react';
import api from '../utils/api';
import {
  Settings,
  Power,
  PowerOff,
  Eye,
  EyeOff,
  Key,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Shield,
  Zap
} from 'lucide-react';

export default function Maintenance() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState('');
  const [newCode, setNewCode] = useState('');
  const [message, setMessage] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const response = await api.get('/maintenance/status');
      setStatus(response.data);
    } catch (error) {
      console.error('Error fetching maintenance status:', error);
    } finally {
      setLoading(false);
    }
  };

  const showResult = (success, message) => {
    setResult({ success, message });
    setTimeout(() => setResult(null), 3000);
  };

  const handleEnableMaintenance = async () => {
    if (!code) {
      showResult(false, 'Kodni kiriting');
      return;
    }

    setActionLoading(true);
    try {
      const response = await api.post('/maintenance/enable', {
        code,
        message: message || "Texnik ishlar olib borilmoqda. Iltimos, keyinroq urinib ko'ring."
      });
      
      if (response.data.success) {
        showResult(true, response.data.message);
        fetchStatus();
        setCode('');
        setMessage('');
      } else {
        showResult(false, response.data.message);
      }
    } catch (error) {
      showResult(false, 'Xatolik yuz berdi');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDisableMaintenance = async () => {
    if (!code) {
      showResult(false, 'Kodni kiriting');
      return;
    }

    setActionLoading(true);
    try {
      const response = await api.post('/maintenance/disable', { code });
      
      if (response.data.success) {
        showResult(true, response.data.message);
        fetchStatus();
        setCode('');
      } else {
        showResult(false, response.data.message);
      }
    } catch (error) {
      showResult(false, 'Xatolik yuz berdi');
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleFeature = async (feature) => {
    if (!code) {
      showResult(false, 'Kodni kiriting');
      return;
    }

    setActionLoading(true);
    try {
      const response = await api.post(`/maintenance/toggle/${feature}`, { code });
      
      if (response.data.success) {
        showResult(true, response.data.message);
        fetchStatus();
        setCode('');
      } else {
        showResult(false, response.data.message);
      }
    } catch (error) {
      showResult(false, 'Xatolik yuz berdi');
    } finally {
      setActionLoading(false);
    }
  };

  const handleChangeCode = async () => {
    if (!code || !newCode) {
      showResult(false, 'Joriy va yangi kodni kiriting');
      return;
    }

    setActionLoading(true);
    try {
      const response = await api.post('/maintenance/change-code', {
        currentCode: code,
        newCode: newCode
      });
      
      if (response.data.success) {
        showResult(true, response.data.message);
        setCode('');
        setNewCode('');
      } else {
        showResult(false, response.data.message);
      }
    } catch (error) {
      showResult(false, 'Xatolik yuz berdi');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
                <Settings className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Texnik Rejim</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Tizim xususiyatlarini boshqarish</p>
              </div>
            </div>
            <button
              onClick={fetchStatus}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Result Alert */}
        {result && (
          <div className={`mb-6 p-4 rounded-xl border ${
            result.success 
              ? 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400' 
              : 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400'
          }`}>
            <div className="flex items-center gap-2">
              {result.success ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
              <span className="font-medium">{result.message}</span>
            </div>
          </div>
        )}

        {/* Status Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Tizim Holati</h2>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              status?.enabled 
                ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' 
                : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
            }`}>
              {status?.enabled ? 'Texnik rejimda' : 'Ishlayapti'}
            </div>
          </div>

          {status?.enabled && (
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                <div>
                  <p className="font-medium text-amber-800 dark:text-amber-200">Xabarnoma</p>
                  <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">{status.message}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Tezkor Amallar</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Enable/Disable Maintenance */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Texnik Rejim</h3>
              
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Kirish kodi"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                />
                
                <textarea
                  placeholder="Xabarnoma (ixtiyoriy)"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                />

                <div className="flex gap-3">
                  <button
                    onClick={handleEnableMaintenance}
                    disabled={actionLoading || !code}
                    className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                  >
                    {actionLoading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Power className="w-4 h-4" />
                    )}
                    Yoqish
                  </button>
                  
                  <button
                    onClick={handleDisableMaintenance}
                    disabled={actionLoading || !code}
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                  >
                    {actionLoading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <PowerOff className="w-4 h-4" />
                    )}
                    O'chirish
                  </button>
                </div>
              </div>
            </div>

            {/* Change Access Code */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Key className="w-4 h-4" />
                Kirish Kodini O'zgartirish
              </h3>
              
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Joriy kod"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                />
                
                <input
                  type="text"
                  placeholder="Yangi kod"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                />
                
                <button
                  onClick={handleChangeCode}
                  disabled={actionLoading || !code || !newCode}
                  className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {actionLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Shield className="w-4 h-4" />
                  )}
                  Kodni O'zgartirish
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Toggles */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Xususiyatlar</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {status?.features && Object.entries(status.features).map(([feature, isEnabled]) => (
              <div
                key={feature}
                className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    isEnabled 
                      ? 'bg-green-100 dark:bg-green-900/30' 
                      : 'bg-gray-100 dark:bg-gray-700'
                  }`}>
                    {isEnabled ? (
                      <Eye className="w-5 h-5 text-green-600 dark:text-green-400" />
                    ) : (
                      <EyeOff className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white capitalize">
                      {feature === 'dashboard' ? 'Bosh panel' :
                       feature === 'tasks' ? 'Vazifalar' :
                       feature === 'exams' ? 'Imtihonlar' :
                       feature === 'quizzes' ? 'Testlar' :
                       feature === 'payments' ? 'To\'lovlar' :
                       feature === 'attendance' ? 'Davomat' :
                       feature === 'market' ? 'Do\'kon' :
                       feature === 'events' ? 'Tadbirlar' :
                       feature === 'rating' ? 'Reyting' : feature}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {isEnabled ? 'Yoqilgan' : 'O\'chirilgan'}
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => handleToggleFeature(feature)}
                  disabled={actionLoading || !code}
                  className="p-2 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Zap className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
