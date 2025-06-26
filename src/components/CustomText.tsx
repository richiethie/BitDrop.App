// components/CustomText.tsx
import { Text as RNText, TextProps, Platform, StyleSheet } from 'react-native';

const fontFamily = Platform.select({
  ios: 'System',
  android: 'Roboto',
  default: 'System',
});

export function CustomText(props: TextProps) {
  return <RNText {...props} style={[{ fontFamily }, props.style]} />;
}
