import { View, Text, Image, ScrollView , TouchableOpacity } from 'react-native'
import React from 'react'
import Colors from '../coloe'
import {useNavigation} from '@react-navigation/native';

export default function Categories() {
  const navigation = useNavigation();
    const items=[
        {
            image: require("../assets/new.png"),
            text : "Nouveauté",
        },
        {
            image: require("../assets/try.png"),
            text : "Essayer",
        },
        {
            image: require("../assets/pull.png"),
            text : "Vêtements",
        },
        {
            image: require("../assets/bracelet.png"),
            text : "Accessoires",
        },
      
    ]

  return (
    <View
    style={{
     
      backgroundColor: "#fff",
      paddingVertical: 10,
      paddingLeft: 20,
    }}
  >
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {items.map((item, index) => (
      <TouchableOpacity onPress={() => navigation.navigate('Liste',{myVariable:item.text})}>
        <View key={index}
             style={{ alignItems: "center",
             marginRight: 15 , 
             padding:7,
             backgroundColor:Colors.pink,
             justifyContent:'center',
             borderRadius:15}}>
          <Image
            source={item.image}
            style={{
              width: 40,
              height: 40,
              resizeMode: "contain",
              
            }}
          />
       
          <Text style={{ fontSize: 13, fontWeight: "900" ,color:'black'}}>{item.text}</Text>
        </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  </View>
  )
}