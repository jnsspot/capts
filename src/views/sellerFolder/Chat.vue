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
            
            <div class="conversation-list">
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
                    <span class="conversation-time">{{ conversation.lastMessageTime }}</span>
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
                v-for="(message, index) in currentConversation.messages" 
                :key="index"
                :class="['message', message.sender === 'me' ? 'outgoing' : 'incoming']"
              >
                <div v-if="message.sender !== 'me'" class="message-avatar">
                  <img :src="currentConversation.avatar" :alt="`${currentConversation.name}'s avatar`" />
                </div>
                <div class="message-content">
                  <div class="message-bubble">
                    {{ message.text }}
                  </div>
                  <div class="message-time">{{ message.time }}</div>
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
              />
              <button class="input-action">
                <Smile size="18" />
              </button>
              <button class="send-button" @click="sendMessage">
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
  import { ref, computed } from 'vue';
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
  
  const searchQuery = ref('');
  const activeTab = ref('customers');
  const activeConversation = ref(null);
  const newMessage = ref('');
  
  const conversations = ref([
    {
      id: 1,
      name: 'John Doe',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      status: 'online',
      lastMessage: "I'd like to place an order for next week",
      lastMessageTime: '10:30 AM',
      unread: 2,
      type: 'customer',
      messages: [
        {
          sender: 'other',
          lastMessage: "I'd like to place an order for next week",
          time: '10:15 AM'
        },
        {
          sender: 'me',
          text: 'Hi John! Thanks for your interest. We have fresh organic tomatoes available right now.',
          time: '10:20 AM'
        },
        {
          sender: 'other',
          lastMessage: "I'd like to place an order for next week",
          time: '10:30 AM'
        }
      ]
    },
    {
      id: 2,
      name: 'Jane Smith',
      avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
      status: 'offline',
      lastMessage: 'Thanks for the quick delivery!',
      lastMessageTime: 'Yesterday',
      unread: 0,
      type: 'customer',
      messages: [
        {
          sender: 'other',
          text: 'I received my order today.',
          time: 'Yesterday, 2:15 PM'
        },
        {
          sender: 'me',
          time: 'Yesterday, 2:20 PM'
        },
        {
          sender: 'other',
          text: 'Thanks for the quick delivery!',
          time: 'Yesterday, 2:25 PM'
        }
      ]
    },
    {
      id: 3,
      name: 'Mike Johnson',
      avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
      status: 'online',
      lastMessage: 'We need to restock carrots',
      lastMessageTime: '2:45 PM',
      unread: 1,
      type: 'team',
      messages: [
        {
          sender: 'other',
          text: 'Hey, just checking our inventory.',
          time: '2:30 PM'
        },
        {
          sender: 'me',
          text: 'How are we looking?',
          time: '2:35 PM'
        },
        {
          sender: 'other',
          text: 'We need to restock carrots',
          time: '2:45 PM'
        }
      ]
    },
    {
      id: 4,
      name: 'Sarah Wilson',
      avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
      status: 'offline',
      lastMessage: 'The new organic certification is ready',
      lastMessageTime: 'Monday',
      unread: 0,
      type: 'team',
      messages: [
        {
          sender: 'other',
          text: "I'd like to place an order for next week",
          time: 'Monday, 11:15 AM'
        },
        {
          sender: 'me',
          text:"I'd like to place an order for next week",
          time: 'Monday, 11:20 AM'
        },
        {
          sender: 'other',
          text: 'The new organic certification is ready',
          time: 'Monday, 11:30 AM'
        }
      ]
    },
    {
      id: 5,
      name: 'David Brown',
      avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
      status: 'online',
      lastMessage: 'Do you have any lettuce available?',
      lastMessageTime: '9:15 AM',
      unread: 0,
      type: 'customer',
      messages: [
        {
          sender: 'other',
          text: 'Good morning!',
          time: '9:10 AM'
        },
        {
          sender: 'me',
          text: 'Good morning, David! How can I help you today?',
          time: '9:12 AM'
        },
        {
          sender: 'other',
          text: 'Do you have any lettuce available?',
          time: '9:15 AM'
        }
      ]
    }
  ]);
  
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
  
  const setActiveConversation = (id) => {
    activeConversation.value = id;
    // Mark as read when opening conversation
    const conversation = conversations.value.find(c => c.id === id);
    if (conversation) {
      conversation.unread = 0;
    }
  };
  
  const sendMessage = () => {
    if (!newMessage.value.trim() || !currentConversation.value) return;
    
    currentConversation.value.messages.push({
      sender: 'me',
      text: newMessage.value,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    
    currentConversation.value.lastMessage = newMessage.value;
    currentConversation.value.lastMessageTime = 'Just now';
    
    newMessage.value = '';
    
    // Simulate reply after 1-3 seconds
    if (Math.random() > 0.5) {
      setTimeout(() => {
        currentConversation.value.messages.push({
          sender: 'other',
          text: "I'd like to place an order for next week",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
        
        currentConversation.value.lastMessage = "I'd like to place an order for next week",
        currentConversation.value.lastMessageTime = 'Just now';
      }, 1000 + Math.random() * 2000);
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
  </style>
  
  