import {View, Text} from 'react-native';
import React, {useEffect} from 'react';
import {ScrollView, StyleSheet, TouchableOpacity,FlatList} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {SafeAreaView} from 'react-native';
import Colors from '../coloe';
import {Image} from 'react-native';
import ListProd1 from '../Components/ListProd1';
import ButtomTab from '../Components/ButtomTab';
import {Divider} from 'react-native-elements';
import axios from 'axios';
import {useState} from 'react';
import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';
import {Switch} from 'react-native';
import {CheckBox} from 'react-native-elements';
import { Snackbar } from 'react-native-paper';
import { useAuth } from '../Context/AuthContext';
import { useNavigation } from '@react-navigation/native';
export default function ListProd({route}) {
  const {myVariable} = route.params;
  const {searchText} = route.params;
  const navigation =useNavigation()
  console.log(myVariable);
  console.log(searchText);
  const [products, setProducts] = useState([]);
  const [selectedCheckbox, setSelectedCheckbox] = useState(null);
  const [productSearch, setProductSearch] = useState([]);
  const [selectedButton, setSelectedButton] = useState(null);
  const [root, setRoot] = useState([]);
  const [clickCount, setClickCount] = useState(0);
  const [backgroundColorState,setBackgroundColorState]=useState('');
  const [visible, setVisible] = React.useState(false);
  const [Partenaire,setPartenaire] =useState([]);
  const {snackMessage}=useAuth()
  useEffect(() => {
    const fetchHandler = async () => {
      return await axios
        .get(
          `https://c534-197-26-80-81.ngrok-free.app/Product/getProductByCategory/${myVariable}`,
        )
        .then(res => res.data);
    };
    fetchHandler().then(data => {
      setProducts(data.products);
    });
    const fetchPartenaire = async () => {
      return await axios
        .get(
          `https://c534-197-26-80-81.ngrok-free.app/Partenaire/gePartnaireProduct/${myVariable}`,
        )
        .then(res => res.data);
    };
    fetchPartenaire().then(data => {
      setPartenaire(data.nomPartenaire);
    });
  }, [myVariable]);
  useEffect(() => {
    const fetchHandler = async () => {
      return await axios
        .get(
          `https://c534-197-26-80-81.ngrok-free.app/Product/searchNameProduct/${myVariable}`,
        )
        .then(res => res.data);
    };
    fetchHandler().then(data => {
      setProductSearch(data.product);
    });
  }, [myVariable]);
  useEffect(() => {
    if (productSearch.length > 0) {
      setRoot(productSearch);
    } else {
      setRoot(products);
    }
  }, [products, productSearch]);
  const triFilter = async type => {
    if (selectedCheckbox === type && clickCount === 1) {
      setSelectedCheckbox(null);
      setClickCount(0);
      if (productSearch.length > 0) {
        setRoot(productSearch);
      } else {
        setRoot(products);
      }
    } else {
      setSelectedCheckbox(type);
      setClickCount(1);
      console.log('welcome honey');
      return await axios
        .get(
          `https://c534-197-26-80-81.ngrok-free.app/Product/getbyPriceHigh/${myVariable}/${type}`,
        )
        .then(res => {
          res.data;

          setRoot(res.data);
        });
    }
  };
  const renderInner = () => {
    return (
      <>
        <View style={styles.panel}>
          {selectedButton === 'Filtrer' ? (
            <>
              <View style={{alignItems: 'center'}}>
              <TouchableOpacity
          onPress={() => bs.current.snapTo(1)}>
          <AntDesign 
            name="closecircle" 
            size={30} 
            color={Colors.orange} 
            style={{marginLeft:250}}
            />
        </TouchableOpacity>
                <Text style={styles.panelTitle}>Choisir un filtre</Text>
              </View>
              <View
                style={{
                  flexDirection: 'column',
                  marginLeft:15,
                  marginTop: 30,
                  paddingHorizontal: 58,
                }}>
                <CheckBox
                  title="Femme"
                  checked={selectedCheckbox === 'Femme'}
                  checkedColor={Colors.orange}
                  onPress={() => triFilter('Femme')}
                />
                <CheckBox
                  title="Homme"
                  checked={selectedCheckbox === 'Homme'}
                  checkedColor={Colors.orange}
                  onPress={() => triFilter('Homme')}
                />
                {Partenaire.map((item,index)=>(
                  <CheckBox
                  key={index}
                  title={item.nom}
                  checked={selectedCheckbox === item.nom}
                  checkedColor={Colors.orange}
                  onPress={() => triFilter(item.nom)}
                />
                ))}
              </View>
            </>
          ) : (
            <>
              <View style={{alignItems: 'center'}}>
              <TouchableOpacity
          onPress={() => bs.current.snapTo(1)}>
          <AntDesign 
            name="closecircle" 
            size={30} 
            color={Colors.orange} 
            style={{marginLeft:250}}
            />
        </TouchableOpacity>
                <Text style={styles.panelTitle}>Choisir un Tri</Text>
              </View>
              <View
                style={{
                  flexDirection: 'column',
                  alignItems: 'center',
                  marginTop: 30,
                }}>
                <CheckBox
                  title="Prix ascendants"
                  checked={selectedCheckbox === 'ASC'}
                  checkedColor={Colors.orange}
                  onPress={() => triFilter('ASC')}
                />
                <CheckBox
                  title="Prix desandants"
                  checked={selectedCheckbox === 'DESC'}
                  checkedColor={Colors.orange}
                  onPress={() => triFilter('DESC')}
                />
              </View>
            </>
          )}
        </View>
      </>
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.panelHeader}>
        <View style={styles.panelHandle} />
      </View>
    </View>
  );
  const bs = React.createRef();
  const fall = new Animated.Value(1);
  return (
    <SafeAreaView style={styles.container}>
      <BottomSheet
        ref={bs}
        snapPoints={[840, 0]}
        renderContent={renderInner}
        renderHeader={renderHeader}
        initialSnap={1}
        callbackNode={fall}
        enabledGestureInteraction={true}
      />
        <Snackbar
        visible={visible}
        onDismiss={()=>{setVisible(false)}}
        style={{ backgroundColor: backgroundColorState }}
        duration={3000} // Durée d'affichage en millisecondes
      >
      {snackMessage}
      </Snackbar>
           <View style={{flexDirection: 'row', alignItems: 'center',marginHorizontal:20}}>
            <TouchableOpacity onPress={()=>navigation.goBack()}>
            <AntDesign name="left" size={30} color='black' />
            </TouchableOpacity>
           
            <Text style={styles.txt}>
              {' '}
              {myVariable ? `${myVariable}` : `${searchText}`}
            </Text>
          
          </View>
          <View
            style={{
              borderWidth: 1,
              borderColor: 'black',
              borderRadius: 20,
              marginTop: 20,
              flexDirection: 'row',
              justifyContent: 'space-around',
              alignContent: 'center',
              alignItems: 'center',
              marginHorizontal:30
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                marginLeft: 25,
              }}>
              <Image source={require('../assets/filter.png')} />

              <TouchableOpacity
                onPress={() => {
                  bs.current.snapTo(0);
                  setSelectedButton('Filtrer');
                }}>
                <Text style={{fontSize: 18,color:'black'}}>Filtrer</Text>
              </TouchableOpacity>
            </View>
            <Text style={{color:'black', height: 30,width:10}}>|</Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 25,
              }}>
              <Image source={require('../assets/tri.png')} />
              <TouchableOpacity
                onPress={() => {
                  bs.current.snapTo(0);
                  setSelectedButton('Trier');
                }}>
                <Text style={{fontSize: 18, marginLeft: 5,color:'black'}}>Trier</Text>
              </TouchableOpacity>
            </View>
          </View>
      <ScrollView style={{paddingHorizontal: 10}}>
        <Animated.View
          style={{
            opacity: Animated.add(0.1, Animated.multiply(fall, 1.0)),
          }}>
            <View>
            <ListProd1 root={root} />
          </View>
        </Animated.View>
      </ScrollView>

      <Divider width={1} />
      <ButtomTab />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 1,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: Colors.white,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    textTransform: 'capitalize',
    color:'black'
  },
  box: {
    borderRadius: 60,
    marginTop: 20,
    backgroundColor: Colors.white,
  },
  img: {
    width: 100,
    height: 100,
    marginLeft: 10,
  },
  txt: {
    fontSize: 15,
    fontWeight: '800',
    color:'black'
  },
  txt1: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 10,
    color:'black'
  },
  header: {
    backgroundColor: '#F5F5F5',
    shadowColor: '#333333',
    shadowOffset: {width: -1, height: -9},
    shadowRadius: 17,
    shadowOpacity: 0.9,
    paddingTop: 30,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: 390,
    marginTop: 100,
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
    backgroundColor: '#F5F5F5',
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
    margin: 40,
    color: 'white',
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
    marginLeft: 15,
  },
  panelTitle:{
    fontSize: 17,
    fontWeight: 'bold',
    
  }
});
