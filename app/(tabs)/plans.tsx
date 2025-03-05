import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface MealOption {
  id: number;
  label: string;
  items: string;
}

interface MealConfig {
  meal: string;
  options: MealOption[];
}

type SelectedConfigs = Record<string, MealOption | undefined>;

const mealConfigurations: MealConfig[] = [
  {
    meal: 'Breakfast',
    options: [
      { id: 1, label: 'Low-Carb', items: 'Eggs, Avocado, Spinach' },
      { id: 2, label: 'Vegetarian', items: 'Oatmeal, Fruits, Almond Butter' },
      { id: 3, label: 'High-Protein', items: 'Greek Yogurt, Chia Seeds, Protein Shake' }
    ]
  },
  {
    meal: 'Lunch',
    options: [
      { id: 4, label: 'Paleo', items: 'Grilled Chicken, Sweet Potato, Broccoli' },
      { id: 5, label: 'Vegan', items: 'Quinoa Salad, Chickpeas, Tahini' },
      { id: 6, label: 'Keto', items: 'Salmon, Asparagus, Cauliflower Rice' }
    ]
  },
  {
    meal: 'Dinner',
    options: [
      { id: 7, label: 'Mediterranean', items: 'Falafel, Hummus, Tabbouleh' },
      { id: 8, label: 'Gluten-Free', items: 'Turkey Meatballs, Zoodles, Marinara Sauce' },
      { id: 9, label: 'Low-Fat', items: 'Tilapia, Brown Rice, Steamed Broccoli' }
    ]
  }
  // Add configurations for other meals...
];

export default function Plans() {
  const [selectedConfigs, setSelectedConfigs] = useState<SelectedConfigs>({});
  const [expandedMeal, setExpandedMeal] = useState<string | null>(null);

  const toggleMeal = (meal: string) => {
    setExpandedMeal(current => current === meal ? null : meal);
  };

  const selectConfiguration = (meal: string, config: MealOption) => {
    setSelectedConfigs(prev => ({
      ...prev,
      [meal]: config
    }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Meal Plans</Text>
      
      <View style={styles.mealContainer}>
        {mealConfigurations.map(({ meal, options }) => (
          <View key={meal} style={styles.mealSection}>
            <TouchableOpacity 
              style={styles.mealHeader}
              onPress={() => toggleMeal(meal)}
            >
              <Text style={styles.mealText}>{meal}</Text>
              <Text style={styles.mealStatus}>
                {selectedConfigs[meal] ? `Selected: ${selectedConfigs[meal]?.label}` : 'Choose configuration'}
              </Text>
            </TouchableOpacity>

            {expandedMeal === meal && (
              <View style={styles.configContainer}>
                {options.map((config) => (
                  <TouchableOpacity
                    key={config.id}
                    style={[
                      styles.configOption,
                      selectedConfigs[meal]?.id === config.id && styles.selectedConfig
                    ]}
                    onPress={() => selectConfiguration(meal, config)}
                  >
                    <Text style={styles.configLabel}>{config.label}</Text>
                    <Text style={styles.configItems}>{config.items}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 20,
    textAlign: 'center',
    width: '100%',
  },
  mealContainer: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 20,
  },
  mealSection: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  mealHeader: {
    paddingVertical: 15,
  },
  mealText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
  },
  mealStatus: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 5,
  },
  configContainer: {
    marginVertical: 10,
    marginLeft: 10,
  },
  configOption: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  selectedConfig: {
    backgroundColor: '#e3f2fd',
    borderColor: '#2196f3',
  },
  configLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2196f3',
    marginBottom: 5,
  },
  configItems: {
    fontSize: 14,
    color: '#607d8b',
  }
});