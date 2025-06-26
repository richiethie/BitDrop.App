import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useState, useRef, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { BitDropLogo, BitDropLogoCompact, BitDropBrand } from '../../components/BitDropLogo';
import { supabase } from '../../lib/supabaseClient';
import { fetchUserProfile } from '../../api/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';


export function LoginScreen({ navigation }: { navigation: any }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrors({ email: ' ', password: 'Invalid credentials' });
      setIsLoading(false);
      return;
    }

    const accessToken = data.session?.access_token;

    if (!accessToken) {
      setErrors({ email: ' ', password: 'Unexpected error. No token received.' });
      setIsLoading(false);
      return;
    }

    try {
      await AsyncStorage.setItem('authToken', accessToken); // ✅ Save token

      const profile = await fetchUserProfile(accessToken);
      console.log('Fetched profile:', profile);

      // Navigate to the Home screen
      navigation.reset({
        index: 0,
        routes: [
          {
            name: 'MainTabs',
            state: {
              index: 0,
              routes: [{ name: 'Home' }],
            },
          },
        ],
      });
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
      setErrors({ email: ' ', password: 'Login succeeded, but failed to fetch profile' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });

      if (error) {
        console.error('Google login error:', error);
        setIsLoading(false);
        return;
      }

      console.log('Redirecting to Google login...');

      // Supabase will handle redirect via deep linking.
      // The session needs to be handled when the app resumes.
      // So we listen for session changes instead:
      const { data: authListener } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (session?.access_token) {
            await AsyncStorage.setItem('authToken', session.access_token);

            try {
              const profile = await fetchUserProfile(session.access_token);
              console.log('Google profile:', profile);
              navigation.reset({
                index: 0,
                routes: [{ name: 'MainTabs' }],
              });
            } catch (err) {
              console.error('Profile fetch error after Google login:', err);
            }
          }
        }
      );

      // Optionally clean up listener later
      // return () => authListener.subscription.unsubscribe();

    } catch (err) {
      console.error('Unexpected Google login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      const storedToken = await AsyncStorage.getItem('authToken');
      if (storedToken) {
        try {
          const profile = await fetchUserProfile(storedToken);
          console.log('Auto-login with token profile:', profile);
          navigation.reset({
            index: 0,
            routes: [{ name: 'MainTabs' }],
          });
        } catch (err) {
          console.log('Token invalid, stay on login screen');
          await AsyncStorage.removeItem('authToken');
        }
      }
    };

    checkSession();
  }, []);

  return (
    <View className="flex-1 bg-black px-2">
      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1 }}
          >
            <Animated.View 
              style={{ 
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }}
              className="flex-1 px-6"
            >
              {/* Header with Gradient */}
              <View className="items-center mt-6 mb-10">
                <BitDropLogo />
                <Text className="text-white text-3xl font-bold mb-2">Welcome Back</Text>
                <Text className="text-zinc-400 text-center text-base">
                  Sign in to continue your BitDrop journey
                </Text>
              </View>

              {/* Login Form */}
              <View className="">
                {/* Email Input */}
                <View className='mb-4'>
                  <Text className="text-white text-sm font-medium mb-2">Email</Text>
                  <View className={`flex-row items-center bg-zinc-900 rounded-xl px-4 py-4 border ${
                    errors.email ? 'border-red-500' : 'border-zinc-800'
                  }`}>
                    <Ionicons name="mail-outline" size={20} color="#71717a" />
                    <TextInput
                      value={email}
                      onChangeText={(text) => {
                        setEmail(text);
                        if (errors.email) setErrors(prev => ({ ...prev, email: undefined }));
                      }}
                      placeholder="Enter your email"
                      placeholderTextColor="#71717a"
                      className="flex-1 text-white ml-3"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                      underlineColorAndroid="transparent" // 🔥 key for Android
                      style={{ 
                        borderWidth: 0,
                        outlineWidth: 0,
                        outlineColor: 'transparent'
                      }}
                    />
                  </View>
                  {errors.email && (
                    <Text className="text-red-400 text-sm mt-1">{errors.email}</Text>
                  )}
                </View>

                {/* Password Input */}
                <View className='mb-4'>
                  <Text className="text-white text-sm font-medium mb-2">Password</Text>
                  <View className={`flex-row items-center bg-zinc-900 rounded-xl px-4 py-4 border ${
                    errors.password ? 'border-red-500' : 'border-zinc-800'
                  }`}>
                    <Ionicons name="lock-closed-outline" size={20} color="#71717a" />
                    <TextInput
                      value={password}
                      onChangeText={(text) => {
                        setPassword(text);
                        if (errors.password) setErrors(prev => ({ ...prev, password: undefined }));
                      }}
                      placeholder="Enter your password"
                      placeholderTextColor="#71717a"
                      className="flex-1 text-white ml-3"
                      secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                      <Ionicons 
                        name={showPassword ? "eye-outline" : "eye-off-outline"} 
                        size={20} 
                        color="#71717a" 
                      />
                    </TouchableOpacity>
                  </View>
                  {errors.password && (
                    <Text className="text-red-400 text-sm mt-1">{errors.password}</Text>
                  )}
                </View>

                {/* Forgot Password */}
                <TouchableOpacity 
                  onPress={() => navigation.navigate('ForgotPassword')}
                  className="items-end"
                >
                  <Text className="text-blue-400 text-sm font-medium">Forgot Password?</Text>
                </TouchableOpacity>

                {/* Login Button */}
                <TouchableOpacity 
                  onPress={handleLogin}
                  disabled={isLoading}
                  className="mt-6"
                >
                  <LinearGradient
                    colors={['#8B5CF6', '#3B82F6']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{ borderRadius: 10, paddingHorizontal: 4, paddingVertical: 12, alignItems: 'center', justifyContent: 'center'  }}
                  >
                    {isLoading ? (
                      <View className="flex-row items-center">
                        <Animated.View
                          style={{
                            transform: [{
                              rotate: fadeAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: ['0deg', '360deg']
                              })
                            }]
                          }}
                        >
                          <Ionicons name="refresh" size={20} color="white" />
                        </Animated.View>
                        <Text className="text-white font-semibold text-base ml-2">Signing In...</Text>
                      </View>
                    ) : (
                      <Text className="text-white font-semibold text-base">Sign In</Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>

                {/* Divider */}
                <View className="flex-row items-center my-6">
                  <View className="flex-1 h-px bg-zinc-800" />
                  <Text className="text-zinc-500 mx-4">or continue with</Text>
                  <View className="flex-1 h-px bg-zinc-800" />
                </View>

                {/* Social Login Buttons */}
                <View className="flex-row space-x-4">
                  <TouchableOpacity className="flex-1 bg-zinc-900 rounded-xl py-4 items-center border border-zinc-800 mr-2" onPress={handleGoogleLogin}>
                    <Ionicons name="logo-google" size={20} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity className="flex-1 bg-zinc-900 rounded-xl py-4 items-center border border-zinc-800">
                    <Ionicons name="logo-apple" size={20} color="white" />
                  </TouchableOpacity>
                  {/* <TouchableOpacity className="flex-1 bg-zinc-900 rounded-xl py-4 items-center border border-zinc-800">
                    <Ionicons name="logo-github" size={20} color="white" />
                  </TouchableOpacity> */}
                </View>
              </View>

              {/* Sign Up Link */}
              <View className="flex-row justify-center items-center mt-8 mb-6">
                <Text className="text-zinc-400 mr-2">Don't have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                  <LinearGradient
                    colors={['#8B5CF6', '#3B82F6']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{ borderRadius: 4, paddingHorizontal: 8, paddingVertical: 4 }}
                  >
                    <Text className="text-white font-semibold">Sign Up</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}