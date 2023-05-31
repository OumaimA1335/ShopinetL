import React, {useState,useEffect} from 'react';
import {View, Text, Modal, TextInput, TouchableOpacity} from 'react-native';
import {Button, Rating, AirbnbRating, Input} from 'react-native-elements';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Colors from '../coloe';
import AsyncStorage from '@react-native-community/async-storage';
import axios from "axios"
const AvisModal = ({visible, onClose,idProduct,idCommande}) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  console.log(idProduct);
  const handleRatingChange = value => {
    setRating(value);
  };

  const handleSubmit = async() => {
    const user = await AsyncStorage.getItem('user');
    const parsedUser = JSON.parse(user);
    console.log('Rating:', rating);
    console.log('Comment:', comment);
    console.log(parsedUser)
    await axios.post(
        `https://c534-197-26-80-81.ngrok-free.app/Avis/createAvis/${idCommande}`,
        {
            nbEtoile :rating,
            description :comment,
            idClient :parsedUser.id,
            idProduit:idProduct
        },
      );
    setRating(0)
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity onPress={()=>{
            onClose();
            setRating(0)
            }}>
            <AntDesign 
            name="closecircle" 
            size={20} 
            color={Colors.orange} 
            style={{marginLeft:240}}
            />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Votre Avis</Text>
          <Rating
            showRating
            onFinishRating={handleRatingChange}
            startingValue={rating}
            ratingColor="green"
          />
          <TextInput
            style={styles.input}
            placeholder="Nom"
            value={comment}
            onChangeText={text => setComment(text)}
            multiline
          />
          <Button
            title="Ajouter"
            onPress={handleSubmit}
            buttonStyle={styles.submitButton}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = {
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
    width: 300,
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  submitButton: {
    marginTop: 20,
    backgroundColor: Colors.orange,
    width: 100,
    borderRadius: 10,
  },
  input: {
    height: 120,
    borderColor: Colors.orange,
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 15,
    width: 250,
    marginTop: 30,
  },
};

export default AvisModal;
