import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

const initialMealData = [
  {
    id: '1',
    day: 'Monday',
    meals: [
      { id: '1a', category: 'Breakfast', items: 'Oatmeal, Banana, Almond Milk' },
      { id: '1b', category: 'Lunch', items: 'Grilled Chicken Salad, Whole Grain Bread' },
      { id: '1c', category: 'Dinner', items: 'Salmon, Quinoa, Steamed Vegetables' }
    ]
  },
  {
    id: '2',
    day: 'Tuesday',
    meals: [
      { id: '2a', category: 'Breakfast', items: 'Greek Yogurt, Mixed Berries, Granola' },
      { id: '2b', category: 'Lunch', items: 'Turkey Wrap, Baby Carrots, Hummus' },
      { id: '2c', category: 'Dinner', items: 'Vegetable Stir-Fry, Brown Rice' }
    ]
  },
  // Add more days as needed...
];

const MealPlanList = () => {
  const [expandedDay, setExpandedDay] = useState(null);

  const toggleDay = (dayId) => {
    setExpandedDay(expandedDay === dayId ? null : dayId);
  };

  const renderDay = ({ item }) => (
    <View style={styles.dayContainer}>
      <TouchableOpacity onPress={() => toggleDay(item.id)}>
        <View style={styles.dayHeader}>
          <Text style={styles.dayTitle}>{item.day}</Text>
          <Text style={styles.toggleIcon}>{expandedDay === item.id ? '▼' : '▶'}</Text>
        </View>
      </TouchableOpacity>

      {expandedDay === item.id && (
        <View style={styles.mealsContainer}>
          {item.meals.map(meal => (
            <View key={meal.id} style={styles.mealItem}>
              <Text style={styles.mealCategory}>{meal.category}:</Text>
              <Text style={styles.mealItems}>{meal.items}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Weekly Meal Plan</Text>
      <FlatList
        data={initialMealData}
        renderItem={renderDay}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  dayContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
  },
  toggleIcon: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  mealsContainer: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
  },
  mealItem: {
    marginBottom: 8,
  },
  mealCategory: {
    fontWeight: '500',
    color: '#e74c3c',
    fontSize: 16,
  },
  mealItems: {
    color: '#34495e',
    fontSize: 14,
    marginLeft: 10,
  },
});

export default MealPlanList;