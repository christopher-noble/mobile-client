import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { Meal } from '../types';

const CARD_BACKGROUND_COLOR = '#fff';
const CARD_BORDER_RADIUS = 12;
const CARD_MARGIN = 8;
const CARD_SHADOW_COLOR = '#000';
const CARD_SHADOW_OFFSET_X = 0;
const CARD_SHADOW_OFFSET_Y = 2;
const CARD_SHADOW_OPACITY = 0.1;
const CARD_SHADOW_RADIUS = 4;
const CARD_ELEVATION = 3;
const IMAGE_HEIGHT = 150;
const TITLE_PADDING = 12;
const TITLE_FONT_SIZE = 14;
const TITLE_FONT_WEIGHT = '600';
const TITLE_COLOR = '#333';
const ACTIVE_OPACITY = 0.7;

type MealCardProps = {
  meal: Meal;
  onPress?: (meal: Meal) => void;
};

export const MealCard: React.FC<MealCardProps> = ({ meal, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress?.(meal)}
      activeOpacity={ACTIVE_OPACITY}
    >
      {meal.imageUrl && (
        <Image source={{ uri: meal.imageUrl }} style={styles.image} />
      )}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{meal.name}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: CARD_BACKGROUND_COLOR,
    borderRadius: CARD_BORDER_RADIUS,
    margin: CARD_MARGIN,
    overflow: 'hidden',
    shadowColor: CARD_SHADOW_COLOR,
    shadowOffset: { width: CARD_SHADOW_OFFSET_X, height: CARD_SHADOW_OFFSET_Y },
    shadowOpacity: CARD_SHADOW_OPACITY,
    shadowRadius: CARD_SHADOW_RADIUS,
    elevation: CARD_ELEVATION,
    flex: 1,
  },
  image: {
    width: '100%',
    height: IMAGE_HEIGHT,
    resizeMode: 'cover',
  },
  titleContainer: {
    padding: TITLE_PADDING,
  },
  title: {
    fontSize: TITLE_FONT_SIZE,
    fontWeight: TITLE_FONT_WEIGHT,
    color: TITLE_COLOR,
    textAlign: 'center',
  },
});
