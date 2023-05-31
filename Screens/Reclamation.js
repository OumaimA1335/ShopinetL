import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { View, TextInput, Button, Alert } from 'react-native';
import Colors from '../coloe';
import { Text } from 'react-native';
import AntDesign from "react-native-vector-icons/AntDesign";
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import MessageModal from '../Components/MessageModal';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
const ReclamationScreen = () => {
  const [feedback, setFeedback] = useState('');
  const [parsedUser,setParsedUser]=useState({
    id: 0,
    email: '',
    role_id: 0,
    image: '',
  })
  const [showMessage, setShowMessage] = useState(false);
  const[Message,setMessage]=useState('')
  const navigation =useNavigation();
  const openModal = () => {
    setModalVisible(true);
  };
  const closeModal = () => {
    setText("")
    setBackgroundColorState("")
    setModalVisible(false);
  };
  const handleSubmit = async() => {
    const user = await AsyncStorage.getItem('user');
        const parsedUser = JSON.parse(user);
        setParsedUser(parsedUser);
    // Handle submission of feedback
    if (feedback.trim() !== '') {
      // Send feedback to server or display confirmation message
      await axios.post(
        'https://c534-197-26-80-81.ngrok-free.app/Reclamation/createReclamation',
        {    
            description :feedback,
            idClient :parsedUser.id,
        },
      );
      setFeedback("");
      setMessage("Nous avons reçu votre message ,\n Nous vous contactez le plutot possible")
      setShowMessage(true)
     
    } else {
      // Display error message if feedback is empty
      setMessage("Tapez une chose")
      setShowMessage(true)
     
    }
  };
  const handleChange=(event)=>{
  console.log(feedback);
  const inputName = event.nativeEvent.target; // récupère le nom ou l'identifiant de l'input
  const inputValue = event.nativeEvent.text; // récupère la nouvelle valeur de l'input
  console.log(inputName,inputValue);
  };
  const handleCloseMessage = () => {
    setShowMessage(false);
  };
  return (
    <View style={styles.container}>
       <MessageModal
        visible={showMessage}
        message={Message}
        onClose={handleCloseMessage}
      />
       <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: -18,
          backgroundColor: 'white',
          paddingVertical: 20,
        }}>
          <TouchableOpacity onPress={()=>navigation.goBack()}>
          <AntDesign name="left"  color='black' style={{marginLeft: 15}} size={20} />
          </TouchableOpacity>
       
        <Text style={styles.title}> Contactez nous</Text>
      </View>
      <View style={styles.box}>
      <TextInput
        accessibilityLabel='feedback'
        multiline
        placeholder="Tapez votre message ici ..."
        value={feedback}
        onChangeText={setFeedback}
        onChange={handleChange}
        style={styles.text}
      />
      <Text>
      </Text>
      <Button title="Envoyer" onPress={handleSubmit} color={Colors.orange}  />
      <Text style={styles.txt}>
        Vous pouvez nous contacter par Téléphone : 52669562
      </Text>
      </View>
    </View>
  );
};
export default ReclamationScreen;
const styles= StyleSheet.create({
container:{
  flex:1,
  paddingVertical:10,

},
title: {
  textTransform: 'capitalize',
  fontSize: 20,
  fontWeight: 'bold',
  color:'black'
},
text:{
    fontSize:15,
    marginTop:50
},
txt:{
  marginTop:20,
  marginBottom:10,
  fontSize:14,
  fontWeight:'bold',
  color:Colors.gray
},
box:{
backgroundColor:"white",
paddingHorizontal:20,
borderRadius:10,
marginTop:10
},
})