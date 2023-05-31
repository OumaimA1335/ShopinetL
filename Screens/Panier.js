import React, {useState} from 'react';
import {Image} from 'react-native';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-community/async-storage';
import Colors from '../coloe';
import Order from '../Components/Order';
import {useEffect} from 'react';
import {useRef} from 'react';
import Swiper from 'react-native-swiper';
import axios from 'axios';
import FlashMessage, {showMessage} from 'react-native-flash-message';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useNavigation} from '@react-navigation/native';
import MessageModal from '../Components/MessageModal';
import { Card, Divider } from 'react-native-elements';
const Panier = () => {
  const [items, setItems] = useState([]);
  const [showMessage, setShowMessage] = useState(false);
  const[Message,setMessage]=useState('')
  const navigation = useNavigation();
  useEffect(() => {
    const fetchHandler = async () => {
      const user = await AsyncStorage.getItem('user');
      const parsedUser = JSON.parse(user);
      console.log(user);
      return await axios
        .get(
          `https://c534-197-26-80-81.ngrok-free.app/Panier/getUserProducts/${parsedUser.id}`,
        )
        .then(res => res.data);
    };
    fetchHandler().then(data => {
      console.log(data);
      setItems(data.products);
    });
  }, []);
  const handleCloseMessage = () => {
    setShowMessage(false);
  };
  const totalPrice = items.reduce((total, item) => {
    const TVA = 19;
    let prixHorsTaxe;
    let TVAProduit;
    let prixTTC;
    if (item.promotion) {
      prixHorsTaxe =
        ((item.prix * (100 - item.promotion)) / 100) * item.quantite;
      TVAProduit = item.prix * (TVA / 100);
      prixTTC = prixHorsTaxe + TVAProduit;
      return (total += prixTTC);
    } else {
      prixHorsTaxe = item.prix * item.quantite;
      TVAProduit = item.prix * (TVA / 100);
      prixTTC = prixHorsTaxe + TVAProduit;
      return (total += prixTTC);
    }
  }, 0);
  const deleteProduct = async id => {
    await axios.delete(
      `https://c534-197-26-80-81.ngrok-free.app/Panier/deleteProductPanier/${id}`,
    );
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  };
  const renderItem = ({item}) => (
    <View style={styles.item}>
      <Image source={{uri: JSON.parse(item.image[0]).url}} style={styles.img} />
      <View style={{marginTop: 50}}>
        <Text style={styles.itemName}>{item.nom}</Text>
        {item.taille != 'undefined' && (
          <Text style={{marginBottom: 0}}>{item.taille}</Text>
        )}
        {item.couleur != null && (
          <Text style={{ marginBottom: item.promotion == 0 ? 55 : 0 }}>
            <FontAwesome
              name="circle"
              size={15}
              color={item.couleur}
              style={{marginLeft: -35, marginTop: 5}}
            />
          </Text>
        )}
        {item.promotion != 0 && (
          <Text style={{ marginBottom: 55}}>
            {item.promotion}% promotion
          </Text>
        )}
      </View>
      <View style={{width:95,flexDirection:'row',marginLeft:-70}}>
      <View style={styles.quantityContainer}>
        <TouchableOpacity
          onPress={() =>
            updateQuantity(item.id, item.quantite - 1, item.quantiteProduit)
          }>
          <Text style={styles.quantityButton}>-</Text>
        </TouchableOpacity>
        <Text style={styles.quantity}>{item.quantite}</Text>
        <TouchableOpacity
          onPress={() =>
            updateQuantity(item.id, item.quantite + 1, item.quantiteProduit)
          }>
          <Text style={styles.quantityButton}>+</Text>
        </TouchableOpacity>
        
      </View>
      </View>
      <View>
      <Text style={styles.itemPrice}>
          {item.promotion
            ? ((item.prix * (100 - item.promotion)) / 100) * item.quantite +
              ' TND'
            : item.prix * item.quantite + ' TND'}
        </Text>
      </View>
    
      <View style={{marginTop: -75}}>
        <TouchableOpacity
          onPress={() => {
            deleteProduct(item.id);
          }}>
          <AntDesign name="closecircle" size={15} color={Colors.orange} />
        </TouchableOpacity>
      </View>
    </View>
  );
  const updateQuantity = async (id, quantity, quantiteProduit) => {
    if (quantity > 0 && quantiteProduit > quantity) {
      const newItems = [...items];
      const index = newItems.findIndex(item => item.id === id);
      newItems[index].quantite = quantity;
      setItems(newItems);
      await axios.put(
        `https://c534-197-26-80-81.ngrok-free.app/Panier/updateQuantity/${id}`,
        {
          quantite: Number(quantity),
        },
      );
    } else {
      setMessage("La quantité de ce produit est limitée")
      setShowMessage(true)
    }
  };
  //remplissage details clients
  const renderInner = () => (
    <>
      <Order products={items} Total={totalPrice} />
    </>
  );
  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.panelHeader}>
        <View style={styles.panelHandle} />
      </View>
    </View>
  );
  const [modalVisible, setModalVisible] = useState(false);
  ///*************
  return (
    <View style={styles.container}>
        <MessageModal
      visible={showMessage}
      message={Message}
      onClose={handleCloseMessage}
    />
      <Modal
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}>
        <View style={styles.modalContainer}>
          {renderHeader()}
          {renderInner()}
        </View>
      </Modal>
     
      <View style={{ flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: 'white',
          }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="left" color={'black'} size={20} />
        </TouchableOpacity>
        <Text style={styles.title}> Panier</Text>
      </View>
     
      
   
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        style={styles.flat}
      />
      <View style={styles.total}>
        <Text style={styles.totalLabel}>Total:</Text>
        <Text style={styles.totalPrice}>{totalPrice} TND</Text>
      </View>
      <View>
        <TouchableOpacity
          style={styles.commandButton}
          onPress={() => setModalVisible(true)}>
          <Text
            style={{
              fontSize: 20,
              textTransform: 'capitalize',
              fontWeight: '700',
              color: 'white',
            }}>
            passer commande
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: 8,
    paddingTop: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  commandButton: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: Colors.orange,
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 10,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 180,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  img: {
    width: 110,
    height: 130,
    borderRadius: 10,
    marginRight: 10,
  },
  itemName: {
    fontSize: 14,
    fontWeight: 'bold',

    color: 'black',
    width: 140,
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 130,

    color: 'black',
  },
  quantityContainer: {
    flex: 1,
    flexDirection: 'row',

    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    height: 30,
    marginRight :5,
  
    marginTop: 130,
  },
  quantityButton: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.orange,
    marginLeft :5
  },
  quantity: {
    marginHorizontal: 20,
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  total: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  bottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.orange,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderTopWidth: 0,
    borderTopColor: Colors.grey,
    borderRadius: 5,
  },
  totalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    color: 'black',
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.red,
    color: 'black',
  },
  flat: {
    paddingHorizontal: 7,
  
    marginTop: -10,
  },
  checkoutButton: {
    backgroundColor: Colors.red,
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  header: {
    backgroundColor: Colors.grey,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    height: 10,
    alignItems: 'center',
  },
  panelHeader: {
    alignItems: 'center',
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.grey,
    marginBottom: 10,
  },
});
export default Panier;
