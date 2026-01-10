import type { Status } from '@/src/shared/types';
import { useCallback, useState } from 'react';
import { createMeal } from '../api/meals-api';
import type { CreateMealRequest, Meal } from '../types';

type MutationState = {
  status: Status;
  error: string | null;
};

type UseCreateMealReturn = MutationState & {
  createMeal: (meal: CreateMealRequest) => Promise<Meal | null>;
};

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
