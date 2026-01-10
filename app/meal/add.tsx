import { IconSymbol } from '@/components/ui/icon-symbol';
import type { MealCategory } from '@/src/features/meals';
import { useCreateMeal } from '@/src/features/meals';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const BACK_BUTTON_SIZE = 44;
const BACK_BUTTON_BORDER_RADIUS = 22;
const HEADER_PADDING = 20;
const HEADER_PADDING_BOTTOM = 16;
const TITLE_FONT_SIZE = 32;
const TITLE_FONT_WEIGHT = '800';
const CONTENT_PADDING = 24;
const SECTION_SPACING = 24;
const INPUT_BORDER_RADIUS = 12;
const INPUT_PADDING = 16;
const INPUT_FONT_SIZE = 16;
const LABEL_FONT_SIZE = 14;
const LABEL_FONT_WEIGHT = '600';
const LABEL_MARGIN_BOTTOM = 8;
const BUTTON_HEIGHT = 56;
const BUTTON_BORDER_RADIUS = 16;
const BUTTON_FONT_SIZE = 18;
const BUTTON_FONT_WEIGHT = '700';
const ADD_ITEM_BUTTON_HEIGHT = 44;
const ADD_ITEM_BUTTON_BORDER_RADIUS = 12;
const ADD_ITEM_BUTTON_FONT_SIZE = 14;
const REMOVE_BUTTON_SIZE = 32;
const REMOVE_BUTTON_BORDER_RADIUS = 16;
const ITEM_SPACING = 12;
const TEXT_COLOR_PRIMARY = '#1a1a1a';
const TEXT_COLOR_SECONDARY = '#666';
const TEXT_COLOR_PLACEHOLDER = '#999';
const BACKGROUND_COLOR = '#ffffff';
const INPUT_BACKGROUND = '#F9FAFB';
const INPUT_BORDER_COLOR = '#E5E7EB';
const BUTTON_BACKGROUND = '#007AFF';
const BUTTON_DISABLED_BACKGROUND = '#E5E7EB';
const BUTTON_TEXT_COLOR = '#ffffff';
const BUTTON_DISABLED_TEXT_COLOR = '#999';
const ADD_ITEM_BUTTON_BACKGROUND = '#F3F4F6';
const ADD_ITEM_BUTTON_TEXT_COLOR = '#007AFF';
const REMOVE_BUTTON_BACKGROUND = '#FEE2E2';
const REMOVE_BUTTON_TEXT_COLOR = '#DC2626';
const ERROR_COLOR = '#DC2626';
const BACK_ICON_SIZE = 24;
const BACK_ICON_COLOR = '#000';
const BACK_BUTTON_BACKGROUND = 'rgba(255, 255, 255, 0.9)';
const CARD_SHADOW_COLOR = '#000';
const CARD_SHADOW_OFFSET_X = 0;
const CARD_SHADOW_OFFSET_Y = 2;
const CARD_SHADOW_OPACITY = 0.1;
const CARD_SHADOW_RADIUS = 4;
const CARD_ELEVATION = 3;
const STEP_NUMBER_SIZE = 32;
const STEP_NUMBER_BORDER_RADIUS = 16;
const STEP_NUMBER_BACKGROUND = '#007AFF';
const STEP_NUMBER_TEXT_COLOR = '#ffffff';
const STEP_NUMBER_FONT_SIZE = 14;
const STEP_NUMBER_FONT_WEIGHT = '700';
const INCREMENTER_BUTTON_SIZE = 48;
const INCREMENTER_BUTTON_BACKGROUND = '#F0F9FF';
const INCREMENTER_BUTTON_ICON_COLOR = '#007AFF';
const INCREMENTER_VALUE_BACKGROUND = '#F9FAFB';
const INCREMENTER_VALUE_BORDER_RADIUS = 16;
const INCREMENTER_VALUE_FONT_SIZE = 24;
const INCREMENTER_VALUE_FONT_WEIGHT = '700';
const HYPHEN_VALUE_FONT_WEIGHT = '500';
const INCREMENTER_VALUE_COLOR = '#1a1a1a';
const MIN_SERVES = 1;
const MAX_SERVES = 20;

const MEAL_CATEGORIES: MealCategory[] = ['breakfast', 'lunch', 'dinner', 'snack', 'dessert', 'beverage'];

type FormData = {
  name: string;
  category: MealCategory;
  ingredients: string[];
  steps: string[];
  serves: number;
};

