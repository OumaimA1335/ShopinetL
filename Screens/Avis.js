import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native';
import {Card, Divider} from 'react-native-elements';
import {ScrollView} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Colors from '../coloe';
import AntDesign from 'react-native-vector-icons/AntDesign';
import BottomTabs from '../Components/ButtomTab';
import {useNavigation} from '@react-navigation/native';
import {useState, useEffect} from 'react';
import axios from 'axios';
import { TouchableOpacity } from 'react-native-gesture-handler';
const Avis = ({route}) => {
  const navigation = useNavigation();
  const [avis, setAvis] = useState([]);
  const {myVariable} = route.params;
  console.log(myVariable);
  useEffect(() => {
    const fetchHandlerAvis = async () => {
      return await axios
        .get(
          `https://c534-197-26-80-81.ngrok-free.app/Avis/getAvisByIdProd/${myVariable}`,
        )
        .then(res => res.data);
    };
    fetchHandlerAvis().then(data => {
      setAvis(data.AllAvis);
    });
  }, []);
  return (
    <SafeAreaView
      style={{
        paddingHorizontal: 12,
        paddingVertical: 15,
        backgroundColor: 'white',
        height: 1150,
      }}>
      <ScrollView>
        <TouchableOpacity onPress={()=> navigation.goBack()}>
        <AntDesign name="left" color="black" size={25} />
        </TouchableOpacity>
      
        <Text
          style={{
            marginTop: -10,
            fontWeight: 'bold',
            fontSize: 25,
            textAlign: 'center',
            color: 'black',
          }}>
          Avis
        </Text>
        {avis.map((item, index) => (
          <Card  key ={index}style={{borderWidth: 'none'}}>
            <View
              style={{
                width: 365,
                height: 150,
                borderRadius: 30,
                flexWrap: 'wrap',
                marginTop: 20,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <View>
                  <Text
                    style={{
                      marginTop: 10,
                      fontWeight: 'bold',
                      fontSize: 15,
                      color: 'black',
                    }}>
                    {' '}
                    {item.nom}
                  </Text>
                  <Text style={{color: Colors.gray, marginLeft: 5}}>
                    {item.date}
                  </Text>
                </View>

                <View
                  style={{
                    marginTop: 20,
                    marginLeft: 55,
                  }}>
                   <Text>{item.nbEtoile}</Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      marginRight:55
                    }}>
                       
                    {Array(item.nbEtoile)
                      .fill()
                      .map((_, i) => (
                        <FontAwesome
                          key={i}
                          name="star"
                          size={16}
                          color="orange"
                        />
                      ))}
                  </View>
                </View>
              </View>

              <Text
                style={{
                  padding: 15,
                  fontWeight: 'normal',
                  fontSize: 12, // Change the font size to 16 (or any other desired value)
                  lineHeight: 22,
                  color: 'black',
                  width: 270,
                }}>
                {'\n'}
                {item.description}
              </Text>
            </View>
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Avis;

const styles = StyleSheet.create({});
