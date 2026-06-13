import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Colors from '../../constants/colors';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    id: 1,
    title: 'Take Control of\nYour Feed',
    subtitle: 'Stop seeing content you hate. Start seeing content that matters to you.',
    emoji: '🎯',
  },
  {
    id: 2,
    title: 'Choose Your\nInterests',
    subtitle: 'Select topics you love and topics you want to avoid. We handle the rest.',
    emoji: '✨',
  },
  {
    id: 3,
    title: 'Auto\nPersonalization',
    subtitle: 'Our smart system works in the background to improve your feed over time.',
    emoji: '🤖',
  },
  {
    id: 4,
    title: 'Watch Your Feed\nTransform',
    subtitle: 'Track progress and see your Instagram become truly yours.',
    emoji: '📈',
  },
];

import { useState, useRef } from 'react';
import { FlatList, Animated } from 'react-native';

export default function Onboarding() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current.scrollToIndex({ index: currentIndex + 1 });
      setCurrentIndex(currentIndex + 1);
    } else {
      router.push('/(auth)/login');
    }
  };

  const handleSkip = () => {
    router.push('/(auth)/login');
  };

  const renderSlide = ({ item }) => (
    <View style={styles.slide}>
      <View style={styles.emojiContainer}>
        <Text style={styles.emoji}>{item.emoji}</Text>
      </View>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.subtitle}>{item.subtitle}</Text>
    </View>
  );

  return (
    <LinearGradient colors={['#0A0A0F', '#12121A']} style={styles.container}>
      <StatusBar style="light" />

      {/* Skip Button */}
      <TouchableOpacity style={styles.skipBtn} onPress={handleSkip}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      {/* Slides */}
      <Animated.FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
      />

      {/* Dots */}
      <View style={styles.dotsContainer}>
        {slides.map((_, i) => {
          const opacity = scrollX.interpolate({
            inputRange: [(i - 1) * width, i * width, (i + 1) * width],
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
          });
          const dotWidth = scrollX.interpolate({
            inputRange: [(i - 1) * width, i * width, (i + 1) * width],
            outputRange: [8, 24, 8],
            extrapolate: 'clamp',
          });
          return (
            <Animated.View
              key={i}
              style={[styles.dot, { opacity, width: dotWidth }]}
            />
          );
        })}
      </View>

      {/* Next / Get Started Button */}
      <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
        <LinearGradient
          colors={['#00D4AA', '#7C3AED']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradientBtn}
        >
          <Text style={styles.nextText}>
            {currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  skipBtn: {
    alignSelf: 'flex-end',
    marginTop: 60,
    marginRight: 24,
    padding: 8,
  },
  skipText: {
    color: Colors.textSecondary,
    fontSize: 16,
  },
  slide: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingBottom: 60,
  },
  emojiContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  emoji: {
    fontSize: 56,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: Colors.text,
    textAlign: 'center',
    lineHeight: 44,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 26,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  nextBtn: {
    width: width - 48,
    marginBottom: 48,
    borderRadius: 16,
    overflow: 'hidden',
  },
  gradientBtn: {
    paddingVertical: 18,
    alignItems: 'center',
    borderRadius: 16,
  },
  nextText: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
});