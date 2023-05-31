import {View, Text, Image, TouchableOpacity, Modal, Alert} from 'react-native';
import React, {useEffect, useState,useRef} from 'react';
import {StyleSheet, Dimensions} from 'react-native';
import {ScrollView} from 'react-native';
import ColorList from './ColorList';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Colors from '../coloe';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import ButtomTab from './ButtomTab';
import {Divider} from 'react-native-elements';
import {TouchableRipple, Menu} from 'react-native-paper';
import {SafeAreaView} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Swiper from 'react-native-swiper';
import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import FlashMessage, {showMessage} from 'react-native-flash-message';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MessageModal from './MessageModal';
import {Picker} from '@react-native-picker/picker';
import DropDownPicker from 'react-native-dropdown-picker';
import ModalDropdown from 'react-native-modal-dropdown';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function ListProd1({root}) {
  const navigation = useNavigation();
  console.log(root);
  const {width} = Dimensions.get('window');
  const [taille, setTaille] = useState([]);
  const [panier, setPanier] = useState({
    id: 0,
    taille: '',
    couleur: '',
  });
  const [avis, setAvis] = useState([]);
  const [offer, setOffer] = useState([]);
  const [visible, setVisible] = React.useState(false);
  const [text, setText] = useState('');
  const [backgroundColorState, setBackgroundColorState] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [Message, setMessage] = useState('');
  const [color, setColor] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const openMenu = () => setIsMenuOpen(true);
  const closeMenu = () => setIsMenuOpen(false);
  const swipers = useRef([]);
  const handleOptionPress = value => {
    onValueChange(value);
    closeMenu();
  };
  const openModal = () => {
    setModalVisible(true);
  };
  const closeModal = () => {
    setText('');
    setBackgroundColorState('');
    setPanier({
      id: 0,
      taille: '',
      couleur: '',
    });
    setModalVisible(false);
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
  useEffect(() => {
    async function fetchData() {
      const results = await Promise.all(
        root.map(item =>
          axios
            .get(
              `https://c534-197-26-80-81.ngrok-free.app/Avis/getNumberStars/${item.id}`,
            )
            .then(res => res.data),
        ),
      );
      setAvis(results);
    }
    fetchData();
    async function fetchOffer() {
      const results = await Promise.all(
        root.map(item => {
          if (item.offreId != null) {
            return axios
              .get(
                `https://c534-197-26-80-81.ngrok-free.app/Offre/getOfferId/${item.offreId}`,
              )
              .then(res => res.data.offre);
          }
        }),
      );
      setOffer(results);
    }
    fetchOffer();
  }, [root]);

  const FetchTaille = async id => {
    try {
      setPanier(prevState => ({
        ...prevState,
        id: id, // new taille value
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
  const handlePanier = async () => {
    const user = await AsyncStorage.getItem('user');
    const parsedUser = JSON.parse(user);
    console.log(panier.couleur, panier.taille);
    if (panier.taille == '' || panier.couleur == '') {
      setText('Vous devez choir une taille et une couleur correspondante');
      setBackgroundColorState('orange');
      setVisible(true);
    } else {
      console.log(panier.couleur);
      const extractedSubstring = panier.couleur.substring(1);
      console.log(extractedSubstring);
      const response1 = await axios.get(
        `https://c534-197-26-80-81.ngrok-free.app/Panier/verifyTailleCouleur/${panier.id}/${panier.taille}/%23${extractedSubstring}`,
      );
      if (response1.data) {
        try {
          await axios.post(
            'https://c534-197-26-80-81.ngrok-free.app/Panier/createPanier',
            {
              userId: Number(parsedUser.id),
              produitId: Number(panier.id),
              taille: String(panier.taille),
              quantite: Number(1),
              couleur: String(panier.couleur),
            },
          );
          setPanier(prevState => ({
            ...prevState,
            taille: '',
            couleur: '',
          }));
          setText('Ajoutée avec succée');
          setBackgroundColorState('green');
          setVisible(true);
        } catch (err) {
          console.log(err)
          setText('Ce produit existe déja dans le panier');
          setBackgroundColorState('red');
          setVisible(true);
        }
      } else {
        setText("Cette taille n'a pas cette couleur");
        setBackgroundColorState('red');
        setVisible(true);
      }
    }
  };
  const handlePnaier2 = async item => {
    const user = await AsyncStorage.getItem('user');
    const parsedUser = JSON.parse(user);
    try {
      const response = await axios.post(
        'https://c534-197-26-80-81.ngrok-free.app/Panier/createPanier',
        {
          userId: Number(parsedUser.id),
          produitId: Number(item.id),
          quantite: Number(1),
        },
      );
      console.log(response.data);
      setMessage('ajoutée avec succeé');
      setShowMessage(true);
    } catch (err) {
      console.log(err);
      setMessage('Le produit déja existe dans la panier');
      setShowMessage(true);
    }
  };
  const handleFavoris = async id => {
    const user = await AsyncStorage.getItem('user');
    const parsedUser = JSON.parse(user);
    try {
      await axios.post(
        'https://c534-197-26-80-81.ngrok-free.app/Favoris/createFavoris',
        {
          userId: Number(parsedUser.id),
          produitId: Number(id),
        },
      );
      setMessage('ajoutée avec succeé');
      setShowMessage(true);
    } catch (err) {
      console.log(err);
      setMessage('Le produit déja existe dans la liste des favoris');
      setShowMessage(true);
    }
  };
  const handleCloseMessage = () => {
    setShowMessage(false);
  };
  return (
    <SafeAreaView>
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
            <Text style={{color:'black'}}>Choisir une taille</Text>
            <View style={{flexDirection: 'column', marginTop: 10}}>
              {taille.map((item, i) => (
                <View style={{flexDirection: 'row', marginLeft: 10}} key={i}>
                  <TouchableOpacity
                    onPress={() => {
                      setPanier(prevState => ({
                        ...prevState,
                        taille: item.taille, // new taille value
                      }));
                    }}>
                    <View style={styles.bottomTaille}>
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

            <TouchableOpacity style={styles.panelButton} onPress={handlePanier}>
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
      <ScrollView showsVerticalScrollIndicator={true}>
        <Animated.View
          style={{
            margin: 20,
            paddingBottom: 230,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              flexWrap: 'wrap', // ajouter flexWrap pour permettre aux éléments de se déplacer à la ligne
              width: width - 50, // ajuster la largeur de la vue
              marginLeft: 5,
            }}>
            {root.map((item, index) => {
              console.log(index);
              return (
                <View key={index} style={styles.box}>
                  <View style={{flexDirection: 'row'}}>
                    {item.model ? (
                      <Image
                        style={{
                          width: 50,
                          height: 40,
                          marginTop: 3,
                          marginLeft: 5,
                        }}
                        source={require('../assets/try2.png')}
                      />
                    ) : null}
                    <View
                      style={{
                        start: item.model ? 80 : 130,
                        marginTop: 5,
                      }}>
                      {item.souscategorie_id == 19 ? (
                        <TouchableOpacity
                          onPress={() => {
                            FetchTaille(item.id);
                            openModal();
                            //bs.current.snapTo(0);
                          }}>
                          <FontAwesome5
                            name="cart-plus"
                            color={Colors.orange}
                            size={20}
                          />
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          onPress={() => {
                            handlePnaier2(item);
                          }}>
                          <FontAwesome5
                            name="cart-plus"
                            color={Colors.orange}
                            size={20}
                          />
                        </TouchableOpacity>
                      )}
                      <TouchableOpacity
                        onPress={() => {
                          handleFavoris(item.id);
                        }}>
                        <FontAwesome5
                          name="heart"
                          color={Colors.orange}
                          size={20}
                          style={{marginTop: 10, marginLeft: 2}}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <Swiper showsPagination={true}>
                    {item.imageList.map((i, index) => {
                      const image = JSON.parse(i);
                      console.log(image.url);
                      return (
                        <Image
                          key={index} // add a unique key prop for each image component
                          source={{uri: image.url}}
                          style={{
                            width: 130,
                            height: 160,
                            paddingVertical: 5,
                            resizeMode: 'center',
                            marginTop: 15,
                            marginLeft: 15, // add some margin between the images
                          }}
                        />
                      );
                    })}
                  </Swiper>
                  {item.offreId != null && (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginEnd: 120,
                      }}>
                      {offer
                        .map(result => {
                          console.log('hello' + result);
                          if (result && result.id === item.offreId) {
                            console.log(result);
                            const pourcentages = result.pourcentage;
                            console.log(pourcentages);
                            return (
                              <Text
                                key={result.id}
                                style={{fontSize: 13, fontWeight: '800',color:Colors.orange}}>
                                {pourcentages}%
                              </Text>
                            );
                          }
                          return null;
                        })
                        .find(element => element !== null)}
                    </View>
                  )}

                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginTop: 0,
                      paddingVertical: 10,
                      paddingHorizontal: 15,
                    }}>
                    <Text style={{fontSize: 13, fontWeight: '900',color:'black'}}>
                      {item.nom}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      paddingHorizontal: 15,
                    }}>
                    {avis.map((it, index) => {
                      if (it.idProduit == item.id && it.sumStars != null) {
                        console.log('1');
                        console.log(it.sumStars);
                        const stars = Array(Math.min(it.sumStars, 5))
                          .fill()
                          .map((_, i) => (
                            <FontAwesome
                              key={i}
                              name="star"
                              size={16}
                              color={Colors.orange}
                            />
                          ));
                        return stars;
                      } else {
                        return null;
                      }
                    })}
                  </View>

                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('Details', {myVariable: item.id})
                    }>
                    <Text
                      style={{
                        marginTop: 10,
                        backgroundColor: Colors.gray1,
                        width: 158,
                        height: 35,
                        fontSize: 15,
                        fontWeight: 'bold',
                        color: Colors.orange,
                        justifyContent: 'center',
                        textAlign: 'center',
                        borderRadius: 10,
                      }}>
                      {item.prix} DT
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  box: {
    position: 'relative',
    width: 160,
    height: 380,
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: 'Black',
    marginRight: 5,
    flexWrap: 'wrap-reverse',
  },
  header: {
    backgroundColor: '#F5F5F5',
    shadowColor: '#333333',
    shadowOffset: {width: -1, height: -9},
    shadowRadius: 17,
    shadowOpacity: 0.9,
    paddingTop: 50,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: 372,
    alignItems: 'center',
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
    height: 500,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 10,
    color: '#05375A',
  },
  commandButton: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#FF6347',
    alignItems: 'center',
    marginTop: 10,
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F2',
    paddingBottom: 5,
  },
  panelButton: {
    padding: 13,
    borderRadius: 10,
    backgroundColor: '#FF6347',
    alignItems: 'center',
    marginVertical: 15,
    color: 'white',
    width: 250,
    marginTop: 20,
  },
  bottomTaille: {
    borderColor: Colors.orange,
    borderRadius: 5,
    backgroundColor: Colors.orange,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 2,
    color: 'white',
    width: 50,
    marginTop: 20,
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
});
