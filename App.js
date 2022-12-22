import React from 'react';
import {View, StyleSheet} from 'react-native';
import PlaceOrder from './src/screens/PlaceOrder';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3FAFF'
  }
});

export default App = () => {
  
  return (
    <View style = {styles.container}>
      <PlaceOrder />
    </View>
  );
};
