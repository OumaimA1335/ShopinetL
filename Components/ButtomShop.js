import {
  View,
  Text,
  Button,
  Modal,
  Picker,
  Alert,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import React, {useRef} from 'react';
import Colors from '../coloe';
import AntDesign from 'react-native-vector-icons/AntDesign';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import {useState} from 'react';
import MessageModal from './MessageModal';
import ModalDropdown from 'react-native-modal-dropdown';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import ModalSelector from 'react-native-modal-selector';
import {SelectList} from 'react-native-dropdown-select-list';
import {Dropdown} from 'react-native-material-dropdown';
import RNPickerSelect from 'react-native-picker-select';
import Swiper from 'react-native-swiper';
export default function ButtomShop({prix, taille, product}) {
  console.log(prix);
  const swipers = useRef([]);

  console.log(product);
  const [visible, setVisible] = React.useState(false);
  const [text, setText] = useState('');
  const [backgroundColorState, setBackgroundColorState] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [Message, setMessage] = useState('');
  const [selectedItemIndex, setSelectedItemIndex] = useState('');
  const [panier, setPanier] = useState({
    taille: '',
    couleur: '',
  });
  const openModal = () => {
    setModalVisible(true);
  };
  const closeModal = () => {
    setText('');
    setPanier({
      taille: '',
      couleur: '',
    });
    setSelectedItemIndex(-1);
    setBackgroundColorState('');
    setModalVisible(false);
  };
  const staticColors = [
    '#FF0000', // Rouge
    '#00FF00', // Vert
    '#0000FF', // Bleu
    '#FFFF00', // Jaune
    '#FFA500', // Orange
    '#800080', // Violet
    '#FFC0CB', // Rose
    '#000000', // Noir
    '#FFFFFF', // Blanc
    '#808080', // Gris
  ];
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
  const handlePanier = async i => {
    const user = await AsyncStorage.getItem('user');
    const parsedUser = JSON.parse(user);
    console.log(panier.couleur, panier.taille);
    try {
      if (product.souscategorie_id == 19) {
        if (panier.taille == '' || panier.couleur == '') {
          setText('Vous devez choir une taille et une couleur correspondante');
          setBackgroundColorState('orange');
          setVisible(true);
        } else {
          console.log(panier.couleur);
          const extractedSubstring = panier.couleur.substring(1);
          console.log(extractedSubstring);
          const response1 = await axios.get(
            `https://c534-197-26-80-81.ngrok-free.app/Panier/verifyTailleCouleur/${product.id}/${panier.taille}/%23${extractedSubstring}`,
          );
          if (response1.data) {
            try {
              await axios.post(
                'https://c534-197-26-80-81.ngrok-free.app/Panier/createPanier',
                {
                  userId: Number(parsedUser.id),
                  produitId: Number(product.id),
                  taille: String(panier.taille),
                  quantite: Number(1),
                  couleur: String(panier.couleur),
                },
              );
              setPanier({
                taille: '',
                couleur: '',
              });
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
      } else {
        try {
          const response = await axios.post(
            'https://c534-197-26-80-81.ngrok-free.app/Panier/createPanier',
            {
              userId: Number(parsedUser.id),
              produitId: Number(product.id),
              quantite: Number(1),
            },
          );
          console.log(response.data);
          setMessage('Ajoutée avec succeé');
          setShowMessage(true);
        } catch (err) {
          setMessage('Ce produit existe dans le panier');
          setShowMessage(true);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleCloseMessage = () => {
    setShowMessage(false);
  };
  return (
    <View>
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
      <View
        style={{
          flexDirection: 'row',
          margin: 10,
          marginHorizontal: 30,
          justifyContent: 'space-between',
        }}>
        {product ? (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginLeft: -105,
            }}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('VirtualTry');
              }}>
              <FontAwesome
                name="camera"
                size={40}
                style={{marginLeft: 100, color: Colors.orange}}
              />
            </TouchableOpacity>
          </View>
        ) : null}

        {product.souscategorie_id == 19 ? (
          <TouchableOpacity style={styles.panelButton} onPress={openModal}>
            <Text style={{color: 'white'}}>Ajouter</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.panelButton} onPress={handlePanier}>
            <Text style={{color: 'white'}}>Ajouter</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
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
  panelButton: {
    padding: 13,
    borderRadius: 10,
    backgroundColor: '#FF6347',
    alignItems: 'center',
    marginLeft: 20,
    color: 'white',
    width: 290,
  },
  panelButton2: {
    padding: 13,
    borderRadius: 10,
    backgroundColor: '#FF6347',
    alignItems: 'center',
    marginTop: 40,
    color: 'white',
    width: 250,
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
  box: {
    borderRadius: 5,
    borderWidth: 1,
    marginTop: 5,
    marginLeft: -15,
    width: 150,
    borderColor: Colors.orange,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  optionText: {
    marginLeft: 10,
  },
  selectedOptionText: {
    fontWeight: 'bold',
  },
  paginationStyle: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  paginationText: {
    color: 'white',
    fontSize: 20,
  },
});
