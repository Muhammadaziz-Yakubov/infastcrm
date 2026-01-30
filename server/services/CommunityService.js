import jwt from 'jsonwebtoken';

class CommunityService {
  constructor() {
    this.onlineUsers = new Map(); // userId -> socketId
    this.userSockets = new Map(); // socketId -> userId
    this.userRoles = new Map(); // userId -> role
  }

  // User connects
  userConnected(socket, token) {
    try {
      console.log('🔐 Verifying token:', token.substring(0, 20) + '...');
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      console.log('🔐 Token decoded:', decoded);
      
      if (decoded.type !== 'student') {
        console.log('❌ Invalid token type:', decoded.type);
        socket.emit('error', { message: 'Noto\'g\'ri token turi' });
        return null;
      }

      const userId = decoded.studentId;
      console.log('🔐 Student ID:', userId);
      
      // Store mappings
      this.onlineUsers.set(userId, socket.id);
      this.userSockets.set(socket.id, userId);
      this.userRoles.set(userId, 'student'); // Default role, could be fetched from DB

      // Join community room
      socket.join('community');

      // Notify others
      socket.broadcast.to('community').emit('user_online', {
        user_id: userId,
        socket_id: socket.id
      });

      console.log(`✅ User ${userId} connected to community chat`);

      return {
        user_id: userId,
        online_users: this.getOnlineUsersList()
      };
    } catch (error) {
      console.error('❌ Token verification failed:', error);
      socket.emit('error', { message: 'Token yaroqsiz: ' + error.message });
      return null;
    }
  }

  // User disconnects
  userDisconnected(socket) {
    const userId = this.userSockets.get(socket.id);
    
    if (userId) {
      // Remove from mappings
      this.onlineUsers.delete(userId);
      this.userSockets.delete(socket.id);
      this.userRoles.delete(userId);

      // Notify others
      socket.broadcast.to('community').emit('user_offline', {
        user_id: userId
      });

      console.log(`❌ User ${userId} disconnected from community chat`);
    }
  }

  // Send message to all users
  sendMessage(socket, messageData) {
    const userId = this.userSockets.get(socket.id);
    
    if (!userId) {
      socket.emit('error', { message: 'Avtorizatsiya talab etiladi' });
      return;
    }

    const message = {
      ...messageData,
      student_id: userId,
      created_at: new Date().toISOString(),
      temp_id: Date.now() // Temporary ID for real-time updates
    };

    // Broadcast to all users in community room
    socket.broadcast.to('community').emit('new_message', message);
    
    // Also send back to sender
    socket.emit('message_sent', message);

    console.log(`💬 User ${userId} sent message: ${message.message.substring(0, 50)}...`);
    
    return message;
  }

  // Get online users list
  getOnlineUsersList() {
    return Array.from(this.onlineUsers.entries()).map(([userId, socketId]) => ({
      _id: userId,
      socket_id: socketId,
      role: this.userRoles.get(userId) || 'student',
      online_at: new Date().toISOString()
    }));
  }

  // Get online users count
  getOnlineUsersCount() {
    return this.onlineUsers.size;
  }

  // Check if user is online
  isUserOnline(userId) {
    return this.onlineUsers.has(userId);
  }

  // Get user socket by ID
  getUserSocket(userId) {
    const socketId = this.onlineUsers.get(userId);
    return socketId ? { id: socketId } : null;
  }

  // Send typing indicator
  sendTypingIndicator(socket, isTyping) {
    const userId = this.userSockets.get(socket.id);
    
    if (userId) {
      socket.broadcast.to('community').emit('user_typing', {
        user_id: userId,
        is_typing: isTyping
      });
    }
  }

  // Send message reaction
  sendReaction(socket, messageId, emoji) {
    const userId = this.userSockets.get(socket.id);
    
    if (userId) {
      const reaction = {
        message_id: messageId,
        user_id: userId,
        emoji: emoji,
        created_at: new Date().toISOString()
      };

      socket.broadcast.to('community').emit('message_reaction', reaction);
      socket.emit('reaction_added', reaction);
    }
  }

  // Handle message deletion
  deleteMessage(socket, messageId) {
    const userId = this.userSockets.get(socket.id);
    
    if (userId) {
      socket.broadcast.to('community').emit('message_deleted', {
        message_id: messageId,
        deleted_by: userId,
        deleted_at: new Date().toISOString()
      });
    }
  }

  // Get community statistics
  getStats() {
    return {
      online_users: this.getOnlineUsersCount(),
      total_connections: this.userSockets.size,
      active_rooms: ['community']
    };
  }
}

// Singleton instance
export const communityService = new CommunityService();
export default communityService;
