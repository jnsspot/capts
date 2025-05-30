<template>
    <div class="dashboard-container">
      <Sidebar initialActiveItem="Chat" />
      
      <div class="main-content">
        <header class="header">
          <div class="page-title">
            <h1>Chat</h1>
            <p>Communicate with your customers and team members</p>
          </div>
        </header>
  
        <div class="chat-container">
          <div class="chat-sidebar">
            <div class="chat-search">
              <div class="search-box">
                <Search size="18" class="search-icon" />
                <input type="text" placeholder="Search conversations..." v-model="searchQuery" />
              </div>
            </div>
            
            <div class="chat-tabs">
              <button 
                class="chat-tab" 
                :class="{ active: activeTab === 'customers' }"
                @click="setActiveTab('customers')"
              >
                Customers
              </button>
              <button 
                class="chat-tab" 
                :class="{ active: activeTab === 'team' }"
                @click="setActiveTab('team')"
              >
                Team
              </button>
            </div>
            
            <div v-if="loadingConversations" class="loading-state">
              <p>Loading conversations...</p>
            </div>
            
            <div v-else-if="filteredConversations.length === 0" class="empty-state">
              <div class="empty-icon">
                <MessageSquare size="48" />
              </div>
              <h2>No conversations yet</h2>
              <p>Your conversations with customers will appear here</p>
            </div>
            
            <div v-else class="conversation-list">
              <div 
                v-for="conversation in filteredConversations" 
                :key="conversation.id"
                class="conversation-item"
                :class="{ active: activeConversation === conversation.id }"
                @click="setActiveConversation(conversation.id)"
              >
                <div class="conversation-avatar">
                  <img :src="conversation.avatar" :alt="`${conversation.name}'s avatar`" />
                  <div class="status-indicator" :class="conversation.status"></div>
                </div>
                <div class="conversation-info">
                  <div class="conversation-header">
                    <h3>{{ conversation.name }}</h3>
                    <span class="conversation-time">{{ formatTime(conversation.lastMessageTime) }}</span>
                  </div>
                  <p class="conversation-preview">{{ conversation.lastMessage }}</p>
                </div>
                <div v-if="conversation.unread" class="unread-badge">{{ conversation.unread }}</div>
              </div>
            </div>
          </div>
          
          <div class="chat-main">
            <div v-if="currentConversation" class="chat-header">
              <div class="chat-contact">
                <div class="contact-avatar">
                  <img :src="currentConversation.avatar" :alt="`${currentConversation.name}'s avatar`" />
                  <div class="status-indicator" :class="currentConversation.status"></div>
                </div>
                <div class="contact-info">
                  <h3>{{ currentConversation.name }}</h3>
                  <p>{{ currentConversation.status === 'online' ? 'Online' : 'Offline' }}</p>
                </div>
              </div>
              <div class="chat-actions">
                <button class="action-icon">
                  <Phone size="18" />
                </button>
                <button class="action-icon">
                  <Video size="18" />
                </button>
                <button class="action-icon">
                  <MoreVertical size="18" />
                </button>
              </div>
            </div>
            
            <div v-if="currentConversation" class="chat-messages">
              <div 
                v-for="message in chatMessages" 
                :key="message.id"
                :class="['message', message.senderId === currentSellerId ? 'outgoing' : 'incoming']"
              >
                <div v-if="message.senderId !== currentSellerId" class="message-avatar">
                  <img :src="currentConversation.avatar" :alt="`${currentConversation.name}'s avatar`" />
                </div>
                <div class="message-content">
                  <div class="message-bubble">
                    {{ message.text }}
                  </div>
                  <div class="message-time">{{ formatTime(message.timestamp) }}</div>
                </div>
              </div>
            </div>
            
            <div v-if="currentConversation" class="chat-input">
              <button class="input-action">
                <Paperclip size="18" />
              </button>
              <input 
                type="text" 
                placeholder="Type a message..." 
                v-model="newMessage"
                @keyup.enter="sendMessage"
                :disabled="sendingMessage"
              />
              <button class="input-action">
                <Smile size="18" />
              </button>
              <button class="send-button" @click="sendMessage" :disabled="!newMessage.trim() || sendingMessage">
                <Send size="18" />
              </button>
            </div>
            
            <div v-if="!currentConversation" class="no-conversation">
              <div class="no-conversation-icon">
                <MessageSquare size="48" />
              </div>
              <h2>Select a conversation</h2>
              <p>Choose a conversation from the list to start chatting</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, onUnmounted } from 'vue';
  import Sidebar from '@/components/Sidebar.vue';
  import { 
    Search, 
    Phone, 
    Video, 
    MoreVertical, 
    Paperclip, 
    Smile, 
    Send,
    MessageSquare
  } from 'lucide-vue-next';
  import { 
    collection, 
    query, 
    where, 
    orderBy, 
    onSnapshot, 
    doc, 
    addDoc, 
    updateDoc, 
    serverTimestamp,
    getDoc,
    setDoc
  } from "firebase/firestore";
  import { db, auth } from "@/firebase/firebaseConfig";
  
  const searchQuery = ref('');
  const activeTab = ref('customers');
  const activeConversation = ref(null);
  const newMessage = ref('');
  const conversations = ref([]);
  const chatMessages = ref([]);
  const loadingConversations = ref(true);
  const sendingMessage = ref(false);
  
  // Get current seller ID
  const currentSellerId = auth.currentUser?.uid;
  
  // Fetch conversations for the seller
  const fetchConversations = () => {
    const q = query(
      collection(db, "conversations"),
      where("participants", "array-contains", currentSellerId),
      orderBy("lastMessageTime", "desc")
    );
  
    return onSnapshot(q, async (snapshot) => {
      const convs = [];
      
      for (const doc of snapshot.docs) {
        const data = doc.data();
        const customerId = data.participants.find(id => id !== currentSellerId);
        
        // Get customer details
        const customerDoc = await getDoc(doc(db, "users", customerId));
        const customerData = customerDoc.data() || {};
        
        convs.push({
          id: doc.id,
          name: `${customerData.firstName || ''} ${customerData.lastName || ''}`.trim() || 'Customer',
          avatar: customerData.photoURL || "https://randomuser.me/api/portraits/lego/1.jpg",
          status: customerData.isOnline ? 'online' : 'offline',
          lastMessage: data.lastMessage,
          lastMessageTime: data.lastMessageTime,
          unread: data.unreadCount || 0,
          type: 'customer',
          customerId: customerId
        });
      }
      
      conversations.value = convs;
      loadingConversations.value = false;
    });
  };
  
  const filteredConversations = computed(() => {
    return conversations.value.filter(conversation => 
      (activeTab.value === 'customers' ? conversation.type === 'customer' : conversation.type === 'team') &&
      conversation.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  });
  
  const currentConversation = computed(() => {
    return conversations.value.find(conversation => conversation.id === activeConversation.value);
  });
  
  const setActiveTab = (tab) => {
    activeTab.value = tab;
    activeConversation.value = null;
  };
  
  const setActiveConversation = async (id) => {
    activeConversation.value = id;
    const conversation = conversations.value.find(c => c.id === id);
    
    if (conversation && conversation.unread > 0) {
      // Mark as read
      await updateDoc(doc(db, "conversations", id), {
        unreadCount: 0
      });
      conversation.unread = 0;
    }
    
    // Load messages
    loadMessages(id);
  };
  
  const loadMessages = (conversationId) => {
    const q = query(
      collection(db, "conversations", conversationId, "messages"),
      orderBy("timestamp", "asc")
    );
    
    return onSnapshot(q, (snapshot) => {
      chatMessages.value = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      scrollToBottom();
    });
  };
  
  const sendMessage = async () => {
    if (!newMessage.value.trim() || !currentConversation.value || sendingMessage.value) return;
    
    sendingMessage.value = true;
    const message = {
      senderId: currentSellerId,
      text: newMessage.value,
      timestamp: serverTimestamp(),
      read: false
    };
    
    try {
      // Add message to Firestore
      await addDoc(
        collection(db, "conversations", currentConversation.value.id, "messages"),
        message
      );
      
      // Update conversation last message
      await updateDoc(doc(db, "conversations", currentConversation.value.id), {
        lastMessage: newMessage.value,
        lastMessageTime: serverTimestamp(),
        lastMessageSender: "seller",
        unreadCount: 1 // Customer has unread message
      });
      
      newMessage.value = "";
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      sendingMessage.value = false;
    }
  };
  
  const scrollToBottom = () => {
    const messagesContainer = document.querySelector('.chat-messages');
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  };
  
  let conversationsUnsubscribe = null;
  let messagesUnsubscribe = null;
  
  onMounted(() => {
    conversationsUnsubscribe = fetchConversations();
  });
  
  onUnmounted(() => {
    if (conversationsUnsubscribe) {
      conversationsUnsubscribe();
    }
    if (messagesUnsubscribe) {
      messagesUnsubscribe();
    }
  });
  
  // Add this function to format timestamps
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
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
  </script>
  
  <style scoped>
  .dashboard-container {
    display: flex;
    min-height: 100vh;
    background-color: #f9fafb;
  }
  
  .main-content {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
  }
  
  .header {
    margin-bottom: 20px;
  }
  
  .page-title h1 {
    font-size: 1.5rem;
    font-weight: 700;
    color: #111827;
    margin: 0 0 5px 0;
  }
  
  .page-title p {
    font-size: 0.9rem;
    color: #6b7280;
    margin: 0;
  }
  
  .chat-container {
    display: flex;
    height: calc(100vh - 140px);
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }
  
  .chat-sidebar {
    width: 300px;
    border-right: 1px solid #e5e7eb;
    display: flex;
    flex-direction: column;
  }
  
  .chat-search {
    padding: 15px;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .search-box {
    display: flex;
    align-items: center;
    background-color: #f3f4f6;
    border-radius: 20px;
    padding: 8px 16px;
    width: 100%;
  }
  
  .search-icon {
    color: #9ca3af;
    margin-right: 8px;
  }
  
  .search-box input {
    border: none;
    outline: none;
    background-color: transparent;
    width: 100%;
    font-size: 0.9rem;
  }
  
  .chat-tabs {
    display: flex;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .chat-tab {
    flex: 1;
    padding: 12px;
    text-align: center;
    background: none;
    border: none;
    font-size: 0.9rem;
    color: #6b7280;
    cursor: pointer;
    position: relative;
  }
  
  .chat-tab.active {
    color: #2e5c31;
    font-weight: 500;
  }
  
  .chat-tab.active::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: #2e5c31;
  }
  
  .conversation-list {
    flex: 1;
    overflow-y: auto;
  }
  
  .conversation-item {
    display: flex;
    align-items: center;
    padding: 15px;
    border-bottom: 1px solid #e5e7eb;
    cursor: pointer;
    transition: background-color 0.2s;
    position: relative;
  }
  
  .conversation-item:hover {
    background-color: #f9fafb;
  }
  
  .conversation-item.active {
    background-color: #f3f4f6;
  }
  
  .conversation-avatar {
    position: relative;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
    margin-right: 12px;
  }
  
  .conversation-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .status-indicator {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    border: 2px solid #ffffff;
  }
  
  .status-indicator.online {
    background-color: #10b981;
  }
  
  .status-indicator.offline {
    background-color: #9ca3af;
  }
  
  .conversation-info {
    flex: 1;
    min-width: 0;
  }
  
  .conversation-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 4px;
  }
  
  .conversation-header h3 {
    font-size: 0.95rem;
    font-weight: 600;
    color: #111827;
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .conversation-time {
    font-size: 0.75rem;
    color: #6b7280;
  }
  
  .conversation-preview {
    font-size: 0.85rem;
    color: #6b7280;
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .unread-badge {
    background-color: #2e5c31;
    color: #ffffff;
    font-size: 0.75rem;
    font-weight: 600;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .chat-main {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  
  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .chat-contact {
    display: flex;
    align-items: center;
  }
  
  .contact-avatar {
    position: relative;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
    margin-right: 12px;
  }
  
  .contact-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .contact-info h3 {
    font-size: 1rem;
    font-weight: 600;
    color: #111827;
    margin: 0 0 2px 0;
  }
  
  .contact-info p {
    font-size: 0.8rem;
    color: #6b7280;
    margin: 0;
  }
  
  .chat-actions {
    display: flex;
    gap: 10px;
  }
  
  .action-icon {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    color: #6b7280;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .action-icon:hover {
    background-color: #f3f4f6;
    color: #111827;
  }
  
  .chat-messages {
    flex: 1;
    padding: 15px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  
  .message {
    display: flex;
    gap: 10px;
    max-width: 70%;
  }
  
  .message.incoming {
    align-self: flex-start;
  }
  
  .message.outgoing {
    align-self: flex-end;
    flex-direction: row-reverse;
  }
  
  .message-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    overflow: hidden;
  }
  
  .message-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .message-content {
    display: flex;
    flex-direction: column;
  }
  
  .message-bubble {
    padding: 10px 15px;
    border-radius: 18px;
    font-size: 0.9rem;
    line-height: 1.4;
  }
  
  .incoming .message-bubble {
    background-color: #f3f4f6;
    color: #111827;
    border-bottom-left-radius: 4px;
  }
  
  .outgoing .message-bubble {
    background-color: #2e5c31;
    color: #ffffff;
    border-bottom-right-radius: 4px;
  }
  
  .message-time {
    font-size: 0.75rem;
    color: #6b7280;
    margin-top: 4px;
    align-self: flex-end;
  }
  
  .chat-input {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 15px;
    border-top: 1px solid #e5e7eb;
  }
  
  .input-action {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    color: #6b7280;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .input-action:hover {
    background-color: #f3f4f6;
    color: #111827;
  }
  
  .chat-input input {
    flex: 1;
    padding: 10px 15px;
    border: 1px solid #e5e7eb;
    border-radius: 20px;
    font-size: 0.9rem;
    outline: none;
  }
  
  .chat-input input:focus {
    border-color: #2e5c31;
  }
  
  .send-button {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #2e5c31;
    border: none;
    color: #ffffff;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .send-button:hover {
    background-color: #26492a;
  }
  
  .no-conversation {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #6b7280;
    padding: 20px;
    text-align: center;
  }
  
  .no-conversation-icon {
    margin-bottom: 15px;
    color: #9ca3af;
  }
  
  .no-conversation h2 {
    font-size: 1.2rem;
    font-weight: 600;
    color: #111827;
    margin: 0 0 10px 0;
  }
  
  .no-conversation p {
    font-size: 0.9rem;
    margin: 0;
  }
  
  /* Dark mode styles */
  :global(.dark) .main-content {
    background-color: #111827;
  }
  
  :global(.dark) .chat-container {
    background-color: #1f2937;
  }
  
  :global(.dark) .chat-sidebar,
  :global(.dark) .chat-header,
  :global(.dark) .chat-input {
    border-color: #374151;
  }
  
  :global(.dark) .chat-tabs,
  :global(.dark) .conversation-item {
    border-color: #374151;
  }
  
  :global(.dark) .page-title h1,
  :global(.dark) .conversation-header h3,
  :global(.dark) .contact-info h3,
  :global(.dark) .no-conversation h2 {
    color: #f9fafb;
  }
  
  :global(.dark) .page-title p,
  :global(.dark) .chat-tab,
  :global(.dark) .conversation-preview,
  :global(.dark) .conversation-time,
  :global(.dark) .contact-info p,
  :global(.dark) .message-time,
  :global(.dark) .no-conversation p {
    color: #9ca3af;
  }
  
  :global(.dark) .search-box,
  :global(.dark) .conversation-item:hover,
  :global(.dark) .conversation-item.active,
  :global(.dark) .action-icon:hover,
  :global(.dark) .input-action:hover {
    background-color: #374151;
  }
  
  :global(.dark) .chat-tab.active {
    color: #4a8f4d;
  }
  
  :global(.dark) .chat-tab.active::after {
    background-color: #4a8f4d;
  }
  
  :global(.dark) .incoming .message-bubble {
    background-color: #374151;
    color: #e5e7eb;
  }
  
  :global(.dark) .outgoing .message-bubble {
    background-color: #4a8f4d;
  }
  
  :global(.dark) .chat-input input {
    background-color: #374151;
    border-color: #4b5563;
    color: #e5e7eb;
  }
  
  :global(.dark) .chat-input input:focus {
    border-color: #4a8f4d;
  }
  
  :global(.dark) .send-button {
    background-color: #4a8f4d;
  }
  
  :global(.dark) .send-button:hover {
    background-color: #3e7b40;
  }
  
  .loading-state {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100px;
    color: #6b7280;
  }
  
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 20px;
    text-align: center;
    color: #6b7280;
  }
  
  .empty-state h2 {
    margin: 15px 0 5px;
    color: #111827;
  }
  
  .empty-state p {
    margin: 0;
    font-size: 0.9rem;
  }
  
  .empty-icon {
    color: #9ca3af;
    margin-bottom: 10px;
  }
  </style>
  
  