import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useState, useEffect} from 'react';
import {SafeAreaView} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Colors from '../coloe';
import {Image} from 'react-native';
import {TouchableOpacity} from 'react-native';
import axios from 'axios';
import AvisModal from '../Components/AvisModal';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useNavigation} from '@react-navigation/native';
const DetailOrder = ({route}) => {
  const {commande} = route.params;
  const [detail, setDetail] = useState({
    nbArticles: 0,
    Total: 0,
  });
  const [products, setProducts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [idProduit, setIdProduit] = useState(0);
  const navigation = useNavigation();
  const handleOpenModal = id => {
    console.log('enter');
    console.log(id);
    setIdProduit(id);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };
  useEffect(() => {
    const fetchHandler = async () => {
      return await axios
        .get(
          `https://c534-197-26-80-81.ngrok-free.app/Commande/NombreProduitsCommande/${commande.id}`,
        )
        .then(res => res.data);
    };
    fetchHandler().then(data => {
      setDetail(data);
    });
    const fetchHandlerProducts = async () => {
      return await axios
        .get(
          `https://c534-197-26-80-81.ngrok-free.app/Commande/getProductCommande/${commande.id}`,
        )
        .then(res => res.data);
    };
    fetchHandlerProducts().then(data => {
      setProducts(data.Tab);
      console.log(products);
    });
  }, [commande]);
  return (
    <SafeAreaView style={styles.container}>
      <AvisModal
        visible={modalVisible}
        onClose={handleCloseModal}
        idProduct={idProduit}
        idCommande={commande.id}
      />
      <ScrollView>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 0,
            backgroundColor: 'white',
            height: 60,
          }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <AntDesign
              name="left"
              style={{marginLeft: 15, color: 'black'}}
              size={15}
            />
          </TouchableOpacity>

          <Text style={styles.title}> Détails de la commande</Text>
        </View>
        <View
          style={{
            paddingHorizontal: 12,
            marginTop: 2,
            backgroundColor: 'white',
            height: 130,
          }}>
          <View style={styles.box}>
            <Text style={styles.txt}>Commande n° {commande.id} </Text>
            <Text style={styles.txt1}>{detail.nbArticles} articles</Text>
            <Text style={styles.txt1}>Effectuer Le: {commande.createdAt} </Text>
            <Text style={styles.txt1}>Total: {detail.Total + 7} TND </Text>
            <Text
              style={{
                backgroundColor: commande.Etat === 'Livrée' ? 'green' : 'red',
                fontSize: 12,
                fontWeight: '700',
                borderRadius: 5,
                color: 'white',
                marginTop: 5,
                paddingLeft: 10,
                width: 150,
              }}>
              Commnade {commande.Etat}
            </Text>
          </View>
        </View>
        <View>
          <Text style={styles.h2}>Articles existe Dans votre commandes</Text>
        </View>
        <View style={styles.box1}></View>
        <View style={styles.box1}>
          {products.map((item, index) => {
            console.log(item.pourcenatge);
            return (
              <View
                key={index}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginVertical: 5,
                }}>
                <Image
                  source={{uri: JSON.parse(item.imageProduit[0]).url}}
                  style={styles.img}
                />
                <View style={{marginLeft: 35}}>
                  <Text style={styles.txt}>{item.nomProduit}</Text>

                  <View style={{flexDirection: 'row'}}>
                    <Text style={styles.txt1}>Quantité:</Text>
                    <Text style={{marginLeft: 3,color : 'black'}}>{item.quantite}</Text>
                  </View>
                  {item.taille ? (
                    <View style={{flexDirection: 'row'}}>
                      <Text style={styles.txt1}>Taille:</Text>
                      <Text style={styles.txt}> {item.taille} </Text>
                    </View>
                  ) : null}
                  {item.taille ? (
                    <View style={{flexDirection: 'row'}}>
                      <Text style={styles.txt1}>Couleur: </Text>
                      <Text style={styles.txt1}>
                        {' '}
                        <FontAwesome
                          name="circle"
                          size={15}
                          color={item.couleur}
                          style={{marginLeft: -35, marginTop: 5}}
                        />{' '}
                      </Text>
                    </View>
                  ) : null}
                  <View style={{flexDirection: 'row'}}>
                    <Text style={styles.txt1}>Prix: </Text>
                    {item.pourcenatge != undefined ? (
                      <Text style={{fontSize: 15, fontWeight: '600',color : 'black'}}>
                        {item.prixProduit * (1 - item.pourcenatge / 100)} TND
                      </Text>
                    ) : (
                      <Text style={{fontSize: 15, fontWeight: '600',color : 'black'}}>
                        {item.prixProduit} TND
                      </Text>
                    )}
                  </View>

                  {item.pourcenatge != undefined ? (
                    <View style={{flexDirection: 'row'}}>
                      <Text style={styles.txt1}>Pourcentage: </Text>
                      <Text style={{fontSize: 15, fontWeight: '600',color : 'black'}}>
                        {item.pourcenatge} %
                      </Text>
                    </View>
                  ) : null}
                  <View>
                    {commande.Etat == 'Livrée' ? (
                      <TouchableOpacity
                        style={styles.commandButton}
                        onPress={() => {
                          handleOpenModal(item.idProduit);
                        }}>
                        <Text
                          style={{
                            fontSize: 10,
                            textTransform: 'uppercase',
                            fontWeight: '500',
                            color: 'white',
                          }}>
                          Donner Avis
                        </Text>
                      </TouchableOpacity>
                    ) : null}
                  </View>
                </View>
              </View>
            );
          })}
        </View>
        <View>
          <Text style={styles.h2}>Paiement</Text>
        </View>
        <View style={styles.box1}>
          <Text style={styles.txt2}>Mode de paiement</Text>

          <View>
            <Text style={styles.txt1}>Paiement {commande.Paiement}</Text>
          </View>
        </View>
        <View style={styles.box1}>
          <Text style={styles.txt2}>Détails du paiement</Text>

          <View>
            <Text style={styles.txt1}>Sous-total: {detail.Total} TND</Text>
            <Text style={styles.txt1}>Frais de Livraison: 7 TND</Text>
            <Text style={styles.txt1}>Total: {detail.Total + 7} TND</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
export default DetailOrder;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    textTransform: 'capitalize',
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  view: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: 'white',
    paddingVertical: 20,
    justifyContent: 'space-between',
  },
  box: {
    borderRadius: 20,
    shadowOpacity: 10,
    marginTop: 1,
  },
  box1: {
    backgroundColor: 'white',
    paddingHorizontal: 12,
    marginHorizontal: 8,
    borderRadius: 3,
    marginTop: 2,
  },
  etat: {
    backgroundColor: Colors.green,
    fontSize: 15,
    fontWeight: '800',
    borderRadius: 5,
    color: 'white',
    marginTop: 5,
    marginRight: 6,
    textTransform: 'capitalize',
  },
  txt: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'black',
  },
  txt1: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 5,
    color: Colors.gray,
  },
  h2: {
    textTransform: 'uppercase',
    fontSize: 15,
    fontWeight: 'bold',
    color: 'gray',
    paddingVertical: 15,
    paddingHorizontal: 12,
  },
  img: {
    width: 90,
    height: 100,
    marginLeft: 10,
  },
  commandButton: {
    padding: 5,
    borderRadius: 10,
    backgroundColor: Colors.orange,
    alignItems: 'center',
    marginTop: -50,
    marginLeft: 135,
    marginBottom: 10,
  },
  txt2: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 5,
    color: 'black',
  },
});
