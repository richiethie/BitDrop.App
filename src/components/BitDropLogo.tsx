import React from 'react';
import { View, Text, ViewStyle } from 'react-native';
import Svg, { 
  Defs, 
  LinearGradient, 
  Stop, 
  Path, 
  Circle, 
  G,
  RadialGradient,
  Polygon
} from 'react-native-svg';

interface BitDropLogoProps {
  width?: number;
  height?: number;
  style?: ViewStyle;
  animated?: boolean;
}

export const BitDropLogo: React.FC<BitDropLogoProps> = ({ 
  width = 120, 
  height = 120, 
  style,
  animated = false 
}) => {
  return (
    <View style={[{ width, height }, style]}>
      <Svg width={width} height={height} viewBox="0 0 120 120">
        <Defs>
          {/* Main gradient - vibrant and modern */}
          <LinearGradient id="mainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#00D9FF" stopOpacity="1" />
            <Stop offset="25%" stopColor="#4F46E5" stopOpacity="1" />
            <Stop offset="50%" stopColor="#7C3AED" stopOpacity="1" />
            <Stop offset="75%" stopColor="#EC4899" stopOpacity="1" />
            <Stop offset="100%" stopColor="#F59E0B" stopOpacity="1" />
          </LinearGradient>

          {/* Secondary gradient for accents */}
          <LinearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#06B6D4" stopOpacity="1" />
            <Stop offset="50%" stopColor="#8B5CF6" stopOpacity="1" />
            <Stop offset="100%" stopColor="#F59E0B" stopOpacity="1" />
          </LinearGradient>

          {/* Glow effect */}
          <RadialGradient id="glow" cx="50%" cy="50%" r="60%">
            <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.3" />
            <Stop offset="50%" stopColor="#00D9FF" stopOpacity="0.2" />
            <Stop offset="100%" stopColor="#7C3AED" stopOpacity="0.1" />
          </RadialGradient>

          {/* Inner highlight */}
          <RadialGradient id="innerGlow" cx="40%" cy="30%" r="50%">
            <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.6" />
            <Stop offset="70%" stopColor="#FFFFFF" stopOpacity="0.2" />
            <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </RadialGradient>

          {/* Shadow gradient */}
          <RadialGradient id="shadow" cx="50%" cy="50%" r="40%">
            <Stop offset="0%" stopColor="#000000" stopOpacity="0" />
            <Stop offset="70%" stopColor="#000000" stopOpacity="0.1" />
            <Stop offset="100%" stopColor="#000000" stopOpacity="0.4" />
          </RadialGradient>
        </Defs>

        {/* Outer glow */}
        <Circle 
          cx="60" 
          cy="60" 
          r="55" 
          fill="url(#glow)" 
          opacity="0.6"
        />

        {/* Shadow */}
        <Circle 
          cx="60" 
          cy="65" 
          r="30" 
          fill="url(#shadow)" 
        />

        {/* Clean geometric drop shape */}
        <G>
          {/* Primary drop shape with angular top and rounded bottom */}
          <Path
            d="M60 15 L75 35 Q85 45 85 62 Q85 85 60 100 Q35 85 35 62 Q35 45 45 35 L60 15 Z"
            fill="url(#mainGradient)"
            stroke="none"
          />

          {/* Central highlight for depth */}
          <Path
            d="M60 20 L70 35 Q75 42 75 58 Q75 75 60 85 Q50 75 50 58 Q50 42 55 35 L60 20 Z"
            fill="url(#innerGlow)"
          />
        </G>
      </Svg>
    </View>
  );
};

// Compact version for smaller spaces
export const BitDropLogoCompact: React.FC<BitDropLogoProps> = ({ 
  width = 60, 
  height = 60, 
  style 
}) => {
  return (
    <View style={[{ width, height }, style]}>
      <Svg width={width} height={height} viewBox="0 0 60 60">
        <Defs>
          <LinearGradient id="compactMainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#00D9FF" stopOpacity="1" />
            <Stop offset="33%" stopColor="#7C3AED" stopOpacity="1" />
            <Stop offset="66%" stopColor="#EC4899" stopOpacity="1" />
            <Stop offset="100%" stopColor="#F59E0B" stopOpacity="1" />
          </LinearGradient>
          
          <RadialGradient id="compactGlow" cx="40%" cy="30%" r="60%">
            <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.5" />
            <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </RadialGradient>
        </Defs>

        {/* Clean compact drop */}
        <Path
          d="M30 8 L37 18 Q42 23 42 32 Q42 43 30 50 Q18 43 18 32 Q18 23 23 18 L30 8 Z"
          fill="url(#compactMainGradient)"
        />

        {/* Highlight */}
        <Path
          d="M30 10 L35 18 Q38 22 38 30 Q38 38 30 42 Q25 38 25 30 Q25 22 28 18 L30 10 Z"
          fill="url(#compactGlow)"
        />
      </Svg>
    </View>
  );
};

// Icon version for very small spaces
export const BitDropIcon: React.FC<BitDropLogoProps> = ({ 
  width = 32, 
  height = 32, 
  style 
}) => {
  return (
    <View style={[{ width, height }, style]}>
      <Svg width={width} height={height} viewBox="0 0 32 32">
        <Defs>
          <LinearGradient id="iconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#00D9FF" />
            <Stop offset="50%" stopColor="#7C3AED" />
            <Stop offset="100%" stopColor="#F59E0B" />
          </LinearGradient>
        </Defs>

        <Path
          d="M16 4 L20 10 Q22 12 22 17 Q22 24 16 28 Q10 24 10 17 Q10 12 12 10 L16 4 Z"
          fill="url(#iconGradient)"
        />
      </Svg>
    </View>
  );
};

// Logo showcase with branding
export const BitDropBrand: React.FC = () => {
  return (
    <View style={{ 
      flex: 1, 
      backgroundColor: '#000000', 
      justifyContent: 'center', 
      alignItems: 'center', 
      padding: 20 
    }}>
      {/* Main logo with text */}
      <View style={{ alignItems: 'center', marginBottom: 40 }}>
        <BitDropLogo width={140} height={140} />
        <View style={{ marginTop: 24, alignItems: 'center' }}>
          <Text style={{ 
            color: 'white', 
            fontSize: 36, 
            fontWeight: '800', 
            letterSpacing: -1,
            textAlign: 'center' 
          }}>
            BitDrop
          </Text>
          <Text style={{ 
            color: '#71717a', 
            fontSize: 16, 
            fontWeight: '500',
            textAlign: 'center', 
            marginTop: 8,
            letterSpacing: 2
          }}>
            CREATE • SHARE • INSPIRE
          </Text>
        </View>
      </View>
    </View>
  );
};