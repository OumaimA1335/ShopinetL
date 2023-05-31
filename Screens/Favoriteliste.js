import {
  Button,
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  Picker
} from 'react-native';
import React, {useState, useEffect,useRef} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Card} from 'react-native-paper';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {Divider} from 'react-native-elements';
import ButtomTab from '../Components/ButtomTab';
import Colors from '../coloe';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import FlashMessage, {showMessage} from 'react-native-flash-message';
import Animated from 'react-native-reanimated';
import ModalDropdown from 'react-native-modal-dropdown';
import BottomSheet from 'reanimated-bottom-sheet';
import { Snackbar } from 'react-native-paper';
import MessageModal from '../Components/MessageModal';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import Swiper from 'react-native-swiper';
const Favoritelist = () => {
  const swipers = useRef([]);
  const [items, setItems] = useState([]);
  const [taille, setTaille] = useState([]);
  const [Chantaille, setChanTaille] = useState("");
  const [panier, setPanier] = useState({
    id: 0,
    taille: '',
    couleur: '',
  });
  const [visible, setVisible] = React.useState(false);
  const [text,setText]=useState('');
  const [backgroundColorState,setBackgroundColorState]=useState('')
  const [modalVisible, setModalVisible] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const[Message,setMessage]=useState('')
  const navigation = useNavigation();
  const openModal = () => {
    setModalVisible(true);
  };
  const closeModal = () => {
    setText("")
    setBackgroundColorState("")
    setPanier({
    id: 0,
    taille: '',
    couleur: '',
    })
    setModalVisible(false);
  };
  useEffect(() => {
    
    const fetchHandler = async () => {
    const user = await AsyncStorage.getItem('user');
    const parsedUser = JSON.parse(user);
    console.log(user);
      return await axios
        .get(
          `https://c534-197-26-80-81.ngrok-free.app/Favoris/getProductsFavByUSer/${parsedUser.id}`,
        )
        .then(res => res.data);
    };
    fetchHandler().then(data => {
      console.log(data);
      setItems(data.produits);
    });
  }, []);
  const deleteProduct = async id => {
    await axios.delete(
      `https://c534-197-26-80-81.ngrok-free.app/Favoris/deletefavoriteProduct/${id}`,
    );
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  };
  const FetchTaille = async id => {
    try {
      setPanier(prevState => ({
        ...prevState,
        id: id, 
      }));
      const response = await axios.get(
        `https://c534-197-26-80-81.ngrok-free.app/Product/getTailleProduct/${id}`,
      );
      const data = response.data;
      setTaille(data.tailles);
    } catch (error) {
      console.error(error);
    }
  };
  const handleSwiperRef = (ref, index) => {
    swipers.current[index] = ref;
  };

  const handleScrollBy = (index, step) => {
    swipers.current[index]?.scrollBy(step);
  };
  handleChangeColor = item => {
    console.log(item);
    setPanier(prevState => ({
      ...prevState,
      couleur: item,
    }));
  };
  const handlePanier = async () => {
    const user = await AsyncStorage.getItem('user');
    const parsedUser = JSON.parse(user);
    console.log(panier.couleur,panier.taille)
    try {
    
        if (panier.taille == '' || panier.couleur =='') {
          setText('Vous devez choir une taille et une couleur correspondante');
          setBackgroundColorState('orange');
          setVisible(true);
        } else {
          console.log(panier.couleur)
          const extractedSubstring = panier.couleur.substring(1);
          console.log(extractedSubstring)
          const response1 = await axios.get(
            `https://c534-197-26-80-81.ngrok-free.app/Panier/verifyTailleCouleur/${panier.id}/${panier.taille}/%23${extractedSubstring}`,
          );
          if (response1.data) {
            try {
               await axios.post(
                'https://e11e-197-3-219-107.ngrok-free.app/Panier/createPanier',
                {
                  userId: Number(parsedUser.id),
                  produitId: Number(panier.id),
                  taille: String(panier.taille),
                  quantite: Number(1),
                  couleur: String(panier.couleur),
                },
              );
              setPanier(
                {
                  taille: '',
                  couleur: '',
                }
              )
              setText('Ajoutée avec succée');
              setBackgroundColorState('green');
              setVisible(true);
            } catch (err) {
              setText('Ce produit existe déja dans le panier');
              setBackgroundColorState('red');
              setVisible(true);
            }
          } else {
            setText("Ce taille n'a pas cette couleur");
            setBackgroundColorState('red');
            setVisible(true);
          }
        }
     
    } catch (error) {
      console.log(error);
    }
  };
  const handlePnaier2=async(item)=>
  {
    const user = await AsyncStorage.getItem('user');
    const parsedUser = JSON.parse(user);
    try{
      const response = await axios.post(
        'https://c534-197-26-80-81.ngrok-free.app/Panier/createPanier',
        {
          userId: Number(parsedUser.id),
          produitId: Number(item.idProduit),
          quantite : Number(1)
        },
      );
      console.log(response.data);
      setMessage("Ajoutée avec succeé")
      setShowMessage(true)
    }catch(err)
    {
      console.log(err)
      setMessage("Ce produit existe déja dans la panier")
      setShowMessage(true)
    
    }
  }
  const handleCloseMessage = () => {
    setShowMessage(false);
  };
  return (
    <SafeAreaView style={styles.container}>
    <Modal
        visible={modalVisible}
        transparent={true}
        onRequestClose={closeModal}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={closeModal}>
              <AntDesign
                name="closecircle"
                size={20}
                color={Colors.orange}
                style={{marginLeft: 230, marginTop: -10}}
              />
            </TouchableOpacity>
            <Text>Choisir une taille</Text>
            <View style={{flexDirection: 'column', marginTop: 10}}>
              {taille.map((item, i) => (
                <View key={i} style={{flexDirection: 'row', marginLeft: 10}}>
                  <TouchableOpacity
                    onPress={() => {
                      setPanier(prevState => ({
                        ...prevState,
                        taille: item.taille, // new taille value
                      }));
                    }}>
                    <View key={i} style={styles.bottomTaille}>
                      <Text style={{color: 'white'}}>{item.taille}</Text>
                    </View>
                  </TouchableOpacity>
                  <View
                    style={{
                      marginTop: 10,
                      marginLeft: 50,
                      width: 150,
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <TouchableOpacity onPress={() => handleScrollBy(i, -1)}>
                        <Icon
                          name="chevron-left"
                          size={20}
                          style={{marginTop: 15}}
                        />
                      </TouchableOpacity>
                      <Swiper
                        showsPagination={false}
                        height={40}
                        width={40}
                        style={{marginTop: 15, marginLeft: 15}}
                        ref={ref => handleSwiperRef(ref, i)}>
                        {item.couleur.map((item, index) => (
                          <TouchableOpacity
                            key={index}
                            onPress={() => {
                              handleChangeColor(item);
                            }}>
                            <Icon name="circle" color={item} size={20} />
                          </TouchableOpacity>
                        ))}
                      </Swiper>
                      <TouchableOpacity onPress={() => handleScrollBy(i, 1)}>
                        <Icon
                          name="chevron-right"
                          size={20}
                          style={{marginTop: 15, marginRight: 55}}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
            </View>
            <TouchableOpacity
              style={styles.panelButton2}
              onPress={handlePanier}>
              <Text style={{color: 'white'}}>Ajouter</Text>
            </TouchableOpacity>
            <View style={{width: 200, marginLeft: 8}}>
              {visible && (
                <Text
                  style={{
                    color: backgroundColorState,
                    fontSize: 12,
                    fontWeight: 'bold',
                  }}>
                  {text}
                </Text>
              )}
            </View>
          </View>
        </View>
      </Modal>
      <MessageModal
        visible={showMessage}
        message={Message}
      
        onClose={handleCloseMessage}
      />
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity onPress={()=>navigation.goBack()}>
          <AntDesign name="left" style={{marginLeft:10,  marginTop:10}}  color={'black'} size={20} />
          </TouchableOpacity>
         
          <Text style={styles.title}> Liste des favoris</Text>
        </View>
        <Text> <FlashMessage style={{borderRadius:25,alignItems:"center"}} position="top" /></Text>
        <ScrollView style={{paddingHorizontal: 5, }}>
        <Animated.View
        style={{
        
        }}>
          {items.map((item, index) => {
            return (
              <Card key={index} style={styles.box}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Image
                    source={{uri: JSON.parse(item.image[0]).url}}
                    style={styles.img}
                  />
                  <View>
                    <Text style={styles.txt}>{item.nom} </Text>

                    <View style={{flexDirection: 'row'}}>
                      <Text style={styles.txt1}>{item.prix} TND</Text>
                      {item.idSousCategorie == 19 ? (
                        <TouchableOpacity
                          onPress={() => {
                            //setPanier(item)
                            FetchTaille(item.idProduit);
                            openModal()
                          }}>
                          <FontAwesome5
                            name="cart-plus"
                            size={20}
                            style={{marginStart: 125, color: Colors.orange}}
                          />
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                        onPress={() => {
                         
                          handlePnaier2(item)
                         
                        }}>
                          <FontAwesome5
                            name="cart-plus"
                            size={20}
                            style={{marginStart: 125, color: Colors.orange}}
                          />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                  <View style={{marginTop: -50, marginLeft: -18}}>
                    <TouchableOpacity
                      onPress={() => {
                        deleteProduct(item.id);
                      }}>
                      <AntDesign
                        name="closecircle"
                        size={15}
                        color={Colors.orange}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </Card>
            );
          })}
          </Animated.View>
        </ScrollView>
        <Divider style={{}} />
        <ButtomTab />
      
    </SafeAreaView>
  );
};

export default Favoritelist;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 5,
    paddingTop: 10,

    backgroundColor: Colors.white,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textTransform: 'capitalize',
    color:'black',
    marginTop:10
  },
  box: {
    marginTop: 10,
    marginLeft: 15,
    backgroundColor: Colors.white,
    height: 155,
    width: 350,
  },
  img: {
    width: 100,
    height: 125,
    marginLeft: 10,
    marginTop: 15,
  },
  txt: {
    fontSize: 15,
    fontWeight: '800',
    marginLeft: 15,
    color:'black',
    width :140
  },
  txt1: {
    fontSize: 15,
    marginTop: 10,
    marginLeft: 15,
    color:'black'
  },
  header: {
    backgroundColor: '#F5F5F5',
    shadowColor: '#333333',
    shadowOffset: {width: -1, height: -9},
    shadowRadius: 17,
    shadowOpacity: 0.9,
    marginTop: 100,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: 382,
    alignItems: 'center',
    paddingTop: 30,
   
  },
  panelHeader: {
    alignItems: 'center',
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00000040',
    marginBottom: 10,
    alignItems: 'center',
  },
  panel: {
    padding: 10,
    backgroundColor: '#F5F5F5',
    paddingTop: 20,
  },
  panelButton: {
    padding: 13,
    borderRadius: 10,
    backgroundColor: '#FF6347',
    alignItems: 'center',
    marginVertical: 7,
    color: 'white',
  },
  bottomTaille: {
    borderColor: Colors.orange,
    borderRadius: 5,
    backgroundColor: Colors.orange,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 2,
    color: 'white',
    width:50,
    marginTop:20,
  
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
  },
  panelButton2: {
    padding: 13,
    borderRadius: 10,
    backgroundColor: '#FF6347',
    alignItems: 'center',
    marginTop: 40,
    color: 'white',
    width: 250,
  }
});