const INITIAL_FORM_DATA: FormData = {
  name: '',
  category: 'dinner',
  ingredients: [''],
  steps: [],
  serves: 0,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: HEADER_PADDING,
    paddingBottom: HEADER_PADDING_BOTTOM,
    paddingTop: 8,
  },
  backButton: {
    width: BACK_BUTTON_SIZE,
    height: BACK_BUTTON_SIZE,
    borderRadius: BACK_BUTTON_BORDER_RADIUS,
    backgroundColor: BACK_BUTTON_BACKGROUND,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    shadowColor: CARD_SHADOW_COLOR,
    shadowOffset: { width: CARD_SHADOW_OFFSET_X, height: CARD_SHADOW_OFFSET_Y },
    shadowOpacity: CARD_SHADOW_OPACITY,
    shadowRadius: CARD_SHADOW_RADIUS,
    elevation: CARD_ELEVATION,
  },
  title: {
    flex: 1,
    fontSize: TITLE_FONT_SIZE,
    fontWeight: TITLE_FONT_WEIGHT,
    marginLeft: '15%',
    color: TEXT_COLOR_PRIMARY,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: CONTENT_PADDING,
  },
  inputGroup: {
    marginBottom: SECTION_SPACING,
  },
  label: {
    fontSize: LABEL_FONT_SIZE,
    fontWeight: LABEL_FONT_WEIGHT,
    color: TEXT_COLOR_PRIMARY,
    marginBottom: LABEL_MARGIN_BOTTOM,
  },
  input: {
    backgroundColor: INPUT_BACKGROUND,
    borderWidth: 1,
    borderColor: INPUT_BORDER_COLOR,
    borderRadius: INPUT_BORDER_RADIUS,
    padding: INPUT_PADDING,
    fontSize: INPUT_FONT_SIZE,
    color: TEXT_COLOR_PRIMARY,
  },
  nameInput: {
    fontSize: TITLE_FONT_SIZE,
    fontWeight: TITLE_FONT_WEIGHT,
    color: TEXT_COLOR_PRIMARY,
    paddingLeft: 5,
    margin: 0,
    minHeight: 50,
  },
  textArea: {
    minHeight: 120,
    paddingTop: INPUT_PADDING,
  },
  categoryContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: INPUT_BACKGROUND,
    borderWidth: 1,
    borderColor: INPUT_BORDER_COLOR,
  },
  categoryChipActive: {
    backgroundColor: BUTTON_BACKGROUND,
    borderColor: BUTTON_BACKGROUND,
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: TEXT_COLOR_SECONDARY,
    textTransform: 'capitalize',
  },
  categoryChipTextActive: {
    color: BUTTON_TEXT_COLOR,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: ITEM_SPACING,
    gap: 8,
  },
  ingredientInput: {
    flex: 1,
  },
  removeButton: {
    width: REMOVE_BUTTON_SIZE,
    height: REMOVE_BUTTON_SIZE,
    borderRadius: REMOVE_BUTTON_BORDER_RADIUS,
    backgroundColor: REMOVE_BUTTON_BACKGROUND,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonText: {
    fontSize: 24,
    color: REMOVE_BUTTON_TEXT_COLOR,
    fontWeight: '600',
    lineHeight: 24,
  },
  addItemButton: {
    height: ADD_ITEM_BUTTON_HEIGHT,
    borderRadius: ADD_ITEM_BUTTON_BORDER_RADIUS,
    backgroundColor: ADD_ITEM_BUTTON_BACKGROUND,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  addItemButtonText: {
    fontSize: ADD_ITEM_BUTTON_FONT_SIZE,
    fontWeight: '600',
    color: ADD_ITEM_BUTTON_TEXT_COLOR,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: ITEM_SPACING,
    gap: 12,
  },
  stepNumberContainer: {
    width: STEP_NUMBER_SIZE,
    height: STEP_NUMBER_SIZE,
    borderRadius: STEP_NUMBER_BORDER_RADIUS,
    backgroundColor: STEP_NUMBER_BACKGROUND,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumber: {
    fontSize: STEP_NUMBER_FONT_SIZE,
    fontWeight: STEP_NUMBER_FONT_WEIGHT,
    color: STEP_NUMBER_TEXT_COLOR,
  },
  stepInput: {
    flex: 1,
  },
  incrementerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  incrementerButton: {
    width: INCREMENTER_BUTTON_SIZE,
    height: INCREMENTER_BUTTON_SIZE,
    borderRadius: INCREMENTER_BUTTON_SIZE / 2,
    backgroundColor: INCREMENTER_BUTTON_BACKGROUND,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: INCREMENTER_BUTTON_ICON_COLOR,
  },
  incrementerButtonDisabled: {
    backgroundColor: INPUT_BACKGROUND,
    borderColor: INPUT_BORDER_COLOR,
    opacity: 0.5,
  },
  incrementerButtonText: {
    fontSize: 24,
    fontWeight: '700',
    color: INCREMENTER_BUTTON_ICON_COLOR,
    lineHeight: 28,
  },
  incrementerButtonTextDisabled: {
    color: TEXT_COLOR_PLACEHOLDER,
  },
  incrementerValueContainer: {
    width: 80,
    height: 64,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: INCREMENTER_VALUE_BORDER_RADIUS,
    backgroundColor: INCREMENTER_VALUE_BACKGROUND,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: INPUT_BORDER_COLOR,
  },
  incrementerValueWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 28,
  },
  incrementerValue: {
    fontSize: INCREMENTER_VALUE_FONT_SIZE,
    fontWeight: INCREMENTER_VALUE_FONT_WEIGHT,
    color: INCREMENTER_VALUE_COLOR,
    lineHeight: 30,
    textAlign: 'center',
  },
  incrementerValueHyphen: {
    fontSize: INCREMENTER_VALUE_FONT_SIZE,
    fontWeight: HYPHEN_VALUE_FONT_WEIGHT,
    color: INCREMENTER_VALUE_COLOR,
    lineHeight: 40,
    textAlign: 'center',
  },
  incrementerLabel: {
    fontSize: 11,
    color: TEXT_COLOR_SECONDARY,
    marginTop: 2,
    fontWeight: '500',
    height: 14,
    textAlign: 'center',
  },
  footer: {
    padding: CONTENT_PADDING,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: INPUT_BORDER_COLOR,
    backgroundColor: BACKGROUND_COLOR,
  },
  submitButton: {
    height: BUTTON_HEIGHT,
    borderRadius: BUTTON_BORDER_RADIUS,
    backgroundColor: BUTTON_BACKGROUND,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: BUTTON_DISABLED_BACKGROUND,
  },
  submitButtonText: {
    fontSize: BUTTON_FONT_SIZE,
    fontWeight: BUTTON_FONT_WEIGHT,
    color: BUTTON_TEXT_COLOR,
  },
  submitButtonTextDisabled: {
    color: BUTTON_DISABLED_TEXT_COLOR,
  },
  errorText: {
    fontSize: 14,
    color: ERROR_COLOR,
    textAlign: 'center',
    marginTop: 8,
  },
  spacer: {
    height: 20,
  },
});

