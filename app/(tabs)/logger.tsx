import { Text, View, StyleSheet, FlatList } from 'react-native';
import React from 'react';
import { useFood } from '../FoodProvider';

// display somewhere in this page the data input into the addfood page
// display the data input into the addfood page in a list format




export default function LogScreen() {
    const { foods, loading } = useFood();

    if(loading){
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    const renderMealList = (mealType: string) => (
        <FlatList
            data={foods.filter(food => food.mealType === mealType)}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
                <View style={styles.listItem}>
                    <Text>{item.name}</Text>
                    <Text>{item.amount}</Text>
                </View>
            )}
            ListEmptyComponent={<Text style={styles.emptyText}>No foods logged</Text>}
        />
        )

    return (
        <View style={styles.container}>
            <View style={styles.columnContainer}>
                {/* Meal Sections */}
                <View style={styles.mealContainer}>
                    <Text style={styles.titlename}>Breakfast</Text>
                    {renderMealList('breakfast')}
                    
                </View>

                <View style={styles.mealContainer}>
                    <Text style={styles.titlename}>Lunch</Text>
                    {renderMealList('lunch')}
                </View>

                <View style={styles.mealContainer}>
                    <Text style={styles.titlename}>Dinner</Text>
                    {renderMealList('dinner')}
                </View>

                <View style={styles.mealContainer}>
                    <Text style={styles.titlename}>Snacks</Text>
                    {renderMealList('snacks')}
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    columnContainer: {
        flex: 1,
        paddingHorizontal: 10,
    },
    mealContainer: {
        flex: 1,
        borderBottomWidth: 1,
        borderColor: '#ccc',
        paddingVertical: 10,
    },
    titlename: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    list: {
        flex: 1,
    },
    listItem: {
        paddingVertical: 4,
    }
});