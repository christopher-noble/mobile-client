import { IconSymbol } from '@/components/ui/icon-symbol';
import { MealList } from '@/src/features/meals';
import type { Meal } from '@/src/shared/api/generated/graphql';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const MAX_WIDTH_WEB = 1200;
const PLACEHOLDER_USER_ID = '00000000-0000-0000-0000-000000000001';

export default function HomeScreen() {
  const [addHovered, setAddHovered] = useState(false);

  const handleMealPress = (meal: Meal) => {
    router.push({ pathname: '/meal/[id]', params: { id: meal.id, mealData: JSON.stringify(meal) } });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.headerWrapper}>
        <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.header}>
          <Animated.Text entering={FadeInRight.delay(300).springify()} style={styles.title}>
            Meals
          </Animated.Text>
          <Animated.View entering={FadeInRight.delay(400).springify()}>
            <Pressable
              onPress={() => router.push('/meal/add')}
              onHoverIn={() => setAddHovered(true)}
              onHoverOut={() => setAddHovered(false)}
              style={[styles.addButton, addHovered && styles.addButtonHovered]}
            >
              <IconSymbol name="plus" size={24} color="#007AFF" weight="semibold" />
            </Pressable>
          </Animated.View>
        </Animated.View>
      </View>
      <MealList userId={PLACEHOLDER_USER_ID} onMealPress={handleMealPress} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  headerWrapper: {
    alignItems: 'center',
  },
  header: {
    width: '100%',
    maxWidth: Platform.OS === 'web' ? MAX_WIDTH_WEB : undefined,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: Platform.OS === 'web' ? 40 : 20,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#1a1a1a',
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F0F9FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonHovered: {
    backgroundColor: '#E0F2FE',
    transform: [{ scale: 1.05 }],
  },
});
