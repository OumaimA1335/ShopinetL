import React from 'react';
import { View } from 'react-native';

const colors = ['#FF5733', '#DAF7A6', '#C70039', '#FFC300', '#900C3F'];

const ColorList = ({couleurs}) => {
  console.log(couleurs);
  return (
    
    <View style={{flexDirection:'row', marginLeft:5}}>
      {couleurs && couleurs.map((color, index) => (
        <View key={index} style={{ backgroundColor: color, height: 15, width:15, borderRadius:30 ,margin:5}} />
      ))}
    </View>
  );
};

export default ColorList;