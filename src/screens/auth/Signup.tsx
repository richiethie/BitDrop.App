import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useState, useRef, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { BitDropIcon, BitDropLogoCompact } from '../../components/BitDropLogo';
import { checkUsernameAndEmail } from '../../api/availability';
import { loginUser, signUpUser } from '../../api/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Navigation types
type AuthStackParamList = {
  Login: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
};

// Login Screen Component


// Sign Up Screen Component
export function SignUpScreen({ navigation }: { navigation: any }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentStep, setCurrentStep] = useState(1);

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

  const validateStep1 = async () => {
    const newErrors: Record<string, string> = {};

    if (!formData.username) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    console.log('Initial validation errors:', newErrors);

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return false;

    try {
      console.log('Calling checkUsernameAndEmail...');
      await checkUsernameAndEmail(formData.username, formData.email);
      console.log('Username and email are available');
      return true;
    } catch (err: any) {
      const message = err.message || '';
      if (message.toLowerCase().includes('username')) {
        newErrors.username = 'Username is already taken';
      }
      if (message.toLowerCase().includes('email')) {
        newErrors.email = 'Email is already in use';
      }
    }
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirm password is required';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    console.log('Continue button pressed');
    const isValid = await validateStep1();
    if (!isValid) return;

    try {
      await checkUsernameAndEmail(formData.username, formData.email);
      setCurrentStep(2);
    } catch (err: any) {
      const message = err.message || '';
      const newErrors: Record<string, string> = {};

      if (message.includes('Username')) newErrors.username = message;
      if (message.includes('Email')) newErrors.email = message;

      setErrors(newErrors);
    }
  };

  const handleSignUp = async () => {
    if (!validateStep2()) return;
    
    setIsLoading(true);
    try {
      // 1. Sign up the user
      await signUpUser({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      // 2. Immediately log them in
      const response = await loginUser({
        email: formData.email,
        password: formData.password,
      });

      // 3. Save token (adjust if you're using secure storage, context, etc.)
      const { token } = response;
      await AsyncStorage.setItem('authToken', token);
      // Example: await AsyncStorage.setItem('authToken', token);

      // 4. Navigate to the Home screen
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
    } catch (err: any) {
      const message = err.message || '';
      const newErrors: Record<string, string> = {};

      if (message.toLowerCase().includes('username')) {
        newErrors.username = 'Username is already taken';
      }
      if (message.toLowerCase().includes('email')) {
        newErrors.email = 'Email is already in use';
      }
      if (Object.keys(newErrors).length === 0) {
        // Generic fallback
        newErrors.password = 'Something went wrong. Please try again.';
      }

      setErrors(newErrors);
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const StepDot = ({ step }: { step: number }) => (
    <View key={step} className="flex-row items-center">
      <LinearGradient
        colors={currentStep >= step ? ['#8B5CF6', '#3B82F6'] : ['#27272a', '#27272a']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' }}
      >
        {currentStep > step ? (
          <Ionicons name="checkmark" size={16} color="white" />
        ) : (
          <Text className="text-white text-sm font-bold">{step}</Text>
        )}
      </LinearGradient>
      {step < 2 && (
        <LinearGradient
          colors={currentStep > step ? ['#8B5CF6', '#3B82F6'] : ['#27272a', '#27272a']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ height: 2, width: 48, marginHorizontal: 8, borderRadius: 1 }}
        />
      )}
    </View>
  );

  return (
    <View className="flex-1 bg-black">
      <SafeAreaView className="flex-1">
        {/* Header */}
        <View className="flex-row items-center px-6 py-4">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <View className="flex-1 items-center">
            <View className="flex-row items-center">
              {[1, 2].map(step => <StepDot step={step} key={`step-${step}`} />)}
            </View>
          </View>
          <View className="w-6" />
        </View>

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
              {/* Header */}
              <View className="items-center mt-8 mb-12">
                <View className='flex-row items-center mb-6'>
                  <BitDropIcon />
                  <Text className="text-3xl text-white font-black">BitDrop</Text>
                </View>
                <Text className="text-white text-3xl font-bold mb-2">
                  {currentStep === 1 ? 'Create Account' : 'Secure Your Account'}
                </Text>
                <Text className="text-zinc-400 text-center text-base">
                  {currentStep === 1 
                    ? 'Join the community of competitors and creators' 
                    : 'Choose a strong password to protect your account'
                  }
                </Text>
              </View>

              {/* Step 1: Basic Info */}
              {currentStep === 1 && (
                <View>
                  <View className="mb-4">
                    <Text className="text-white text-sm font-medium mb-2">Username</Text>
                    <View className={`flex-row items-center bg-zinc-900 rounded-xl px-4 py-4 border ${
                      errors.username ? 'border-red-500' : 'border-zinc-800'
                    }`}>
                      <Ionicons name="person-outline" size={20} color="#71717a" />
                      <TextInput
                        value={formData.username}
                        onChangeText={(text) => updateFormData('username', text)}
                        placeholder="Choose a username"
                        placeholderTextColor="#71717a"
                        className="flex-1 text-white ml-3"
                        autoCapitalize="none"
                        autoCorrect={false}
                      />
                    </View>
                    {errors.username && (
                      <Text className="text-red-400 text-sm mt-1">{errors.username}</Text>
                    )}
                  </View>

                  <View>
                    <Text className="text-white text-sm font-medium mb-2">Email</Text>
                    <View className={`flex-row items-center bg-zinc-900 rounded-xl px-4 py-4 border ${
                      errors.email ? 'border-red-500' : 'border-zinc-800'
                    }`}>
                      <Ionicons name="mail-outline" size={20} color="#71717a" />
                      <TextInput
                        value={formData.email}
                        onChangeText={(text) => updateFormData('email', text)}
                        placeholder="Enter your email"
                        placeholderTextColor="#71717a"
                        className="flex-1 text-white ml-3"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                      />
                    </View>
                    {errors.email && (
                      <Text className="text-red-400 text-sm mt-1">{errors.email}</Text>
                    )}
                  </View>

                  <TouchableOpacity onPress={handleNext} className="mt-8">
                    <LinearGradient
                      colors={['#8B5CF6', '#3B82F6']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={{ borderRadius: 10, paddingHorizontal: 4, paddingVertical: 12, alignItems: 'center', justifyContent: 'center'  }}
                    >
                      <Text className="text-white font-semibold text-base">Continue</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              )}

              {/* Step 2: Password */}
              {currentStep === 2 && (
                <View className="">
                  <View className='mb-4'>
                    <Text className="text-white text-sm font-medium mb-2">Password</Text>
                    <View className={`flex-row items-center bg-zinc-900 rounded-xl px-4 py-4 border ${
                      errors.password ? 'border-red-500' : 'border-zinc-800'
                    }`}>
                      <Ionicons name="lock-closed-outline" size={20} color="#71717a" />
                      <TextInput
                        value={formData.password}
                        onChangeText={(text) => updateFormData('password', text)}
                        placeholder="Create a password"
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

                  <View>
                    <Text className="text-white text-sm font-medium mb-2">Confirm Password</Text>
                    <View className={`flex-row items-center bg-zinc-900 rounded-xl px-4 py-4 border ${
                      errors.confirmPassword ? 'border-red-500' : 'border-zinc-800'
                    }`}>
                      <Ionicons name="lock-closed-outline" size={20} color="#71717a" />
                      <TextInput
                        value={formData.confirmPassword}
                        onChangeText={(text) => updateFormData('confirmPassword', text)}
                        placeholder="Confirm your password"
                        placeholderTextColor="#71717a"
                        className="flex-1 text-white ml-3"
                        secureTextEntry={!showConfirmPassword}
                      />
                      <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                        <Ionicons 
                          name={showConfirmPassword ? "eye-outline" : "eye-off-outline"} 
                          size={20} 
                          color="#71717a" 
                        />
                      </TouchableOpacity>
                    </View>
                    {errors.confirmPassword && (
                      <Text className="text-red-400 text-sm mt-1">{errors.confirmPassword}</Text>
                    )}
                  </View>

                  <View className="flex-row space-x-4 mt-8">
                    <TouchableOpacity 
                      onPress={() => setCurrentStep(1)}
                      className="flex-1 bg-zinc-800 rounded-xl py-4 items-center mr-2"
                    >
                      <Text className="text-white font-semibold text-base">Back</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      onPress={handleSignUp}
                      disabled={isLoading}
                      className="flex-1"
                    >
                      <LinearGradient
                        colors={['#8B5CF6', '#3B82F6']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={{ borderRadius: 10, paddingHorizontal: 4, paddingVertical: 15, alignItems: 'center', justifyContent: 'center'  }}
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
                            <Text className="text-white font-semibold text-base ml-2">Creating...</Text>
                          </View>
                        ) : (
                          <Text className="text-white font-semibold text-base">Create Account</Text>
                        )}
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* Sign In Link */}
              <View className="flex-row justify-center items-center mt-8 mb-6">
                <Text className="text-zinc-400">Already have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <LinearGradient
                    colors={['#8B5CF6', '#3B82F6']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{ borderRadius: 4, paddingHorizontal: 8, paddingVertical: 4 }}
                  >
                    <Text className="text-white font-semibold">Sign In</Text>
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

// Forgot Password Screen (Bonus)
