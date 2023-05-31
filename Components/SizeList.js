import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SolidsList = ({ solids }) => {


  return (
    <View style={styles.container}>
      {solids.map((solid, index) => (
        <View key={index} style={styles.solid}>
          <Text style={styles.text}>{solid}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  solid: {
    width: 100,
    height: 100,
    backgroundColor: 'blue',
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 16,
  },
});

export default SolidsList;