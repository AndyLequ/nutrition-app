// App.js (using Native Stack for Expo)
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './components/HomeScreen/HomeScreen';
import DayLog from './components/DayLog/DayLog';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="DayLog" component={DayLog}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}