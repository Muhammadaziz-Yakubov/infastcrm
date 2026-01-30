import jwt from 'jsonwebtoken';
import communityService from '../services/CommunityService.js';
import Message from '../models/Message.js';

export const setupCommunitySocket = (io) => {
  console.log('🔥 Setting up Community Socket.io handlers...');

  // Create namespace with CORS
  const communityNamespace = io.of('/community');
  
  communityNamespace.on('connection', (socket) => {
    console.log(`🔌 New community socket connection: ${socket.id}`);

    // Authenticate user
    socket.on('authenticate', (token) => {
      try {
        const result = communityService.userConnected(socket, token);
        
        if (result) {
          // Send initial data
          socket.emit('authenticated', {
            user_id: result.user_id,
            online_users: result.online_users,
            message: 'Community chatga muvaffaqiyatli ulandingiz!'
          });

          // Send recent messages
          loadRecentMessages(socket);
        }
      } catch (error) {
        console.error('Authentication error:', error);
        socket.emit('error', { message: 'Avtorizatsiya xatolik' });
      }
    });

    // Send message
    socket.on('send_message', async (data) => {
      try {
        const { message, type = 'text', reply_to } = data;
        
        if (!message || !message.trim()) {
          socket.emit('error', { message: 'Xabar bo\'sh bo\'lishi mumkin emas' });
          return;
        }

        // Get user info from token
        const token = socket.handshake.auth.token;
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        
        if (decoded.type !== 'student') {
          socket.emit('error', { message: 'Noto\'g\'ri token turi' });
          return;
        }

        // Create message in database
        const newMessage = new Message({
          student_id: decoded.studentId,
          student_name: 'Loading...', // Will be populated
          message: message.trim(),
          type: type,
          role: 'student',
          reply_to: reply_to || null
        });

        await newMessage.save();
        await newMessage.populate('student_id', 'full_name profile_image');
        if (reply_to) {
          await newMessage.populate('reply_to', 'message student_name');
        }

        // Broadcast to all users
        const messageData = {
          _id: newMessage._id,
          student_id: newMessage.student_id._id,
          student_name: newMessage.student_id.full_name,
          profile_image: newMessage.student_id.profile_image,
          message: newMessage.message,
          type: newMessage.type,
          role: newMessage.role,
          reply_to: newMessage.reply_to,
          created_at: newMessage.created_at,
          reactions: []
        };

        communityNamespace.emit('new_message', messageData);
        
        // Also send back to sender
        socket.emit('message_sent', messageData);
      } catch (error) {
        console.error('Send message error:', error);
        socket.emit('error', { message: 'Xabar yuborishda xatolik' });
      }
    });

    // Typing indicator
    socket.on('typing', (isTyping) => {
      socket.broadcast.to('community').emit('user_typing', {
        user_id: communityService.userSockets.get(socket.id),
        is_typing: isTyping
      });
    });

    // Add reaction
    socket.on('add_reaction', async (data) => {
      try {
        const { messageId, emoji } = data;
        
        const message = await Message.findById(messageId);
        if (!message) {
          socket.emit('error', { message: 'Xabar topilmadi' });
          return;
        }

        const token = socket.handshake.auth.token;
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        
        await message.addReaction(decoded.studentId, emoji);
        
        const reaction = {
          message_id: messageId,
          user_id: decoded.studentId,
          emoji: emoji,
          created_at: new Date().toISOString()
        };

        socket.broadcast.to('community').emit('message_reaction', reaction);
        socket.emit('reaction_added', reaction);
      } catch (error) {
        console.error('Reaction error:', error);
        socket.emit('error', { message: 'Reaksiya qo\'shishda xatolik' });
      }
    });

    // Delete message
    socket.on('delete_message', async (messageId) => {
      try {
        const token = socket.handshake.auth.token;
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        
        const message = await Message.findById(messageId);
        if (!message) {
          socket.emit('error', { message: 'Xabar topilmadi' });
          return;
        }

        // Check if user owns the message
        if (message.student_id.toString() !== decoded.studentId.toString()) {
          socket.emit('error', { message: 'Ruxsat berilmagan' });
          return;
        }

        message.is_deleted = true;
        await message.save();
        
        socket.broadcast.to('community').emit('message_deleted', {
          message_id: messageId,
          deleted_by: decoded.studentId,
          deleted_at: new Date().toISOString()
        });
      } catch (error) {
        console.error('Delete message error:', error);
        socket.emit('error', { message: 'Xabarni o\'chirishda xatolik' });
      }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      communityService.userDisconnected(socket);
      console.log(`🔌 Community socket disconnected: ${socket.id}`);
    });

    // Handle errors
    socket.on('error', (error) => {
      console.error(`Community socket error for ${socket.id}:`, error);
    });
  });

  // Helper function to load recent messages
  async function loadRecentMessages(socket) {
    try {
      const messages = await Message.getRecentMessages(50);
      const reversedMessages = messages.reverse(); // Show newest first
      
      socket.emit('recent_messages', {
        messages: reversedMessages.map(msg => ({
          _id: msg._id,
          student_id: msg.student_id._id,
          student_name: msg.student_id.full_name,
          profile_image: msg.student_id.profile_image,
          message: msg.message,
          type: msg.type,
          role: msg.role,
          reply_to: msg.reply_to,
          created_at: msg.created_at,
          reactions: msg.reactions || []
        }))
      });
    } catch (error) {
      console.error('Load recent messages error:', error);
      socket.emit('error', { message: 'Xabarlar yuklashda xatolik' });
    }
  }

  console.log('✅ Community Socket.io handlers setup complete!');
};

export default setupCommunitySocket;
