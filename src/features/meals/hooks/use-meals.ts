/**
 * useMeals Hook
 * 
 * Custom hook for fetching and managing meals data
 */

import type { AsyncState } from '@/src/shared/types';
import { useCallback, useEffect, useState } from 'react';
import { getMealById, getMeals } from '../api/meals-api';
import type { Meal, MealListParams } from '../types';

type UseMealsReturn = AsyncState<Meal[]> & {
  refetch: () => Promise<void>;
};

/**
 * Hook to fetch list of meals
 */
export const useMeals = (params?: MealListParams): UseMealsReturn => {
  const [state, setState] = useState<AsyncState<Meal[]>>({
    data: null,
    status: 'idle',
    error: null,
  });

  const fetchMeals = useCallback(async () => {
    setState((prev) => ({ ...prev, status: 'loading', error: null }));

    try {
      const response = await getMeals(params);
      setState({
        data: response.items,
        status: 'success',
        error: null,
      });
    } catch (error) {
      setState({
        data: null,
        status: 'error',
        error: error instanceof Error ? error.message : 'Failed to fetch meals',
      });
    }
  }, [params]);

  useEffect(() => {
    fetchMeals();
  }, [fetchMeals]);

  return {
    ...state,
    refetch: fetchMeals,
  };
};

/**
 * Hook to fetch a single meal by ID
 */
export const useMeal = (id: string | null) => {
  const [state, setState] = useState<AsyncState<Meal>>({
    data: null,
    status: 'idle',
    error: null,
  });

  useEffect(() => {
    if (!id) {
      setState({ data: null, status: 'idle', error: null });
      return;
    }

    const fetchMeal = async () => {
      setState((prev) => ({ ...prev, status: 'loading', error: null }));

      try {
        const meal = await getMealById(id);
        setState({
          data: meal,
          status: 'success',
          error: null,
        });
      } catch (error) {
        setState({
          data: null,
          status: 'error',
          error: error instanceof Error ? error.message : 'Failed to fetch meal',
        });
      }
    };

    fetchMeal();
  }, [id]);

  return state;
};
