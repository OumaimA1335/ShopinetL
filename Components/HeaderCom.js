import { View, Text } from 'react-native'
import React from 'react';
import Colors from '../coloe';

export default function HeaderCom() {
  return (
    <View>
      <Text style={{textAlign:'center',fontSize:12,fontWeight:'bold',marginTop:-10,color:'black'}}>livraison gratuite à partir de 99.99TND ...</Text>
    </View>
  )
}