import { View, Image, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import astronaut from '../../assets/profile-astronaut.jpg';
import { CustomText as Text } from '../../components/CustomText';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';

interface Drop {
  id: string;
  thumbnail: string;
  caption: string;
  likes: number;
  comments: number;
  shares: number;
  views: number;
  type: 'image' | 'video';
  isViral?: boolean;
}

interface Group {
  id: string;
  name: string;
  avatar: string;
  role: 'member' | 'admin' | 'owner';
  memberCount: number;
}

const mockDrops: Drop[] = [
  {
    id: '1',
    thumbnail: 'https://picsum.photos/200/300?random=1',
    caption: 'When the deploy goes right 😎',
    likes: 1247,
    comments: 89,
    shares: 23,
    views: 5420,
    type: 'video',
    isViral: true,
  },
  {
    id: '2',
    thumbnail: 'https://picsum.photos/200/300?random=2',
    caption: 'Live footage of Monday morning',
    likes: 892,
    comments: 45,
    shares: 12,
    views: 3240,
    type: 'image',
  },
  {
    id: '3',
    thumbnail: 'https://picsum.photos/200/300?random=3',
    caption: 'CSS debugging be like...',
    likes: 634,
    comments: 34,
    shares: 8,
    views: 2150,
    type: 'video',
  },
  {
    id: '4',
    thumbnail: 'https://picsum.photos/200/300?random=4',
    caption: 'Friday afternoon energy',
    likes: 445,
    comments: 23,
    shares: 5,
    views: 1680,
    type: 'image',
  },
  {
    id: '5',
    thumbnail: 'https://picsum.photos/200/300?random=5',
    caption: 'When code works on first try',
    likes: 1089,
    comments: 67,
    shares: 19,
    views: 4320,
    type: 'video',
  },
  {
    id: '6',
    thumbnail: 'https://picsum.photos/200/300?random=6',
    caption: 'Documentation vs Reality',
    likes: 723,
    comments: 41,
    shares: 14,
    views: 2890,
    type: 'image',
  },
];

const mockLikedDrops: Drop[] = [
  {
    id: '10',
    thumbnail: 'https://picsum.photos/200/300?random=10',
    caption: 'React hooks explained',
    likes: 3420,
    comments: 234,
    shares: 89,
    views: 12450,
    type: 'video',
  },
  {
    id: '11',
    thumbnail: 'https://picsum.photos/200/300?random=11',
    caption: 'Git merge conflicts',
    likes: 2156,
    comments: 123,
    shares: 45,
    views: 8930,
    type: 'image',
  },
];

const mockGroups: Group[] = [
  {
    id: '1',
    name: 'Dev Memers',
    avatar: '💻',
    role: 'admin',
    memberCount: 847,
  },
  {
    id: '2',
    name: 'Family Banter',
    avatar: '👨‍👩‍👧‍👦',
    role: 'owner',
    memberCount: 12,
  },
  {
    id: '3',
    name: 'Open Fire Memes',
    avatar: '🔥',
    role: 'member',
    memberCount: 15420,
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

export default function Profile() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'drops' | 'liked' | 'groups'>('drops');

  const totalLikes = mockDrops.reduce((sum, drop) => sum + drop.likes, 0);
  const totalViews = mockDrops.reduce((sum, drop) => sum + drop.views, 0);
  const viralMemes = mockDrops.filter(drop => drop.isViral).length;

  const DropCard = ({ item }: { item: Drop }) => (
    <TouchableOpacity className="w-[31%] mb-3 relative">
      <Image 
        source={{ uri: item.thumbnail }}
        className="w-full h-32 rounded-lg bg-zinc-800"
        resizeMode="cover"
      />
      {item.type === 'video' && (
        <View className="absolute top-2 right-2">
          <Ionicons name="play-circle" size={16} color="white" />
        </View>
      )}
      {item.isViral && (
        <View className="absolute top-2 left-2 bg-red-600 rounded-full px-2 py-1">
          <Text className="text-white text-xs font-bold">🔥</Text>
        </View>
      )}
      <View className="absolute bottom-0 left-0 right-0 bg-black/60 rounded-b-lg p-2">
        <View className="flex-row items-center">
          <Ionicons name="heart" size={12} color="white" />
          <Text className="text-white text-xs ml-1">{formatNumber(item.likes)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const GroupCard = ({ group }: { group: Group }) => (
    <TouchableOpacity className="flex-row items-center p-4 border-b border-zinc-900/30">
      <View className="w-12 h-12 bg-zinc-800 rounded-full items-center justify-center mr-4">
        <Text className="text-xl">{group.avatar}</Text>
      </View>
      <View className="flex-1">
        <View className="flex-row items-center mb-1">
          <Text className="text-white font-medium">{group.name}</Text>
          {group.role !== 'member' && (
            <View className="ml-2 bg-blue-600 rounded-full px-2 py-1">
              <Text className="text-white text-xs font-bold">{group.role.charAt(0).toUpperCase() + group.role.slice(1)}</Text>
            </View>
          )}
        </View>
        <Text className="text-zinc-400 text-sm">{formatNumber(group.memberCount)} members</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#71717a" />
    </TouchableOpacity>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'drops':
        return (
          <View className="flex-row flex-wrap justify-between px-6">
            {mockDrops.map((item) => (
              <DropCard key={item.id} item={item} />
            ))}
          </View>
        );
      case 'liked':
        return (
          <View className="flex-row flex-wrap justify-between px-6">
            {mockLikedDrops.map((item) => (
              <DropCard key={item.id} item={item} />
            ))}
          </View>
        );
      case 'groups':
        return (
          <View>
            {mockGroups.map((group) => (
              <GroupCard key={group.id} group={group} />
            ))}
          </View>
        );
    }
  };

  return (
    <View className="flex-1 bg-black">
      <SafeAreaView className="flex-1">
        <View className="px-6 py-6 flex-row items-center justify-between">
          <Text className="text-white text-2xl font-semibold">Profile</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Auth' as never)}>
            <Ionicons name="settings-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="items-center px-6 py-6">
            <View className="relative mb-4">
              <Image source={astronaut} style={{ width: 96, height: 96, borderRadius: 48 }} />
              <View className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-600 rounded-full items-center justify-center border-2 border-black">
                <Ionicons name="checkmark" size={16} color="white" />
              </View>
            </View>
            <Text className="text-white text-2xl font-bold mb-1">@{user?.username || 'username'}</Text>
            <Text className="text-zinc-400 text-sm mb-3">{user?.bio || 'Welcome to BitDrop!'}</Text>
            <TouchableOpacity className="border border-zinc-700 rounded-full px-6 py-2">
              <Text className="text-white font-medium">Edit Profile</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row justify-around px-6 py-6 bg-zinc-900/30 mx-6 rounded-2xl mb-6">
            <View className="items-center">
              <Text className="text-white text-xl font-bold">{formatNumber(totalLikes)}</Text>
              <Text className="text-zinc-400 text-sm">Likes</Text>
            </View>
            <View className="items-center">
              <Text className="text-white text-xl font-bold">{formatNumber(totalViews)}</Text>
              <Text className="text-zinc-400 text-sm">Views</Text>
            </View>
            <View className="items-center">
              <Text className="text-white text-xl font-bold">{mockDrops.length}</Text>
              <Text className="text-zinc-400 text-sm">Drops</Text>
            </View>
            <View className="items-center">
              <Text className="text-white text-xl font-bold">{mockGroups.length}</Text>
              <Text className="text-zinc-400 text-sm">Groups</Text>
            </View>
          </View>

          <View className="px-6 mb-6">
            <Text className="text-white font-semibold mb-3">Achievements</Text>
            <View className="flex-row space-x-3">
              <View className="bg-gradient-to-r from-red-900/30 to-orange-900/30 rounded-xl p-4 border border-red-900/30 flex-1">
                <Text className="text-2xl mb-1">🔥</Text>
                <Text className="text-white font-medium text-sm">Viral Creator</Text>
                <Text className="text-zinc-400 text-xs">{viralMemes} viral memes</Text>
              </View>
              <View className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-xl p-4 border border-blue-900/30 flex-1">
                <Text className="text-2xl mb-1">👑</Text>
                <Text className="text-white font-medium text-sm">Group Leader</Text>
                <Text className="text-zinc-400 text-xs">Admin in 2 groups</Text>
              </View>
            </View>
          </View>

          <View className="flex-row px-6 mb-6">
             {(['drops', 'liked', 'groups'] as Array<'drops' | 'liked' | 'groups'>).map((tab) => (
              <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)} className="mr-8">
                <Text className={`font-medium pb-2 capitalize ${
                  activeTab === tab ? 'text-white border-b-2 border-white' : 'text-zinc-500'
                }`}>
                  {tab} {tab === 'drops' && `(${mockDrops.length})`}
                  {tab === 'liked' && `(${mockLikedDrops.length})`}
                  {tab === 'groups' && `(${mockGroups.length})`}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {renderTabContent()}

          <View className="h-6" />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
