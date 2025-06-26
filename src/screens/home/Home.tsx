import { Video, ResizeMode } from 'expo-av';
import { View, Dimensions, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlatList } from 'react-native-gesture-handler';
import { useRef, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { CustomText as Text } from '../../components/CustomText';

import stock1 from '../../assets/stock1.mp4';
import stock2 from '../../assets/stock2.mp4';

const TAB_BAR_HEIGHT = 85;
const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');
// Calculate video height to fill screen minus tab bar
const VIDEO_HEIGHT = SCREEN_HEIGHT - TAB_BAR_HEIGHT;

type Meme = {
  id: string;
  user: string;
  videoUrl: string;
  caption: string;
  likes: number;
  comments: number;
  shares: number;
  avatar?: string;
};

const mockMemes: Meme[] = [
  {
    id: '1',
    user: 'johndoe',
    videoUrl: stock1,
    caption: 'This one always hits 🤣 #funny #relatable #vibes',
    likes: 12400,
    comments: 89,
    shares: 23,
  },
  {
    id: '2',
    user: 'janedoe',
    videoUrl: stock2,
    caption: 'When devs see Friday deploy... 💀😭 #coding #developer #fridayfeels #relatable',
    likes: 8750,
    comments: 156,
    shares: 45,
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

export default function Home() {
  const videoRefs = useRef<Video[]>([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [likedVideos, setLikedVideos] = useState<Set<string>>(new Set());

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      const visibleIndex = viewableItems[0].index;
      setCurrentVideoIndex(visibleIndex);
      
      videoRefs.current.forEach((video, index) => {
        if (video) {
          if (index === visibleIndex) {
            video.playAsync();
          } else {
            video.pauseAsync();
          }
        }
      });
    }
  }).current;

  const handleLike = (memeId: string) => {
    setLikedVideos(prev => {
      const newSet = new Set(prev);
      if (newSet.has(memeId)) {
        newSet.delete(memeId);
      } else {
        newSet.add(memeId);
      }
      return newSet;
    });
  };

  return (
    <View className="flex-1 bg-black">
        {/* Fixed overlay header */}
        <View className="absolute top-0 left-0 right-0 z-10 px-6 pt-16 flex-row justify-between items-center">
            <View className="flex-row items-center justify-center">
                <TouchableOpacity className="flex-row items-center justify-center">
                    <Text className="text-white text-2xl font-semibold mr-1">
                        Home
                    </Text>
                    <Ionicons name="chevron-down" size={16} color="white" />
                </TouchableOpacity>
            </View>
            <TouchableOpacity className="w-8 h-8 items-center justify-center">
                <Ionicons name="search" size={24} color="white" />
            </TouchableOpacity>
        </View>
        
        <FlatList
            data={mockMemes}
            keyExtractor={(item) => item.id}
            pagingEnabled
            showsVerticalScrollIndicator={false}
            decelerationRate="fast"
            snapToInterval={VIDEO_HEIGHT}
            snapToAlignment="start"
            renderItem={({ item, index }) => (
                <View style={{ height: VIDEO_HEIGHT, width: SCREEN_WIDTH }} className="relative bg-black">
                    {/* Video Container - Perfectly Centered */}
                    <View
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: 'black',
                        }}
                    >
                        <Video
                            ref={(ref) => {
                                if (ref) videoRefs.current[index] = ref;
                            }}
                            source={{ uri: item.videoUrl }}
                            style={{
                                width: SCREEN_WIDTH,
                                height: VIDEO_HEIGHT,
                            }}
                            resizeMode={ResizeMode.COVER}
                            shouldPlay={index === currentVideoIndex}
                            isLooping
                            isMuted={false}
                            useNativeControls={false}
                            positionMillis={0}
                        />
                    </View>

                    {/* Bottom Overlay Content - Fixed Position */}
                    <View
                        style={{
                            position: 'absolute',
                            bottom: 20, // Fixed distance from bottom
                            left: 16,
                            right: 16,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'flex-end',
                            zIndex: 2,
                        }}
                    >
                        {/* Left Side Content */}
                        <View style={{ flex: 1, marginRight: 16 }}>
                            <View className="flex-row items-center mb-3">
                                <View className="w-8 h-8 rounded-full bg-gray-600 mr-2 items-center justify-center">
                                    <Ionicons name="person" size={16} color="white" />
                                </View>
                                <Text className="text-white font-semibold text-md">
                                    @{item.user}
                                </Text>
                            </View>
                            <Text className="text-white text-base text-sm leading-5 mb-2">
                                {item.caption}
                            </Text>
                            {/* <View className="flex-row items-center">
                                <Ionicons name="musical-notes" size={16} color="white" />
                                <Text className="text-white text-sm ml-2 opacity-80">
                                    Original audio
                                </Text>
                            </View> */}
                        </View>

                        {/* Right Side Buttons */}
                        <View className="items-center">
                            <TouchableOpacity 
                                className="items-center mb-6" 
                                onPress={() => handleLike(item.id)}
                            >
                                <Ionicons
                                    name={likedVideos.has(item.id) ? 'heart' : 'heart-outline'}
                                    size={28}
                                    color={likedVideos.has(item.id) ? '#FF3040' : 'white'}
                                />
                                <Text className="text-white text-xs mt-1">
                                    {formatNumber(item.likes + (likedVideos.has(item.id) ? 1 : 0))}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity className="items-center mb-6">
                                <Ionicons name="chatbubble-outline" size={28} color="white" />
                                <Text className="text-white text-xs mt-1">{formatNumber(item.comments)}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity className="items-center mb-6">
                                <Ionicons name="arrow-redo-outline" size={28} color="white" />
                                <Text className="text-white text-xs mt-1">{formatNumber(item.shares)}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity className="items-center mb-6">
                                <Ionicons name="ellipsis-horizontal" size={28} color="white" />
                            </TouchableOpacity>

                            <View className="w-8 h-8 rounded-full bg-gray-600 border-2 border-white items-center justify-center">
                                <Ionicons name="person" size={16} color="white" />
                            </View>
                        </View>
                    </View>
                </View>
            )}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={{ 
                itemVisiblePercentThreshold: 80,
                minimumViewTime: 100 
            }}
            getItemLayout={(data, index) => ({
                length: VIDEO_HEIGHT,
                offset: VIDEO_HEIGHT * index,
                index,
            })}
        />
    </View>
  );
}