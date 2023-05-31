import React, {useState} from 'react';
import Login from './Screens/Login';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Register from './Screens/Register';
import {AuthContextProvider} from './Context/AuthContext';
import Home from './Screens/Home';
import Panier from './Screens/Panier';
import Profile from './Screens/Profile';
import Favoritelist from './Screens/Favoriteliste';
import Details from './Screens/Detail';
import EditProfile from './Screens/EditProfile';
import ListProd from './Screens/ListProd';
import ReclamationScreen from './Screens/Reclamation';
import HistoryOrder from './Screens/HistoryOrder';
import DetailOrder from './Screens/DetailOrder';
import Avis from './Screens/Avis';

const AppStack = createStackNavigator();
export default App = () => {
  return (
    <NavigationContainer>
      <AppStack.Navigator>
        <AppStack.Screen
          name="Login"
          options={{headerShown: false}}
          component={Login}
        />
        <AppStack.Screen
          name="Register"
          options={{headerShown: false}}
          component={Register}
        />
        <AppStack.Screen
          name="Home"
          options={{headerShown: false}}
          component={Home}
        />
        <AppStack.Screen
          name="Panier"
          options={{headerShown: false}}
          component={Panier}
        />
        <AppStack.Screen
          name="Profile"
          options={{headerShown: false}}
          component={Profile}
        />
        <AppStack.Screen
          name="Favoris"
          options={{headerShown: false}}
          component={Favoritelist}
        />
        <AppStack.Screen
          name="Details"
          options={{headerShown: false}}
          component={Details}
        />
        <AppStack.Screen
          name="Liste"
          options={{headerShown: false}}
          component={ListProd}
        />
        <AppStack.Screen
          name="Reclamation"
          options={{headerShown: false}}
          component={ReclamationScreen}
        />
        <AppStack.Screen
          name="Edit"
          options={{headerShown: false}}
          component={EditProfile}
        />
         <AppStack.Screen
          name="HistoryOrder"
          options={{headerShown: false}}
          component={HistoryOrder}
        />
         <AppStack.Screen
          name="DetailOrder"
          options={{headerShown: false}}
          component={DetailOrder}
        />
        
        <AppStack.Screen
          name="Avis"
          options={{headerShown: false}}
          component={Avis}
        />
      </AppStack.Navigator>
    </NavigationContainer>
  );
};
