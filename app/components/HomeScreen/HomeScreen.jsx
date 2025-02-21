import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useNavigation } from 'expo-router';
import styles from './HomeScreenStyles';
import SummaryCard from '../SummaryCard/SummaryCard';


export default function HomeScreen() {
    const navigation = useNavigation();

    const stats = [
        { label: 'Calories', value: '2000' },
        { label: 'Protein', value: '150g' },
        { label: 'Carbs', value: '250g' },
        { label: 'Fats', value: '70g' },
    ];
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Home Screen</Text>
            <Text style={styles.text}>Welcome to the Home Screen!</Text>
            <SummaryCard title="Nutrition Summary" stats={stats} />
        </View>
    );  
}