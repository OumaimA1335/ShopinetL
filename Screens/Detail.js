import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Button,
  StyleSheet,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import ColorList from '../Components/ColorList';
import ButtomShop from '../Components/ButtomShop';
import {Divider} from 'react-native-elements';
import {useNavigation} from '@react-navigation/native';
import {ScrollView} from 'react-native';
import Swiper from 'react-native-swiper';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { FlatList } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
//import SizeList from '../components/SizeList';
import axios from 'axios';
import ProdDetailCard from '../Components/ProdDetailCard';
import Colors from '../coloe';
import {Card} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { orange100 } from 'react-native-paper/lib/typescript/src/styles/themes/v2/colors';
export default function Details({route}) {
  const {myVariable} = route.params;
  console.log(myVariable);
  const navigation = useNavigation();
  const [product, setProduct] = useState({
    nom: '',
    marque_id: 0,
    souscategorie_id: 0,
    description: '',
    prix: 0,
    codeBar: '',
    imageList: [],
    sexe: '',
    quantite: 0,
    PartenaireId: 0,
    offreId: 0,
  });
  const [partenaire, setPartenaire] = useState('');
  const [taille, setTaille] = useState([]);
  const [Favoris, setFavoris] = useState();
  const [avis, setAvis] = useState([
    {
      nbEtoile: 0,
      description: '',
    },
  ]);
  const [products, setProducts] = useState([]);
  const [panier, setPanier] = useState({
    id: 0,
    taille: '',
  });
  const [offer, setOffer] = useState({});
  const [Colors, setColors] = useState([]);
  const [isFavorited, setIsFavorited] = useState(false);
  useEffect(() => {
    setPanier(prevState => ({
      ...prevState,
      id: myVariable,
    }));

    const fetchHandler = async () => {
      return await axios
        .get(
          `https://c534-197-26-80-81.ngrok-free.app/Product/GetProductId/${myVariable}`,
        )
        .then(res => res.data);
    };
    const fetchHandlerTailleProduct = async () => {
      return await axios
        .get(
          `https://c534-197-26-80-81.ngrok-free.app/Product/getTailleProduct/${myVariable}`,
        )
        .then(res => res.data);
    };
    const fetchHandlerAvis = async () => {
      return await axios
        .get(
          `https://c534-197-26-80-81.ngrok-free.app/Avis/getAvisByIdProd/${myVariable}`,
        )
        .then(res => res.data);
    };
    fetchHandlerAvis().then(data => {
      setAvis(data.AllAvis);
    });
    fetchHandler().then(data => {
      setProduct(data.product);
    });
    const fetchHandlerFavoris = async () => {
      return await axios
        .get(
          `https://c534-197-26-80-81.ngrok-free.app/Favoris/NumberLikes/${myVariable}`,
        )
        .then(res => res.data);
    };
    fetchHandlerFavoris().then(data => {
      setFavoris(data);
    });
    fetchHandlerTailleProduct().then(data => {
      console.log('taille');
      console.log(taille);
      setTaille(data.tailles);
    });
  }, [myVariable]);
  useEffect(() => {
    const fetchHandler = async () => {
      if (product.marque_id != 0) {
        return await axios
          .get(
            `https://c534-197-26-80-81.ngrok-free.app/Partenaire/getByIdPartenaire/${product.PartenaireId}`,
          )
          .then(res => res.data);
      }
    };
    const fetchHandlerProductByCategory = async () => {
      if (product.marque_id != 0) {
        return await axios
          .get(
            `https://c534-197-26-80-81.ngrok-free.app/Product/getProductBySousCategory/${product.souscategorie_id}`,
          )
          .then(res => res.data);
      }
    };
    fetchHandlerProductByCategory().then(data => {
      setProducts(data.products);
    });
    fetchHandler().then(data => {
      setPartenaire(data.partenaire);
    });
    async function fetchOffer() {
      if (product.offreId != null) {
        return axios
          .get(
            `https://c534-197-26-80-81.ngrok-free.app/Offre/getOfferId/${product.offreId}`,
          )
          .then(res => {
            setOffer(res.data.offre);
          });
      }
    }
    fetchOffer();
    const fetchHandlerLoveProduct = async () => {
      const user = await AsyncStorage.getItem('user');
    const parsedUser = JSON.parse(user);
        return await axios
          .get(
            `https://c534-197-26-80-81.ngrok-free.app/Favoris/LoveProduct/${product.id}/${parsedUser.id}`,
          )
          .then(res => res.data);
    };
    fetchHandlerLoveProduct().then(data => {
      setIsFavorited(data);
    });
    const fetchHandlerColors = async () => {
      return await axios
        .get(
          `https://c534-197-26-80-81.ngrok-free.app/Product/getColorsProduct2/${product.id}`,
        )
        .then(res => res.data);
  };
  fetchHandlerColors().then(data => {
    setColors(data.couleurs);
  });
  }, [product]);
  const handleFavoris = async id => {
    const user = await AsyncStorage.getItem('user');
    const parsedUser = JSON.parse(user);
  
    try {
      if (isFavorited) {
        // Remove favorited item
        await axios.delete(
          `https://c534-197-26-80-81.ngrok-free.app/Favoris/deleteFavorisIdProduct/${product.id}`,
        );
      } else {
        // Add favorited item
        await axios.post(
          'https://c534-197-26-80-81.ngrok-free.app/Favoris/createFavoris',
          {
            userId: Number(parsedUser.id),
            produitId: Number(product.id),
          },
        );
      }
  
      setIsFavorited(!isFavorited);
    } catch (err) {
      console.log(err);
    }
  };
  
  return (
    <SafeAreaView style={{flex: 1}}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: -10,
          backgroundColor: 'white',
          paddingVertical: 20,
        }}>
          <TouchableOpacity onPress={()=> navigation.goBack()}>
        <AntDesign name="left" style={{marginLeft: 15,color:'black'}} size={20} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleFavoris}>
 
    <AntDesign
      name={isFavorited ? 'heart' : 'hearto'}
      style={{ marginLeft: 320, color: 'black' }}
      size={20}
    />
  
