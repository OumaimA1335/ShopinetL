import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import React, {useState} from 'react';
import {useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import {TextInput} from 'react-native';
import BottomSheet from 'reanimated-bottom-sheet';
import Animated from 'react-native-reanimated';
//import { FlatList } from 'react-native-gesture-handler';
import ImagePicker from 'react-native-image-crop-picker';
import {PermissionsAndroid, Platform} from 'react-native';
import {Avatar} from 'react-native-paper';
import Colors from '../coloe';
import {useAuth} from '../Context/AuthContext';
import MessageModal from '../Components/MessageModal';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import AntDesign from "react-native-vector-icons/AntDesign"
import { Divider } from 'react-native-elements';
const EditProfile = () => {
  const [image, setImage] = useState('');
  const [inputs, setInputs] = useState({
    email: '',
    password: '',
  });
  const [showMessage, setShowMessage] = useState(false);
  const[Message,setMessage]=useState('')
  const {updateEmail,handleLogout,updateEmail2, } = useAuth();
  const navigation = useNavigation();
  useEffect(()=>{
    const fetchUser = async () => {
      try {
        const user = await AsyncStorage.getItem('user');
        const parsedUser = JSON.parse(user);
        setImage(parsedUser.image)
        setInputs({ email: parsedUser.email,
        password : parsedUser.Mdp });
      
      } catch (error) {
        console.log(error);
      }
    };
    fetchUser();
  },[])
  const updateProfile = async () => {
    const user = await AsyncStorage.getItem('user');
    const parsedUser = JSON.parse(user);
    try{
     if( inputs.email !='' &inputs.password!='')
     {
      if(inputs.password.startsWith('$'))
      {await updateEmail2(inputs.email);
        await axios.put(`https://c534-197-26-80-81.ngrok-free.app/Admin/updateAccount/${parsedUser.id}`,{
          email :inputs.email,
          image : image,
          mdp :inputs.password  
             })
         setMessage("Vos coordonnées ont été mises à jour avec succès.");
         setShowMessage(true);
         setInputs(
          {
            email: '',
            password: '',
          }
         )
   
      }else
      {
        const update = await updateEmail(inputs.email,inputs.password);
        await axios.put(`https://c534-197-26-80-81.ngrok-free.app/Admin/updateAccount/${parsedUser.id}`,{
          email :inputs.email,
          image : image,
          mdp :inputs.password  
             })
         setMessage("Vos coordonnées ont été mises à jour avec succès.");
         setShowMessage(true);
         setInputs(
          {
            email: '',
            password: '',
          }
         )
      }
    
     }else
     {
       setMessage("Vérifiez vos champs");
       setShowMessage(true);
     }
    }catch(err)
    {
      console.log(err)
    }
  };
  const takePhotoFromCamera = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'This app needs access to your camera.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Camera permission granted');
        // Your code to access the camera here

        await ImagePicker.openCamera({
          compressImageMaxWidth: 300,
          compressImageMaxHeight: 400,
          cropping: true,
          compressImageQuality: 0.7,
        }).then(image => {
          console.log(image.path);
          setImage(image.path);
          bs.current.snapTo(1);
        });
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };
  const choosePhotoFromLibrary = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Read Permission',
          message: 'This app needs access to your gallery.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('read permission granted');
        await ImagePicker.openPicker({
          width: 500,
          height: 500,

          sortOrder: 'none',
          compressImageMaxWidth: 1000,
          compressImageMaxHeight: 1000,
          compressImageQuality: 1,
          compressVideoPreset: 'MediumQuality',
          includeExif: true,
          cropperStatusBarColor: 'white',
          cropperToolbarColor: 'white',
          cropperActiveWidgetColor: 'white',
          cropperToolbarWidgetColor: '#3498DB',
        }).then(image => {
          if (image) {
            console.log(image.path);
            setImage(image.path);
            //bs.current.snapTo(1);
          } else {
            console.log('No image selected');
          }
        });
      } else {
        console.log('denied');
      }
    } catch (error) {
      console.error('Error selecting image:', error);
      console.log(image);
    }
  };
  const {colors} = useTheme();
  const renderInner = () => (
    <View style={styles.panel}>
      <View style={{alignItems: 'center'}}>
        <Text style={styles.panelTitle}>Upload Photo</Text>
        <Text style={styles.panelSubtitle}>Choose Your Profile Picture</Text>
      </View>
      <TouchableOpacity
        style={styles.panelButton}
        onPress={takePhotoFromCamera}>
        <Text style={styles.panelButtonTitle}>Take Photo</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.panelButton}
        onPress={choosePhotoFromLibrary}>
        <Text style={styles.panelButtonTitle}>Choose From Library</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.panelButton}
        onPress={() => bs.current.snapTo(1)}>
        <Text style={styles.panelButtonTitle}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.panelHeader}>
        <View style={styles.panelHandle} />
      </View>
    </View>
  );
  const bs = React.createRef();
  const fall = new Animated.Value(1);
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
      <BottomSheet
        ref={bs}
        snapPoints={[330, 0]}
        renderContent={renderInner}
        renderHeader={renderHeader}
        initialSnap={1}
        callbackNode={fall}
        enabledGestureInteraction={true}
      />
       <View
        style={{
          flexDirection: 'row',
      
          marginTop: 10,
          marginRight:15,
          backgroundColor: 'white',
          paddingVertical: 5,
        }}>
          <TouchableOpacity onPress={()=>navigation.goBack()}>
          <AntDesign name="left" style={{marginLeft: 15,color:'black'}} size={20} />
          </TouchableOpacity>
       
        <Text style={styles.title}>Modifier Compte</Text>
        <Divider  />
      </View>
      <Animated.View
        style={{
          margin: 20,
          opacity: Animated.add(0.1, Animated.multiply(fall, 1.0)),
        }}>
        <View style={{margin: 20}}>
       
          <View style={{alignItems: 'center'}}>
            <TouchableOpacity onPress={() => bs.current.snapTo(0)}>
              <View
                style={{
                  height: 100,
                  width: 100,
                  borderRadius: 15,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  {image ? (
                    <Avatar.Image
                      source={{
                        uri: image,
                      }}
                      size={80}
                      backgroundColor="transparent"
                    />
                  ) : (
                    <Icon
                      name="camera"
                      size={35}
                      color={Colors.orange}
                      style={{
                        opacity: 0.7,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderWidth: 1,
                        borderColor: '#fff',
                        borderRadius: 10,
                      }}
                    />
                  )}
                </View>
              </View>
            </TouchableOpacity>

          </View>

          <View style={styles.action}>
            <FontAwesome name="envelope-o" color={'black'} size={20} />
            <TextInput
              placeholder="Email"
              placeholderTextColor="#666666"
              keyboardType="email-address"
              autoCorrect={false}
              value={inputs.email}
              onChangeText={text => setInputs({...inputs, email: text})}
              style={[
                styles.textInput,
                {
                  color: colors.text,
                },
              ]}
            />
          </View>
          <View style={styles.action}>
            <FontAwesome name="lock" color={'black'} size={20} />
            <TextInput
              placeholder="Mot de passe"
              placeholderTextColor="#666666"
              secureTextEntry={true}
              value={inputs.password}
              onChangeText={text => setInputs({...inputs, password: text})}
              autoCorrect={false}
              style={[
                styles.textInput,
                {
                  color: colors.text,
                },
              ]}
            />
          </View>
          <TouchableOpacity style={styles.commandButton} onPress={updateProfile}>
            <Text style={styles.panelButtonTitle}>Mettre à jour</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};
export default EditProfile;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#fff',
    shadowColor: '#333333',
    shadowOffset: {width: -1, height: -3},
    shadowRadius: 2,
    shadowOpacity: 0.4,
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
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
  },
  panel: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    paddingTop: 20,
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
    marginVertical: 7,
  },
  title: {
    textTransform: 'capitalize',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft:10,
    color:'black'
  }
});
