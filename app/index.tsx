// import React from 'react';
// import { View, StyleSheet } from 'react-native';
// import SummaryCard from './components/SummaryCard/SummaryCard';
// import HomeScreen from './components/HomeScreen/HomeScreen';

// export default function Index() {
//   const stats = [
//     { label: 'Calories', value: 200 },
//     { label: 'Protein', value: '10g' },
//     { label: 'Carbs', value: '30g' },
//   ];

//   return (
//     <View style={styles.container}>
//       {/* <SummaryCard title="Nutrition Summary" stats={stats} /> */}
//       <HomeScreen />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 16,
//   },
// });
import { registerRootComponent } from "expo";
import App from "./App";

registerRootComponent(App);
// registerRootComponent calls AppRegistry.registerComponent('main', () => App);