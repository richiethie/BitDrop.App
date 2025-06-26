import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from '../screens/auth/Login';
import { SignUpScreen } from '../screens/auth/Signup';
import { ForgotPasswordScreen } from '../screens/auth/ForgotPassword';

export type AuthStackParamList = {
  Login: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>{/* <Stack.Navigator initialRouteName="AuthGate"> */}
      {/* <Stack.Screen name="AuthGate" component={AuthGate} options={{ headerShown: false }} /> */}
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
}
