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
export { useCreateMeal } from './hooks/use-meal-mutations';

// Types
export type {
  Meal,
  MealCategory,
  NutritionalInfo,
  CreateMealRequest,
  MealFilters,
  MealListParams,
} from './types';


// API (usually not exported, but available if needed)
export * from './api/meals-api';
