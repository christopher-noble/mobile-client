import { router } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { useMeals } from '../hooks/use-meals';
import type { Meal, MealListParams } from '../types';
import { MealCard } from './meal-card';

const LOADING_INDICATOR_COLOR = '#007AFF';
const LOADING_INDICATOR_SIZE = 'large';
const ERROR_COLOR = '#FF3B30';
const RETRY_COLOR = '#007AFF';
const EMPTY_TEXT_COLOR = '#999';
const PADDING_SIZE = 32;
const LIST_PADDING = 16;
const FONT_SIZE_LARGE = 16;
const FONT_SIZE_SMALL = 14;
const ERROR_MARGIN_BOTTOM = 8;
const EMPTY_MESSAGE = 'No meals found';
const RETRY_MESSAGE = 'Tap to retry';
const NUM_COLUMNS = 2;
const FLATLIST_KEY = `meals-list-${NUM_COLUMNS}`;

type MealListProps = {
  params?: MealListParams;
  onMealPress?: (meal: Meal) => void;
};

export const MealList: React.FC<MealListProps> = ({ params, onMealPress }) => {
  const { data, status, error, refetch } = useMeals(params);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const handleCardPress = useCallback((meal: Meal) => {
    if (onMealPress) {
      onMealPress(meal);
    } else {
      router.push({
        pathname: '/meal/[id]' as const,
        params: {
          id: meal.id,
          mealData: JSON.stringify(meal),
        },
      });
    }
  }, [onMealPress]);

  if (status === 'loading' && !data) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size={LOADING_INDICATOR_SIZE} color={LOADING_INDICATOR_COLOR} />
      </View>
    );
  }

  if (status === 'error' && !data) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
        <Text style={styles.retryText} onPress={handleRefresh}>
          {RETRY_MESSAGE}
        </Text>
      </View>
    );
  }

  if (!data || data.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>{EMPTY_MESSAGE}</Text>
      </View>
    );
  }

  return (
    <FlatList
      key={FLATLIST_KEY}
      data={data}
      renderItem={({ item }) => (
        <MealCard meal={item} onPress={handleCardPress} />
      )}
      keyExtractor={(item) => item.id}
      numColumns={NUM_COLUMNS}
      contentContainerStyle={styles.list}
      refreshing={refreshing}
      onRefresh={handleRefresh}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    padding: LIST_PADDING,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: PADDING_SIZE,
  },
  errorText: {
    fontSize: FONT_SIZE_LARGE,
    color: ERROR_COLOR,
    textAlign: 'center',
    marginBottom: ERROR_MARGIN_BOTTOM,
  },
  retryText: {
    fontSize: FONT_SIZE_SMALL,
    color: RETRY_COLOR,
    textDecorationLine: 'underline',
  },
  emptyText: {
    fontSize: FONT_SIZE_LARGE,
    color: EMPTY_TEXT_COLOR,
    textAlign: 'center',
  },
});
