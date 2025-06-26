import { View, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { CustomText as Text } from '../../components/CustomText';

// Navigation types
type GroupStackParamList = {
  Groups: undefined;
  GroupDetail: {
    groupId: string;
    groupName: string;
    groupAvatar: string;
  };
};

type GroupDetailNavigationProp = StackNavigationProp<GroupStackParamList, 'GroupDetail'>;
type GroupDetailRouteProp = RouteProp<GroupStackParamList, 'GroupDetail'>;

// Data types
type ChatMessage = {
  id: string;
  type: 'text' | 'drop';
  user: string;
  userAvatar: string;
  timestamp: Date;
  content?: string; // for text messages
  drop?: GroupDrop; // for meme drops
  isOwn?: boolean; // if it's from the current user
};

type GroupDrop = {
  id: string;
  creator: string;
  creatorAvatar: string;
  thumbnail: string;
  caption: string;
  votes: number;
  comments: number;
  shares: number;
  timestamp: Date;
  hasVoted: boolean;
  type: 'image' | 'video';
  isPinned?: boolean;
};

type GroupMember = {
  id: string;
  username: string;
  avatar: string;
  role: 'owner' | 'admin' | 'member';
  totalDrops: number;
  weeklyScore: number;
  isOnline?: boolean;
};

type Comment = {
  id: string;
  user: string;
  userAvatar: string;
  text: string;
  timestamp: Date;
  reactions?: string[];
};

// Mock data
const mockDrops: GroupDrop[] = [
  {
    id: '1',
    creator: '@codemaster',
    creatorAvatar: '👨‍💻',
    thumbnail: 'https://picsum.photos/300/400?random=1',
    caption: 'When the deployment actually works on the first try 🎉',
    votes: 23,
    comments: 8,
    shares: 3,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    hasVoted: false,
    type: 'video',
    isPinned: true,
  },
  {
    id: '2',
    creator: '@debugqueen',
    creatorAvatar: '👩‍💻',
    thumbnail: 'https://picsum.photos/300/400?random=2',
    caption: 'Me explaining why I need 3 monitors for "productivity"',
    votes: 19,
    comments: 12,
    shares: 5,
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    hasVoted: true,
    type: 'image',
  },
  {
    id: '3',
    creator: '@frontendwiz',
    creatorAvatar: '🎨',
    thumbnail: 'https://picsum.photos/300/400?random=3',
    caption: 'CSS: "It works on my machine" 🤷‍♂️',
    votes: 15,
    comments: 6,
    shares: 2,
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    hasVoted: false,
    type: 'video',
  },
];

const mockMembers: GroupMember[] = [
  {
    id: '1',
    username: 'codemaster',
    avatar: '👨‍💻',
    role: 'owner',
    totalDrops: 45,
    weeklyScore: 234,
    isOnline: true,
  },
  {
    id: '2',
    username: 'debugqueen',
    avatar: '👩‍💻',
    role: 'admin',
    totalDrops: 32,
    weeklyScore: 189,
    isOnline: false,
  },
  {
    id: '3',
    username: 'frontendwiz',
    avatar: '🎨',
    role: 'member',
    totalDrops: 28,
    weeklyScore: 156,
    isOnline: true,
  },
];

// Utility functions
const formatNumber = (num: number): string => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

const formatTimeAgo = (date: Date) => {
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours}h ago`;
  return `${Math.floor(diffInHours / 24)}d ago`;
};

const getRoleBadgeColor = (role: string) => {
  switch (role) {
    case 'owner': return 'bg-yellow-600';
    case 'admin': return 'bg-blue-600';
    default: return 'bg-zinc-700';
  }
};

export default function GroupDetail() {
  const navigation = useNavigation<GroupDetailNavigationProp>();
  const route = useRoute<GroupDetailRouteProp>();
  
  // Get the passed parameters
  const { groupId, groupName, groupAvatar } = route.params;
  
  const [activeTab, setActiveTab] = useState<'feed' | 'leaderboard' | 'members'>('feed');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'text',
      user: '@codemaster',
      userAvatar: '👨‍💻',
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
      content: 'Good morning devs! Ready for another day of debugging? 😅',
      isOwn: false,
    },
    {
      id: '2',
      type: 'drop',
      user: '@codemaster',
      userAvatar: '👨‍💻',
      timestamp: new Date(Date.now() - 7 * 60 * 60 * 1000),
      drop: mockDrops[0],
      isOwn: false,
    },
    {
      id: '3',
      type: 'text',
      user: '@debugqueen',
      userAvatar: '👩‍💻',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      content: 'Lmaooo this is too accurate 😂😂',
      isOwn: false,
    },
    {
      id: '4',
      type: 'text',
      user: '@you',
      userAvatar: '🚀',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      content: 'Facts! This happened to me yesterday',
      isOwn: true,
    },
    {
      id: '5',
      type: 'drop',
      user: '@debugqueen',
      userAvatar: '👩‍💻',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      drop: mockDrops[1],
      isOwn: false,
    },
    {
      id: '6',
      type: 'text',
      user: '@frontendwiz',
      userAvatar: '🎨',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      content: 'Why is this me every single day 💀',
      isOwn: false,
    },
    {
      id: '7',
      type: 'text',
      user: '@you',
      userAvatar: '🚀',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      content: 'The monitor struggle is real though',
      isOwn: true,
    },
    {
      id: '8',
      type: 'drop',
      user: '@frontendwiz',
      userAvatar: '🎨',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
      drop: mockDrops[2],
      isOwn: false,
    },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedDrop, setSelectedDrop] = useState<GroupDrop | null>(null);

  // Update groupInfo to use the passed data
  const groupInfo = {
    name: groupName,
    avatar: groupAvatar,
    description: 'Coding humor and programming fails',
    memberCount: 847,
    weeklyPosts: 23,
    isPrivate: true,
    userRole: 'admin' as const,
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: ChatMessage = {
        id: Date.now().toString(),
        type: 'text',
        user: '@you',
        userAvatar: '🚀',
        timestamp: new Date(),
        content: newMessage.trim(),
        isOwn: true,
      };
      setChatMessages(prev => [...prev, message]);
      setNewMessage('');
    }
  };

  const handleDropClick = (drop: GroupDrop) => {
    setSelectedDrop(drop);
  };

  const handleVoteInChat = (dropId: string) => {
    setChatMessages(prev => prev.map(msg => 
      msg.drop?.id === dropId && msg.drop
        ? { 
            ...msg, 
            drop: {
              ...msg.drop,
              hasVoted: !msg.drop.hasVoted,
              votes: msg.drop.hasVoted ? msg.drop.votes - 1 : msg.drop.votes + 1
            }
          }
        : msg
    ));
  };

  const ChatMessageBubble = ({ message }: { message: ChatMessage }) => {
    if (message.type === 'text') {
      return (
        <View className={`flex-row mb-3 ${message.isOwn ? 'justify-end' : 'justify-start'}`}>
          {!message.isOwn && (
            <Text className="text-lg mr-3 mt-1">{message.userAvatar}</Text>
          )}
          <View className={`max-w-[75%] ${
            message.isOwn 
              ? 'bg-blue-600 rounded-l-2xl rounded-tr-2xl rounded-br-md' 
              : 'bg-zinc-800 rounded-r-2xl rounded-tl-2xl rounded-bl-md'
          } px-4 py-3`}>
            {!message.isOwn && (
              <Text className="text-zinc-400 text-xs font-medium mb-1">{message.user}</Text>
            )}
            <Text className="text-white">{message.content}</Text>
          </View>
          {message.isOwn && (
            <Text className="text-lg ml-3 mt-1">{message.userAvatar}</Text>
          )}
        </View>
      );
    }

    // Drop message
    return (
      <View className={`mb-4 ${message.isOwn ? 'items-end' : 'items-start'}`}>
        <View className={`flex-row items-center mb-2 ${message.isOwn ? 'flex-row-reverse' : ''}`}>
          <Text className={`text-lg ${message.isOwn ? 'ml-2' : 'mr-2'}`}>{message.userAvatar}</Text>
          <Text className="text-zinc-400 text-sm font-medium">{message.user}</Text>
          <Text className="text-zinc-500 text-xs ml-2">{formatTimeAgo(message.timestamp)}</Text>
        </View>
        
        <TouchableOpacity 
          onPress={() => message.drop && handleDropClick(message.drop)}
          className={`max-w-[85%] bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 ${
            message.isOwn ? 'self-end' : 'self-start'
          }`}
        >
          <View className="relative">
            <Image 
              source={{ uri: message.drop?.thumbnail }}
              className="w-full h-48"
              resizeMode="cover"
            />
            {message.drop?.type === 'video' && (
              <View className="absolute inset-0 items-center justify-center">
                <View className="w-12 h-12 bg-black/60 rounded-full items-center justify-center">
                  <Ionicons name="play" size={20} color="white" />
                </View>
              </View>
            )}
            {message.drop?.isPinned && (
              <View className="absolute top-2 left-2 bg-yellow-600 rounded-full px-2 py-1">
                <Text className="text-white text-xs font-bold">📌</Text>
              </View>
            )}
          </View>
          
          {message.drop?.caption && (
            <View className="p-3">
              <Text className="text-white text-sm">{message.drop.caption}</Text>
            </View>
          )}
          
          <View className="flex-row items-center justify-between px-3 pb-3">
            <View className="flex-row items-center space-x-4">
              <TouchableOpacity 
                onPress={() => message.drop && handleVoteInChat(message.drop.id)}
                className="flex-row items-center"
              >
                <Ionicons 
                  name={message.drop?.hasVoted ? "arrow-up" : "arrow-up-outline"} 
                  size={20} 
                  color={message.drop?.hasVoted ? "#3b82f6" : "#71717a"} 
                />
                <Text className={`ml-1 text-sm ${message.drop?.hasVoted ? 'text-blue-400' : 'text-zinc-400'}`}>
                  {message.drop?.votes}
                </Text>
              </TouchableOpacity>
              
              <View className="flex-row items-center">
                <Ionicons name="chatbubble-outline" size={18} color="#71717a" />
                <Text className="text-zinc-400 ml-1 text-sm">{message.drop?.comments}</Text>
              </View>
            </View>
            
            <TouchableOpacity>
              <Ionicons name="ellipsis-horizontal" size={18} color="#71717a" />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const MemberCard = ({ member }: { member: GroupMember }) => (
    <View className="flex-row items-center p-4 border-b border-zinc-900/30">
      <View className="relative mr-4">
        <Text className="text-2xl">{member.avatar}</Text>
        {member.isOnline && (
          <View className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-black" />
        )}
      </View>
      
      <View className="flex-1">
        <View className="flex-row items-center mb-1">
          <Text className="text-white font-medium">@{member.username}</Text>
          <View className={`ml-2 ${getRoleBadgeColor(member.role)} rounded-full px-2 py-1`}>
            <Text className="text-white text-xs font-bold uppercase">{member.role}</Text>
          </View>
        </View>
        <View className="flex-row items-center space-x-4">
          <Text className="text-zinc-400 text-sm">{member.totalDrops} drops</Text>
          <Text className="text-zinc-400 text-sm">{member.weeklyScore} pts this week</Text>
        </View>
      </View>
      
      <TouchableOpacity>
        <Ionicons name="chevron-forward" size={20} color="#71717a" />
      </TouchableOpacity>
    </View>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'feed':
        return (
          <View className="flex-1">
            {/* Chat Messages */}
            <ScrollView 
              className="flex-1 px-4 py-4" 
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
            >
              {chatMessages.map((message) => (
                <ChatMessageBubble key={message.id} message={message} />
              ))}
            </ScrollView>
            
            {/* Message Input */}
            <View className="flex-row items-center px-4 py-3 bg-zinc-900/50 border-t border-zinc-800">
              <TextInput
                value={newMessage}
                onChangeText={setNewMessage}
                placeholder="Message Dev Memers..."
                placeholderTextColor="#71717a"
                className="flex-1 bg-zinc-800 rounded-full px-4 py-3 text-white mr-3"
                multiline
                maxLength={500}
              />
              <TouchableOpacity 
                onPress={handleSendMessage}
                className={`w-10 h-10 rounded-full items-center justify-center ${
                  newMessage.trim() ? 'bg-blue-600' : 'bg-zinc-700'
                }`}
                disabled={!newMessage.trim()}
              >
                <Ionicons 
                  name="send" 
                  size={18} 
                  color={newMessage.trim() ? 'white' : '#71717a'} 
                />
              </TouchableOpacity>
            </View>
          </View>
        );
      case 'leaderboard':
        return (
          <ScrollView className="px-6">
            <Text className="text-white text-lg font-semibold mb-4">This Week's Top Drops</Text>
            {mockDrops
              .sort((a, b) => b.votes - a.votes)
              .map((drop, index) => (
                <View key={drop.id} className="flex-row items-center p-4 bg-zinc-900/30 rounded-xl mb-3">
                  <Text className="text-white text-lg font-bold mr-4">#{index + 1}</Text>
                  <Image 
                    source={{ uri: drop.thumbnail }}
                    className="w-12 h-16 rounded-lg bg-zinc-800 mr-4"
                    resizeMode="cover"
                  />
                  <View className="flex-1">
                    <Text className="text-white font-medium" numberOfLines={1}>{drop.caption}</Text>
                    <Text className="text-zinc-400 text-sm">by {drop.creator}</Text>
                  </View>
                  <Text className="text-blue-400 font-bold">{drop.votes} votes</Text>
                </View>
              ))}
          </ScrollView>
        );
      case 'members':
        return (
          <ScrollView>
            {mockMembers.map((member) => (
              <MemberCard key={member.id} member={member} />
            ))}
          </ScrollView>
        );
    }
  };

  return (
    <View className="flex-1 bg-black">
      <SafeAreaView className="flex-1">
        {/* Header */}
        <View className="flex-row items-center px-6 py-4 border-b border-zinc-900/30">
          <TouchableOpacity 
            className="mr-4"
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <View className="flex-1">
            <View className="flex-row items-center">
              <Text className="text-2xl mr-3">{groupInfo.avatar}</Text>
              <View>
                <View className="flex-row items-center">
                  <Text className="text-white text-xl font-semibold">{groupInfo.name}</Text>
                  {groupInfo.isPrivate && (
                    <Ionicons name="lock-closed" size={16} color="#71717a" style={{ marginLeft: 8 }} />
                  )}
                </View>
                <Text className="text-zinc-400 text-sm">{formatNumber(groupInfo.memberCount)} members</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity className="ml-4">
            <Ionicons name="ellipsis-vertical" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Group Stats */}
        <View className="flex-row justify-around py-4 border-b border-zinc-900/30">
          <View className="items-center">
            <Text className="text-white text-lg font-bold">{groupInfo.weeklyPosts}</Text>
            <Text className="text-zinc-400 text-sm">This Week</Text>
          </View>
          <View className="items-center">
            <Text className="text-white text-lg font-bold">#{Math.floor(Math.random() * 10) + 1}</Text>
            <Text className="text-zinc-400 text-sm">Your Rank</Text>
          </View>
          <View className="items-center">
            <Text className="text-white text-lg font-bold">{Math.floor(Math.random() * 500) + 100}</Text>
            <Text className="text-zinc-400 text-sm">Your Points</Text>
          </View>
        </View>

        {/* Tabs */}
        <View className="flex-row px-6 py-4 border-b border-zinc-900/30">
          {(['feed', 'leaderboard', 'members'] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              className="mr-8"
            >
              <Text className={`font-medium pb-2 capitalize ${
                activeTab === tab ? 'text-white border-b-2 border-white' : 'text-zinc-500'
              }`}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Content */}
        <View className="flex-1">
          {renderTabContent()}
        </View>

        {/* Bottom Action Bar */}
        {/* <View className="flex-row items-center px-6 py-4 bg-zinc-900/50 border-t border-zinc-800">
          <TouchableOpacity className="flex-1 bg-blue-600 rounded-xl py-3 mr-3">
            <Text className="text-white font-semibold text-center">Drop Meme</Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-zinc-700 rounded-xl p-3">
            <Ionicons name="person-add" size={20} color="white" />
          </TouchableOpacity>
        </View> */}
      </SafeAreaView>
    </View>
  );
}