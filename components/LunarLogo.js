import React from 'react';
import { View } from 'react-native';
import Svg, { Defs, Ellipse, LinearGradient, Path, Stop } from 'react-native-svg';

// A modern, 3D-style crescent moon logo with gold and blue gradients
const LunarLogo = ({ size = 100 }) => (
  <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
    <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <Defs>
        <LinearGradient id="moonGradient" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <Stop stopColor="#FFD700" />
          <Stop offset="0.7" stopColor="#b455e3" />
          <Stop offset="1" stopColor="#0f3460" />
        </LinearGradient>
        <LinearGradient id="shadowGradient" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <Stop stopColor="#fff" stopOpacity="0.2" />
          <Stop offset="1" stopColor="#0f3460" stopOpacity="0.7" />
        </LinearGradient>
      </Defs>
      {/* Main crescent */}
      <Path
        d="M50 10
          A40 40 0 1 0 90 50
          Q70 50 50 10Z"
        fill="url(#moonGradient)"
        stroke="#FFD700"
        strokeWidth="2"
        shadowColor="#FFD700"
        shadowOpacity={0.5}
        shadowRadius={8}
      />
      {/* Inner shadow for 3D effect */}
      <Path
        d="M60 20
          A30 30 0 1 0 80 50
          Q70 50 60 20Z"
        fill="url(#shadowGradient)"
      />
      {/* Craters */}
      <Ellipse cx="68" cy="38" rx="3" ry="2" fill="#fff8b0" opacity="0.4" />
      <Ellipse cx="78" cy="52" rx="2" ry="1.5" fill="#fff8b0" opacity="0.3" />
      <Ellipse cx="62" cy="48" rx="1.5" ry="1" fill="#fff8b0" opacity="0.2" />
    </Svg>
  </View>
);

export default LunarLogo;
