// App.tsx
import * as React from "react";
import {
  NavigationContainer,
  NavigationIndependentTree,
} from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Text } from "react-native";


// Create nested navigators
const TopTab = createMaterialTopTabNavigator();
const BottomTab = createBottomTabNavigator();

// Screens for your sub-tabs
function SubTab1() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Sub Tab 1 Content</Text>
    </View>
  );
}

function SubTab2() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Sub Tab 2 Content</Text>
    </View>
  );
}

// Main tab component with swipeable sub-tabs
function MainTabWithSubTabs() {
  return (
    <TopTab.Navigator
      screenOptions={{
        swipeEnabled: true,
        tabBarIndicatorStyle: { backgroundColor: "blue" },
        tabBarLabelStyle: { fontSize: 14, fontWeight: "bold" },
      }}
    >
      <TopTab.Screen
        name="SubTab1"
        component={SubTab1}
        options={{ title: "First Page" }}
      />
      <TopTab.Screen
        name="SubTab2"
        component={SubTab2}
        options={{ title: "Second Page" }}
      />
    </TopTab.Navigator>
  );
}

// Main app navigation with bottom tabs
function TabViews() {
  return (
    <NavigationIndependentTree>
      <NavigationContainer>
        <BottomTab.Navigator>
          <BottomTab.Screen
            name="MainTab"
            component={MainTabWithSubTabs}
            options={{ title: "Swipeable Tab" }}
          />
          {/* Add other bottom tabs here */}
        </BottomTab.Navigator>
      </NavigationContainer>
    </NavigationIndependentTree>
  );
}

export default TabViews;
