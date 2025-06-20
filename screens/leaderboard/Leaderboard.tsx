import { View, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { CustomText as Text } from '../../components/CustomText';

type LeaderboardMeme = {
  id: string;
  title: string;
  creator: string;
  thumbnail: string;
  likes: number;
  comments: number;
  shares: number;
  score: number;
  badge?: 'crown' | 'fire' | 'rising';
};

type LeaderboardCreator = {
  id: string;
  username: string;
  avatar: string;
  totalLikes: number;
  memesPosted: number;
  score: number;
  badge?: 'legend' | 'rising' | 'consistent';
};

type LeaderboardGroup = {
  id: string;
  name: string;
  avatar: string;
  members: number;
  weeklyPosts: number;
  totalEngagement: number;
  score: number;
};

const mockPersonalMemes: LeaderboardMeme[] = [
  {
    id: '1',
    title: 'My debugging journey',
    creator: '@you',
    thumbnail: 'https://picsum.photos/300/400?random=11',
    likes: 342,
    comments: 23,
    shares: 8,
    score: 373,
    badge: 'rising',
  },
  {
    id: '2',
    title: 'Weekend coding vibes',
    creator: '@you',
    thumbnail: 'https://picsum.photos/300/400?random=12',
    likes: 189,
    comments: 15,
    shares: 4,
    score: 208,
  },
  {
    id: '3',
    title: 'CSS struggles are real',
    creator: '@you',
    thumbnail: 'https://picsum.photos/300/400?random=13',
    likes: 156,
    comments: 12,
    shares: 3,
    score: 171,
  },
];

const mockPersonalCreators: LeaderboardCreator[] = [
  {
    id: '1',
    username: 'you',
    avatar: '🚀',
    totalLikes: 687,
    memesPosted: 8,
    score: 752,
    badge: 'rising',
  },
  {
    id: '2',
    username: 'bestfriend',
    avatar: '😎',
    totalLikes: 423,
    memesPosted: 5,
    score: 468,
  },
  {
    id: '3',
    username: 'colleague_joe',
    avatar: '👨‍💻',
    totalLikes: 234,
    memesPosted: 3,
    score: 267,
  },
];

const mockPersonalGroups: LeaderboardGroup[] = [
  {
    id: '1',
    name: 'Dev Memers',
    avatar: '💻',
    members: 847,
    weeklyPosts: 23,
    totalEngagement: 8430,
    score: 8453,
  },
  {
    id: '2',
    name: 'Family Banter',
    avatar: '👨‍👩‍👧‍👦',
    members: 12,
    weeklyPosts: 8,
    totalEngagement: 234,
    score: 242,
  },
  {
    id: '3',
    name: 'Open Fire Memes',
    avatar: '🔥',
    members: 15420,
    weeklyPosts: 45,
    totalEngagement: 23450,
    score: 23495,
  },
];
const mockGlobalMemes: LeaderboardMeme[] = [
  {
    id: '1',
    title: 'When the code finally works',
    creator: '@codemaster',
    thumbnail: 'https://picsum.photos/300/400?random=1',
    likes: 15420,
    comments: 892,
    shares: 234,
    score: 16546,
    badge: 'crown',
  },
  {
    id: '2', 
    title: 'Friday deploy energy',
    creator: '@memegod',
    thumbnail: 'https://picsum.photos/300/400?random=2',
    likes: 12340,
    comments: 567,
    shares: 189,
    score: 13096,
    badge: 'fire',
  },
  {
    id: '3',
    title: 'Debugging at 3AM vibes',
    creator: '@nightcoder',
    thumbnail: 'https://picsum.photos/300/400?random=3',
    likes: 9870,
    comments: 445,
    shares: 123,
    score: 10438,
    badge: 'rising',
  },
  {
    id: '4',
    title: 'CSS is my passion',
    creator: '@frontend_wizard',
    thumbnail: 'https://picsum.photos/300/400?random=4',
    likes: 8560,
    comments: 334,
    shares: 98,
    score: 8992,
  },
  {
    id: '5',
    title: 'Production bug discovered',
    creator: '@bugfinder',
    thumbnail: 'https://picsum.photos/300/400?random=5',
    likes: 7890,
    comments: 278,
    shares: 87,
    score: 8255,
  },
];

const mockGlobalCreators: LeaderboardCreator[] = [
  {
    id: '1',
    username: 'codemaster',
    avatar: '👨‍💻',
    totalLikes: 45680,
    memesPosted: 23,
    score: 47903,
    badge: 'legend',
  },
  {
    id: '2',
    username: 'memegod',
    avatar: '🔥',
    totalLikes: 38920,
    memesPosted: 19,
    score: 40159,
    badge: 'consistent',
  },
  {
    id: '3',
    username: 'nightcoder',
    avatar: '🌙',
    totalLikes: 28450,
    memesPosted: 15,
    score: 29915,
    badge: 'rising',
  },
];

const mockGlobalGroups: LeaderboardGroup[] = [
  {
    id: '1',
    name: 'Dev Memers',
    avatar: '💻',
    members: 847,
    weeklyPosts: 89,
    totalEngagement: 234560,
    score: 235449,
  },
  {
    id: '2',
    name: 'Open Fire Memes',
    avatar: '🔥',
    members: 15420,
    weeklyPosts: 156,
    totalEngagement: 892340,
    score: 907760,
  },
  {
    id: '3',
    name: 'Crypto Degenerates',
    avatar: '💎',
    members: 8930,
    weeklyPosts: 203,
    totalEngagement: 567890,
    score: 576820,
  },
];

const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

const getBadgeIcon = (badge?: string) => {
  switch (badge) {
    case 'crown': return '👑';
    case 'fire': return '🔥';
    case 'rising': return '📈';
    case 'legend': return '🏆';
    case 'consistent': return '⭐';
    default: return null;
  }
};

const getRankIcon = (position: number) => {
  switch (position) {
    case 1: return '🥇';
    case 2: return '🥈';
    case 3: return '🥉';
    default: return `#${position}`;
  }
};

export default function Leaderboard() {
  const [activeCategory, setActiveCategory] = useState<'memes' | 'creators' | 'groups'>('memes');
  const [viewMode, setViewMode] = useState<'personal' | 'global'>('personal');

  const MemeCard = ({ meme, position }: { meme: LeaderboardMeme; position: number }) => (
    <TouchableOpacity className="flex-row items-center p-4 border-b border-zinc-900/30">
      <View className="w-12 items-center mr-4">
        <Text className="text-white text-lg font-bold">
          {typeof getRankIcon(position) === 'string' && getRankIcon(position).includes('#') 
            ? getRankIcon(position) 
            : getRankIcon(position)}
        </Text>
      </View>
      
      <Image 
        source={{ uri: meme.thumbnail }}
        className="w-16 h-20 rounded-lg bg-zinc-800 mr-4"
        resizeMode="cover"
      />
      
      <View className="flex-1">
        <View className="flex-row items-center mb-1">
          <Text className="text-white font-medium flex-1" numberOfLines={1}>
            {meme.title}
          </Text>
          {meme.badge && (
            <Text className="ml-2">{getBadgeIcon(meme.badge)}</Text>
          )}
        </View>
        
        <Text className="text-zinc-400 text-sm mb-2">by {meme.creator}</Text>
        
        <View className="flex-row items-center space-x-4">
          <View className="flex-row items-center">
            <Ionicons name="heart" size={14} color="#ef4444" />
            <Text className="text-zinc-400 text-xs ml-1">{formatNumber(meme.likes)}</Text>
          </View>
          <View className="flex-row items-center">
            <Ionicons name="chatbubble" size={14} color="#71717a" />
            <Text className="text-zinc-400 text-xs ml-1">{formatNumber(meme.comments)}</Text>
          </View>
          <View className="flex-row items-center">
            <Ionicons name="arrow-redo" size={14} color="#71717a" />
            <Text className="text-zinc-400 text-xs ml-1">{formatNumber(meme.shares)}</Text>
          </View>
        </View>
      </View>
      
      <View className="items-end">
        <Text className="text-white font-semibold">{formatNumber(meme.score)}</Text>
        <Text className="text-zinc-500 text-xs">score</Text>
      </View>
    </TouchableOpacity>
  );

  const CreatorCard = ({ creator, position }: { creator: LeaderboardCreator; position: number }) => (
    <TouchableOpacity className="flex-row items-center p-4 border-b border-zinc-900/30">
      <View className="w-12 items-center mr-4">
        <Text className="text-white text-lg font-bold">
          {typeof getRankIcon(position) === 'string' && getRankIcon(position).includes('#') 
            ? getRankIcon(position) 
            : getRankIcon(position)}
        </Text>
      </View>
      
      <View className="w-12 h-12 bg-zinc-800 rounded-full items-center justify-center mr-4">
        <Text className="text-xl">{creator.avatar}</Text>
      </View>
      
      <View className="flex-1">
        <View className="flex-row items-center mb-1">
          <Text className="text-white font-medium">@{creator.username}</Text>
          {creator.badge && (
            <Text className="ml-2">{getBadgeIcon(creator.badge)}</Text>
          )}
        </View>
        
        <View className="flex-row items-center space-x-4">
          <Text className="text-zinc-400 text-sm">{formatNumber(creator.totalLikes)} likes</Text>
          <Text className="text-zinc-400 text-sm">{creator.memesPosted} memes</Text>
        </View>
      </View>
      
      <View className="items-end">
        <Text className="text-white font-semibold">{formatNumber(creator.score)}</Text>
        <Text className="text-zinc-500 text-xs">score</Text>
      </View>
    </TouchableOpacity>
  );

  const GroupCard = ({ group, position }: { group: LeaderboardGroup; position: number }) => (
    <TouchableOpacity className="flex-row items-center p-4 border-b border-zinc-900/30">
      <View className="w-12 items-center mr-4">
        <Text className="text-white text-lg font-bold">
          {typeof getRankIcon(position) === 'string' && getRankIcon(position).includes('#') 
            ? getRankIcon(position) 
            : getRankIcon(position)}
        </Text>
      </View>
      
      <View className="w-12 h-12 bg-zinc-800 rounded-full items-center justify-center mr-4">
        <Text className="text-xl">{group.avatar}</Text>
      </View>
      
      <View className="flex-1">
        <Text className="text-white font-medium mb-1">{group.name}</Text>
        <View className="flex-row items-center space-x-4">
          <Text className="text-zinc-400 text-sm">{formatNumber(group.members)} members</Text>
          <Text className="text-zinc-400 text-sm">{group.weeklyPosts} posts</Text>
        </View>
      </View>
      
      <View className="items-end">
        <Text className="text-white font-semibold">{formatNumber(group.score)}</Text>
        <Text className="text-zinc-500 text-xs">score</Text>
      </View>
    </TouchableOpacity>
  );

  const renderContent = () => {
    const isPersonal = viewMode === 'personal';
    
    switch (activeCategory) {
      case 'memes':
        const memes = isPersonal ? mockPersonalMemes : mockGlobalMemes;
        return memes.map((meme, index) => (
          <MemeCard key={meme.id} meme={meme} position={index + 1} />
        ));
      case 'creators':
        const creators = isPersonal ? mockPersonalCreators : mockGlobalCreators;
        return creators.map((creator, index) => (
          <CreatorCard key={creator.id} creator={creator} position={index + 1} />
        ));
      case 'groups':
        const groups = isPersonal ? mockPersonalGroups : mockGlobalGroups;
        return groups.map((group, index) => (
          <GroupCard key={group.id} group={group} position={index + 1} />
        ));
    }
  };

  return (
    <View className="flex-1 bg-black">
      <SafeAreaView className="flex-1">
        {/* Header */}
        <View className="px-6 py-6">
          <Text className="text-white text-2xl font-semibold mb-2">Leaderboard</Text>
          <Text className="text-zinc-400 text-sm">
            {viewMode === 'personal' 
              ? 'Your performance and circles' 
              : 'Top performers across BitDrop'
            }
          </Text>
        </View>

        {/* Personal vs Global Toggle */}
        <View className="bg-zinc-900/30 mx-6 rounded-xl p-1 flex-row mb-6">
          <TouchableOpacity
            onPress={() => setViewMode('personal')}
            className={`flex-1 py-3 rounded-lg ${
              viewMode === 'personal' ? 'bg-zinc-700' : ''
            }`}
          >
            <Text className={`text-center font-medium ${
              viewMode === 'personal' ? 'text-white' : 'text-zinc-400'
            }`}>
              Personal
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setViewMode('global')}
            className={`flex-1 py-3 rounded-lg ${
              viewMode === 'global' ? 'bg-zinc-700' : ''
            }`}
          >
            <Text className={`text-center font-medium ${
              viewMode === 'global' ? 'text-white' : 'text-zinc-400'
            }`}>
              Global
            </Text>
          </TouchableOpacity>
        </View>

        {/* Category Tabs */}
        <View className="bg-zinc-900/30 mx-6 rounded-xl p-1 flex-row mb-6">
          {(['memes', 'creators', 'groups'] as const).map((category) => (
            <TouchableOpacity
              key={category}
              onPress={() => setActiveCategory(category)}
              className={`flex-1 py-3 rounded-lg ${
                activeCategory === category ? 'bg-zinc-700' : ''
              }`}
            >
              <Text className={`text-center font-medium capitalize ${
                activeCategory === category ? 'text-white' : 'text-zinc-400'
              }`}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Winner Spotlight */}
        {activeCategory === 'memes' && (
          <View className="mx-6 mb-6 bg-gradient-to-r from-yellow-900/20 to-orange-900/20 rounded-2xl p-6 border border-yellow-900/30">
            <View className="flex-row items-center mb-3">
              <Text className="text-2xl mr-2">
                {viewMode === 'personal' ? '🚀' : '👑'}
              </Text>
              <Text className="text-yellow-400 font-semibold">
                {viewMode === 'personal' ? 'Your Top Meme' : 'Meme of the Week'}
              </Text>
            </View>
            {viewMode === 'personal' ? (
              <>
                <Text className="text-white text-lg font-medium mb-1">{mockPersonalMemes[0]?.title}</Text>
                <Text className="text-zinc-300 mb-3">Your best performing drop</Text>
                <View className="flex-row items-center">
                  <Text className="text-yellow-400 font-bold text-xl mr-2">{formatNumber(mockPersonalMemes[0]?.score || 0)}</Text>
                  <Text className="text-zinc-400">total score</Text>
                </View>
              </>
            ) : (
              <>
                <Text className="text-white text-lg font-medium mb-1">{mockGlobalMemes[0]?.title}</Text>
                <Text className="text-zinc-300 mb-3">by {mockGlobalMemes[0]?.creator}</Text>
                <View className="flex-row items-center">
                  <Text className="text-yellow-400 font-bold text-xl mr-2">{formatNumber(mockGlobalMemes[0]?.score || 0)}</Text>
                  <Text className="text-zinc-400">total score</Text>
                </View>
              </>
            )}
          </View>
        )}

        {/* Rankings List */}
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {renderContent()}
          <View className="h-6" />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}