import {StyleSheet, Text, View} from 'react-native';
import React, {useState, useEffect} from 'react';
import {SafeAreaView} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {ScrollView} from 'react-native';
import {Card} from 'react-native-paper';
import {Image} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import ListeCommande from '../Components/ListeCommande';
import Colors from '../coloe';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import { useNavigation } from '@react-navigation/native';
const HistoryOrder = () => {
  const [items, setItems] = useState([]);
  const [parsedUser, setParsedUser] = useState({
    id: 0,
    email: '',
    role_id: 0,
    image: '',
  });
  const [colorText,setColorText] =useState(false);
  const navigation =useNavigation()
  const [colorText2,setColorText2] =useState(false);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await AsyncStorage.getItem('user');
        const parsedUser = JSON.parse(user);
        setParsedUser(parsedUser);
        console.log(parsedUser);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUser();
  }, []);
  useEffect(() => {
    const fetchHandler = async () => {
        return await axios
          .get(
            `https://c534-197-26-80-81.ngrok-free.app/Commande/getCommandeNonLivree/${parsedUser.id}`,
          )
          .then(res => res.data);
      };
      fetchHandler().then(data => {
        console.log(data.commande);
        setItems(data.commande);
      });
      setColorText2(true)
  }, [parsedUser]);
  const handleEtatNonValide = () => {
    const fetchHandler = async () => {
      return await axios
        .get(
          `https://c534-197-26-80-81.ngrok-free.app/Commande/getCommandeNonLivree/${parsedUser.id}`,
        )
        .then(res => res.data);
    };
    fetchHandler().then(data => {
      console.log(data.commande);
      setItems(data.commande);
    });
    setColorText(false)
    setColorText2(true)
  };
  const handleEtatValide = async () => {
    const fetchHandler = async () => {
      return await axios
        .get(
          `https://c534-197-26-80-81.ngrok-free.app/Commande/getCommandeLivree/${parsedUser.id}`,
        )
        .then(res => res.data);
    };
    fetchHandler().then(data => {
      console.log(data.commande);
      setItems(data.commande);
    });
    setColorText(true)
    setColorText2(false)
  };
  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: -18,
          backgroundColor: 'white',
          paddingVertical: 20,
        }}>
          <TouchableOpacity onPress={()=>navigation.goBack()}>
          <AntDesign name="left" style={{marginLeft: 15,color:'black'}} size={20} />
          </TouchableOpacity>
      
        <Text style={styles.title}> Liste commande</Text>
      </View>
      <View style={styles.view}>
        <TouchableOpacity onPress={handleEtatNonValide}>
          <Text style={{marginLeft: 20, fontWeight: 'bold', fontSize: 15,color: colorText2 ? Colors.orange : "black"}}>
            Commandes en cours
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleEtatValide}>
          <Text style={{marginRight: 35, fontWeight: 'bold', fontSize: 15,color: colorText ? Colors.orange : "black"}}>
            Commandes Livrée
          </Text>
        </TouchableOpacity>
      </View>
      <ListeCommande data={items} setData ={setItems} />
    </SafeAreaView>
  );
};
export default HistoryOrder;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
  },
  title: {
    textTransform: 'capitalize',
    fontSize: 20,
    fontWeight: 'bold',
    color:'black'
  },
  view: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: 'white',
    paddingVertical: 20,
    justifyContent: 'space-between',
  },
  box: {
    borderRadius: 20,

    shadowOpacity: 10,
    marginTop: 1,
  },
  img: {
    width: 100,
    height: 100,
    marginLeft: 10,
  },
  txt: {
    fontSize: 15,
    fontWeight: '800',
    color:'black'
  },
  txt1: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 10,
    color:'black'
  },
});
