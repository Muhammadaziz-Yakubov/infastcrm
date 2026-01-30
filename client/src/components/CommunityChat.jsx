import { useState, useEffect, useRef } from 'react';
import { Send, Users, MessageCircle, Zap, Flame, Sparkles, Crown, Shield, Star, Heart, Laugh, ThumbsUp, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import api from '../utils/api';
import { io } from 'socket.io-client';

export default function CommunityChat() {
  const { student } = useAuth();
  const { darkMode } = useTheme();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initialize Socket.io connection
    const token = localStorage.getItem('studentToken');
    if (!token) {
      console.error('No student token found');
      setLoading(false);
      return;
    }

    const newSocket = io('/community', {
      auth: {
        token: token
      },
      transports: ['websocket', 'polling']
    });

    newSocket.on('connect', () => {
      console.log('Connected to community chat');
      setConnected(true);
      newSocket.emit('authenticate', token);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from community chat');
      setConnected(false);
    });

    newSocket.on('authenticated', (data) => {
      console.log('Authenticated to community chat:', data);
      setOnlineUsers(data.online_users || []);
    });

    newSocket.on('recent_messages', (data) => {
      setMessages(data.messages || []);
      setLoading(false);
    });

    newSocket.on('new_message', (message) => {
      setMessages(prev => [message, ...prev]);
    });

    newSocket.on('message_sent', (message) => {
      setMessages(prev => [message, ...prev]);
    });

    newSocket.on('user_online', (data) => {
      setOnlineUsers(prev => [...prev.filter(u => u._id !== data.user_id), {
        _id: data.user_id,
        socket_id: data.socket_id,
        full_name: 'Online User',
        role: 'student'
      }]);
    });

    newSocket.on('user_offline', (data) => {
      setOnlineUsers(prev => prev.filter(u => u._id !== data.user_id));
    });

    newSocket.on('user_typing', (data) => {
      // Handle typing indicator
      console.log('User typing:', data);
    });

    newSocket.on('error', (error) => {
      console.error('Socket error:', error);
      // Fallback to HTTP polling
      fetchMessages();
      fetchOnlineUsers();
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await api.get('/community/messages');
      setMessages(response.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Xatolik:', error);
      // 401 xatolikda logout qilmaslik uchun
      if (error.response?.status !== 401) {
        setLoading(false);
      }
    }
  };

  const fetchOnlineUsers = async () => {
    try {
      const response = await api.get('/community/online-users');
      setOnlineUsers(response.data || []);
    } catch (error) {
      console.error('Online users xatolik:', error);
      // 401 xatolikda logout qilmaslik uchun
      if (error.response?.status !== 401) {
        // Hech narsa qilmaslik, faqat console log
      }
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setSending(true);
    
    try {
      if (socket && connected) {
        // Send via Socket.io for real-time
        socket.emit('send_message', {
          message: newMessage.trim(),
          type: 'text'
        });
        setNewMessage('');
      } else {
        // Fallback to HTTP
        const response = await api.post('/community/messages', {
          message: newMessage.trim(),
          type: 'text'
        });
        
        setMessages(prev => [response.data, ...prev]);
        setNewMessage('');
      }
    } catch (error) {
      console.error('Xatolik:', error);
      // 401 xatolikda alert ko'rsatmaslik
      if (error.response?.status !== 401) {
        alert('Xabar yuborishda xatolik yuz berdi');
      }
    } finally {
      setSending(false);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin': return <Crown className="text-yellow-500" size={16} />;
      case 'moderator': return <Shield className="text-blue-500" size={16} />;
      case 'vip': return <Star className="text-purple-500" size={16} />;
      default: return <Users className="text-gray-500" size={16} />;
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin': return 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white';
      case 'moderator': return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white';
      case 'vip': return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
      default: return 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-200px)]">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-800 dark:to-indigo-800 p-4 rounded-t-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <MessageCircle className="text-white" size={28} />
              <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full animate-pulse ${
                connected ? 'bg-green-400' : 'bg-red-400'
              }`}></div>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">InFast Community</h2>
              <p className="text-purple-100 text-sm">
                {connected ? 'Real-time suhbat' : 'Connecting...'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
              <span className="text-white text-sm font-medium">
                <Flame className="inline mr-1" size={16} />
                {onlineUsers.length} online
              </span>
            </div>
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
              connected 
                ? 'bg-green-500/20 text-green-100 border border-green-400/30' 
                : 'bg-red-500/20 text-red-100 border border-red-400/30'
            }`}>
              {connected ? '🟢 Connected' : '🔴 Offline'}
            </div>
          </div>
        </div>
      </div>

      {/* Online Users */}
      {onlineUsers.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-800 p-3 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 overflow-x-auto">
            <span className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">Online:</span>
            {onlineUsers.map((user, index) => (
              <div key={index} className="flex items-center gap-1 bg-white dark:bg-gray-700 px-2 py-1 rounded-full border border-gray-200 dark:border-gray-600">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{user.full_name}</span>
                {getRoleIcon(user.role)}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-900 p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-500 dark:text-gray-400">Hozircha xabarlar yo'q</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Suhbatni boshlang! 🚀</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 ${
                message.student_id === student?.id ? 'flex-row-reverse' : ''
              }`}
            >
              <div className="flex-shrink-0">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  message.student_id === student?.id 
                    ? 'bg-gradient-to-br from-purple-500 to-indigo-500' 
                    : 'bg-gradient-to-br from-gray-400 to-gray-600'
                }`}>
                  {message.student_id === student?.id ? (
                    <span className="text-white font-bold text-sm">
                      {student?.full_name?.charAt(0)?.toUpperCase()}
                    </span>
                  ) : (
                    <Users className="text-white" size={20} />
                  )}
                </div>
              </div>
              
              <div className={`flex-1 max-w-xs lg:max-w-md ${
                message.student_id === student?.id ? 'text-right' : ''
              }`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-gray-900 dark:text-white text-sm">
                    {message.student_id === student?.id ? student?.full_name : message.student_name}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getRoleBadge(message.role)}`}>
                    {message.role || 'student'}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatTime(message.created_at)}
                  </span>
                </div>
                
                <div className={`p-3 rounded-2xl ${
                  message.student_id === student?.id
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                }`}>
                  <p className="text-sm break-words">{message.message}</p>
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={sendMessage} className="bg-gray-50 dark:bg-gray-800 p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Xabaringizni yozing..."
              className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              disabled={sending}
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
              <button
                type="button"
                className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                title="Emoji"
              >
                <Laugh className="text-gray-500 dark:text-gray-400" size={18} />
              </button>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={sending || !newMessage.trim()}
            className="px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {sending ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Send size={18} />
            )}
          </button>
        </div>
        
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <Zap className="text-yellow-500" size={14} />
              Tezkor suhbat
            </span>
            <span className="flex items-center gap-1">
              <Sparkles className="text-purple-500" size={14} />
              Real-time
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              title="Qoidalarni ko'rish"
            >
              <AlertCircle className="text-gray-500 dark:text-gray-400" size={14} />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
