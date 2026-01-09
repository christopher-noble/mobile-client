import { IconSymbol } from '@/components/ui/icon-symbol';
import type { MealCategory } from '@/src/features/meals';
import { useCreateMeal } from '@/src/features/meals';
import { router } from 'expo-router';
import React, { useState } from 'react';
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
const INPUT_FOCUS_BORDER_COLOR = '#007AFF';
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

const MEAL_CATEGORIES: MealCategory[] = ['breakfast', 'lunch', 'dinner', 'snack', 'dessert', 'beverage'];

type FormData = {
  name: string;
  description: string;
  category: MealCategory;
  ingredients: string[];
  serves: string;
};

const INITIAL_FORM_DATA: FormData = {
  name: '',
  description: '',
  category: 'dinner',
  ingredients: [''],
  serves: '',
};

export default function AddMealScreen() {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [ingredientInputs, setIngredientInputs] = useState<string[]>(['']);
  const { createMeal, status, error } = useCreateMeal();

  const handleNameChange = (text: string) => {
    setFormData((prev) => ({ ...prev, name: text }));
  };

  const handleDescriptionChange = (text: string) => {
    setFormData((prev) => ({ ...prev, description: text }));
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
    setIngredientInputs([...ingredientInputs, '']);
  };

  const handleRemoveIngredient = (index: number) => {
    if (ingredientInputs.length > 1) {
      const newIngredients = ingredientInputs.filter((_, i) => i !== index);
      setIngredientInputs(newIngredients);
    }
  };

  const handleServesChange = (text: string) => {
    setFormData((prev) => ({ ...prev, serves: text }));
  };

  const handleSubmit = async () => {
    const validIngredients = ingredientInputs.filter((ing) => ing.trim() !== '');
    
    if (!formData.name.trim()) {
      return;
    }

    if (validIngredients.length === 0) {
      return;
    }

    if (!formData.description.trim()) {
      return;
    }

    const mealData = {
      name: formData.name.trim(),
      description: formData.description.trim(),
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
    formData.description.trim() !== '';

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
            Add New Meal
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
              <Text style={styles.label}>Meal Name</Text>
              <TextInput
                style={[
                  styles.input,
                  focusedInput === 'name' && styles.inputFocused,
                ]}
                placeholder="Enter meal name"
                placeholderTextColor={TEXT_COLOR_PLACEHOLDER}
                value={formData.name}
                onChangeText={handleNameChange}
                onFocus={() => setFocusedInput('name')}
                onBlur={() => setFocusedInput(null)}
                autoCapitalize="words"
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
                    style={[styles.input, styles.ingredientInput]}
                    placeholder={`Ingredient ${index + 1}`}
                    placeholderTextColor={TEXT_COLOR_PLACEHOLDER}
                    value={ingredient}
                    onChangeText={(text) => handleIngredientChange(index, text)}
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
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Enter step-by-step instructions..."
                placeholderTextColor={TEXT_COLOR_PLACEHOLDER}
                value={formData.description}
                onChangeText={handleDescriptionChange}
                onFocus={() => setFocusedInput('description')}
                onBlur={() => setFocusedInput(null)}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(700).springify()}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Serves</Text>
              <TextInput
                style={styles.input}
                placeholder="How many people?"
                placeholderTextColor={TEXT_COLOR_PLACEHOLDER}
                value={formData.serves}
                onChangeText={handleServesChange}
                onFocus={() => setFocusedInput('serves')}
                onBlur={() => setFocusedInput(null)}
                keyboardType="number-pad"
              />
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
  inputFocused: {
    borderColor: INPUT_FOCUS_BORDER_COLOR,
    borderWidth: 2,
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
