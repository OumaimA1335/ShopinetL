import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import Colors from '../coloe';
import {ScrollView} from 'react-native';
import {Card} from 'react-native-paper';
import {Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import AntDesign from 'react-native-vector-icons/AntDesign';
const ListeCommande = ({data, setData}) => {
  console.log(data);
  const navigation = useNavigation();
  const deleleCommande = async id => {
    await axios.delete(
      `https://c534-197-26-80-81.ngrok-free.app/Commande/cancelCommande/${id}`,
    );
    setData(prevItems => prevItems.filter(item => item.id !== id));
  };
  return (
    <View>
      <ScrollView style={{marginBottom: 50}}>
        {data.map((item, index) => {
          return (
            <Card key={index} style={styles.box}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View style={{justifyContent: 'space-around', marginLeft: 20}}>
                  <View style={{flexDirection: 'row'}}>
                    <Text style={styles.txt}>Commande n°{item.id} </Text>
                    <TouchableOpacity
                      key={index}
                      onPress={() => {
                        navigation.navigate('DetailOrder',{commande:item});
                      }}>
                      <AntDesign
                        name="doubleright"
                        size={15}
                        style={{
                          marginTop: 8,
                          marginLeft: 220,
                          color: Colors.orange,
                        }}
                      />
                    </TouchableOpacity>
                  </View>

                  <Text
                    style={{
                      fontWeight: 'bold',
                      color: Colors.gray,
                      marginTop: 5,
                    }}>
                    {item.Adresse}
                  </Text>
                  <View style={{width: 170}}>
                    <Text
                      style={{
                        backgroundColor:
                          item.confirmation === 'Confirmée' ? 'green' : 'red',
                        fontSize: 12,
                        fontWeight: '700',
                        borderRadius: 5,
                        color: 'white',
                        marginTop: 5,
                        paddingLeft: 10,
                      }}>
                      Commande {item.confirmation}
                    </Text>
                  </View>
                  <View style={{width: 140}}>
                    <Text
                      style={{
                        backgroundColor:
                          item.Etat === 'Livrée' ? 'green' : 'red',
                        fontSize: 12,
                        fontWeight: '700',
                        borderRadius: 5,
                        color: 'white',
                        marginTop: 5,
                        paddingLeft: 10,
                      }}>
                      Commande {item.Etat}
                    </Text>
                  </View>

                  <Text style={styles.txt1}>Le {item.createdAt} </Text>
                </View>
                {item.confirmation == 'Non confirmeé' ? (
                  <View style={{marginBottom: -85, marginLeft: -25}}>
                    <TouchableOpacity
                      onPress={() => {
                        deleleCommande(item.id);
                      }}>
                      <MaterialCommunityIcons
                        name="delete"
                        size={30}
                        style={{color: Colors.orange}}
                      />
                    </TouchableOpacity>
                  </View>
                ) : null}
              </View>
            </Card>
          );
        })}
      </ScrollView>
    </View>
  );
};
export default ListeCommande;
const styles = StyleSheet.create({
  etat: {
    backgroundColor: Colors.dark1,
    fontSize: 15,
    fontWeight: '800',
    borderRadius: 5,
    color: 'white',
    marginTop: 5,
  },
  box: {
    borderRadius: 5,

    shadowOpacity: 10,
    marginTop: 20,
    backgroundColor: 'white',
    marginBottom: 4,
  },
  img: {
    width: 100,
    height: 100,
    marginLeft: 10,
  },
  txt: {
    fontSize: 15,
    fontWeight: '700',
    marginTop: 5,
    color:'black'
  },
  txt1: {
    fontSize: 15,
    fontWeight: '700',
    marginTop: 5,
    marginBottom: 5,
    color:'black'
  },
});
