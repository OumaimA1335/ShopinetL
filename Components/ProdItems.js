import React from 'react';
import { View, Text, StyleSheet, Dimensions, FlatList, Image } from 'react-native';
import Colors from '../coloe';
import { ScrollView } from 'react-native-gesture-handler';

const data = [
  {
    id: '1',
    title: 'Pink Hoodies',
    price: '50$',
    image: require('../assets/brac1.png'),
  },
  {
    id: '2',
    title: 'Green Hoodies',
    price: '60$',
    image: require('../assets/brac2.png'),
  },
  {
    id: '3',
    title: 'Blue Hoodies',
    price: '70$',
    image: require('../assets/brac2.png'),
  },
  {
    id: '3',
    title: 'Blue Hoodies',
    price: '70$',
    image: require('../assets/brac2.png'),
  },
  // Add more data items here
];

const windowWidth = Dimensions.get('window').width;

const Card = ({ item }) => (
  <View style={styles.card}>
  <Image source={{uri: JSON.parse(item.imageList[0]).url}} style={styles.image} />
    <Text style={styles.title}>{item.nom}</Text>
    <Text style={styles.price}>{item.prix}DT</Text>
  </View>
);

const CardList = ({recent}) => {
  console.log(recent)
  return(
    <ScrollView horizontal={true}>
       <View style={styles.container}>
    {recent.slice(0, 4).map((item, index) => (
      <View key={item.id} style={index % 2 === 0 ? styles.rowContainer : null}>
        <Card item={item} />
      </View>
    ))}
  </View>
    </ScrollView>
   )
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 10,
      flexDirection: 'row',
     
    },
    rowContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 10,
      
    },
    card: {
      width: (windowWidth - 40) / 2,
      backgroundColor: 'white',
      borderRadius: 8,
      padding: 10,
    },
    image: {
      width: '90%',
      height: 150,
      resizeMode: 'cover',
      marginBottom: 10,
      backgroundColor: Colors.grey2,
      borderRadius: 8,
    },
    title: {
      fontSize: 16,
      fontWeight: '500',
      marginBottom: 5,
    },
    price: {
      fontSize: 14,
      color: 'black',
      marginLeft:50
    },
  });
  
export default CardList;