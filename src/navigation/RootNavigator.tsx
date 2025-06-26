import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { View } from 'react-native';
import Home from '../screens/home/Home';
import Drop from '../screens/drop/Drop';
import Profile from '../screens/profile/Profile';
import Groups from '../screens/groups/Groups';
import Leaderboard from '../screens/leaderboard/Leaderboard';
import { Ionicons } from '@expo/vector-icons';
import GroupStack from './GroupStack';
import AuthStackNavigator from './AuthStack';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { ActivityIndicator } from 'react-native';
import { BitDropBrand } from '../components/BitDropLogo';

// Type definitions

// Stack navigator param list for root
type RootStackParamList = {
    MainTabs: undefined;
    Auth: undefined;
};

// Tab navigator param list
export type RootTabParamList = {
  Home: undefined;
  Groups: undefined;
  Drop: undefined;
  Leaderboard: undefined;
  Profile: undefined;
};

// Tab icon types
type TabIconName = keyof RootTabParamList;

interface TabIconProps {
  name: TabIconName;
  focused: boolean;
  size?: number;
}

const RootStack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();

// Custom tab bar icon component
const TabIcon: React.FC<TabIconProps> = ({ name, focused, size = 24 }) => {
  const iconColor = focused ? '#FFFFFF' : '#8E8E93';

  const iconMap: Record<TabIconName, keyof typeof Ionicons.glyphMap> = {
    Home: focused ? 'home' : 'home-outline',
    Groups: focused ? 'people' : 'people-outline',
    Drop: 'water',
    Leaderboard: focused ? 'trophy' : 'trophy-outline',
    Profile: focused ? 'person-circle' : 'person-circle-outline',
  };

  return (
    <View className="items-center justify-center">
      {name === 'Drop' ? (
        <View className="relative w-12 h-12 items-center justify-center">
          <View className="bg-blue-500 rounded-full w-12 h-12 items-center justify-center shadow-lg">
            <Ionicons name="water" size={24} color="#FFFFFF" />
          </View>
          <View className="absolute inset-0 items-center justify-center mt-1">
            <Ionicons name="add" size={12} color="#3B82F6" />
          </View>
        </View>
      ) : (
        <Ionicons name={iconMap[name]} size={size} color={iconColor} />
      )}
    </View>
  );
};

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: '#1C1C1E',
          borderTopWidth: 1,
          borderTopColor: '#2C2C2E',
          height: 85,
          paddingBottom: 10,
          paddingTop: 10,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: '#8E8E93',
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{ tabBarIcon: ({ focused, size }) => <TabIcon name="Home" focused={focused} size={size} /> }}
      />
      <Tab.Screen
        name="Groups"
        component={GroupStack}
        options={{ tabBarIcon: ({ focused, size }) => <TabIcon name="Groups" focused={focused} size={size} /> }}
      />
      <Tab.Screen
        name="Drop"
        component={Drop}
        options={{ tabBarIcon: ({ focused, size }) => <TabIcon name="Drop" focused={focused} size={size} /> }}
      />
      <Tab.Screen
        name="Leaderboard"
        component={Leaderboard}
        options={{ tabBarIcon: ({ focused, size }) => <TabIcon name="Leaderboard" focused={focused} size={size} /> }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{ tabBarIcon: ({ focused, size }) => <TabIcon name="Profile" focused={focused} size={size} /> }}
      />
    </Tab.Navigator>
  );
}

export default function RootNavigator(): React.JSX.Element {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // null = loading

  useEffect(() => {
    // Initial session check
    const checkInitialAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session?.access_token);
    };

    checkInitialAuth();

    // Subscribe to auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session?.access_token);
    });

    // Cleanup the subscription on unmount
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  if (isAuthenticated === null) {
    // You can style this however you'd like
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <BitDropBrand  />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <RootStack.Screen name="MainTabs" component={MainTabs} />
        ) : (
          <RootStack.Screen name="Auth" component={AuthStackNavigator} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
