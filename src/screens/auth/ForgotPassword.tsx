import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useState, useRef, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';

export function ForgotPasswordScreen({ navigation }: { navigation: any }) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleResetPassword = async () => {
    if (!email) return;
    
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setEmailSent(true);
    }, 1500);
  };

  if (emailSent) {
    return (
      <View className="flex-1 bg-black">
        <SafeAreaView className="flex-1 px-6 justify-center items-center">
          <LinearGradient
            colors={['#8B5CF6', '#3B82F6', '#06B6D4']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="w-20 h-20 rounded-2xl items-center justify-center mb-6"
          >
            <Ionicons name="mail" size={32} color="white" />
          </LinearGradient>
          <Text className="text-white text-2xl font-bold mb-4">Check Your Email</Text>
          <Text className="text-zinc-400 text-center mb-8">
            We've sent a password reset link to {email}
          </Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <LinearGradient
              colors={['#8B5CF6', '#3B82F6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="rounded-xl py-4 px-8"
            >
              <Text className="text-white font-semibold">Back to Login</Text>
            </LinearGradient>
          </TouchableOpacity>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <SafeAreaView className="flex-1">
        <View className="flex-row items-center px-6 py-4">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
        </View>
        
        <View className="flex-1 px-6 justify-center">
          <View className="items-center mb-12">
            <LinearGradient
              colors={['#8B5CF6', '#3B82F6', '#06B6D4']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="w-20 h-20 rounded-2xl items-center justify-center mb-6"
            >
              <Ionicons name="key" size={32} color="white" />
            </LinearGradient>
            <Text className="text-white text-3xl font-bold mb-2">Reset Password</Text>
            <Text className="text-zinc-400 text-center">
              Enter your email and we'll send you a link to reset your password
            </Text>
          </View>

          <View className="space-y-6">
            <View>
              <Text className="text-white text-sm font-medium mb-2">Email</Text>
              <View className="flex-row items-center bg-zinc-900 rounded-xl px-4 py-4 border border-zinc-800">
                <Ionicons name="mail-outline" size={20} color="#71717a" />
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email"
                  placeholderTextColor="#71717a"
                  className="flex-1 text-white ml-3"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <TouchableOpacity 
              onPress={handleResetPassword}
              disabled={isLoading || !email}
              className="mt-8"
            >
              <LinearGradient
                colors={email && !isLoading ? ['#8B5CF6', '#3B82F6'] : ['#52525b', '#3f3f46']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="rounded-xl py-4 items-center"
              >
                {isLoading ? (
                  <View className="flex-row items-center">
                    <Ionicons name="refresh" size={20} color="white" />
                    <Text className="text-white font-semibold text-base ml-2">Sending...</Text>
                  </View>
                ) : (
                  <Text className="text-white font-semibold text-base">Send Reset Link</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}