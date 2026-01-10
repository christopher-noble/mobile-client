import { IconSymbol } from '@/components/ui/icon-symbol';
import type { Meal } from '@/src/features/meals';
import { MealList } from '@/src/features/meals';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const HEADER_PADDING = 20;
const HEADER_PADDING_BOTTOM = 16;
const TITLE_FONT_SIZE = 36;
const TITLE_FONT_WEIGHT = '800';
const TITLE_COLOR = '#1a1a1a';
const ADD_BUTTON_SIZE = 44;
const ADD_BUTTON_BORDER_RADIUS = 22;
const ADD_ICON_SIZE = 24;
const ADD_ICON_COLOR = '#007AFF';
const ADD_BUTTON_BACKGROUND = '#F0F9FF';

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

  const handleAddMealPress = () => {
    router.push('/meal/add' as const);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Animated.View
        entering={FadeInDown.delay(100).springify()}
        style={styles.headerContainer}
      >
        <View style={styles.headerRow}>
          <View style={styles.titleContainer}>
            <Animated.Text
              entering={FadeInRight.delay(300).springify()}
              style={styles.title}
            >
              Meals
            </Animated.Text>
          </View>
          <Animated.View entering={FadeInRight.delay(400).springify()}>
            <TouchableOpacity
              onPress={handleAddMealPress}
              style={styles.addButton}
            >
              <IconSymbol
                name="plus"
                size={ADD_ICON_SIZE}
                color={ADD_ICON_COLOR}
                weight="semibold"
              />
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Animated.View>
      <MealList onMealPress={handleMealPress} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  headerContainer: {
    padding: HEADER_PADDING,
    paddingBottom: HEADER_PADDING_BOTTOM,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: TITLE_FONT_SIZE,
    fontWeight: TITLE_FONT_WEIGHT,
    color: TITLE_COLOR,
  },
  addButton: {
    width: ADD_BUTTON_SIZE,
    height: ADD_BUTTON_SIZE,
    borderRadius: ADD_BUTTON_BORDER_RADIUS,
    backgroundColor: ADD_BUTTON_BACKGROUND,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
