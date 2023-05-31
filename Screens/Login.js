import {
  View,
  Text,
  Button,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import React, {useState, useRef} from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import {AiFillGoogleCircle} from 'react-icons/ai';
import Colors from '../coloe';
import {Input} from 'react-native-elements';
import {ScrollView} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import loginWithEmailPassword from '../Context/AuthContext';
import axios from 'axios';
import {KeyboardAvoidingView} from 'react-native';
import {useAuth} from '../Context/AuthContext';
import AsyncStorage from '@react-native-community/async-storage';

export default function Login() {
  const navigation = useNavigation();
  const {
    loginWithEmailPassword,
    errorMessage,
    signInGoogle,
    signInWithFacebook,
    user,
  } = useAuth();
  const [inputs, setInputs] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [show, setShow] = useState(false);
  const handleLogin = async () => {
    console.log(inputs.password);
    if (
      inputs.email == '' ||
      inputs.password == '' ||
      inputs.confirmPassword == ''
    ) {
      setError('Veuillez remplir les champs');
      setShow(true);
    } else {
      const login = await loginWithEmailPassword(
        inputs.email,
        inputs.password,
        navigation,
      );
      console.log(login);
      if (login instanceof Error) {
        if (login.code == 'auth/wrong-password') {
          setError('Le mot de passe est incorrect');
          setShow(true);
        } else if (login.code == 'auth/user-not-found') {
          setError("L'email est incorrect");
          setShow(true);
        } else if ((login.code = 'auth/invalid-email')) {
          setError('Vérifiez votre email et mot de passe');
          setShow(true);
        }
      } else {
        console.log('1');
        if (login.emailVerified) {
          await axios
            .get(
              `https://c534-197-26-80-81.ngrok-free.app/Admin/GetAccountByEmail/${inputs.email}`,
            )
            .then(res => {
              res.data;
              console.log(res.data.account);
              AsyncStorage.setItem('user', JSON.stringify(res.data.account));
              AsyncStorage.setItem('type', 'email');
            });
          const value = await AsyncStorage.getItem('user');
          console.log(value);
          if (value.role_id == 2 || value.role_id == 1) {
            setError('Vous ne pouvez pas accéder avec ce email');
            setShow(true);
          } else {
            setShow(false);
            navigation.navigate('Home');
          }
        } else {
          setError("Vous devez consulter l'email de vérification");
          setShow(true);
        }
      }
    }
  };
  const hangleloginGoogle = async () => {
    const sigin = await signInGoogle(navigation);
    console.log(sigin);
    if (sigin) {
      await axios.post(
        'https://c534-197-26-80-81.ngrok-free.app/Admin/createAccount',
        {
          email: String(sigin.email),
          role_id: Number(3),
          image: String(sigin.photo),
        },
      );
      await axios
        .get(
          `https://c534-197-26-80-81.ngrok-free.app/Admin/GetAccountByEmail/${sigin.email}`,
        )
        .then(res => {
          res.data;
          console.log(res.data.account);
          AsyncStorage.setItem('user', JSON.stringify(res.data.account));
          AsyncStorage.setItem('type', 'go');
        });
      const value = await AsyncStorage.getItem('user');
      console.log(value);
      if (value.role_id == 2 || value.role_id == 1) {
        setError('Vous ne pouvez pas accéder avec ce email');
        setShow(true);
      } else {
        setShow(false);
        navigation.navigate('Home');
      }
    }
  };
  const handleLoginFB = async () => {
    await signInWithFacebook(navigation);
    await axios.post(
      'https://c534-197-26-80-81.ngrok-free.app/Admin/createAccount',
      {
        email: String(user.email),
        role_id: Number(3),
        image: String(user.photoURL),
      },
    );
    await axios
      .get(
        `https://c534-197-26-80-81.ngrok-free.app/Admin/GetAccountByEmail/${user.email}`,
      )
      .then(res => {
        res.data;
        console.log(res.data.account);
        AsyncStorage.setItem('user', JSON.stringify(res.data.account));
        AsyncStorage.setItem('type', 'fb');
      });
    const value = await AsyncStorage.getItem('user');
    console.log(value);
    if (value.role_id == 2 || value.role_id == 1) {
      setError('Vous ne pouvez pas accéder avec ce email');
      setShow(true);
    } else {
      setShow(false);
      navigation.navigate('Home');
    }
    console.log(user);
  };
  return (
    <ScrollView
      style={{paddingHorizontal: 25, paddingVertical: 50}}
      keyboardShouldPersistTaps="always"
      keyboardDismissMode="none">
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
          marginLeft: 19,
          marginTop: 32,
        }}>
        <View style={styles.action}>
          <FontAwesome
            name="envelope"
            color={'black'}
            size={20}
            style={{marginTop: 8, marginRight: -19, color: 'black'}}
          />
          <Input
            style={styles.input}
            onChangeText={value => setInputs({...inputs, email: value})}
            value={inputs.email}
            type="text"
            placeholder="Email"
          />
        </View>
        <View style={styles.action}>
          <FontAwesome
            name="lock"
            color={'black'}
            size={20}
            style={{marginTop: 8, marginRight: -19, color: 'black'}}
          />
          <Input
            style={styles.input}
            secureTextEntry={true}
            onChangeText={value => setInputs({...inputs, password: value})}
            value={inputs.password}
            placeholder="Mot de passe"
          />
        </View>

        {show && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
        <Button
          title="Se connecter"
          style={styles.button}
          color="black"
          onPress={handleLogin}></Button>
        <View></View>
        <Text style={styles.txt1}> ou se connecter avec </Text>
        <View style={styles.icon}>
          <TouchableOpacity onPress={hangleloginGoogle}>
            <Icon name="google" size={30} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLoginFB}>
            <MaterialIcons name="facebook" size={34} color="black" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text
            style={{
              textAlign: 'center',
              marginTop: 20,
              textDecorationLine: 'underline',
            }}>
            Vous n’avez pas de compte ?
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.dark,
    padding: 20,
    borderRadius: 10,
    marginTop: 30,
  },
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
    marginTop: 30,
    fontWeight: '500',
    color: 'black',
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
    color: 'black',
  },
});
