import { View, Text, TextInput, Button } from 'react-native';
import React, { useState } from 'react';
import InputAutoSuggest from 'react-native-autocomplete-search/src/InputAutoSuggest';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from '../coloe';
import {useNavigation} from '@react-navigation/native';
export default function Search() {
  const navigation = useNavigation();
  const [search,setSearch]=useState(null);
  const handleChange =()=>
  {
    navigation.navigate('Liste',{myVariable:search});
  }
  return (
    <View style={{ marginTop: 15, flexDirection: 'row', justifyContent: 'space-between' ,}}>
      <View style={{flex: 1, marginRight: 100, justifyContent:'center'}}>
        <TextInput
          placeholder="Search"
          onChangeText={value => setSearch(value)}
          onEndEditing={handleChange}
          value ={search} 
          style={{
            backgroundColor: '#eee',
            borderRadius: 20,
            fontWeight: '700',
            paddingHorizontal: 10,
            height: 40,
            width : 350,
            justifyContent: 'center',
            color:'black'
          }}
        />
        <View style={{ position: 'absolute', left: 120 }}>
          <Ionicons name="search" size={20} style={{marginLeft:200,color:Colors.orange}} />
        </View>
      </View>
          
    </View>
  );
}