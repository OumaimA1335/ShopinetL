import {View, Text, Button, Image, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import Colors from '../coloe';
import {Input} from 'react-native-elements';
import {ScrollView} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useAuth} from '../Context/AuthContext';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import FontAwesome from "react-native-vector-icons/FontAwesome"
export default function Register() {
  const navigation = useNavigation();
  const [inputs, setInputs] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState(null);
  const [show, setShow] = useState(false);
  const {SignUpWithEmailPassword, errorMessage} = useAuth();
  const handleRegister = async () => {
    setError(null);
    if (
      inputs.email == '' ||
      inputs.password == '' ||
      inputs.confirmPassword == ''
    ) {
      setError('Veuillez remplir les champs');
      setShow(true);
      console.log('Veuillez remplir les champs');
    }
    else if(inputs.password!=inputs.confirmPassword)
    {
      setError('Les champs de mot de passe ne correspondent pas.');
      setShow(true);
      console.log('Les champs de mot de passe ne correspondent pas.');
    } else {
      if (inputs.password === inputs.confirmPassword) {
        const signup = await SignUpWithEmailPassword(
          inputs.email,
          inputs.password,
          navigation,
        );
        if (signup == undefined) {
          await axios.post(
            'https://c534-197-26-80-81.ngrok-free.app/Admin/createAccount',
            {
              email: String(inputs.email),
              role_id: Number(3),
              mdp : String(inputs.password)
            },
          );
          await axios
            .get(
              `https://c534-197-26-80-81.ngrok-free.app/Admin/GetAccountByEmail/${inputs.email}`,
            )
            .then(res => {
              res.data;
              console.log(res.data.account);
              AsyncStorage.setItem('user', JSON.stringify(res.data.account));
              AsyncStorage.setItem("type","email");
            });
          setShow(false);
          navigation.navigate('Login');
        } else {
          if (signup.code === 'auth/email-already-in-use') {
            setError('Cet email est déjà utilisé par un autre compte.');
          } else if (signup.code === 'auth/weak-password') {
            setError('Le mot de passe doit avoir au moins 6 caractères.');
          } else {
            setError('Une erreur est survenue. Veuillez réessayer plus tard.');
          }
        }
      } else {
        setError("votre mot de passe n'est pas le meme");
        setShow(true);
      }
    }
  };

  return (
    <ScrollView style={{paddingHorizontal: 25, paddingVertical: 50}}>
      <View
        style={{
          width: 100,
          position: 'relative',
          top: 50,
          px: 10,
          flex: 1,
          paddingLeft: 16,
          paddingBottom: 40,
          justifyContent: 'center',
          left: 50,
        }}>
        <Image
          flex={1}
          alt="logo"
          w={'300'}
          source={require('../assets/logoshopinet1.png')}
        />
      </View>
      <View
        style={{
          w: '2/3',
          position: 'relative',
          flex: 1,
          justifyContent: 'center',
          marginTop: 32,
        }}>
           <View style={styles.action}>
           <FontAwesome name="envelope" color={'black'} size={20} style={{marginTop: 8,marginRight:-19,color:'black'}}  />
        <Input
          style={styles.input}
          type="Email"
          placeholder="email"
          value={inputs.email}
          onChangeText={value => setInputs({...inputs, email: value})}
        />
       </View>
       <View style={styles.action}>
       <FontAwesome name="lock" color={'black'} size={20} style={{marginTop: 8,marginRight:-19,color:'black'}}  />
        <Input
          style={styles.input}
          name="confirmPassword"
          type="password"
          placeholder="Mot de passe"
          value={inputs.password}
          secureTextEntry={true}
          onChangeText={value => setInputs({...inputs, password: value})}
        />
        </View>
        <View style={styles.action}>
       <FontAwesome name="lock" color={'black'} size={20} style={{marginTop: 8,marginRight:-19,color:'black'}}  />
        <Input
          name="password"
          style={styles.input}
          secureTextEntry={true}
          placeholder="Confirmez votre mot de passe"
          value={inputs.confirmPassword}
          onChangeText={value => setInputs({...inputs, confirmPassword: value})}
        />
</View>
        <View>
          {show && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
        </View>

        <Button
          title="Se connecter"
          style={{borderRadius: 20, fontWeight: 'bold'}}
          color='black'
          onPress={handleRegister}></Button>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  inputText: {
    borderRadius: 5,
  },
  text: {
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 15,
  },
  txt1: {
    textAlign: 'center',
    fontSize: 15,
    marginTop: 15,
    fontWeight: 'bold',
  },
  icon: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 20,
  },
  errorContainer: {
    backgroundColor: '#FB335B',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  errorText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F2',
    paddingBottom: 5,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 0,
    paddingLeft: 10,
    marginLeft: 10,
    color:'black'
  },
});