export default function AddMealScreen() {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [ingredientInputs, setIngredientInputs] = useState<string[]>(['']);
  const [stepInputs, setStepInputs] = useState<string[]>([]);
  const [showSteps, setShowSteps] = useState<boolean>(false);
  const { createMeal, status, error } = useCreateMeal();
  const nameInputRef = useRef<TextInput>(null);
  const ingredientInputRefs = useRef<(TextInput | null)[]>([]);
  const stepInputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      nameInputRef.current?.focus();
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const handleNameChange = (text: string) => {
    setFormData((prev) => ({ ...prev, name: text }));
  };

  const handleCategoryChange = (category: MealCategory) => {
    setFormData((prev) => ({ ...prev, category }));
  };

  const handleIngredientChange = (index: number, text: string) => {
    const newIngredients = [...ingredientInputs];
    newIngredients[index] = text;
    setIngredientInputs(newIngredients);
  };

  const handleAddIngredient = () => {
    const newIndex = ingredientInputs.length;
    setIngredientInputs([...ingredientInputs, '']);
    setTimeout(() => {
      ingredientInputRefs.current[newIndex]?.focus();
    }, 100);
  };

  const handleIngredientSubmit = (index: number) => {
    const nextIndex = index + 1;
    if (nextIndex < ingredientInputs.length) {
      setTimeout(() => {
        ingredientInputRefs.current[nextIndex]?.focus();
      }, 100);
    } else {
      handleAddIngredient();
    }
  };

  const handleRemoveIngredient = (index: number) => {
    if (ingredientInputs.length > 1) {
      const newIngredients = ingredientInputs.filter((_, i) => i !== index);
      setIngredientInputs(newIngredients);
    }
  };

  const handleStepChange = (index: number, text: string) => {
    const newSteps = [...stepInputs];
    newSteps[index] = text;
    setStepInputs(newSteps);
  };

  const handleAddSteps = () => {
    setShowSteps(true);
    const newIndex = stepInputs.length;
    const newSteps = stepInputs.length === 0 ? [''] : [...stepInputs, ''];
    setStepInputs(newSteps);
    setTimeout(() => {
      stepInputRefs.current[newIndex]?.focus();
    }, 100);
  };

  const handleAddStep = () => {
    const newIndex = stepInputs.length;
    setStepInputs([...stepInputs, '']);
    setTimeout(() => {
      stepInputRefs.current[newIndex]?.focus();
    }, 100);
  };

  const handleStepSubmit = (index: number) => {
    const nextIndex = index + 1;
    if (nextIndex < stepInputs.length) {
      setTimeout(() => {
        stepInputRefs.current[nextIndex]?.focus();
      }, 100);
    } else {
      handleAddStep();
    }
  };

  const handleRemoveStep = (index: number) => {
    if (stepInputs.length > 1) {
      const newSteps = stepInputs.filter((_, i) => i !== index);
      setStepInputs(newSteps);
    } else {
      setStepInputs([]);
      setShowSteps(false);
    }
  };

  const handleDecrementServes = () => {
    setFormData((prev) => {
      const newValue = prev.serves - 1;
      return {
        ...prev,
        serves: newValue >= MIN_SERVES ? newValue : 0,
      };
    });
  };

  const handleIncrementServes = () => {
    setFormData((prev) => {
      const newValue = prev.serves === 0 ? MIN_SERVES : prev.serves + 1;
      return {
        ...prev,
        serves: Math.min(MAX_SERVES, newValue),
      };
    });
  };

  const handleSubmit = async () => {
    const validIngredients = ingredientInputs.filter((ing) => ing.trim() !== '');
    const validSteps = stepInputs.filter((step) => step.trim() !== '');

    if (!formData.name.trim()) {
      return;
    }

    if (validIngredients.length === 0) {
      return;
    }

    if (showSteps && validSteps.length === 0) {
      return;
    }

    const description = validSteps.length > 0
      ? validSteps.map((step, index) => `${index + 1}. ${step.trim()}`).join('\n\n')
      : '';

    const mealData = {
      name: formData.name.trim(),
      description,
      category: formData.category,
      ingredients: validIngredients.map((ing) => ing.trim()),
    };

    const created = await createMeal(mealData);

    if (created) {
      router.back();
    }
  };

  const isValid =
    formData.name.trim() !== '' &&
    ingredientInputs.some((ing) => ing.trim() !== '') &&
    (!showSteps || stepInputs.some((step) => step.trim() !== ''));

  const isLoading = status === 'loading';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <Animated.View
          entering={FadeInUp.duration(300)}
          style={styles.header}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <IconSymbol
              name="chevron.left"
              size={BACK_ICON_SIZE}
              color={BACK_ICON_COLOR}
              weight="semibold"
            />
          </TouchableOpacity>
          <Animated.Text
            entering={FadeInDown.delay(200).springify()}
            style={styles.title}
          >
            Add New
          </Animated.Text>
        </Animated.View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View entering={FadeInDown.delay(300).springify()}>
            <View style={styles.inputGroup}>
              <TextInput
                ref={nameInputRef}
                style={styles.nameInput}
                value={formData.name}
                onChangeText={handleNameChange}
                autoCapitalize="words"
                autoFocus
              />
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(400).springify()}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Category</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoryContainer}
              >
                {MEAL_CATEGORIES.map((category) => (
                  <TouchableOpacity
                    key={category}
                    onPress={() => handleCategoryChange(category)}
                    style={[
                      styles.categoryChip,
                      formData.category === category && styles.categoryChipActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.categoryChipText,
                        formData.category === category && styles.categoryChipTextActive,
                      ]}
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(500).springify()}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Ingredients</Text>
              {ingredientInputs.map((ingredient, index) => (
                <View key={index} style={styles.ingredientRow}>
                  <TextInput
                    ref={(ref) => {
                      ingredientInputRefs.current[index] = ref;
                    }}
                    style={[styles.input, styles.ingredientInput]}
                    placeholder={`Ingredient ${index + 1}`}
                    placeholderTextColor={TEXT_COLOR_PLACEHOLDER}
                    value={ingredient}
                    onChangeText={(text) => handleIngredientChange(index, text)}
                    onSubmitEditing={() => handleIngredientSubmit(index)}
                    returnKeyType="next"
                    autoCapitalize="words"
                  />
                  {ingredientInputs.length > 1 && (
                    <TouchableOpacity
                      onPress={() => handleRemoveIngredient(index)}
                      style={styles.removeButton}
                    >
                      <Text style={styles.removeButtonText}>×</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}
              <TouchableOpacity
                onPress={handleAddIngredient}
                style={styles.addItemButton}
              >
                <Text style={styles.addItemButtonText}>+ Add Ingredient</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(600).springify()}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Steps to Prepare</Text>
              {showSteps ? (
                <>
                  {stepInputs.map((step, index) => (
                    <View key={index} style={styles.stepRow}>
                      <View style={styles.stepNumberContainer}>
                        <Text style={styles.stepNumber}>{index + 1}</Text>
                      </View>
                      <TextInput
                        ref={(ref) => {
                          stepInputRefs.current[index] = ref;
                        }}
                        style={[styles.input, styles.stepInput]}
                        placeholder={`Step ${index + 1}...`}
                        placeholderTextColor={TEXT_COLOR_PLACEHOLDER}
                        value={step}
                        onChangeText={(text) => handleStepChange(index, text)}
                        onSubmitEditing={() => handleStepSubmit(index)}
                        returnKeyType="next"
                        autoCapitalize="sentences"
                      />
                      {stepInputs.length > 1 && (
                        <TouchableOpacity
                          onPress={() => handleRemoveStep(index)}
                          style={styles.removeButton}
                        >
                          <Text style={styles.removeButtonText}>×</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  ))}
                  <TouchableOpacity
                    onPress={handleAddStep}
                    style={styles.addItemButton}
                  >
                    <Text style={styles.addItemButtonText}>+ Add Step</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity
                  onPress={handleAddSteps}
                  style={styles.addItemButton}
                >
                  <Text style={styles.addItemButtonText}>+ Add Steps</Text>
                </TouchableOpacity>
              )}
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(700).springify()}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Serves</Text>
              <View style={styles.incrementerContainer}>
                <TouchableOpacity
                  onPress={handleDecrementServes}
                  disabled={formData.serves === 0}
                  style={[
                    styles.incrementerButton,
                    formData.serves === 0 && styles.incrementerButtonDisabled,
                  ]}
                >
                  <Text
                    style={[
                      styles.incrementerButtonText,
                      formData.serves === 0 && styles.incrementerButtonTextDisabled,
                    ]}
                  >
                    −
                  </Text>
                </TouchableOpacity>
                <View style={styles.incrementerValueContainer}>
                  <View style={styles.incrementerValueWrapper}>
                    <Text style={formData.serves === 0 ? styles.incrementerValueHyphen : styles.incrementerValue}>
                      {formData.serves === 0 ? '−' : formData.serves}
                    </Text>
                  </View>
                  <Text style={styles.incrementerLabel}>
                    {formData.serves === 0 ? ' ' : formData.serves === 1 ? 'person' : 'people'}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={handleIncrementServes}
                  disabled={formData.serves >= MAX_SERVES}
                  style={[
                    styles.incrementerButton,
                    formData.serves >= MAX_SERVES && styles.incrementerButtonDisabled,
                  ]}
                >
                  <Text
                    style={[
                      styles.incrementerButtonText,
                      formData.serves >= MAX_SERVES && styles.incrementerButtonTextDisabled,
                    ]}
                  >
                    +
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>

          {error && (
            <Animated.View entering={FadeInDown.delay(800).springify()}>
              <Text style={styles.errorText}>{error}</Text>
            </Animated.View>
          )}

          <View style={styles.spacer} />
        </ScrollView>

        <Animated.View entering={FadeInUp.delay(800).springify()}>
          <View style={styles.footer}>
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={!isValid || isLoading}
              style={[
                styles.submitButton,
                (!isValid || isLoading) && styles.submitButtonDisabled,
              ]}
            >
              {isLoading ? (
                <ActivityIndicator color={BUTTON_TEXT_COLOR} />
              ) : (
                <Text
                  style={[
                    styles.submitButtonText,
                    (!isValid || isLoading) && styles.submitButtonTextDisabled,
                  ]}
                >
                  Save Meal
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
