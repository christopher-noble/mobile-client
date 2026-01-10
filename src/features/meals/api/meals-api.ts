import { apiClient } from '@/src/shared/api/client';
import { mockApi } from '@/src/shared/api/mock-data';
import { PaginatedResponse } from '@/src/shared/types';
import type { CreateMealRequest, Meal, MealListParams } from '../types';

const USE_MOCK_DATA = !process.env.EXPO_PUBLIC_API_URL;

export const getMeals = async (params?: MealListParams) => {
  if (USE_MOCK_DATA) {
    return await mockApi.getMeals();
  }
  const response = await apiClient.get<PaginatedResponse<Meal>>('/meals', params);
  return response.data;
};

export const getMealById = async (id: string) => {
  if (USE_MOCK_DATA) {
    return await mockApi.getMealById(id);
  }
  const response = await apiClient.get<Meal>(`/meals/${id}`);
  return response.data;
};

export const createMeal = async (meal: CreateMealRequest) => {
  const response = await apiClient.post<Meal>('/meals', meal);
  return response.data;
};
