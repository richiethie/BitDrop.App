import { View, TouchableOpacity, Image, ScrollView, TextInput, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { CustomText as Text } from '../../components/CustomText';

type DropItem = {
  id: string;
  type: 'image' | 'video';
  uri: string;
  caption?: string;
  status: 'draft' | 'shared' | 'scheduled';
  sharedTo?: string[];
  createdAt: Date;
  thumbnail?: string;
};

const mockDrops: DropItem[] = [
  {
    id: '1',
    type: 'image',
    uri: 'https://picsum.photos/300/400?random=1',
    caption: 'When the code finally works 🎉',
    status: 'draft',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  },
  {
    id: '2',
    type: 'video',
    uri: 'https://picsum.photos/300/400?random=2',
    caption: 'POV: You\'re debugging at 3AM',
    status: 'shared',
    sharedTo: ['Dev Memers', 'Open Fire Memes'],
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
  },
  {
    id: '3',
    type: 'image',
    uri: 'https://picsum.photos/300/400?random=3',
    status: 'draft',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
  },
];

export default function Drop() {
  const [drops, setDrops] = useState<DropItem[]>(mockDrops);
  const [activeTab, setActiveTab] = useState<'all' | 'drafts' | 'shared'>('all');
  const [selectedDrop, setSelectedDrop] = useState<DropItem | null>(null);
  const [caption, setCaption] = useState('');

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [9, 16],
      quality: 0.8,
    });

    if (!result.canceled) {
      const newDrop: DropItem = {
        id: Date.now().toString(),
        type: result.assets[0].type === 'video' ? 'video' : 'image',
        uri: result.assets[0].uri,
        status: 'draft',
        createdAt: new Date(),
      };
      setDrops(prev => [newDrop, ...prev]);
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const filteredDrops = drops.filter(drop => {
    if (activeTab === 'drafts') return drop.status === 'draft';
    if (activeTab === 'shared') return drop.status === 'shared';
    return true;
  });

  const handleShare = (dropId: string) => {
    setDrops(prev => prev.map(drop => 
      drop.id === dropId 
        ? { ...drop, status: 'shared' as const, sharedTo: ['Dev Memers'], caption }
        : drop
    ));
    setSelectedDrop(null);
    setCaption('');
  };

  const DropCard = ({ item }: { item: DropItem }) => (
    <TouchableOpacity 
      onPress={() => setSelectedDrop(item)}
      className="w-[120px] mr-3"
    >
      <View className="relative">
        <Image 
          source={{ uri: item.uri }} 
          className="w-[120px] h-[160px] rounded-xl bg-zinc-800"
          resizeMode="cover"
        />
        
        {/* Status Indicator */}
        <View className={`absolute top-2 right-2 w-2 h-2 rounded-full ${
          item.status === 'draft' ? 'bg-yellow-500' : 
          item.status === 'shared' ? 'bg-green-500' : 'bg-blue-500'
        }`} />
        
        {/* Video Indicator */}
        {item.type === 'video' && (
          <View className="absolute bottom-2 left-2">
            <Ionicons name="play-circle" size={16} color="white" />
          </View>
        )}
      </View>
      
      <View className="mt-2">
        <Text className="text-white text-xs font-medium" numberOfLines={2}>
          {item.caption || 'No caption'}
        </Text>
        <Text className="text-zinc-500 text-xs mt-1">
          {formatTimeAgo(item.createdAt)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (selectedDrop) {
    return (
      <View className="flex-1 bg-black">
        <SafeAreaView className="flex-1">
          {/* Header */}
          <View className="flex-row items-center justify-between px-6 py-4 border-b border-zinc-900/50">
            <TouchableOpacity onPress={() => setSelectedDrop(null)}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text className="text-white font-medium">Edit Drop</Text>
            <TouchableOpacity onPress={() => handleShare(selectedDrop.id)}>
              <Text className="text-blue-500 font-medium">Share</Text>
            </TouchableOpacity>
          </View>

          <ScrollView className="flex-1 px-6 py-6">
            {/* Preview */}
            <View className="items-center mb-8">
              <Image 
                source={{ uri: selectedDrop.uri }} 
                className="w-[200px] h-[300px] rounded-2xl bg-zinc-800"
                resizeMode="cover"
              />
            </View>

            {/* Caption Input */}
            <View className="mb-6">
              <Text className="text-white font-medium mb-3">Caption</Text>
              <TextInput
                value={caption}
                onChangeText={setCaption}
                placeholder="Add a caption..."
                placeholderTextColor="#71717a"
                multiline
                className="bg-zinc-900/50 rounded-xl p-4 text-white text-base min-h-[80px]"
                style={{ textAlignVertical: 'top' }}
              />
            </View>

            {/* Share Options */}
            <View className="mb-6">
              <Text className="text-white font-medium mb-3">Share to</Text>
              <TouchableOpacity className="bg-zinc-900/50 rounded-xl p-4 flex-row items-center justify-between">
                <View>
                  <Text className="text-white">Select Groups</Text>
                  <Text className="text-zinc-400 text-sm">Choose where to share</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#71717a" />
              </TouchableOpacity>
            </View>

            {/* Actions */}
            <View className="space-y-3">
              <TouchableOpacity className="bg-blue-600 rounded-xl p-4">
                <Text className="text-white font-medium text-center">Share Now</Text>
              </TouchableOpacity>
              
              <TouchableOpacity className="border border-zinc-700 rounded-xl p-4">
                <Text className="text-white font-medium text-center">Save as Draft</Text>
              </TouchableOpacity>
              
              <TouchableOpacity className="border border-red-900 rounded-xl p-4">
                <Text className="text-red-400 font-medium text-center">Delete</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <SafeAreaView className="flex-1">
        {/* Header */}
        <View className="px-6 py-6 flex-row items-center justify-between">
          <Text className="text-white text-2xl font-semibold">Drops</Text>
          <TouchableOpacity onPress={pickImage} className="w-8 h-8 items-center justify-center">
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View className="px-6 mb-6">
          <View className="flex-row space-x-6">
            <View>
              <Text className="text-white text-lg font-semibold">{drops.filter(d => d.status === 'draft').length}</Text>
              <Text className="text-zinc-500 text-sm">Drafts</Text>
            </View>
            <View>
              <Text className="text-white text-lg font-semibold">{drops.filter(d => d.status === 'shared').length}</Text>
              <Text className="text-zinc-500 text-sm">Shared</Text>
            </View>
            <View>
              <Text className="text-white text-lg font-semibold">{drops.length}</Text>
              <Text className="text-zinc-500 text-sm">Total</Text>
            </View>
          </View>
        </View>

        {/* Tabs */}
        <View className="flex-row px-6 mb-6">
          {(['all', 'drafts', 'shared'] as const).map((tab) => (
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

        {/* Content Grid */}
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {filteredDrops.length > 0 ? (
            <View className="px-6">
              <FlatList
                data={filteredDrops}
                renderItem={({ item }) => <DropCard item={item} />}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingRight: 24 }}
              />
            </View>
          ) : (
            <View className="flex-1 justify-center items-center px-8">
              <Text className="text-zinc-600 text-6xl mb-6">📥</Text>
              <Text className="text-white text-lg font-medium mb-2 text-center">
                {activeTab === 'drafts' ? 'No drafts yet' : 
                 activeTab === 'shared' ? 'Nothing shared yet' : 'No drops yet'}
              </Text>
              <Text className="text-zinc-500 text-center text-sm leading-5 mb-6">
                {activeTab === 'drafts' ? 'Create content and save as drafts before sharing' :
                 activeTab === 'shared' ? 'Share your drops to groups and they\'ll appear here' :
                 'Start by adding content from your camera roll or share sheet'}
              </Text>
              <TouchableOpacity 
                onPress={pickImage}
                className="bg-white px-6 py-3 rounded-full"
              >
                <Text className="text-black font-medium">Add Content</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>

        {/* Quick Actions */}
        {filteredDrops.length > 0 && (
          <View className="px-6 py-4 border-t border-zinc-900/50">
            <TouchableOpacity 
              onPress={pickImage}
              className="bg-zinc-900/50 rounded-xl p-4 flex-row items-center justify-center"
            >
              <Ionicons name="camera" size={20} color="white" />
              <Text className="text-white font-medium ml-2">Add More Content</Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}