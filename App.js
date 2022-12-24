import React, {useEffect} from 'react';
import { StyleSheet, SafeAreaView} from 'react-native';
import PlaceOrder from './src/screens/PlaceOrder';
import LottieSplashScreen from "react-native-lottie-splash-screen";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3FAFF'
  }
});

export default App = () => {
  
  useEffect(() => {
    LottieSplashScreen.hide(); // here
  }, []);
  
  return (
    <>
    <SafeAreaView style = {styles.container} >
      <PlaceOrder />
    </SafeAreaView>
    </>
  );
};
