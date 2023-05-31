import React from "react";
import { View ,Button, Text, TouchableOpacity ,StyleSheet,Image} from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import {useNavigation} from '@react-navigation/native';
import Colors from "../coloe";
export default function BottomTabs() {
  const navigation = useNavigation();
  return (
    <View
      style={{
        flexDirection: "row",
        margin: 10,
        marginHorizontal: 30,
        justifyContent: "space-between",
      }}
    >
     <TouchableOpacity onPress={() => navigation.navigate('Home')}> 
     <FontAwesome5
        name="home"
        color={Colors.orange}
        size={25}
        style={{
          marginBottom: 3,
          alignSelf: "center",   
        }}
      />
      <Text style={{color:'black'}}>Accueil</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() =>{ navigation.navigate('Panier');
    console.log("yghjj")}}>
        <FontAwesome5
        name="cart-plus"
        color={Colors.orange}
        size={25}
        style={{
          marginBottom: 3,
          alignSelf: "center",   
        }}
      />
      <Text style={{color:'black'}}>Panier</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() =>{ navigation.navigate('Liste',{myVariable:"Essayer"});
   }} style={{
    top:-30,
    justifyContent:'center',
    alignItems:'center',
        ...styles.shadow,
        borderRadius:35,
  
   }}>
    <View style={{
        width:70,
        height:70,
        borderRadius:35,
        backgroundColor:Colors.orange,
        alignItems:'center',
    justifyContent:'center',
    ...styles.shadow,
    borderWidth:4,
    borderColor:'white'
    }}>
       <FontAwesome5
        name="camera"
        color='white'
        size={25}
        style={{
          marginBottom: 3,
          alignSelf: "center",   
        }}
      />
    </View>
    </TouchableOpacity>
   
      <TouchableOpacity onPress={() =>{ navigation.navigate('Favoris');
   }}>
        <FontAwesome5
        name="heart"
        color={Colors.orange}
        size={25}
        style={{
          marginBottom: 3,
          alignSelf: "center",   
        }}
      />
      <Text style={{color:'black'}}>Favoris</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() =>{ navigation.navigate('Profile');
 }}>
        <FontAwesome5
        name="user"
        color={Colors.orange}
        size={25}
        style={{
          marginBottom: 3,
          alignSelf: "center",   
        }}
      />
      <Text style={{color:'black'}}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
}

const Icon = (props) => (
  <TouchableOpacity>
    <View>
      <FontAwesome5
        name={props.icon}
        size={25}
        style={{
          marginBottom: 3,
          alignSelf: "center",
          
        }}
      />
      <Text>{props.text}</Text>
    </View>
  </TouchableOpacity>
);
const styles= StyleSheet.create({
  shadow:{
          shadowColor:'#7F5DF0',
          shadowOffset:{
              width:0,
              height:10,
          },
          shadowOpacity:0.25,
          shadowRadius:3.5,
          elevation:5
  }
})

