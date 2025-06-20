import { View, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { CustomText as Text } from '../../components/CustomText';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { GroupStackParamList } from '../../navigation/GroupStack';

type Group = {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  isPrivate: boolean;
  isJoined: boolean;
  weeklyPosts: number;
  topMemer?: string;
  avatar: string;
  recentActivity: string;
};

type GroupsNavigationProp = StackNavigationProp<GroupStackParamList, 'Groups'>;

const mockGroups: Group[] = [
  {
    id: '1',
    name: 'Dev Memers',
    description: 'Coding humor and programming fails',
    memberCount: 847,
    isPrivate: true,
    isJoined: true,
    weeklyPosts: 23,
    topMemer: '@codemaster',
    avatar: '💻',
    recentActivity: '2h ago',
  },
  {
    id: '2',
    name: 'Family Banter',
    description: 'Keep it clean, keep it funny',
    memberCount: 12,
    isPrivate: true,
    isJoined: true,
    weeklyPosts: 8,
    topMemer: '@mom_jokes',
    avatar: '👨‍👩‍👧‍👦',
    recentActivity: '5m ago',
  },
  {
    id: '3',
    name: 'Open Fire Memes',
    description: 'No limits, no mercy, pure chaos',
    memberCount: 15420,
    isPrivate: false,
    isJoined: true,
    weeklyPosts: 156,
    topMemer: '@memegod',
    avatar: '🔥',
    recentActivity: 'now',
  },
  {
    id: '4',
    name: 'Sports Roasts',
    description: 'Trash talk and game highlights',
    memberCount: 3240,
    isPrivate: false,
    isJoined: false,
    weeklyPosts: 89,
    topMemer: '@ballbuster',
    avatar: '⚽',
    recentActivity: '1h ago',
  },
  {
    id: '5',
    name: 'Crypto Degenerates',
    description: 'Diamond hands and loss porn',
    memberCount: 8930,
    isPrivate: false,
    isJoined: false,
    weeklyPosts: 203,
    topMemer: '@hodl_king',
    avatar: '💎',
    recentActivity: '15m ago',
  },
  {
    id: '6',
    name: 'Food Critics',
    description: 'Roasting restaurants and recipes',
    memberCount: 2156,
    isPrivate: false,
    isJoined: false,
    weeklyPosts: 67,
    topMemer: '@chef_burns',
    avatar: '🍔',
    recentActivity: '45m ago',
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

export default function Groups() {
  const navigation = useNavigation<GroupsNavigationProp>();
  const [groups, setGroups] = useState<Group[]>(mockGroups);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'joined' | 'discover'>('joined');

  const handleJoinGroup = (groupId: string) => {
    setGroups(prev => 
      prev.map(group => 
        group.id === groupId 
          ? { ...group, isJoined: !group.isJoined, memberCount: group.isJoined ? group.memberCount - 1 : group.memberCount + 1 }
          : group
      )
    );
  };

  const filteredGroups = groups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         group.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'joined' ? group.isJoined : !group.isJoined;
    return matchesSearch && matchesTab;
  });

  const GroupCard = ({ group }: { group: Group }) => (
    <TouchableOpacity 
      className="px-6 py-5 border-b border-zinc-900/50"
      onPress={() => navigation.navigate('GroupDetail', {
        groupId: group.id,
        groupName: group.name,
        groupAvatar: group.avatar,
      })}
    >
      <View className="flex-row items-center justify-between">
        {/* Left Side */}
        <View className="flex-row items-center flex-1 mr-4">
          <Text className="text-2xl mr-4">{group.avatar}</Text>
          <View className="flex-1">
            <View className="flex-row items-center mb-1">
              <Text className="text-white font-medium text-base">{group.name}</Text>
              {group.isPrivate && (
                <View className="w-1 h-1 rounded-full bg-zinc-500 mx-2" />
              )}
              {group.isPrivate && (
                <Text className="text-zinc-500 text-xs">Private</Text>
              )}
            </View>
            <Text className="text-zinc-400 text-sm mb-2" numberOfLines={1}>
              {group.description}
            </Text>
            <Text className="text-zinc-500 text-xs">
              {formatNumber(group.memberCount)} members
            </Text>
          </View>
        </View>
        
        {/* Right Side */}
        <TouchableOpacity
          onPress={() => handleJoinGroup(group.id)}
          className={`px-4 py-2 rounded-full min-w-[70px] ${
            group.isJoined 
              ? 'border border-zinc-700' 
              : 'bg-white'
          }`}
        >
          <Text className={`font-medium text-center text-sm ${
            group.isJoined ? 'text-zinc-300' : 'text-black'
          }`}>
            {group.isJoined ? 'Joined' : 'Join'}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-black">
      <SafeAreaView className="flex-1">
        {/* Minimal Header */}
        <View className="px-6 py-6 flex-row items-center justify-between">
          <Text className="text-white text-2xl font-semibold">Groups</Text>
          <TouchableOpacity className="w-8 h-8 items-center justify-center">
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Clean Search */}
        <View className="px-6 mb-6">
          <View className="flex-row items-center bg-zinc-900/50 rounded-2xl px-4 py-3">
            <Ionicons name="search" size={18} color="#71717a" />
            <TextInput
              placeholder="Search groups"
              placeholderTextColor="#71717a"
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="flex-1 text-white ml-3 text-base"
            />
          </View>
        </View>

        {/* Minimal Tabs */}
        <View className="flex-row px-6 mb-8">
          <TouchableOpacity
            onPress={() => setActiveTab('joined')}
            className="mr-8"
          >
            <Text className={`font-medium pb-2 ${
              activeTab === 'joined' ? 'text-white border-b-2 border-white' : 'text-zinc-500'
            }`}>
              Joined
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab('discover')}
          >
            <Text className={`font-medium pb-2 ${
              activeTab === 'discover' ? 'text-white border-b-2 border-white' : 'text-zinc-500'
            }`}>
              Discover
            </Text>
          </TouchableOpacity>
        </View>

        {/* Clean List */}
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {filteredGroups.length > 0 ? (
            filteredGroups.map((group) => (
              <GroupCard key={group.id} group={group} />
            ))
          ) : (
            <View className="flex-1 justify-center items-center px-8 py-20">
              <Text className="text-zinc-600 text-6xl mb-6">○</Text>
              <Text className="text-white text-lg font-medium mb-2 text-center">
                {activeTab === 'joined' ? 'No groups yet' : 'Nothing found'}
              </Text>
              <Text className="text-zinc-500 text-center text-sm leading-5">
                {activeTab === 'joined' 
                  ? 'Join groups to connect with your community'
                  : 'Try a different search term'
                }
              </Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}