# Adding Your Lunar Logo to Splash Screen

## Quick Setup Instructions:

### 1. Add Your Logo Image
- Place your lunar logo image in `/assets/images/` folder
- Recommended name: `lunar-logo.png` (or whatever you prefer)
- Recommended size: 100x100px to 200x200px for best quality

### 2. Update SplashScreen.js
Open `/src/screens/SplashScreen.js` and make these changes:

**Step A: Update the import statement (line 3)**
```javascript
// Change from:
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';

// Change to:
import { View, Text, StyleSheet, Animated, Dimensions, Image } from 'react-native';
```

**Step B: Replace the logo placeholder (around line 60)**
```javascript
// Replace this entire section:
<View style={styles.logoPlaceholder}>
  {/* Lunar Logo Placeholder - Replace with your actual logo */}
  <View style={styles.moonContainer}>
    // ... all the placeholder moon code
  </View>
</View>

// With this:
<View style={styles.logoPlaceholder}>
  <Image 
    source={require("../../assets/images/lunar-logo.png")} 
    style={styles.logoImage}
    resizeMode="contain"
  />
</View>
```

### 3. Customize App Name (Optional)
In the same file, you can change:
```javascript
<Text style={styles.appName}>Service MVP</Text>
<Text style={styles.appTagline}>Your Service Booking Platform</Text>
```

To your preferred app name and tagline.

### 4. Animation Timing (Optional)
You can adjust timing in the `useEffect` section:
- `duration: 800` - Background fade in speed
- `duration: 1000` - Logo appearance speed  
- `setTimeout(() => {}, 1500)` - How long logo stays visible
- `duration: 600` - Fade out speed

## Current Splash Screen Flow:
1. App opens → Dark gradient background fades in
2. Lunar logo appears with scaling animation
3. Floating particles animate around logo
4. After 1.5 seconds, everything fades out
5. Automatically navigates to Login screen

## Customization Options:
- **Background colors**: Change the LinearGradient colors array
- **Logo size**: Modify `logoImage` width/height in styles
- **Animation style**: Adjust spring tension/friction values
- **Particles**: Change count, size, or colors in the particle array