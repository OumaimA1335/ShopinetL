import React from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';
import Colors from '../coloe';



const Card = ({ item }) => (
  <View style={styles.card}>
 <Image source={{uri: JSON.parse(item.imageList[0]).url}} style={styles.image} />
    <Text style={styles.title}>{item.nom}</Text>
    <Text style={styles.price}>{item.prix}DT</Text>
  </View>
);

const CardList = ({bracelet}) => {
console.log(bracelet)
const firstTwoItems = bracelet.slice(0, 2);
return(
  <FlatList
    data={firstTwoItems}
    horizontal
    showsHorizontalScrollIndicator={false}
    renderItem={({ item }) => <Card item={item} />}
    keyExtractor={(item) => item.id}
  />)
};

const styles = StyleSheet.create({
  card: {
    width: 160,
    margin: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
 
  
  },
  image: {
    width: 150,
    height: 190,
    resizeMode: 'contain',
    marginBottom: 10,
    backgroundColor: Colors.grey2,
    borderRadius: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '400',
    marginBottom: 5,
   
  },
  price: {
    fontSize: 14,
    color: 'gray',
    marginLeft:55,
    color:'black'
  },
});

export default CardList;

