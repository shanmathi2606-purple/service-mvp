// src/components/LunarLogo.js
import React from 'react';
import { View } from 'react-native';
import Svg, { 
  Defs, 
  LinearGradient, 
  Stop, 
  Path, 
  Circle,
  Text as SvgText
} from 'react-native-svg';

const LunarLogo = ({ size = 150 }) => {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size * 0.8} viewBox="0 0 200 160">
        <Defs>
          {/* Gradient for first crescent - White to Baby Blue */}
          <LinearGradient id="crescent1" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#FFFFFF" />
            <Stop offset="50%" stopColor="#E6F3FF" />
            <Stop offset="100%" stopColor="#87CEEB" />
          </LinearGradient>
          
          {/* Gradient for second crescent - Baby Blue to White */}
          <LinearGradient id="crescent2" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#87CEEB" />
            <Stop offset="50%" stopColor="#ADD8E6" />
            <Stop offset="100%" stopColor="#FFFFFF" />
          </LinearGradient>
          
          {/* Gradient for text - White to Baby Blue */}
          <LinearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#FFFFFF" />
            <Stop offset="33%" stopColor="#E6F3FF" />
            <Stop offset="66%" stopColor="#ADD8E6" />
            <Stop offset="100%" stopColor="#87CEEB" />
          </LinearGradient>
        </Defs>
        
        {/* Background glow circles */}
        <Circle cx="60" cy="50" r="30" fill="rgba(255, 255, 255, 0.1)" />
        <Circle cx="140" cy="50" r="30" fill="rgba(135, 206, 235, 0.1)" />
        
        {/* First Crescent Moon (Left) */}
        {/* 3D Shadow */}
        <Path
          d="M 45 25 C 30 25, 20 40, 30 55 C 40 70, 55 65, 65 50 C 75 35, 65 20, 45 25 Z"
          fill="#000000"
          opacity="0.15"
          transform="translate(2, 2)"
        />
        
        {/* Main crescent */}
        <Path
          d="M 45 25 C 30 25, 20 40, 30 55 C 40 70, 55 65, 65 50 C 75 35, 65 20, 45 25 Z"
          fill="url(#crescent1)"
          stroke="#FFFFFF"
          strokeWidth="2"
        />
        
        {/* Highlight for 3D effect */}
        <Path
          d="M 45 30 C 35 30, 28 40, 35 50 C 42 60, 52 58, 58 48 C 64 38, 58 28, 45 30 Z"
          fill="rgba(255, 255, 255, 0.25)"
        />
        
        {/* Second Crescent Moon (Right) */}
        {/* 3D Shadow */}
        <Path
          d="M 155 25 C 140 25, 130 40, 140 55 C 150 70, 165 65, 175 50 C 185 35, 175 20, 155 25 Z"
          fill="#000000"
          opacity="0.15"
          transform="translate(2, 2)"
        />
        
        {/* Main crescent */}
        <Path
          d="M 155 25 C 140 25, 130 40, 140 55 C 150 70, 165 65, 175 50 C 185 35, 175 20, 155 25 Z"
          fill="url(#crescent2)"
          stroke="#87CEEB"
          strokeWidth="2"
        />
        
        {/* Highlight for 3D effect */}
        <Path
          d="M 155 30 C 145 30, 138 40, 145 50 C 152 60, 162 58, 168 48 C 174 38, 168 28, 155 30 Z"
          fill="rgba(255, 255, 255, 0.25)"
        />
        
        {/* Connecting energy beam */}
        <Path
          d="M 75 45 Q 100 35, 125 45 Q 100 55, 75 45"
          fill="rgba(255, 255, 255, 0.3)"
          stroke="rgba(135, 206, 235, 0.5)"
          strokeWidth="1"
        />
        
        {/* Small stars */}
        <Circle cx="25" cy="30" r="1" fill="#FFFFFF" opacity="0.9" />
        <Circle cx="175" cy="35" r="1.2" fill="#87CEEB" opacity="0.8" />
        <Circle cx="30" cy="70" r="0.8" fill="#ADD8E6" opacity="0.7" />
        <Circle cx="170" cy="65" r="1" fill="#FFFFFF" opacity="0.8" />
        
        {/* LUNAR Text with 3D effect */}
        {/* Text shadow */}
        <SvgText
          x="100"
          y="110"
          textAnchor="middle"
          fontSize="24"
          fontWeight="bold"
          fill="#000000"
          opacity="0.25"
          transform="translate(2, 2)"
        >
          LUNAR
        </SvgText>
        
        {/* Main text */}
        <SvgText
          x="100"
          y="110"
          textAnchor="middle"
          fontSize="24"
          fontWeight="bold"
          fill="url(#textGrad)"
          stroke="rgba(135, 206, 235, 0.3)"
          strokeWidth="0.8"
        >
          LUNAR
        </SvgText>
        
        {/* Text highlight */}
        <SvgText
          x="100"
          y="110"
          textAnchor="middle"
          fontSize="24"
          fontWeight="bold"
          fill="rgba(255, 255, 255, 0.3)"
          transform="translate(-1, -1)"
        >
          LUNAR
        </SvgText>
        
        {/* Subtitle */}
        <SvgText
          x="100"
          y="125"
          textAnchor="middle"
          fontSize="8"
          fill="rgba(255, 255, 255, 0.9)"
        >
          SERVICE PLATFORM
        </SvgText>
      </Svg>
    </View>
  );
};

export default LunarLogo;