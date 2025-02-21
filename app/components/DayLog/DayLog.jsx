import React from 'react';
import './DayLogStyles'
// import './DayLog.css';

const MealCard = ({ mealType, calories, protein }) => {
    return (
        <div className="meal-card">
            <h2>{mealType}</h2>
            <p>Calories: {calories}</p>
            <p>Protein: {protein}g</p>
        </div>
    );
};

const DayLog = () => {
    const meals = [
        { mealType: 'Breakfast', calories: 300, protein: 20 },
        { mealType: 'Lunch', calories: 600, protein: 35 },
        { mealType: 'Dinner', calories: 700, protein: 40 },
    ];

    return (
        <div className="day-log">
            {meals.map((meal, index) => (
                <MealCard
                    key={index}
                    mealType={meal.mealType}
                    calories={meal.calories}
                    protein={meal.protein}
                />
            ))}
        </div>
    );
};

export default DayLog;