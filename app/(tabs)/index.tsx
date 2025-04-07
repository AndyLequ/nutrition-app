import { View, Text, Dimensions } from "react-native";
import { useState, useEffect } from "react";
import { useFood } from "../FoodProvider";
import { NutritionGoals } from "../components/NutritionGoals";
import Svg, { G, Path, Text as SvgText } from "react-native-svg";
import * as d3Shape from "d3-shape";

export default function Index() {
  const [protein, setProtein] = useState(0);
  const [carbs, setCarbs] = useState(0);
  const [calories, setCalories] = useState(0);
  const [fat, setFat] = useState(0);

  const { foods } = useFood();
  const safeFoods = Array.isArray(foods) ? foods : [];

  useEffect(() => {
    const truncateToTwoDecimals = (num: number) => {
      return Math.trunc(num * 100) / 100;
    };

    const totalProtein = truncateToTwoDecimals(
      safeFoods.reduce((sum, food) => sum + (food.protein || 0), 0)
    );
    const totalCalories = truncateToTwoDecimals(
      safeFoods.reduce((sum, food) => sum + (food.calories || 0), 0)
    );
    const totalCarbs = truncateToTwoDecimals(
      safeFoods.reduce((sum, food) => sum + (food.carbs || 0), 0)
    );
    const totalFat = truncateToTwoDecimals(
      safeFoods.reduce((sum, food) => sum + (food.fat || 0), 0)
    );

    setProtein(totalProtein);
    setCalories(totalCalories);
    setCarbs(totalCarbs);
    setFat(totalFat);
  }, [safeFoods]);

  const DATA = [
    { name: "Protein", value: protein, color: "#FF6384" },
    { name: "Carbs", value: carbs, color: "#36A2EB" },
    { name: "Fat", value: fat, color: "#FFCE56" },
    { name: "Calories", value: calories, color: "#4BC0C0" },
  ];

  const screenWidth = Dimensions.get("window").width;
  const radius = screenWidth * 0.4;
  const innerRadius = radius * 0.6;

  const totalValue = DATA.reduce((sum, item) => sum + item.value, 0);

  const pieGenerator = d3Shape.pie().value((d) => d.value);
  const arcs = pieGenerator(DATA);

  const arcGenerator = d3Shape
    .arc()
    .innerRadius(innerRadius)
    .outerRadius(radius);

  return (
    <View className="p-4 bg-white rounded-lg shadow-md">
      <Text className="text-lg font-bold mb-4 text-gray-800">Summary</Text>
      <View className="flex-row justify-between">
        <View className="items-center px-3">
          <Text className="text-sm text-gray-500 mb-1">Protein</Text>
          <Text className="text-base font-medium text-gray-800">{protein}</Text>
        </View>
        <View className="items-center px-3">
          <Text className="text-sm text-gray-500 mb-1">Calories</Text>
          <Text className="text-base font-medium text-gray-800">
            {calories}
          </Text>
        </View>
        <View className="items-center px-3">
          <Text className="text-sm text-gray-500 mb-1">Carbs</Text>
          <Text className="text-base font-medium text-gray-800">{carbs}</Text>
        </View>
        <View className="items-center px-3">
          <Text className="text-sm text-gray-500 mb-1">Fat</Text>
          <Text className="text-base font-medium text-gray-800">{fat}</Text>
        </View>
      </View>

      {/* Nutrition Goals */}
      <NutritionGoals />

      {/* Pie Chart */}
      <View style={{ padding: 20, backgroundColor: "white", borderRadius: 10 }}>
        <Svg width={screenWidth} height={screenWidth}>
          <G transform={`translate(${screenWidth / 2}, ${screenWidth / 2})`}>
            {arcs.map((arc, index) => (
              <Path
                key={index}
                d={arcGenerator(arc)}
                fill={DATA[index].color}
              />
            ))}
            <SvgText
              x={0}
              y={0}
              textAnchor="middle"
              fontSize="20"
              fill="#000"
              fontWeight="bold"
            ></SvgText>
          </G>
        </Svg>
      </View>
      <View>
        <Text>Legend</Text>
        {DATA.map((item, index) => (
          <View
            key={index}
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            <View
              style={{
                width: 20,
                height: 20,
                backgroundColor: item.color,
                marginRight: 10,
              }}
            />
            <Text>{item.name}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
