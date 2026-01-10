import { IconSymbol } from '@/components/ui/icon-symbol';
import { useMeal } from '@/src/features/meals';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
    FadeInDown,
    FadeInUp,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const BACK_BUTTON_SIZE = 44;
const BACK_BUTTON_BORDER_RADIUS = 22;
const HEADER_HEIGHT = 300;
const CONTENT_PADDING = 24;
const TITLE_FONT_SIZE = 32;
const TITLE_FONT_WEIGHT = '800';
const DESCRIPTION_FONT_SIZE = 16;
const SECTION_TITLE_FONT_SIZE = 20;
const SECTION_TITLE_FONT_WEIGHT = '700';
const INGREDIENT_FONT_SIZE = 16;
const NUTRITION_LABEL_FONT_SIZE = 14;
const NUTRITION_VALUE_FONT_SIZE = 18;
const NUTRITION_VALUE_FONT_WEIGHT = '700';
const BACK_ICON_SIZE = 24;
const BACK_ICON_COLOR = '#000';
const BACK_BUTTON_BACKGROUND = 'rgba(255, 255, 255, 0.9)';
const TEXT_COLOR_PRIMARY = '#1a1a1a';
const TEXT_COLOR_SECONDARY = '#666';
const BACKGROUND_COLOR = '#ffffff';
const SECTION_SPACING = 32;
const ITEM_SPACING = 16;
const BADGE_PADDING_HORIZONTAL = 12;
const BADGE_PADDING_VERTICAL = 6;
const BADGE_BORDER_RADIUS = 20;
const NUTRITION_ITEM_SPACING = 12;
const CARD_SHADOW_COLOR = '#000';
const CARD_SHADOW_OFFSET_X = 0;
const CARD_SHADOW_OFFSET_Y = 2;
const CARD_SHADOW_OPACITY = 0.1;
const CARD_SHADOW_RADIUS = 4;
const CARD_ELEVATION = 3;

