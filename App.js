import React, {useEffect, useState, useRef} from 'react';
import { StyleSheet, Animated, Text, SafeAreaView} from 'react-native';
import PlaceOrder from './src/screens/PlaceOrder';
import NetInfo from "@react-native-community/netinfo";
import LottieSplashScreen from "react-native-lottie-splash-screen";
import { moderateScale } from 'react-native-size-matters';
import colors from './src/common/colors';
import strings from './src/common/strings';
import ErrorBoundaryComponent from './src/common/ErrorBoundary/ErrorBoundaryComponent';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
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
    color: colors.defaultLight, 
    fontSize: moderateScale(16),
    fontFamily: 'Poppins-SemiBold',
  },
});

export default App = () => {
  const [banner] = useState(new Animated.Value(0));
  const [isOffline, setOfflineStatus] = useState(false);
  const isInitialMount = useRef(true);

  useEffect(() => {
    const removeNetInfoSubscription = NetInfo.addEventListener((state) => {
      const offline = !(state.isConnected && state.isInternetReachable);
      setOfflineStatus(offline);
    });
  
    return () => removeNetInfoSubscription();
  }, []);
  
  // To hide Lottie splash screen
  useEffect(() => {
    LottieSplashScreen.hide();
  }, []);

  // To animate network banner
  useEffect(() => {
    if (isInitialMount?.current) {
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
    <ErrorBoundaryComponent>
      <SafeAreaView style = {styles.container}>
        <Animated.View style={[styles.banner, bannerStyle, { backgroundColor: isOffline ? colors.networkBanner.offline : colors.networkBanner.online}]}>
          <Text style={styles.bannerText}>{isOffline ? strings.App.offline : strings.App.online}</Text>
        </Animated.View>
        <PlaceOrder offline = {isOffline}/>
      </SafeAreaView>
    </ErrorBoundaryComponent>
  );
};
