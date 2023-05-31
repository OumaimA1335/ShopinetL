import React, {useState,useEffect} from 'react';
import {View, Text, TextInput, Button, StyleSheet, Alert} from 'react-native';
import Colors from '../coloe';
import {Picker} from 'react-native-elements';
import {RadioButton} from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import MessageModal from './MessageModal';
import ModalCommande from './ModalCommande';
import { useNavigation } from '@react-navigation/native';
const Order = ({products,Total}) => {
  console.log('Hi');
  console.log(products);
  console.log(Total)
  const [commande, setCommande] = useState({
    nom:'',
    ville:'',
    region:'',
    phone:'',
    paiement:''
  });
  const navigation = useNavigation();
  const [checked, setChecked] = useState('first');
  const [panierId,setPanierId]=useState([]);
  const [showMessage, setShowMessage] = useState(false);
  const [showMessage2, setShowMessage2] = useState(false);
  const [message,setMessage] =useState('');
  useEffect(() => {
    const updatePanierId = async () => {
      const newPanierIds = await Promise.all(
        products.map((item) => item.id)
      );
      setPanierId((prevPanierId) => [...prevPanierId, ...newPanierIds]);
    };
  
    updatePanierId();
  }, [products]);
  const handleCloseMessage = () => {
    setShowMessage(false);
    setShowMessage2(false);
  };
  const handleOrder = async() => {
    const user = await AsyncStorage.getItem('user');
    const parsedUser = JSON.parse(user);
    // Handle submission of order
    if (
      commande.nom.trim() === '' ||
      commande.ville.trim() === '' ||
      commande.region.trim() === '' ||
      commande.phone.trim() === '' 
      
    ) {
      
      setMessage("Veuillez remplir les champs");
      setShowMessage2(true)
     
    } else {
      const fullAddress = commande.ville + ' ' + commande.region;
      await axios.post(
        'https://c534-197-26-80-81.ngrok-free.app/Commande/createCommande',
        {
          Adresse : String(fullAddress),
          Tel :Number(commande.phone),
          idClient : Number(parsedUser.id),
          Paiement : String(checked),
          PanierId : panierId,
          nom : String(commande.nom)
        },
      );
      setShowMessage(true)
    }
  };
  const data = [
    {key: '1', value: 'kelibia', disabled: true},
    {key: '2', value: 'Nabeul'},
    {key: '3', value: 'Tunis'},
    {key: '4', value: 'Ariana', disabled: true},
    {key: '5', value: 'Hammamet'},
    {key: '6', value: 'Lac1'},
    {key: '7', value: 'Marsa'},
  ];
  const gouve = [
    {key: '1', value: 'Bizert', disabled: true},
    {key: '2', value: 'Nabeul'},
    {key: '3', value: 'Tunis'},
    {key: '4', value: 'Ariana', disabled: false},
    {key: '5', value: 'Sousse'},
    {key: '6', value: 'Sfax'},
    {key: '7', value: 'Kef'},
  ];

  return (
    <View style={styles.container}>
      <ModalCommande
      visible={showMessage}
      Total={Total}
      onClose={handleCloseMessage}
      />
      <MessageModal
      visible={showMessage2}
      message={message}
      onClose={handleCloseMessage}
      />
      <Text style={styles.title}>Finalisation de la commande</Text>
      <View style={styles.diviser}>
        <FontAwesome
          name="user"
          size={20}
          style={{marginTop: 10, marginRight: 5,color:'black'}}
        />
        <TextInput

          style={styles.input}
          placeholder="Nom"
          value={commande.nom}
          onChangeText={text => setCommande(prevCommande => ({ ...prevCommande, nom: text }))}
        />
      </View>
      <View style={styles.diviser}>
        <MaterialCommunityIcons name="home-city" size={20} style={{color:'black'}} />
        <TextInput
          style={styles.input}
          placeholder="Ville"
          value={commande.ville}
          onChangeText={text => setCommande(prevCommande => ({ ...prevCommande, ville: text }))}
        />
        <MaterialCommunityIcons
          name="home-city"
          size={20}
          style={{marginRight: 5,color:'black'}}
        />
        <TextInput
          style={styles.input}
          placeholder="Région"
          value={commande.region}
          onChangeText={text => setCommande(prevCommande => ({ ...prevCommande, region: text }))}
        />
        <FontAwesome name="phone" size={20} style={{marginRight: 5,color:'black'}} />
        <TextInput
          style={styles.input}
          placeholder="Numéro de téléphone"
          value={commande.phone}
          onChangeText={text => setCommande(prevCommande => ({ ...prevCommande,phone: text }))}
          keyboardType="phone-pad"
        />
      </View>
      <View style={styles.diviser1}></View>

      <View style={{marginLeft: -190, alignItems: 'center', marginTop: -30}}>
        <Text style={{marginLeft: 15,color:'black'}}> Méthode de paiement</Text>
        <RadioButton.Group
          onValueChange={value => setChecked(value)}
          value={checked}>
          <View
            style={{flexDirection: 'row', alignItems: 'center', marginTop: 15}}>
            <RadioButton color={Colors.orange} value="A la livraison" />
            <Text style={{color:'black'}}>A la livraison</Text>
          </View>
          <View
            style={{flexDirection: 'row', alignItems: 'center', marginTop: 15}}>
            <RadioButton color={Colors.orange} value="Par carte" />
            <Text style={{color:'black'}}>Par carte</Text>
          </View>
        </RadioButton.Group>
      </View>
      <View style={{marginTop: 20, width: 300}}>
        <Button title="Valider" onPress={handleOrder} color={Colors.orange} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -80,
  },
  title: {
    fontSize: 24,
    fontStyle: 'italic',
    marginBottom: 20,
    color:'black'
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 0,
    borderBottomWidth: 1,
    marginBottom: 50,
    paddingLeft: 20,
    width: 300,
    marginLeft: 10,
    marginTop: -35,
    color:'black'
  },
  diviser: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 5,
  },
  diviser1: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    width: '80%',
    //justifyContent:'space-between'
  },
  box: {
    borderRadius: 0,
    borderWidth: 0,
    borderBottomWidth: 1,
    width: '70%',
  },
});

export default Order;
