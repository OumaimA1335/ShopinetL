import { View, Text, SafeAreaView, SafeAreaViewBase, ScrollView, Button, TouchableOpacity, KeyboardAvoidingView } from 'react-native'
import React, { useEffect, useState } from 'react'
import HeaderCom from '../Components/HeaderCom'
import Search from '../Components/Search'
import Categories from '../Components/Categories'
import Announce from '../Components/Announce'
//import ProductItems from '../components/ProductItems'
import { Divider } from 'react-native-elements'
//import ButtomTab from '../components/ButtomTab'
import { StyleSheet, Image } from 'react-native'
import Colors from '../coloe'
import BottomTabs from '../Components/ButtomTab'
//import Ionicons from "react-native-vector-icons/Ionicons";
import { Card } from 'react-native-paper'
import ProductItems from '../Components/ProductItems'
import ProdItems from '../Components/ProdItems'
import { FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native'
import axios from 'axios'
export default function Home() {
  const navigation = useNavigation();
  const marque = {
    zara: require("../assets/zara.png"),
    jennyfer: require("../assets/Jennyfer.png"),
    pullAndBear: require("../assets/pull&bear.png"),
    stradivarius: require("../assets/Stradivarius.png"),
  };
  const [bracelets,setBracelets]=useState([]);
  const [recent,setRecent]=useState([]);
  useEffect(()=>{
    const fetchHandler = async () => {
      return await axios
        .get(
          `https://c534-197-26-80-81.ngrok-free.app/Product/getBracelet`,
        )
        .then(res => res.data);
    };
    fetchHandler().then(data => {
      console.log(data);
      setBracelets(data.products);
    });
    const fetchHandlerRecent = async () => {
      return await axios
        .get(
          `https://c534-197-26-80-81.ngrok-free.app/Product/getrecentProduct`,
        )
        .then(res => res.data);
    };
    fetchHandlerRecent().then(data => {
      console.log(data);
      setRecent(data.products);
    });
  },[])
  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <SafeAreaView style={{ backgroundColor: "white", flex: 1, }}>
        <ScrollView style={{ paddingHorizontal: 12 }}>
          <View style={{ backgroundColor: "white", padding: 12 }}>
            <Image source={require('../assets/logoshopinet1.png')} style={{ height: 40, marginTop: 10,marginLeft:70 }} />

            <Search />
            <Text style={{ fontWeight: '600', color: 'black', fontSize: 18, marginTop: 20, marginBottom: 10 }}>Explorez notre collection de T-shirts et bracelets maintenant </Text>
            <Card style={{ backgroundColor: Colors.gray1, flexDirection: 'row' }}>
              <View style={{ flexDirection: 'row' }}>
                <View style={{ marginLeft: 10 }}>
                  <Text style={{ fontWeight: '700', color: Colors.orange, fontSize: 18, marginTop: 20, width: 240 }}>Adoptez un look décontracté et rafraîchissant </Text>
                  <Text style={{ fontWeight: '600', fontSize: 16, marginTop: 18, width: 200 }}>Cet été avec nos pulls
                    oversize</Text>
                  <TouchableOpacity style={styles.commandButton} onPress={() => navigation.navigate('Liste',{myVariable:"Vêtements"})} >
                    <Text style={{ fontSize: 20, textTransform: 'capitalize', fontWeight: '500', color: Colors.orange }}>Découvrir</Text>
                  </TouchableOpacity>
                </View>

                <Image source={require('../assets/TShirtHomme.png')} style={{ width: '30%', height: '100%', borderRadius: 8 }} />

              </View>
            </Card>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}><Text style={{ fontWeight: '800', color: 'black', fontSize: 18, marginTop: 20, marginBottom: 10 }}>
              Produit populaire
            </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Liste',{myVariable:"Populaire"})}><Text style={{ color: Colors.orange }}>Voir Tout</Text></TouchableOpacity></View>

            <Card style={{ backgroundColor: '#fff', flexDirection: 'row' }}>
              <View style={{ flexDirection: 'row' }}>
                <Image source={require('../assets/image2.png')} style={{ width: 140, height: 200, marginLeft: 10, marginVertical: 10, borderRadius: 6, }} />
                <View>
                  <Text style={{ fontWeight: '700', color: Colors.orange, fontSize: 17, marginTop: 20, marginLeft: 10 }}>
                    Articles populaire
                  </Text>
                  <Text style={{ fontWeight: '500', fontSize: 14, marginTop: 18, width: 190, marginLeft: 10 }}>
                    Découvrez nos T-shirts et bracelets uniques, {'\n'}
                    conçus pour les passionnés  {'\n'}
                    de notre
                    application mobile !
                  </Text>
                  <TouchableOpacity style={{
                    padding: 5,
                    width: 130,
                    borderRadius: 6,
                    backgroundColor: Colors.orange,
                    alignItems: 'center',
                    marginTop: 10,
                    marginLeft: 10,
                  }} 
                  onPress={() => navigation.navigate('Liste',{myVariable:"Populaire"})} >
                    <Text style={{ fontSize: 15, textTransform: 'capitalize', fontWeight: '500', color: 'white' }}>Savoir plus</Text>
                  </TouchableOpacity>
                </View>

              </View>

            </Card>
            <Text style={{ fontWeight: '800', color: 'black', fontSize: 18, marginTop: 20, marginBottom: 10 }}>
              Catégories
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
        
              <View style={styles.imageContainer}>
            <Image source={require('../assets/femme.png')} style={styles.image} />
                <View style={styles.overlay}>
                <TouchableOpacity onPress={() => navigation.navigate('Liste',{myVariable:"Femme"})}><Text style={styles.overlayText}>Femme</Text></TouchableOpacity>  
                </View>
              </View>
              <View style={styles.imageContainer}>
                <Image source={require('../assets/homme.png')} style={styles.image} />
                <View style={styles.overlay}>
                <TouchableOpacity onPress={() => navigation.navigate('Liste',{myVariable:"Homme"})}><Text style={styles.overlayText}>Homme</Text></TouchableOpacity>  
                </View>
              </View>
         
            </View>
            <Announce />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',marginTop:20 }}>
              <Text style={{ fontWeight: '800', color: 'black', fontSize: 18, marginBottom: 10 }}>
             Nos bracelets
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Liste',{myVariable:"Accessoires"})}><Text style={{ color: Colors.orange }}>Voir Tout</Text>
              </TouchableOpacity>
            </View>
            <ProductItems bracelet={bracelets} />
            <Card style={{ backgroundColor: Colors.gray1, flexDirection: 'row' }}>
              <View style={{ flexDirection: 'row' }}>
                <View style={{ marginLeft: 10, flex: 1 }}>
                  <Text style={{ fontWeight: '700', color: Colors.orange, fontSize: 18, marginTop: 20, width: 240 }}>Nouvelle collection</Text>
                  <Text style={{ fontWeight: '600', fontSize: 18, marginTop: 18, width: 200 }}>Soyez différent à votre
                    manière !
                  </Text>
                  <Text style={{ fontWeight: '700', fontSize: 15, marginTop: 20, width: 200 }}>Trouvez votre style unique.</Text>

                  <TouchableOpacity style={{
                    padding: 8,
                    width: 130,
                    borderRadius: 6,
                    backgroundColor: Colors.orange,
                    alignItems: 'center',
                    marginTop: 10,
                    marginLeft: 10,
                    marginBottom: 30,
                  }} 
                  onPress={() => navigation.navigate('Liste',{myVariable:"Nouveaux T-shirts"})}
                   >
                    <Text style={{ fontSize: 15, textTransform: 'capitalize', fontWeight: '500', color: 'white' }}>Savoir plus</Text>
                  </TouchableOpacity>
                </View>
                <View style={{ flex: 1 }}>
                  <Image source={require('../assets/image3.png')} style={{ left: 200, top: 20, }} />
                </View>

              </View>
            </Card>
            
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 }}>
              <Text style={{ fontWeight: '800', color: 'black', fontSize: 18, marginBottom: 10 }}>
                Les plus récents
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Liste',{myVariable:"Nouveauté"})}><Text style={{ color: Colors.orange }}>Voir Tout</Text>
              </TouchableOpacity>
            </View>
            <ProdItems recent ={recent} />
          </View>



        </ScrollView>
        <Divider width={1} />
        <BottomTabs />
      </SafeAreaView>

    </KeyboardAvoidingView>

  )
}
const styles = StyleSheet.create({
  box1: {
    marginTop: 10,
    backgroundColor: Colors.pink,
    width: 360,
    height: 60,
    fontSize: 15, fontWeight: 'bold',

    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20
  },
  vu1: {
    backgroundColor: Colors.grey2,
    width: '100%',
    height: '30%',
    borderRadius: 8,
    flexDirection: 'row'

  },
  commandButton: {
    padding: 8,
    width: 160,
    borderRadius: 6,
    backgroundColor: 'white',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 50,
    shadowColor: '#7F5DF0',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,

  },
  imageContainer: {
    flex: 1,
    position: 'relative',
    borderRadius: 10,
    marginRight: 8
  },
  image: {
    width: '100%',
    height: 200,



  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,

  },
  overlayText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },

})