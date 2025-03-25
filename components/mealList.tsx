import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useFood } from '../FoodProvider';

export const renderMealList = (mealType: string) => (
    <FlatList 
        data={foods.filter((food) => food.mealType === mealType)}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
            <View style={styles.listItem}>
                <Text>{item.name}</Text>
                <Text>{item.amount}</Text>
                <Text>Protein: {item.protein}g</Text>
                <Text>Calories: {item.calories} cal</Text>
            </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No items found</Text>}
    />
    )