export default function MealDetailScreen() {
  const { id, mealData } = useLocalSearchParams<{ id: string; mealData?: string }>();
  const { data: fetchedMeal, status } = useMeal(id || null);
  
  const meal = mealData ? JSON.parse(mealData) as typeof fetchedMeal : fetchedMeal;

  if (!meal && status === 'error') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Meal not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!meal) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.headerContainer}>
          {meal.imageUrl && (
            <Animated.View entering={FadeInUp.duration(300)} style={StyleSheet.absoluteFill}>
              <Image
                source={{ uri: meal.imageUrl }}
                style={styles.headerImage}
                contentFit="cover"
                transition={200}
              />
            </Animated.View>
          )}
          <LinearGradient
            colors={['transparent', 'rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.7)', 'rgba(255, 255, 255, 0.9)', '#ffffff']}
            locations={[0, 0.4, 0.7, 0.9, 1]}
            style={styles.gradientOverlay}
          />
          <Animated.View
            entering={FadeInUp.delay(200).springify()}
            style={styles.backButtonContainer}
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
          </Animated.View>
        </View>

        <View style={styles.contentContainer}>
          <Animated.View entering={FadeInDown.delay(300).springify()}>
            <View style={styles.titleRow}>
              <Text style={styles.title} numberOfLines={2}>
                {meal.name}
              </Text>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>
                  {meal.category}
                </Text>
              </View>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(400).springify()}>
            <Text style={styles.description}>
              {meal.description}
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(500).springify()}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Ingredients
              </Text>
              <View style={styles.ingredientsContainer}>
                {meal.ingredients.map((ingredient, index) => (
                  <Animated.View
                    key={ingredient}
                    entering={FadeInDown.delay(600 + index * 50).springify()}
                    style={styles.ingredientBadge}
                  >
                    <Text style={styles.ingredientText}>
                      {ingredient}
                    </Text>
                  </Animated.View>
                ))}
              </View>
            </View>
          </Animated.View>

          {meal.nutritionalInfo && (
            <Animated.View entering={FadeInDown.delay(700).springify()}>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  Nutrition
                </Text>
                <View style={styles.nutritionGrid}>
                  <View style={styles.nutritionItem}>
                    <Text style={styles.nutritionLabel}>
                      Calories
                    </Text>
                    <Text style={styles.nutritionValue}>
                      {meal.nutritionalInfo.calories}
                    </Text>
                  </View>
                  <View style={styles.nutritionItem}>
                    <Text style={styles.nutritionLabel}>
                      Protein
                    </Text>
                    <Text style={styles.nutritionValue}>
                      {meal.nutritionalInfo.protein}g
                    </Text>
                  </View>
                  <View style={styles.nutritionItem}>
                    <Text style={styles.nutritionLabel}>
                      Carbs
                    </Text>
                    <Text style={styles.nutritionValue}>
                      {meal.nutritionalInfo.carbs}g
                    </Text>
                  </View>
                  <View style={styles.nutritionItem}>
                    <Text style={styles.nutritionLabel}>
                      Fat
                    </Text>
                    <Text style={styles.nutritionValue}>
                      {meal.nutritionalInfo.fat}g
                    </Text>
                  </View>
                </View>
              </View>
            </Animated.View>
          )}

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },
  scrollView: {
    flex: 1,
  },
  headerContainer: {
    height: HEADER_HEIGHT,
    position: 'relative',
    overflow: 'hidden',
  },
  headerImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 200,
  },
  backButtonContainer: {
    position: 'absolute',
    top: 48,
    left: 16,
  },
  backButton: {
    width: BACK_BUTTON_SIZE,
    height: BACK_BUTTON_SIZE,
    borderRadius: BACK_BUTTON_BORDER_RADIUS,
    backgroundColor: BACK_BUTTON_BACKGROUND,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: CARD_SHADOW_COLOR,
    shadowOffset: { width: CARD_SHADOW_OFFSET_X, height: CARD_SHADOW_OFFSET_Y },
    shadowOpacity: CARD_SHADOW_OPACITY,
    shadowRadius: CARD_SHADOW_RADIUS,
    elevation: CARD_ELEVATION,
  },
  contentContainer: {
    padding: CONTENT_PADDING,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: ITEM_SPACING,
  },
  title: {
    flex: 1,
    fontSize: TITLE_FONT_SIZE,
    fontWeight: TITLE_FONT_WEIGHT,
    color: TEXT_COLOR_PRIMARY,
    marginRight: ITEM_SPACING,
  },
  categoryBadge: {
    paddingHorizontal: BADGE_PADDING_HORIZONTAL,
    paddingVertical: BADGE_PADDING_VERTICAL,
    borderRadius: BADGE_BORDER_RADIUS,
    backgroundColor: '#FED7AA',
  },
  categoryText: {
    fontSize: INGREDIENT_FONT_SIZE,
    color: '#C2410C',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  description: {
    fontSize: DESCRIPTION_FONT_SIZE,
    color: TEXT_COLOR_SECONDARY,
    lineHeight: 24,
    marginBottom: SECTION_SPACING,
  },
  section: {
    marginBottom: SECTION_SPACING,
  },
  sectionTitle: {
    fontSize: SECTION_TITLE_FONT_SIZE,
    fontWeight: SECTION_TITLE_FONT_WEIGHT,
    color: TEXT_COLOR_PRIMARY,
    marginBottom: ITEM_SPACING,
  },
  ingredientsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  ingredientBadge: {
    paddingHorizontal: BADGE_PADDING_HORIZONTAL,
    paddingVertical: BADGE_PADDING_VERTICAL,
    borderRadius: BADGE_BORDER_RADIUS,
    backgroundColor: '#F3F4F6',
  },
  ingredientText: {
    fontSize: INGREDIENT_FONT_SIZE,
    color: '#374151',
  },
  nutritionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  nutritionItem: {
    flex: 1,
    minWidth: '45%',
    marginBottom: NUTRITION_ITEM_SPACING,
  },
  nutritionLabel: {
    fontSize: NUTRITION_LABEL_FONT_SIZE,
    color: TEXT_COLOR_SECONDARY,
    marginBottom: 4,
  },
  nutritionValue: {
    fontSize: NUTRITION_VALUE_FONT_SIZE,
    fontWeight: NUTRITION_VALUE_FONT_WEIGHT,
    color: TEXT_COLOR_PRIMARY,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: CONTENT_PADDING,
  },
  errorText: {
    fontSize: DESCRIPTION_FONT_SIZE,
    color: TEXT_COLOR_SECONDARY,
  },
});
