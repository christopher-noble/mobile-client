/**
 * Meals Feature Types
 * 
 * Type definitions specific to the meals feature
 */

import { BaseEntity } from '@/src/shared/types';

/**
 * Meal entity
 */
export type Meal = BaseEntity & {
  name: string;
  description: string;
  imageUrl?: string;
  category: MealCategory;
  ingredients: string[];
  nutritionalInfo?: NutritionalInfo;
};

/**
 * Meal category
 */
export type MealCategory = 
  | 'breakfast'
  | 'lunch'
  | 'dinner'
  | 'snack'
  | 'dessert'
  | 'beverage';

/**
 * Nutritional information
 */
export type NutritionalInfo = {
  calories: number;
  protein: number; // in grams
  carbs: number; // in grams
  fat: number; // in grams
  fiber?: number; // in grams
};

/**
 * Create meal request
 */
export type CreateMealRequest = Omit<Meal, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * Update meal request
 */
export type UpdateMealRequest = Partial<CreateMealRequest>;

/**
 * Meal filters
 */
export type MealFilters = {
  category?: MealCategory;
  search?: string;
};

/**
 * Meal list query params
 */
export type MealListParams = {
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
} & MealFilters;
