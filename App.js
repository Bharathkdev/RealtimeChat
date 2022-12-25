import React, {useEffect, useState, useRef} from 'react';
import { StyleSheet, Animated, Text, SafeAreaView} from 'react-native';
import PlaceOrder from './src/screens/PlaceOrder';
import NetInfo from "@react-native-community/netinfo";
import LottieSplashScreen from "react-native-lottie-splash-screen";
import { moderateScale } from 'react-native-size-matters';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3FAFF'
  },
  banner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: moderateScale(50),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: moderateScale(20),
    zIndex: 2,    //to make the banner fixed at the top and the scroll view content go behind it when scrolled
  },
  bannerText: {
    color: 'white', 
    fontSize: moderateScale(16),
    fontWeight: '500'
  },
});

export default App = () => {
  const [banner] = useState(new Animated.Value(0));
  const [isOffline, setOfflineStatus] = useState(false);
  const isInitialMount = useRef(true);

  useEffect(() => {
    const removeNetInfoSubscription = NetInfo.addEventListener((state) => {
      const offline = !(state.isConnected && state.isInternetReachable);
      console.log("Offline: ", state, offline);
      setOfflineStatus(offline);
    });
  
    return () => removeNetInfoSubscription();
  }, []);
  
  useEffect(() => {
    setTimeout(() => {LottieSplashScreen.hide()}, 2000);
  }, []);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      if(isOffline) {
        Animated.timing(banner, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }).start()
      } 
    } else {
      if(isOffline) {
        Animated.timing(banner, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }).start()
      } else {
        Animated.timing(banner, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
          }).start(() => {
              Animated.timing(banner, {
                toValue: 0,
                duration: 1000,
                useNativeDriver: true,
          }).start()
        })
      }
    }
  }, [isOffline]);

  const bannerStyle = {
    transform: [
    {
      translateY: banner.interpolate({
        inputRange: [0, 1],
        outputRange: [moderateScale(-50), 0],
      }),
    }
  ]
  }; 

  
  return (
    <>
    <SafeAreaView style = {styles.container}>
      <Animated.View style={[styles.banner, bannerStyle, { backgroundColor: isOffline ? '#FF0000' : '#00A300'}]}>
        <Text style={styles.bannerText}>{isOffline ? "You are offline!" : "You're back online!"}</Text>
      </Animated.View>
      <PlaceOrder offline = {isOffline}/>
    </SafeAreaView>
    </>
  );
};
