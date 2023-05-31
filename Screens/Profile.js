import React from 'react';
import {View, SafeAreaView, StyleSheet} from 'react-native';
import {
  Avatar,
  Title,
  Caption,
  Text,
  TouchableRipple,
} from 'react-native-paper';

import Icon from 'react-native-vector-icons/FontAwesome5';
import Entypo from 'react-native-vector-icons/Entypo'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import { useEffect ,useState} from 'react';
import axios from 'axios';
import { useAuth } from '../Context/AuthContext';
import AntDesign from "react-native-vector-icons/AntDesign"
import Colors from '../coloe';
import { TouchableOpacity } from 'react-native-gesture-handler';
const Profile = () => {
  const navigation = useNavigation();
  const [parsedUser, setParsedUser] = useState({
    id :0,
    email :'',
    role_id:0,
    image :"",
  });
  const [items,setItems]=useState({
    id: 0,
    Adresse: "",
    Tel:0,
    idClient:0,
    Etat: "",
    Paiement: "",
    confirmation: "",
    nom: ""
  })
  const [numberCommande,setNumberCommande]=useState(0);
  const [type,setType]=useState('')
  const {handleLogout} =useAuth();
  useEffect(()=>{
    const fetchUser = async () => {
      try {
        const user = await AsyncStorage.getItem('user');
        const parsedUser = JSON.parse(user);
        const type1 = await AsyncStorage.getItem('type');
        setType(type1);
        setParsedUser(parsedUser);
        console.log(parsedUser);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUser();
   
  },[])
  useEffect(()=>{
    const fetchHandler = async () => {
      return await axios
        .get(
          `https://c534-197-26-80-81.ngrok-free.app/Commande/userInformattion/${parsedUser.id}`,
        )
        .then(res => res.data);
    };
    const fetchHandlerNumber = async () => {
      return await axios
        .get(
          `https://c534-197-26-80-81.ngrok-free.app/Commande/GetNumberOforderByUser/${parsedUser.id}`,
        )
        .then(res => res.data);
    };
    fetchHandler().then(data => {
      console.log(data);
      setItems(data);
    });
    fetchHandlerNumber().then(data => {
      console.log(data);
      setNumberCommande(data);
    });
  },[parsedUser])
  return (
    <SafeAreaView style={styles.container}>
       <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: -10,
          backgroundColor: 'white',
          paddingVertical: 20,
        }}>
          <TouchableOpacity onPress={()=>navigation.goBack()}>
          <AntDesign name="left" style={{marginLeft: 15,color:'black'}} size={20} />
          </TouchableOpacity>
       
        <Text style={styles.title}>Compte</Text>
      </View>
      {type && type =="email" ? (<View>
      <MaterialCommunityIcons
                name="account-edit"
                size={25}
                style={{textAlign:'right',marginRight:12}}
                color={Colors.orange}
                onPress={() => navigation.navigate('Edit')}
              />
      </View>):null}
      <View style={styles.userInfoSection}>
        <View style={{flexDirection: 'row', marginTop: 15}}>
        {parsedUser.image ? (  
        <Avatar.Image 
            source={{
              uri: parsedUser.image,
            }}
            size={80}
            backgroundColor="transparent"
          />):(
            <Avatar.Image 
            source={{
              uri:'https://www.nicepng.com/png/detail/115-1150821_default-avatar-comments-sign-in-icon-png.png',
            }}
            size={80}
            backgroundColor="transparent"
          />
          )
}
          <View style={{marginLeft: 20}}>
            {items.nom!="" ? (<Title style={[styles.title2, {
              marginTop:15,
              marginBottom: 5,
            }]}>{items.nom}</Title>):null}

          </View>
        </View>
      </View>

      <View style={styles.userInfoSection}>
       {items.Adresse !=""? ( <View style={styles.row}>
          <Icon name="map" color={Colors.orange} size={20}/>
          <Text style={{color:"#777777", marginLeft: 20}}>{items.Adresse}</Text>
        </View>):null}
        {items.Tel !=0 ? (<View style={styles.row}>
          <Icon name="phone" color={Colors.orange} size={20}/>
          <Text style={{color:"#777777", marginLeft: 20}}>+216 {items.Tel}</Text>
        </View>):null}
        <View style={styles.row}>
          <Icon name="envelope" color={Colors.orange} size={20}/>
          <Text style={{color:"#777777", marginLeft: 20}}>{parsedUser.email}</Text>
        </View>
      </View>

      <View style={styles.infoBoxWrapper}>
          
         {numberCommande!=0 ? ( <View style={styles.infoBox}>
            <Title>{numberCommande}</Title>
            <Caption>Commandes</Caption>
          </View>):null}
      </View>

      <View style={styles.menuWrapper}>     
        <TouchableRipple onPress={() => {navigation.navigate('HistoryOrder')}}>
          <View style={styles.menuItem}>
            <Icon name="list-ul" color="#FF6347" size={25}/>
            <Text style={styles.menuItemText}>Commandes historiques</Text>
          </View>
        </TouchableRipple>
        <TouchableRipple onPress={() => navigation.navigate('Reclamation')}>
          <View style={styles.menuItem}>
            <Icon name="exclamation-circle" color="#FF6347" size={25}/>
            <Text style={styles.menuItemText}>Réclamation</Text>
          </View>
        </TouchableRipple>
        <TouchableRipple onPress={() => {
          handleLogout()
          navigation.navigate('Login')
          }}>
          <View style={styles.menuItem}>
            <Entypo name="log-out" color="#FF6347" size={25}/>
            <Text style={styles.menuItemText}>Déconnecter</Text>
          </View>
        </TouchableRipple>
      </View>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
    backgroundColor:'white'
  },
  userInfoSection: {
    paddingHorizontal: 30,
    marginBottom: 25,
  },
  title2: {
    fontSize: 16,
    fontWeight: 'bold',
    color:'black'
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  infoBoxWrapper: {
    borderBottomColor: '#dddddd',
    borderBottomWidth: 1,
    borderTopColor: '#dddddd',
    borderTopWidth: 1,
    flexDirection: 'row',
    height: 100,
    justifyContent:'center'
  },
  infoBox: {
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuWrapper: {
    marginTop: 10,
  },
  menuItem: {
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 30,
  },
  menuItemText: {
    color: '#777777',
    marginLeft: 20,
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 26,
    color:'black'
  },
  title: {
    textTransform: 'capitalize',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft:10,
    color:'black'
  }
});