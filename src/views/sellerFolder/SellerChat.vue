<template>
    <div class="app-container">
      <Sidebar />
      
      <div class="chat-container">
        <div class="header">
          <h1>Messages</h1>
          <div class="header-actions">
            <button class="action-button">
              <Filter size="18" />
              <span>Filter</span>
            </button>
            <button class="action-button">
              <Search size="18" />
              <span>Search</span>
            </button>
          </div>
        </div>
        
        <div class="content">
          <div class="conversations-panel">
            <div class="panel-header">
              <h2>Conversations</h2>
              <span class="conversation-count">{{ filteredConversations.length }}</span>
            </div>
            
            <div class="tabs">
              <button 
                v-for="tab in tabs" 
                :key="tab.id"
                class="tab-button" 
                :class="{ active: activeTab === tab.id }"
                @click="activeTab = tab.id"
              >
                {{ tab.name }}
                <span v-if="tab.count" class="tab-count">{{ tab.count }}</span>
              </button>
            </div>
            
            <div class="search-box">
              <Search size="16" class="search-icon" />
              <input 
                type="text" 
                placeholder="Search conversations..." 
                v-model="searchQuery"
              />
            </div>
            
            <div class="conversations-list">
              <div 
                v-for="conversation in filteredConversations" 
                :key="conversation.id"
                class="conversation-item"
                :class="{ active: selectedConversationId === conversation.id }"
                @click="selectConversation(conversation)"
              >
                <div class="conversation-avatar">
                  <img :src="conversation.customerAvatar" :alt="conversation.customerName">
                  <div class="status-dot" :class="{ online: conversation.customerOnline }"></div>
                </div>
                <div class="conversation-content">
                  <div class="conversation-header">
                    <h3>{{ conversation.customerName }}</h3>
                    <span class="conversation-time">{{ formatTime(conversation.lastMessageTime) }}</span>
                  </div>
                  <p class="conversation-preview">{{ conversation.lastMessage }}</p>
                  <div class="conversation-meta">
                    <span v-if="conversation.orderId" class="order-badge">
                      Order #{{ conversation.orderId }}
                    </span>
                  </div>
                </div>
                <div class="conversation-indicators">
                  <div v-if="conversation.unreadCount > 0" class="unread-badge">{{ conversation.unreadCount }}</div>
                </div>
              </div>
              
              <div v-if="filteredConversations.length === 0" class="empty-state">
                <MessageSquare size="40" />
                <p>No conversations found</p>
              </div>
            </div>
          </div>
          
          <div class="chat-panel" v-if="selectedConversation">
            <div class="chat-header">
              <div class="chat-user">
                <div class="chat-avatar">
                  <img :src="selectedConversation.customerAvatar" :alt="selectedConversation.customerName">
                  <div class="status-dot" :class="{ online: selectedConversation.customerOnline }"></div>
                </div>
                <div class="chat-user-info">
                  <h3>{{ selectedConversation.customerName }}</h3>
                  <div class="chat-user-meta">
                    <span v-if="selectedConversation.customerOnline" class="online-status">Online</span>
                    <span v-else class="offline-status">Last seen recently</span>
                    <span v-if="selectedConversation.orderId" class="order-number">
                      Order #{{ selectedConversation.orderId }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="chat-actions">
                <button class="icon-button">
                  <Phone size="18" />
                </button>
                <button class="icon-button">
                  <UserPlus size="18" />
                </button>
                <button class="icon-button">
                  <MoreVertical size="18" />
                </button>
              </div>
            </div>
            
            <div class="chat-messages" ref="messagesContainer">
              <div class="date-separator">
                <span>{{ currentDate }}</span>
              </div>
              
              <div 
                v-for="(message, index) in chatMessages" 
                :key="index"
                class="chat-message"
                :class="{ 
                  'outgoing': message.senderType === 'seller',
                  'incoming': message.senderType === 'customer',
                  'system': message.senderType === 'system'
                }"
              >
                <div v-if="message.senderType === 'system'" class="system-message">
                  {{ message.text }}
                </div>
                <template v-else>
                  <div class="message-bubble">
                    <div v-if="message.productInfo" class="product-preview">
                      <img :src="message.productInfo.image" :alt="message.productInfo.name">
                      <div class="product-details">
                        <h4>{{ message.productInfo.name }}</h4>
                        <p>₱{{ message.productInfo.price }}</p>
                      </div>
                    </div>
                    <div v-if="message.orderInfo" class="order-preview">
                      <div class="order-header">
                        <ShoppingBag size="16" />
                        <span>Order #{{ message.orderInfo.id }}</span>
                      </div>
                      <div class="order-details">
                        <p>{{ message.orderInfo.items }} items • ₱{{ message.orderInfo.total }}</p>
                        <span :class="'order-status-' + message.orderInfo.status.toLowerCase()">
                          {{ message.orderInfo.status }}
                        </span>
                      </div>
                    </div>
                    <p>{{ message.text }}</p>
                  </div>
                  <div class="message-time">
                    {{ formatMessageTime(message.timestamp) }}
                    <CheckCheck 
                      v-if="message.senderType === 'seller'" 
                      size="14" 
                      class="message-status" 
                      :class="{ 'read': message.read }" 
                    />
                  </div>
                </template>
              </div>
            </div>
            
            <div class="quick-replies" v-if="quickReplies.length > 0">
              <button 
                v-for="(reply, index) in quickReplies" 
                :key="index"
                class="quick-reply-button"
                @click="sendQuickReply(reply)"
              >
                {{ reply }}
              </button>
            </div>
            
            <div class="chat-input">
              <div class="input-actions">
                <button class="icon-button">
                  <Paperclip size="18" />
                </button>
                <button class="icon-button">
                  <Image size="18" />
                </button>
                <button class="icon-button">
                  <Tag size="18" />
                </button>
              </div>
              <div class="input-container">
                <textarea 
                  v-model="newMessage" 
                  placeholder="Type a message..." 
                  @keydown.enter.prevent="sendMessage"
                  rows="1"
                  ref="messageInput"
                ></textarea>
                <button class="send-button" @click="sendMessage" :disabled="!newMessage.trim()">
                  <Send size="18" />
                </button>
              </div>
            </div>
          </div>
          
          <div class="empty-chat" v-else>
            <div class="empty-chat-content">
              <MessageSquare size="60" />
              <h2>Select a conversation</h2>
              <p>Choose a conversation from the list to start chatting</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue';
  import { 
    Search, 
    Filter, 
    MessageSquare, 
    MoreVertical, 
    Phone, 
    UserPlus, 
    Paperclip, 
    Image, 
    Tag, 
    Send, 
    CheckCheck,
    ShoppingBag
  } from 'lucide-vue-next';
  import Sidebar from '@/components/Sidebar.vue';
  import { db } from '@/firebase/firebaseConfig';
  import { collection, query, where, orderBy, onSnapshot, doc, addDoc, updateDoc, serverTimestamp, getDoc } from 'firebase/firestore';
  import { getAuth } from 'firebase/auth';
  
  // Firebase auth
  const auth = getAuth();
  const sellerId = auth.currentUser?.uid;
  
  // State
  const activeTab = ref('all');
  const searchQuery = ref('');
  const selectedConversationId = ref(null);
  const selectedConversation = ref(null);
  const newMessage = ref('');
  const messagesContainer = ref(null);
  const messageInput = ref(null);
  const conversations = ref([]);
  const chatMessages = ref([]);
  
  // Unsubscribe functions
  let conversationsUnsubscribe = null;
  let messagesUnsubscribe = null;
  
  // Tabs
  const tabs = [
    { id: 'all', name: 'All' },
    { id: 'unread', name: 'Unread' },
    { id: 'orders', name: 'Orders' },
    { id: 'support', name: 'Support' }
  ];
  
  // Quick replies
  const quickReplies = [
    "Yes, we have that in stock!",
    "We can deliver tomorrow",
    "Thank you for your order!",
    "How can I help you today?"
  ];
  
  // Current date for the chat
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Format time
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    const now = new Date();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };
  
  // Format message time
  const formatMessageTime = (timestamp) => {
    if (!timestamp) return '';
    return timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Filtered conversations based on active tab and search query
  const filteredConversations = computed(() => {
    let filtered = conversations.value;
    
    // Filter by tab
    if (activeTab.value !== 'all') {
      if (activeTab.value === 'unread') {
        filtered = filtered.filter(conv => conv.unreadCount > 0);
      } else if (activeTab.value === 'orders') {
        filtered = filtered.filter(conv => conv.orderId);
      } else if (activeTab.value === 'support') {
        // You might need to adjust this based on how you identify support conversations
        filtered = filtered.filter(conv => conv.isSupport);
      }
    }
    
    // Filter by search query
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      filtered = filtered.filter(conv => 
        conv.customerName.toLowerCase().includes(query) || 
        conv.lastMessage.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  });
  
  // Fetch conversations for the seller
  const fetchConversations = () => {
    const q = query(
      collection(db, 'conversations'),
      where('participants', 'array-contains', sellerId),
      orderBy('lastMessageTime', 'desc')
    );
    
    conversationsUnsubscribe = onSnapshot(q, (snapshot) => {
      conversations.value = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        customerId: doc.data().participants.find(id => id !== sellerId)
      }));
      
      // Fetch customer details for each conversation
      conversations.value.forEach(async (conv) => {
        if (!conv.customerName) {
          const customerDoc = await getDoc(doc(db, 'users', conv.customerId));
          if (customerDoc.exists()) {
            const customerData = customerDoc.data();
            conv.customerName = customerData.displayName || 'Customer';
            conv.customerAvatar = customerData.photoURL || 'https://randomuser.me/api/portraits/lego/1.jpg';
            conv.customerOnline = customerData.isOnline || false;
          }
        }
      });
    });
  };
  
 // In the selectConversation function:
 const selectConversation = async (conversation) => {
  selectedConversationId.value = conversation.id;
  selectedConversation.value = conversation;
  
  // Mark as read if needed
  if (conversation.unreadCount > 0 && conversation.lastMessageSender === 'customer') {
    await updateDoc(doc(db, 'conversations', conversation.id), {
      unreadCount: 0
    });
  }
  
  // Load messages for this conversation
  loadMessages(conversation.id);
};
    

  // Load messages for a conversation
  const loadMessages = (conversationId) => {
    if (messagesUnsubscribe) {
      messagesUnsubscribe();
    }
    
    const q = query(
      collection(db, 'conversations', conversationId, 'messages'),
      orderBy('timestamp', 'asc')
    );
    
    messagesUnsubscribe = onSnapshot(q, (snapshot) => {
      chatMessages.value = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Scroll to bottom
      scrollToBottom();
    });
  };
  
  // Send a message
  const sendMessage = async () => {
  if (!newMessage.value.trim() || !selectedConversationId.value) return;
  
  const message = {
    senderId: sellerId,
    senderType: 'seller',
    text: newMessage.value,
    timestamp: serverTimestamp(),
    read: false
  };
  
  // Add message to Firestore
  await addDoc(
    collection(db, 'conversations', selectedConversationId.value, 'messages'),
    message
  );
  
  // Update conversation last message
  await updateDoc(doc(db, 'conversations', selectedConversationId.value), {
    lastMessage: newMessage.value,
    lastMessageTime: serverTimestamp(),
    lastMessageSender: 'seller',
    unreadCount: 1 // Customer has unread message
  });
  
  newMessage.value = '';
};
  
  // Send a quick reply
  const sendQuickReply = (reply) => {
    newMessage.value = reply;
    sendMessage();
  };
  
  // Scroll to bottom of messages
  const scrollToBottom = () => {
    nextTick(() => {
      if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
      }
    });
  };
  
  // Auto-resize textarea
  const resizeTextarea = () => {
    if (messageInput.value) {
      messageInput.value.style.height = 'auto';
      messageInput.value.style.height = messageInput.value.scrollHeight + 'px';
    }
  };
  
  // Watch for changes to newMessage to resize textarea
  watch(newMessage, () => {
    resizeTextarea();
  });
  
  // Initialize on mount
  onMounted(() => {
    if (sellerId) {
      fetchConversations();
    }
    scrollToBottom();
  });
  
  // Clean up on unmount
  onUnmounted(() => {
    if (conversationsUnsubscribe) {
      conversationsUnsubscribe();
    }
    if (messagesUnsubscribe) {
      messagesUnsubscribe();
    }
  });
  </script>
  
  <style scoped>
  .app-container {
    display: flex;
    height: 100vh;
    width: 100%;
    overflow: hidden;
  }
  
  .chat-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
    margin-left: 230px; /* Match sidebar width */
  }
  
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px 20px;
    background-color: #ffffff;
    border-bottom: 1px solid #e0e0e0;
    height: 70px;
  }
  
  .header h1 {
    font-size: 20px;
    font-weight: 600;
    color: #333;
    margin: 0;
  }
  
  .header-actions {
    display: flex;
    gap: 10px;
  }
  
  .action-button {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 8px 12px;
    border-radius: 6px;
    background-color: #f5f5f5;
    color: #555;
    font-size: 14px;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .action-button:hover {
    background-color: #e8e8e8;
  }
  
  .content {
    display: flex;
    flex: 1;
    overflow: hidden;
  }
  
  .conversations-panel {
    width: 320px;
    border-right: 1px solid #e0e0e0;
    display: flex;
    flex-direction: column;
    background-color: #f9f9f9;
  }
  
  .panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px;
    border-bottom: 1px solid #e0e0e0;
  }
  
  .panel-header h2 {
    font-size: 16px;
    font-weight: 600;
    margin: 0;
    color: #333;
  }
  
  .conversation-count {
    background-color: #2e5c31;
    color: white;
    font-size: 12px;
    padding: 2px 8px;
    border-radius: 10px;
    font-weight: 500;
  }
  
  .tabs {
    display: flex;
    padding: 10px;
    gap: 5px;
    border-bottom: 1px solid #e0e0e0;
    overflow-x: auto;
  }
  
  .tab-button {
    padding: 8px 12px;
    border-radius: 15px;
    background: none;
    border: none;
    font-size: 13px;
    color: #666;
    cursor: pointer;
    white-space: nowrap;
    display: flex;
    align-items: center;
    gap: 5px;
    transition: all 0.2s ease;
  }
  
  .tab-button.active {
    background-color: #2e5c31;
    color: white;
  }
  
  .tab-count {
    background-color: rgba(255, 255, 255, 0.2);
    padding: 1px 6px;
    border-radius: 10px;
    font-size: 11px;
  }
  
  .tab-button:not(.active) .tab-count {
    background-color: #e0e0e0;
    color: #666;
  }
  
  .search-box {
    padding: 10px;
    position: relative;
  }
  
  .search-icon {
    position: absolute;
    left: 20px;
    top: 50%;
    transform: translateY(-50%);
    color: #999;
  }
  
  .search-box input {
    width: 100%;
    padding: 10px 10px 10px 35px;
    border-radius: 20px;
    border: 1px solid #e0e0e0;
    font-size: 13px;
    background-color: white;
  }
  
  .conversations-list {
    flex: 1;
    overflow-y: auto;
    padding: 10px;
  }
  
  .conversation-item {
    display: flex;
    padding: 12px;
    border-radius: 8px;
    margin-bottom: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    background-color: white;
    border: 1px solid transparent;
  }
  
  .conversation-item:hover {
    background-color: #f0f0f0;
  }
  
  .conversation-item.active {
    background-color: #e8f3e8;
    border-color: #2e5c31;
  }
  
  .conversation-avatar {
    position: relative;
    width: 45px;
    height: 45px;
    border-radius: 50%;
    overflow: hidden;
    margin-right: 12px;
  }
  
  .conversation-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .status-dot {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: #ccc;
    border: 2px solid white;
  }
  
  .status-dot.online {
    background-color: #4CAF50;
  }
  
  .conversation-content {
    flex: 1;
    min-width: 0;
  }
  
  .conversation-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 3px;
  }
  
  .conversation-header h3 {
    font-size: 14px;
    font-weight: 600;
    margin: 0;
    color: #333;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .conversation-time {
    font-size: 12px;
    color: #999;
    white-space: nowrap;
  }
  
  .conversation-preview {
    font-size: 13px;
    color: #666;
    margin: 0 0 5px 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .conversation-meta {
    display: flex;
    gap: 5px;
  }
  
  .order-badge, .product-badge {
    font-size: 11px;
    padding: 2px 6px;
    border-radius: 4px;
    background-color: #f0f0f0;
    color: #666;
  }
  
  .order-badge {
    background-color: #e8f3e8;
    color: #2e5c31;
  }
  
  .conversation-indicators {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-left: 8px;
    gap: 5px;
  }
  
  .unread-badge {
    background-color: #2e5c31;
    color: white;
    font-size: 11px;
    min-width: 18px;
    height: 18px;
    border-radius: 9px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 5px;
  }
  
  .priority-indicator {
    font-size: 10px;
    padding: 2px 5px;
    border-radius: 3px;
    text-transform: uppercase;
    font-weight: 600;
  }
  
  .priority-indicator.high {
    background-color: #ffebee;
    color: #d32f2f;
  }
  
  .priority-indicator.medium {
    background-color: #fff8e1;
    color: #ffa000;
  }
  
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 30px;
    color: #999;
    text-align: center;
  }
  
  .chat-panel {
    flex: 1;
    display: flex;
    flex-direction: column;
    background-color: white;
  }
  
  .chat-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px 20px;
    border-bottom: 1px solid #e0e0e0;
    background-color: white;
  }
  
  .chat-user {
    display: flex;
    align-items: center;
  }
  
  .chat-avatar {
    position: relative;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
    margin-right: 12px;
  }
  
  .chat-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .chat-user-info h3 {
    font-size: 16px;
    font-weight: 600;
    margin: 0 0 3px 0;
    color: #333;
  }
  
  .chat-user-meta {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 12px;
    color: #666;
  }
  
  .online-status {
    color: #4CAF50;
  }
  
  .offline-status {
    color: #999;
  }
  
  .order-number {
    background-color: #e8f3e8;
    color: #2e5c31;
    padding: 2px 6px;
    border-radius: 4px;
  }
  
  .chat-actions {
    display: flex;
    gap: 8px;
  }
  
  .icon-button {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f5f5f5;
    color: #555;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .icon-button:hover {
    background-color: #e8e8e8;
  }
  
  .chat-messages {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
    background-color: #f9f9f9;
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  
  .date-separator {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 10px 0;
  }
  
  .date-separator span {
    background-color: #e8e8e8;
    padding: 5px 10px;
    border-radius: 10px;
    font-size: 12px;
    color: #666;
  }
  
  .chat-message {
    display: flex;
    flex-direction: column;
    max-width: 70%;
  }
  
  .chat-message.incoming {
    align-self: flex-start;
  }
  
  .chat-message.outgoing {
    align-self: flex-end;
  }
  
  .chat-message.system {
    align-self: center;
    max-width: 80%;
  }
  
  .system-message {
    background-color: #f0f0f0;
    padding: 8px 12px;
    border-radius: 10px;
    font-size: 12px;
    color: #666;
    text-align: center;
  }
  
  .message-bubble {
    padding: 12px 15px;
    border-radius: 15px;
    font-size: 14px;
    color: #333;
    background-color: white;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }
  
  .chat-message.incoming .message-bubble {
    border-top-left-radius: 5px;
    background-color: white;
  }
  
  .chat-message.outgoing .message-bubble {
    border-top-right-radius: 5px;
    background-color: #e8f3e8;
    color: #333;
  }
  
  .product-preview {
    display: flex;
    gap: 10px;
    padding: 10px;
    background-color: #f9f9f9;
    border-radius: 8px;
    margin-bottom: 10px;
  }
  
  .product-preview img {
    width: 50px;
    height: 50px;
    border-radius: 5px;
    object-fit: cover;
  }
  
  .product-details h4 {
    font-size: 14px;
    margin: 0 0 3px 0;
  }
  
  .product-details p {
    font-size: 13px;
    margin: 0;
    color: #2e5c31;
    font-weight: 600;
  }
  
  .order-preview {
    background-color: #f9f9f9;
    border-radius: 8px;
    padding: 10px;
    margin-bottom: 10px;
  }
  
  .order-header {
    display: flex;
    align-items: center;
    gap: 5px;
    margin-bottom: 5px;
    font-weight: 600;
    font-size: 13px;
  }
  
  .order-details {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
  }
  
  .order-status-processing {
    color: #ff9800;
    font-weight: 600;
  }
  
  .order-status-shipped {
    color: #2196F3;
    font-weight: 600;
  }
  
  .order-status-delivered {
    color: #4CAF50;
    font-weight: 600;
  }
  
  .message-time {
    font-size: 11px;
    color: #999;
    margin-top: 5px;
    align-self: flex-end;
    display: flex;
    align-items: center;
    gap: 4px;
  }
  
  .message-status {
    color: #ccc;
  }
  
  .message-status.read {
    color: #2e5c31;
  }
  
  .quick-replies {
    display: flex;
    gap: 8px;
    padding: 10px 20px;
    overflow-x: auto;
    background-color: white;
    border-top: 1px solid #e0e0e0;
  }
  
  .quick-reply-button {
    white-space: nowrap;
    padding: 8px 12px;
    border-radius: 15px;
    background-color: #f0f0f0;
    color: #333;
    font-size: 13px;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .quick-reply-button:hover {
    background-color: #e0e0e0;
  }
  
  .chat-input {
    padding: 15px 20px;
    background-color: white;
    border-top: 1px solid #e0e0e0;
  }
  
  .input-actions {
    display: flex;
    gap: 8px;
    margin-bottom: 10px;
  }
  
  .input-container {
    display: flex;
    align-items: flex-end;
    gap: 10px;
    background-color: #f5f5f5;
    border-radius: 20px;
    padding: 8px 15px;
  }
  
  .input-container textarea {
    flex: 1;
    border: none;
    background: none;
    resize: none;
    max-height: 100px;
    font-size: 14px;
    padding: 5px 0;
    outline: none;
    font-family: inherit;
  }
  
  .send-button {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #2e5c31;
    color: white;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .send-button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
  
  .empty-chat {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f9f9f9;
  }
  
  .empty-chat-content {
    text-align: center;
    color: #999;
    padding: 20px;
  }
  
  .empty-chat-content h2 {
    font-size: 18px;
    margin: 15px 0 5px 0;
    color: #666;
  }
  
  .empty-chat-content p {
    font-size: 14px;
    margin: 0;
  }
  
  /* Dark mode support */
  :root.dark .chat-container {
    background-color: #1a1a1a;
  }
  
  :root.dark .header,
  :root.dark .chat-header {
    background-color: #222;
    border-color: #333;
  }
  
  :root.dark .header h1,
  :root.dark .chat-user-info h3 {
    color: #fff;
  }
  
  :root.dark .action-button,
  :root.dark .icon-button {
    background-color: #333;
    color: #ccc;
  }
  
  :root.dark .action-button:hover,
  :root.dark .icon-button:hover {
    background-color: #444;
  }
  
  :root.dark .conversations-panel {
    background-color: #222;
    border-color: #333;
  }
  
  :root.dark .panel-header {
    border-color: #333;
  }
  
  :root.dark .panel-header h2 {
    color: #fff;
  }
  
  :root.dark .tab-button {
    color: #ccc;
  }
  
  :root.dark .tab-button:not(.active) .tab-count {
    background-color: #444;
    color: #ccc;
  }
  
  :root.dark .search-box input {
    background-color: #333;
    border-color: #444;
    color: #fff;
  }
  
  :root.dark .conversation-item {
    background-color: #2a2a2a;
  }
  
  :root.dark .conversation-item:hover {
    background-color: #333;
  }
  
  :root.dark .conversation-item.active {
    background-color: #2e3c2f;
    border-color: #4a8f4d;
  }
  
  :root.dark .conversation-header h3 {
    color: #fff;
  }
  
  :root.dark .conversation-preview {
    color: #ccc;
  }
  
  :root.dark .order-badge {
    background-color: #2e3c2f;
    color: #8bc34a;
  }
  
  :root.dark .product-badge {
    background-color: #333;
    color: #ccc;
  }
  
  :root.dark .chat-messages {
    background-color: #1a1a1a;
  }
  
  :root.dark .date-separator span {
    background-color: #333;
    color: #ccc;
  }
  
  :root.dark .system-message {
    background-color: #333;
    color: #ccc;
  }
  
  :root.dark .message-bubble {
    background-color: #2a2a2a;
    color: #eee;
  }
  
  :root.dark .chat-message.outgoing .message-bubble {
    background-color: #2e3c2f;
    color: #eee;
  }
  
  :root.dark .product-preview,
  :root.dark .order-preview {
    background-color: #333;
  }
  
  :root.dark .quick-reply-button {
    background-color: #333;
    color: #ccc;
  }
  
  :root.dark .quick-reply-button:hover {
    background-color: #444;
  }
  
  :root.dark .input-container {
    background-color: #333;
  }
  
  :root.dark .input-container textarea {
    color: #fff;
  }
  
  :root.dark .empty-chat {
    background-color: #1a1a1a;
  }
  
  :root.dark .empty-chat-content h2 {
    color: #ccc;
  }
  </style>