/**
 * Meals Feature Public API
 * 
 * This file exports all public APIs for the meals feature.
 * Other parts of the app should only import from this file.
 */

// Components
export { MealCard } from './components/meal-card';
export { MealList } from './components/meal-list';

// Hooks
export { useMeals, useMeal } from './hooks/use-meals';
export { useCreateMeal, useUpdateMeal, useDeleteMeal } from './hooks/use-meal-mutations';

// Types
export type {
  Meal,
  MealCategory,
  NutritionalInfo,
  CreateMealRequest,
  UpdateMealRequest,
  MealFilters,
  MealListParams,
} from './types';

// Utils
export { getCategoryDisplayName, filterMealsBySearch, sortMeals } from './utils';

// API (usually not exported, but available if needed)
export * from './api/meals-api';
