/**
 * useMealMutations Hook
 * 
 * Custom hook for meal mutations (create, update, delete)
 */

import type { Status } from '@/src/shared/types';
import { useCallback, useState } from 'react';
import { createMeal, deleteMeal, updateMeal } from '../api/meals-api';
import type { CreateMealRequest, Meal, UpdateMealRequest } from '../types';

type MutationState = {
  status: Status;
  error: string | null;
};

type UseCreateMealReturn = MutationState & {
  createMeal: (meal: CreateMealRequest) => Promise<Meal | null>;
};

type UseUpdateMealReturn = MutationState & {
  updateMeal: (id: string, meal: UpdateMealRequest) => Promise<Meal | null>;
};

type UseDeleteMealReturn = MutationState & {
  deleteMeal: (id: string) => Promise<void>;
};

/**
 * Hook for creating meals
 */
export const useCreateMeal = (): UseCreateMealReturn => {
  const [state, setState] = useState<MutationState>({
    status: 'idle',
    error: null,
  });

  const mutate = useCallback(async (meal: CreateMealRequest) => {
    setState({ status: 'loading', error: null });

    try {
      const created = await createMeal(meal);
      setState({ status: 'success', error: null });
      return created;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create meal';
      setState({ status: 'error', error: errorMessage });
      return null;
    }
  }, []);

  return {
    ...state,
    createMeal: mutate,
  };
};

/**
 * Hook for updating meals
 */
export const useUpdateMeal = (): UseUpdateMealReturn => {
  const [state, setState] = useState<MutationState>({
    status: 'idle',
    error: null,
  });

  const mutate = useCallback(async (id: string, meal: UpdateMealRequest) => {
    setState({ status: 'loading', error: null });

    try {
      const updated = await updateMeal(id, meal);
      setState({ status: 'success', error: null });
      return updated;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update meal';
      setState({ status: 'error', error: errorMessage });
      return null;
    }
  }, []);

  return {
    ...state,
    updateMeal: mutate,
  };
};

/**
 * Hook for deleting meals
 */
export const useDeleteMeal = (): UseDeleteMealReturn => {
  const [state, setState] = useState<MutationState>({
    status: 'idle',
    error: null,
  });

  const mutate = useCallback(async (id: string) => {
    setState({ status: 'loading', error: null });

    try {
      await deleteMeal(id);
      setState({ status: 'success', error: null });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete meal';
      setState({ status: 'error', error: errorMessage });
      throw error;
    }
  }, []);

  return {
    ...state,
    deleteMeal: mutate,
  };
};
