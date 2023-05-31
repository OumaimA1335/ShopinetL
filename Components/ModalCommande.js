import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import AntDesign from "react-native-vector-icons/AntDesign";
import Colors from '../coloe';
import { useNavigation } from '@react-navigation/native';
const ModalCommande = ({ visible,Total, onClose}) => {
    const navigation = useNavigation();
  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={styles.container}>
        <View style={styles.modalContent}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <AntDesign
                        name="closecircle"
                        size={20}
                        color={Colors.orange}
                        style={{marginLeft:230,marginTop:-10}}
                      />
          </TouchableOpacity>
          <View>
            <View style={{marginTop:15}}>
            <Text style={styles.title}>Confirmer la commande</Text>
            </View>
        
          <View style={{marginLeft:15,flexDirection:'row',marginTop:10}}>
          <Text style={styles.messageText}>Sous total :</Text>
          <Text style={{color:'black',fontWeight:'600'}}>{Total}DT</Text>
          </View>
          <View style={{marginLeft:15 ,flexDirection:'row',marginTop:10}}>
          <Text style={styles.messageText}>Frais de livraison :</Text>
          <Text style={{color:'black',fontWeight:'600'}}>7DT</Text>
          </View>
          <View style={{marginLeft:15,flexDirection:'row',marginTop:10}}>
          <Text style={styles.messageText}>TVA : </Text>
          <Text style={{color:'black',fontWeight:'600'}}>19%</Text>
          </View>
           <View style={{marginLeft:15,flexDirection:'row', marginTop:10}}>
           <Text style={styles.messageText}>Total :</Text>
           <Text style={{color:'black',fontWeight:'600'}}>{Total+7}DT</Text>
           </View>
          </View>
         
          <TouchableOpacity
              style={styles.panelButton}
              onPress={()=>{
                onClose()
                navigation.navigate('Home');
              }}
             >
              <Text style={{color: 'white'}}>Confirmer</Text>
            </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
  },
  title:{
    fontSize: 20,
    marginBottom: 10,
    textAlign: 'center',
    fontWeight:'600',
    color:'black'
  },
  messageText: {
    fontSize: 15,
    marginBottom: 10,
    textAlign: 'center',
   
    color:'black'
  },
  closeButton: {
    borderRadius: 5,
    fontStyle:'italic',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  panelButton: {
    padding: 13,
    borderRadius: 10,
    backgroundColor: '#FF6347',
    alignItems: 'center',
    color: 'white',
    width: 100,
    marginTop:10
  }
});

export default ModalCommande;
