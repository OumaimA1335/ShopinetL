import { View, Text, Image,TouchableOpacity ,StyleSheet} from 'react-native'
import React,{useEffect,useState} from 'react'
import { ScrollView } from 'react-native'
import Colors from '../coloe'
import { Card } from 'react-native-paper'
import axios from "axios"
import { useNavigation } from '@react-navigation/native'
export default function Announce() {
  const navigation = useNavigation();
  const [products,setproducts]=useState([]);
  useEffect(()=>{
    const fetchHandler = async () => {
      return await axios
        .get(
          `https://c534-197-26-80-81.ngrok-free.app/Offre/getoffreProducts`,
        )
        .then(res => res.data);
    };
    fetchHandler().then(data => {
      console.log(data);
      setproducts(data.offres);
    });
    
  },[])
  return (
    <ScrollView horizontal={true}>
      {products.map((item,index)=>(
      <Card key={index} style={{ backgroundColor: Colors.gray1, width: 345, height: 155, marginTop: 60, borderRadius: 8,marginRight:10}}>
        <View style={{ flexDirection: 'row',}}>
          <Image source={require('../assets/WomenHoodie.png')} style={{ top: -40,left:5 }} />
       <View style={{justifyContent:'center',alignItems:'center'}}>
       <Text style={{color:'black',textAlign:'center',fontWeight: '400',fontSize: 15,width:210}} >Profitez de <Text style={{fontWeight:'bold'}}>l'{item.nom}</Text>{'\n'}
           avec une réduction <Text style={{fontWeight:'bold'}}>{item.pourcentage}%</Text> {'\n'} jusqu'a {'\n'}<Text style={{fontWeight:'bold'}}>{item.dateEnd}</Text>
          </Text>
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
                  onPress={() => navigation.navigate('Liste',{myVariable:item.nom})}>
                    <Text style={{ fontSize: 15, textTransform: 'capitalize', fontWeight:'500', color: 'white' }}>Savoir plus</Text>
                  </TouchableOpacity>
       </View>
       </View>
      </Card>))}
    </ScrollView>
  )
}