import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import AntDesign from "react-native-vector-icons/AntDesign";
import Colors from '../coloe';
const MessageModal = ({ visible, message, onClose ,color }) => {
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
          <Text style={styles.messageText}>{message}</Text>
         
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
  messageText: {
    fontSize: 13,
    marginBottom: 10,
    textAlign: 'center',
    color:'black'
  },
  closeButton: {
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MessageModal;
