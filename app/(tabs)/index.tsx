import type { Meal } from '@/src/features/meals';
import { MealList } from '@/src/features/meals';
import { router } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const HEADER_PADDING = 20;
const HEADER_PADDING_BOTTOM = 16;
const EMOJI_SIZE = 32;
const TITLE_FONT_SIZE = 36;
const TITLE_FONT_WEIGHT = '800';
const SUBTITLE_FONT_SIZE = 16;
const SUBTITLE_COLOR = '#666';
const TITLE_COLOR = '#1a1a1a';
const GRADIENT_START = '#FF6B6B';
const GRADIENT_END = '#4ECDC4';

export default function HomeScreen() {
  const handleMealPress = (meal: Meal) => {
    router.push({
      pathname: '/meal/[id]' as const,
      params: {
        id: meal.id,
        mealData: JSON.stringify(meal),
      },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <Animated.View
        entering={FadeInDown.delay(100).springify()}
        className="px-5 pb-4"
        style={{
          padding: HEADER_PADDING,
          paddingBottom: HEADER_PADDING_BOTTOM,
        }}
      >
        <View className="flex-row items-center mb-2">
          <View className="flex-1">
            <Animated.Text
              entering={FadeInRight.delay(300).springify()}
              className="text-gray-900 font-extrabold"
              style={{
                fontSize: TITLE_FONT_SIZE,
                fontWeight: TITLE_FONT_WEIGHT,
                color: TITLE_COLOR,
              }}
            >
              Your Top Meals
            </Animated.Text>
          </View>
        </View>
      </Animated.View>
      <MealList onMealPress={handleMealPress} />
    </SafeAreaView>
  );
}
