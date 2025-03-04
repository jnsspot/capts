<template>
    <div class="messages-page">
      <div class="header">
        <button class="back-button" @click="$emit('navigate', 'HomePage')">
          <ChevronLeft size="22" />
        </button>
        <h1>Messages</h1>
        <div class="header-buttons">
          <button class="icon-button">
            <Search size="18" />
          </button>
          <button class="icon-button profile-icon">
            <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Profile" />
          </button>
        </div>
      </div>
      
      <div class="content">
        <div class="tabs">
          <button 
            class="tab-button" 
            :class="{ active: activeTab === 'all' }"
            @click="activeTab = 'all'"
          >
            All
          </button>
          <button 
            class="tab-button" 
            :class="{ active: activeTab === 'farmers' }"
            @click="activeTab = 'farmers'"
          >
            Farmers
          </button>
          <button 
            class="tab-button" 
            :class="{ active: activeTab === 'support' }"
            @click="activeTab = 'support'"
          >
            Support
          </button>
        </div>
        
        <div v-if="filteredMessages.length === 0" class="empty-state">
          <div class="empty-icon">
            <MessageCircle size="60" />
          </div>
          <h2>No messages yet</h2>
          <p>Your conversations with farmers and support will appear here</p>
        </div>
        
        <div v-else class="messages-list">
          <div 
            class="message-item" 
            v-for="(message, index) in filteredMessages" 
            :key="index"
            @click="openChat(message)"
          >
            <div class="message-avatar">
              <img :src="message.avatar" :alt="message.name">
              <div class="status-dot" :class="{ online: message.online }"></div>
            </div>
            <div class="message-content">
              <div class="message-header">
                <h3>{{ message.name }}</h3>
                <span class="message-time">{{ message.time }}</span>
              </div>
              <p class="message-preview">{{ message.lastMessage }}</p>
            </div>
            <div class="message-indicators">
              <div v-if="message.unread" class="unread-badge">{{ message.unread }}</div>
              <CheckCheck v-if="message.read" size="16" class="read-indicator" />
            </div>
          </div>
        </div>
      </div>
      
      <div v-if="selectedChat" class="chat-window">
        <div class="chat-header">
          <button class="back-button" @click="selectedChat = null">
            <ChevronLeft size="22" />
          </button>
          <div class="chat-user">
            <div class="chat-avatar">
              <img :src="selectedChat.avatar" :alt="selectedChat.name">
              <div class="status-dot" :class="{ online: selectedChat.online }"></div>
            </div>
            <div>
              <h3>{{ selectedChat.name }}</h3>
              <p v-if="selectedChat.online">Online</p>
              <p v-else>Offline</p>
            </div>
          </div>
          <button class="icon-button">
            <MoreVertical size="18" />
          </button>
        </div>
        
        <div class="chat-messages">
          <div 
            v-for="(msg, index) in chatMessages" 
            :key="index" 
            class="chat-message"
            :class="{ 'outgoing': msg.outgoing }"
          >
            <div class="message-bubble">
              {{ msg.text }}
            </div>
            <div class="message-time">
              {{ msg.time }}
              <CheckCheck v-if="msg.outgoing" size="12" class="message-status" :class="{ 'read': msg.read }" />
            </div>
          </div>
        </div>
        
        <div class="chat-input">
          <button class="attachment-button">
            <Paperclip size="18" />
          </button>
          <input type="text" placeholder="Type a message..." v-model="newMessage">
          <button class="send-button" @click="sendMessage">
            <Send size="18" />
          </button>
        </div>
      </div>
      
      <bottom-navigation active-tab="messages" @navigate="$emit('navigate', $event)" />
    </div>
  </template>
  
  <script>
  import BottomNavigation from '@/components/BottomNavigation.vue';
  import { 
    ChevronLeft, 
    Search, 
    MessageCircle, 
    CheckCheck, 
    MoreVertical,
    Paperclip,
    Send
  } from 'lucide-vue-next';
  import { ref, computed } from 'vue';
  
  export default {
    components: {
      BottomNavigation,
      ChevronLeft,
      Search,
      MessageCircle,
      CheckCheck,
      MoreVertical,
      Paperclip,
      Send
    },
    setup() {
      const activeTab = ref('all');
      const selectedChat = ref(null);
      const newMessage = ref('');
      const chatMessages = ref([
        {
          text: "Hello! I'm interested in your organic vegetables. Do you have any fresh lettuce available?",
          time: "10:30 AM",
          outgoing: true,
          read: true
        },
        {
          text: "Yes, we have fresh lettuce harvested this morning! Would you like to order some?",
          time: "10:35 AM",
          outgoing: false,
          read: true
        },
        {
          text: "Great! I'd like to order 2 kg of lettuce. When can you deliver?",
          time: "10:38 AM",
          outgoing: true,
          read: true
        },
        {
          text: "We can deliver tomorrow morning between 8-10 AM. Is that okay?",
          time: "10:40 AM",
          outgoing: false,
          read: true
        },
        {
          text: "That works perfectly. Thank you!",
          time: "10:42 AM",
          outgoing: true,
          read: false
        }
      ]);
      
      const messages = ref([
        {
          id: 1,
          name: "Batangas Organic Farms",
          avatar: "https://randomuser.me/api/portraits/men/45.jpg",
          lastMessage: "We can deliver tomorrow morning between 8-10 AM. Is that okay?",
          time: "10:40 AM",
          unread: 0,
          read: true,
          online: true,
          type: "farmers"
        },
        {
          id: 2,
          name: "Baguio Fresh Produce",
          avatar: "https://randomuser.me/api/portraits/women/22.jpg",
          lastMessage: "Your order #12345 has been shipped and will arrive tomorrow.",
          time: "Yesterday",
          unread: 2,
          read: false,
          online: false,
          type: "farmers"
        },
        {
          id: 3,
          name: "Customer Support",
          avatar: "https://randomuser.me/api/portraits/women/68.jpg",
          lastMessage: "Thank you for contacting support. How can we help you today?",
          time: "2 days ago",
          unread: 0,
          read: true,
          online: true,
          type: "support"
        }
      ]);
      
      const filteredMessages = computed(() => {
        if (activeTab.value === 'all') {
          return messages.value;
        } else {
          return messages.value.filter(msg => msg.type === activeTab.value);
        }
      });
      
      const openChat = (message) => {
        selectedChat.value = message;
      };
      
      const sendMessage = () => {
        if (!newMessage.value.trim()) return;
        
        chatMessages.value.push({
          text: newMessage.value,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          outgoing: true,
          read: false
        });
        
        newMessage.value = '';
        
        // Simulate reply after 1 second
        setTimeout(() => {
          chatMessages.value.push({
            text: "Thanks for your message! I'll get back to you shortly.",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            outgoing: false,
            read: true
          });
        }, 1000);
      };
      
      return {
        activeTab,
        messages,
        filteredMessages,
        selectedChat,
        chatMessages,
        newMessage,
        openChat,
        sendMessage
      };
    }
  }
  </script>
  
  <style scoped>
  .messages-page {
    height: 100%;
    display: flex;
    flex-direction: column;
    padding-bottom: 80px;
    position: relative;
  }
  
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 15px;
    background-color: #2e5c31;
    color: white;
  }
  
  .back-button {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
  }
  
  .header h1 {
    font-size: 18px;
    font-weight: 600;
  }
  
  .header-buttons {
    display: flex;
    gap: 8px;
  }
  
  .icon-button {
    width: 40px;
    height: 40px;
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    overflow: hidden;
  }
  
  .profile-icon img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .content {
    flex: 1;
    padding: 20px 15px;
    background-color: #f5f5f5;
    overflow-y: auto;
  }
  
  .tabs {
    display: flex;
    background-color: white;
    border-radius: 10px;
    margin-bottom: 20px;
    overflow: hidden;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  }
  
  .tab-button {
    flex: 1;
    padding: 15px 0;
    text-align: center;
    font-size: 14px;
    font-weight: 600;
    color: #666;
    background: none;
    border: none;
    transition: all 0.2s ease;
  }
  
  .tab-button.active {
    color: #2e5c31;
    background-color: rgba(46, 92, 49, 0.1);
  }
  
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 50px 20px;
  }
  
  .empty-icon {
    color: #ccc;
    margin-bottom: 20px;
  }
  
  .empty-state h2 {
    font-size: 18px;
    margin-bottom: 10px;
    color: #333;
  }
  
  .empty-state p {
    font-size: 14px;
    color: #666;
    margin-bottom: 30px;
  }
  
  .messages-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  
  .message-item {
    display: flex;
    align-items: center;
    background-color: white;
    border-radius: 10px;
    padding: 15px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .message-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }
  
  .message-avatar {
    position: relative;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    overflow: hidden;
    margin-right: 15px;
  }
  
  .message-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .status-dot {
    position: absolute;
    bottom: 2px;
    right: 2px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: #ccc;
    border: 2px solid white;
  }
  
  .status-dot.online {
    background-color: #4CAF50;
  }
  
  .message-content {
    flex: 1;
  }
  
  .message-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px;
  }
  
  .message-header h3 {
    font-size: 14px;
    font-weight: 600;
    color: #333;
  }
  
  .message-time {
    font-size: 12px;
    color: #999;
  }
  
  .message-preview {
    font-size: 13px;
    color: #666;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 200px;
  }
  
  .message-indicators {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-left: 10px;
  }
  
  .unread-badge {
    background-color: #2e5c31;
    color: white;
    font-size: 10px;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
  }
  
  .read-indicator {
    color: #2e5c31;
  }
  
  /* Chat Window */
  .chat-window {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: white;
    z-index: 100;
    display: flex;
    flex-direction: column;
  }
  
  .chat-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px;
    background-color: #2e5c31;
    color: white;
  }
  
  .chat-user {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .chat-avatar {
    position: relative;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
  }
  
  .chat-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .chat-user h3 {
    font-size: 16px;
    font-weight: 600;
    margin: 0;
  }
  
  .chat-user p {
    font-size: 12px;
    margin: 0;
    opacity: 0.8;
  }
  
  .chat-messages {
    flex: 1;
    padding: 15px;
    background-color: #f5f5f5;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  
  .chat-message {
    display: flex;
    flex-direction: column;
    max-width: 70%;
    align-self: flex-start;
  }
  
  .chat-message.outgoing {
    align-self: flex-end;
  }
  
  .message-bubble {
    background-color: white;
    padding: 12px 15px;
    border-radius: 15px;
    border-top-left-radius: 5px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    font-size: 14px;
    color: #333;
  }
  
  .chat-message.outgoing .message-bubble {
    background-color: #e1f5e1;
    border-top-left-radius: 15px;
    border-top-right-radius: 5px;
  }
  
  .message-time {
    font-size: 11px;
    color: #999;
    margin-top: 5px;
    display: flex;
    align-items: center;
    gap: 5px;
  }
  
  .message-status {
    color: #ccc;
  }
  
  .message-status.read {
    color: #2e5c31;
  }
  
  .chat-input {
    display: flex;
    align-items: center;
    padding: 10px 15px;
    background-color: white;
    border-top: 1px solid #eee;
  }
  
  .attachment-button {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #666;
    background: none;
  }
  
  .chat-input input {
    flex: 1;
    padding: 10px 15px;
    border: 1px solid #ddd;
    border-radius: 20px;
    font-size: 14px;
    margin: 0 10px;
  }
  
  .send-button {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #2e5c31;
    color: white;
  }
  </style>