</TouchableOpacity>


    
      </View>
      <ScrollView style={{}}>
        <Swiper showsPagination={true} style={{height: 530}}>
          {product.imageList.map((i, index) => {
            const image = JSON.parse(i);
            return (
              <Image
                key={index} // add a unique key prop for each image component
                source={{uri: image.url}}
                style={{
                  width: 390,
                  height: 450,
                  marginTop: 20,
                  resizeMode: 'cover',
                  paddingHorizontal: 12
                }}
              />
            );
          })}
        </Swiper>
        <Card style={styles.box2}>
          <View style={{marginLeft: 15, marginRight: 10}}>
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: 20,
                color: 'gray',
                textTransform: 'capitalize',
                color:'black'
              }}>
              {/*nom article*/} {product.nom}
            </Text>
            <Text style={{fontWeight: '300', fontSize: 20,color:'black'}}>
              {/*Partenaire*/} {partenaire.nom}
            </Text>
            <View style={{marginLeft:260,marginTop:-25}}>  
            <Text style={{fontWeight:'700',color:'black',fontSize:18}} > Prix ({product.prix}DT)</Text>
            </View>
          
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between',marginTop:-15}}>
              {product && product.offreId != null ? (
                <Text
                  style={{
                    fontWeight: '300',
                    fontSize: 20,
                    marginTop: 20,
                    alignItems: 'center',
                    color:'black',
                    marginLeft :8
                  }}>
                  {offer.pourcentage} %
                </Text>
              ) : null}
              <Text
                style={{
                  fontWeight: '300',
                  fontSize: 20,
                  marginTop: 20,
                  marginLeft: product.offreId === null ? 255 : -50,
                  alignItems: 'center',
                  color:'black'
                }}>
                {/* nombre de favoris  favoris*/} {Favoris}{' '}
                <Entypo name="heart" size={20} color={Colors.orange} /> J'aime
              </Text>
            </View>
          </View>
        </Card>
        {product.souscategorie_id == 19 ? (
          <Card style={styles.box2}>
            <View
              style={{
                width: 365,
                height: 80,

                borderRadius: 30,
                flexDirection: 'column',
                marginTop: 20,
              }}>
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: 20,
                  marginLeft: 20,
                  marginTop: -5,
                  color:'black'
                }}>
                Tailles :
              </Text>

              <ScrollView horizontal={true}>
                <View style={{flexDirection: 'row', marginLeft: 20}}>
                  {taille.map((item, i) => (
                    <TouchableOpacity
                      onPress={() => {
                        setPanier(prevState => ({
                          ...prevState,
                          taille: item.taille, // new taille value
                        }));
                      }}>
                      <View key={i} style={styles.box}>
                        <Text style={{color: 'white'}}>{item.taille}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
          </Card>
        ) : null}
        {product.souscategorie_id == 19 ? (
          <Card style={styles.box2}>
            <View
              style={{
                width: 365,
                height:50,

                borderRadius: 30,
                flexDirection: 'column',
                marginTop: 20,
              }}>
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: 20,
                  marginLeft: 20,
                  marginTop: -15,
                  color:'black'
                }}>
                Couleurs :
              </Text>

              <ScrollView horizontal={true}>
                <View style={{flexDirection: 'row', marginLeft: 20}}>
                  {Colors.map((item, i) => (
                  <Icon
                  name="circle"
                  size={20}
                  color={item}
                  style={{marginRight: 10,marginTop:5}}
                />
                     
                  ))}
                </View>
              </ScrollView>
            </View>
          </Card>
        ) : null}
        <Card style={styles.box2}>
          <View
            style={{
              width: 365,
              height: 190,

              flexDirection: 'row',
              marginTop: 20,
              borderRadius: 30,
            }}>
            <Text
              style={{
                padding: 15,
                fontWeight: 'normal',
                fontSize: 12, // Change the font size to 16 (or any other desired value)
                lineHeight: 22,
              }}>
              <Text style={{marginLeft: 5, fontWeight: 'bold', fontSize: 20,color:'black'}}>
                {' '}
                Description : {'\n'}
              </Text>
              {product.description}
            </Text>
          </View>
        </Card>
        {avis.length > 0 && (
          <Card style={styles.box2}>
           <TouchableOpacity onPress={()=> navigation.navigate("Avis",{myVariable:product.id})}>
                <AntDesign name='forward' size={20} color="black" style={{marginLeft:340,marginTop:10}}/>
              </TouchableOpacity>  
            <View
              style={{
                width: 365,
                height: 110,
                flexDirection: 'column',
                borderRadius: 30,
                flexWrap: 'wrap',
                marginTop: 20,
              }}>
              
              <Text
                style={{
                  marginLeft: 10,
                  marginTop:-35,
                  fontWeight: 'bold',
                  fontSize: 20,
                  color:"black"
                }}>
                {' '}
                Avis :
              </Text>
             
              {avis.slice(0, 2).map((item, index) => (
                <Text
                  style={{
                    marginTop:5,
                   marginLeft:15,
                    fontWeight: 'normal',
                    fontSize: 12, // Change the font size to 16 (or any other desired value)
                    lineHeight: 22,
                    color:'black'
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      marginLeft: 5,
                    }}>
                    {Array(item.nbEtoile)
                      .fill()
                      .map((_, i) => (
                        <FontAwesome
                          key={i}
                          name="star"
                          size={16}
                          color="orange"
                        />
                      ))}
                  </View>
                  {'\n'}
                  {item.description} 
                </Text>
              ))}
            </View>
        
          </Card>
        )}
        
      </ScrollView>

      <Divider width={1} />
      <ButtomShop prix={product.prix} taille={taille} product={product} />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  box: {
    borderColor: Colors.orange,
    borderRadius: 5,
    backgroundColor: Colors.orange,
    paddingHorizontal: 8,
    paddingVertical: 5,
    marginVertical: 12,
    marginHorizontal: 5,
    borderWidth: 1,
    color: 'white',
  },
  title: {
    textTransform: 'capitalize',
    fontSize: 20,
    fontWeight: 'bold',
    color:'black'
  },
  box2: {
    borderRadius: 2,

    shadowOpacity: 10,
    marginTop: 20,
    backgroundColor: 'white',
    marginBottom: 4,
  }
});
