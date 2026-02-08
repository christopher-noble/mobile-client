import { router } from 'expo-router';
import React, { useCallback } from 'react';
import { ActivityIndicator, FlatList, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { Meal } from '@/src/shared/api/generated/graphql';
import { useMeals } from '../hooks/use-meals';
import { MealCard } from './meal-card';

const MAX_WIDTH_WEB = 1200;

interface MealListProps {
  userId: string;
  onMealPress?: (meal: Meal) => void;
}

export const MealList: React.FC<MealListProps> = ({ userId, onMealPress }) => {
  const { data, loading, error, refetch } = useMeals({ variables: { userId } });

  const handleCardPress = useCallback((meal: Meal) => {
    if (onMealPress) {
      onMealPress(meal);
    } else {
      router.push({ pathname: '/meal/[id]', params: { id: meal.id, mealData: JSON.stringify(meal) } });
    }
  }, [onMealPress]);

  if (loading && !data) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error.message}</Text>
        <Text style={styles.retryText} onPress={() => refetch()}>Tap to retry</Text>
      </View>
    );
  }

  if (!data?.meals.length) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>No meals found</Text>
      </View>
    );
  }

  if (Platform.OS === 'web') {
    return (
      <ScrollView contentContainerStyle={styles.webContainer}>
        <View style={styles.webGrid}>
          {data.meals.map((meal) => (
            <MealCard key={meal.id} meal={meal} onPress={handleCardPress} />
          ))}
        </View>
      </ScrollView>
    );
  }

  return (
    <FlatList
      data={data.meals}
      renderItem={({ item }) => <MealCard meal={item} onPress={handleCardPress} />}
      keyExtractor={(item) => item.id}
      numColumns={2}
      contentContainerStyle={styles.list}
      refreshing={loading}
      onRefresh={() => refetch()}
    />
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  list: {
    padding: 16,
  },
  webContainer: {
    alignItems: 'center',
    padding: 16,
    paddingBottom: 40,
  },
  webGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    maxWidth: MAX_WIDTH_WEB,
    gap: 8,
  },
  errorText: {
    fontSize: 16,
    color: '#DC2626',
    marginBottom: 8,
  },
  retryText: {
    fontSize: 14,
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
  },
});
