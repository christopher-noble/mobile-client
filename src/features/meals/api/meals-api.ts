/**
 * Meals API
 * 
 * API calls for the meals feature
 */

import { mockApi } from '@/src/shared/api/mock-data';
import { apiClient } from '@/src/shared/api/client';
import { PaginatedResponse } from '@/src/shared/types';
import type { CreateMealRequest, Meal, MealListParams, UpdateMealRequest } from '../types';

const USE_MOCK_DATA = !process.env.EXPO_PUBLIC_API_URL;

/**
 * Get all meals with optional filters
 */
export const getMeals = async (params?: MealListParams) => {
  if (USE_MOCK_DATA) {
    return await mockApi.getMeals();
  }
  const response = await apiClient.get<PaginatedResponse<Meal>>('/meals', params);
  return response.data;
};

/**
 * Get meal by ID
 */
export const getMealById = async (id: string) => {
  if (USE_MOCK_DATA) {
    return await mockApi.getMealById(id);
  }
  const response = await apiClient.get<Meal>(`/meals/${id}`);
  return response.data;
};

/**
 * Create a new meal
 */
export const createMeal = async (meal: CreateMealRequest) => {
  const response = await apiClient.post<Meal>('/meals', meal);
  return response.data;
};

/**
 * Update an existing meal
 */
export const updateMeal = async (id: string, meal: UpdateMealRequest) => {
  const response = await apiClient.patch<Meal>(`/meals/${id}`, meal);
  return response.data;
};

/**
 * Delete a meal
 */
export const deleteMeal = async (id: string) => {
  await apiClient.delete(`/meals/${id}`);
};

/**
 * Get meals by category
 */
export const getMealsByCategory = async (category: string, params?: MealListParams) => {
  const response = await apiClient.get<PaginatedResponse<Meal>>(
    `/meals/category/${category}`,
    params
  );
  return response.data;
};
