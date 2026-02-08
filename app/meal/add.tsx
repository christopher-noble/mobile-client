import { IconSymbol } from '@/components/ui/icon-symbol';
import { useCreateMeal } from '@/src/features/meals';
import type { MealCategory } from '@/src/shared/api/generated/graphql';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const MAX_WIDTH_WEB = 600;
const MAX_SERVES = 20;
const PLACEHOLDER_USER_ID = '00000000-0000-0000-0000-000000000001';
const MEAL_CATEGORIES: MealCategory[] = ['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK', 'DESSERT', 'BEVERAGE'];

interface FormData {
  name: string;
  category: MealCategory;
  serves: number;
}

const INITIAL_FORM: FormData = { name: '', category: 'DINNER', serves: 0 };

export default function AddMealScreen() {
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [ingredients, setIngredients] = useState<string[]>(['']);
  const [steps, setSteps] = useState<string[]>([]);
  const [createMeal, { loading, error }] = useCreateMeal();
  const nameRef = useRef<TextInput>(null);
  const ingredientRefs = useRef<(TextInput | null)[]>([]);
  const stepRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    setTimeout(() => nameRef.current?.focus(), 300);
  }, []);

  const updateIngredient = (index: number, text: string) => {
    const updated = [...ingredients];
    updated[index] = text;
    setIngredients(updated);
  };

  const addIngredient = () => {
    setIngredients([...ingredients, '']);
    setTimeout(() => ingredientRefs.current[ingredients.length]?.focus(), 100);
  };

  const removeIngredient = (index: number) => {
    if (ingredients.length > 1) setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const updateStep = (index: number, text: string) => {
    const updated = [...steps];
    updated[index] = text;
    setSteps(updated);
  };

  const addStep = () => {
    setSteps([...steps, '']);
    setTimeout(() => stepRefs.current[steps.length]?.focus(), 100);
  };

  const removeStep = (index: number) => {
    setSteps(steps.length > 1 ? steps.filter((_, i) => i !== index) : []);
  };

  const handleSubmit = async () => {
    const validIngredients = ingredients.filter((i) => i.trim());
    const validSteps = steps.filter((s) => s.trim());
    if (!form.name.trim() || !validIngredients.length) return;
    if (steps.length && !validSteps.length) return;

    const description = validSteps.length
      ? validSteps.map((s, i) => `${i + 1}. ${s.trim()}`).join('\n\n')
      : '';

    const { data } = await createMeal({
      variables: {
        input: {
          userId: PLACEHOLDER_USER_ID,
          name: form.name.trim(),
          description,
          category: form.category,
          ingredients: validIngredients.map((i) => i.trim()),
        },
      },
    });

    if (data?.createMeal) router.back();
  };

  const isValid = form.name.trim() && ingredients.some((i) => i.trim()) && (!steps.length || steps.some((s) => s.trim()));

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <View style={styles.headerWrapper}>
          <Animated.View entering={FadeInUp.duration(300)} style={styles.header}>
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <IconSymbol name="chevron.left" size={24} color="#000" weight="semibold" />
            </Pressable>
            <Animated.Text entering={FadeInDown.delay(200).springify()} style={styles.headerTitle}>
              Add New
            </Animated.Text>
            <View style={styles.backButton} />
          </Animated.View>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.formWrapper}>
            <View style={styles.form}>
              <Animated.View entering={FadeInDown.delay(300).springify()} style={styles.section}>
                <TextInput
                  ref={nameRef}
                  style={styles.nameInput}
                  value={form.name}
                  onChangeText={(name) => setForm({ ...form, name })}
                  placeholder="Meal name"
                  placeholderTextColor="#999"
                  autoCapitalize="words"
                />
              </Animated.View>

              <Animated.View entering={FadeInDown.delay(400).springify()} style={styles.section}>
                <Text style={styles.label}>Category</Text>
                <View style={styles.chips}>
                  {MEAL_CATEGORIES.map((cat) => (
                    <Pressable
                      key={cat}
                      onPress={() => setForm({ ...form, category: cat })}
                      style={[styles.chip, form.category === cat && styles.chipActive]}
                    >
                      <Text style={[styles.chipText, form.category === cat && styles.chipTextActive]}>
                        {cat}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </Animated.View>

              <Animated.View entering={FadeInDown.delay(500).springify()} style={styles.section}>
                <Text style={styles.label}>Ingredients</Text>
                {ingredients.map((ingredient, index) => (
                  <View key={index} style={styles.row}>
                    <TextInput
                      ref={(ref) => { ingredientRefs.current[index] = ref; }}
                      style={[styles.input, styles.flex]}
                      placeholder={`Ingredient ${index + 1}`}
                      placeholderTextColor="#999"
                      value={ingredient}
                      onChangeText={(text) => updateIngredient(index, text)}
                      onSubmitEditing={() => index < ingredients.length - 1 ? ingredientRefs.current[index + 1]?.focus() : addIngredient()}
                      returnKeyType="next"
                    />
                    {ingredients.length > 1 && (
                      <Pressable onPress={() => removeIngredient(index)} style={styles.removeButton}>
                        <Text style={styles.removeText}>×</Text>
                      </Pressable>
                    )}
                  </View>
                ))}
                <Pressable onPress={addIngredient} style={styles.addButton}>
                  <Text style={styles.addButtonText}>+ Add Ingredient</Text>
                </Pressable>
              </Animated.View>

              <Animated.View entering={FadeInDown.delay(600).springify()} style={styles.section}>
                <Text style={styles.label}>Steps</Text>
                {steps.map((step, index) => (
                  <View key={index} style={styles.row}>
                    <View style={styles.stepNumber}>
                      <Text style={styles.stepNumberText}>{index + 1}</Text>
                    </View>
                    <TextInput
                      ref={(ref) => { stepRefs.current[index] = ref; }}
                      style={[styles.input, styles.flex]}
                      placeholder={`Step ${index + 1}`}
                      placeholderTextColor="#999"
                      value={step}
                      onChangeText={(text) => updateStep(index, text)}
                      onSubmitEditing={() => index < steps.length - 1 ? stepRefs.current[index + 1]?.focus() : addStep()}
                      returnKeyType="next"
                    />
                    <Pressable onPress={() => removeStep(index)} style={styles.removeButton}>
                      <Text style={styles.removeText}>×</Text>
                    </Pressable>
                  </View>
                ))}
                <Pressable onPress={addStep} style={styles.addButton}>
                  <Text style={styles.addButtonText}>+ Add Step</Text>
                </Pressable>
              </Animated.View>

              <Animated.View entering={FadeInDown.delay(700).springify()} style={styles.section}>
                <Text style={styles.label}>Serves</Text>
                <View style={styles.stepper}>
                  <Pressable
                    onPress={() => setForm({ ...form, serves: Math.max(0, form.serves - 1) })}
                    disabled={form.serves === 0}
                    style={[styles.stepperButton, form.serves === 0 && styles.stepperButtonDisabled]}
                  >
                    <Text style={[styles.stepperButtonText, form.serves === 0 && styles.stepperButtonTextDisabled]}>−</Text>
                  </Pressable>
                  <View style={styles.stepperValue}>
                    <Text style={styles.stepperValueText}>{form.serves || '−'}</Text>
                    <Text style={styles.stepperLabel}>{form.serves === 1 ? 'person' : form.serves > 1 ? 'people' : ''}</Text>
                  </View>
                  <Pressable
                    onPress={() => setForm({ ...form, serves: Math.min(MAX_SERVES, (form.serves || 0) + 1) })}
                    disabled={form.serves >= MAX_SERVES}
                    style={[styles.stepperButton, form.serves >= MAX_SERVES && styles.stepperButtonDisabled]}
                  >
                    <Text style={[styles.stepperButtonText, form.serves >= MAX_SERVES && styles.stepperButtonTextDisabled]}>+</Text>
                  </Pressable>
                </View>
              </Animated.View>

              {error && <Text style={styles.error}>{error.message}</Text>}
            </View>
          </View>
        </ScrollView>

        <View style={styles.footerWrapper}>
          <Animated.View entering={FadeInUp.delay(800).springify()} style={styles.footer}>
            <Pressable
              onPress={handleSubmit}
              disabled={!isValid || loading}
              style={[styles.submitButton, (!isValid || loading) && styles.submitButtonDisabled]}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={[styles.submitText, (!isValid || loading) && styles.submitTextDisabled]}>
                  Save Meal
                </Text>
              )}
            </Pressable>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  flex: { flex: 1 },
  headerWrapper: { alignItems: 'center', backgroundColor: '#FAFAFA' },
  header: {
    width: '100%',
    maxWidth: Platform.OS === 'web' ? MAX_WIDTH_WEB : undefined,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: Platform.OS === 'web' ? 32 : 8,
  },
  backButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  headerTitle: { fontSize: 24, fontWeight: '700', color: '#1a1a1a' },
  scrollContent: { alignItems: 'center', paddingBottom: 40 },
  formWrapper: { width: '100%', alignItems: 'center', padding: 16 },
  form: { width: '100%', maxWidth: Platform.OS === 'web' ? MAX_WIDTH_WEB : undefined },
  section: { marginBottom: 24 },
  nameInput: { fontSize: 28, fontWeight: '700', color: '#1a1a1a', padding: 8 },
  label: { fontSize: 14, fontWeight: '600', color: '#1a1a1a', marginBottom: 8 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F3F4F6', borderWidth: 1, borderColor: '#E5E7EB' },
  chipActive: { backgroundColor: '#007AFF', borderColor: '#007AFF' },
  chipText: { fontSize: 14, fontWeight: '600', color: '#666', textTransform: 'capitalize' },
  chipTextActive: { color: '#fff' },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 8 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, padding: 16, fontSize: 16, color: '#1a1a1a' },
  removeButton: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#FEE2E2', alignItems: 'center', justifyContent: 'center' },
  removeText: { fontSize: 20, color: '#DC2626', fontWeight: '600' },
  addButton: { height: 44, borderRadius: 12, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' },
  addButtonText: { fontSize: 14, fontWeight: '600', color: '#007AFF' },
  stepNumber: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#007AFF', alignItems: 'center', justifyContent: 'center' },
  stepNumberText: { fontSize: 14, fontWeight: '700', color: '#fff' },
  stepper: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 16 },
  stepperButton: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#F0F9FF', borderWidth: 2, borderColor: '#007AFF', alignItems: 'center', justifyContent: 'center' },
  stepperButtonDisabled: { backgroundColor: '#F3F4F6', borderColor: '#E5E7EB', opacity: 0.5 },
  stepperButtonText: { fontSize: 24, fontWeight: '700', color: '#007AFF' },
  stepperButtonTextDisabled: { color: '#999' },
  stepperValue: { width: 80, height: 64, borderRadius: 16, backgroundColor: '#fff', borderWidth: 2, borderColor: '#E5E7EB', alignItems: 'center', justifyContent: 'center' },
  stepperValueText: { fontSize: 24, fontWeight: '700', color: '#1a1a1a' },
  stepperLabel: { fontSize: 11, color: '#666', marginTop: 2 },
  error: { fontSize: 14, color: '#DC2626', textAlign: 'center', marginTop: 8 },
  footerWrapper: { alignItems: 'center', borderTopWidth: 1, borderTopColor: '#E5E7EB', backgroundColor: '#FAFAFA' },
  footer: { width: '100%', maxWidth: Platform.OS === 'web' ? MAX_WIDTH_WEB : undefined, padding: 16 },
  submitButton: { height: 56, borderRadius: 16, backgroundColor: '#007AFF', alignItems: 'center', justifyContent: 'center' },
  submitButtonDisabled: { backgroundColor: '#E5E7EB' },
  submitText: { fontSize: 18, fontWeight: '700', color: '#fff' },
  submitTextDisabled: { color: '#999' },
});
