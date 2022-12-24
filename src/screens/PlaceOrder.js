import React, { useState, useRef, useEffect } from 'react';
import { KeyboardAvoidingView, View, StyleSheet, Animated, Text, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import WebSocket from 'react-native-websocket';
import DeviceInfo from 'react-native-device-info';
import { moderateScale } from 'react-native-size-matters';
import ChatIcon from 'react-native-vector-icons/Fontisto';
import {TextInputWithLabel} from '../common/components/TextInputWithLabel';
import { Label } from '../common/components/Label';
import { CustomButton } from '../common/components/CustomButton';
import ChatModal from './ChatModal';
import NetInfo from "@react-native-community/netinfo";
import { Formik } from 'formik';
import * as Yup from 'yup';
import DateTimePickerModal from "@react-native-community/datetimepicker";

const styles = StyleSheet.create({
  containerStyle: {
    flex:1, 
    padding: moderateScale(10), 
    marginVertical: moderateScale(20),
    justifyContent:'space-between'
  },
  innerContainerStyle: {
    flexGrow: 1,
  },
  textInputViewStyle: {
    marginBottom: moderateScale(16),
  },
  iconContainerStyle: {
    padding: moderateScale(10),
    alignItems: 'flex-end',
  },
  badgeViewStyle:{
    position: "absolute",
    minHeight:moderateScale(32),
    minWidth:moderateScale(32),
    borderRadius: moderateScale(16),
    borderWidth: moderateScale(2),
    borderColor: "#4AADE8",
    backgroundColor: "#FFFFFF",
    justifyContent: 'center',
    alignItems: 'center',
    right: moderateScale(-5),
    top: moderateScale(-5),
  },
  iconStyle: {
    padding: moderateScale(10),
    borderRadius: moderateScale(10),
    backgroundColor: 'transparent',
    shadowColor: "#000",
    shadowOffset: {
    	width: 0,
    	height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
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

export default PlaceOrder = () => {
  const [modalVisibility, setModalVisibility] = useState(false);
  const [messagesList, setMessagesList] = useState([]);
  const [newMessageCount, setNewMessageCount] = useState(0);
  const [isOffline, setOfflineStatus] = useState(false);
  const [isCalendarVisible, setCalendarVisible] = useState(false);
  const [date, setDate] = useState(new Date());
  const ws = useRef(null);
  const isInitialMount = useRef(true);
  const listRef = useRef(null);
  const newMessageBadgeCount = `${newMessageCount > 10 ? '10+' : newMessageCount}`;
  const [banner] = useState(new Animated.Value(0));

  useEffect(() => {
    const removeNetInfoSubscription = NetInfo.addEventListener((state) => {
      const offline = !(state.isConnected && state.isInternetReachable);
      console.log("Offline: ", state, offline);
      setOfflineStatus(offline);
    });
  
    return () => removeNetInfoSubscription();
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

  const handleNewMessage = () => {
    if(modalVisibility) {
      setTimeout(() => listRef?.current?.scrollToEnd({ animated: true }), 500);
    }
  };

  const toggleModal = () => {
    setModalVisibility(true);
  };

  const handleDateConfirm = (event, newDate) => {
      const selectedDate = newDate || new Date();

      console.log('Event picker :', event, newDate);
      setCalendarVisible(false);
      setDate(selectedDate);
  };

  const placeOrder = (name, contact, itemsPlaced, delivery) => {
    ws.current.send(JSON.stringify({id: new Date().getTime(), type: 'order', name, contact, itemsPlaced, delivery, deviceId: DeviceInfo.getUniqueId()._j, time: new Date().getTime()}));
  }

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


  return(
      <>
      <Animated.View style={[styles.banner, bannerStyle, { backgroundColor: isOffline ? '#FF0000' : '#00A300'}]}>
        <Text style={styles.bannerText}>{isOffline ? "You are offline!" : "You're back online!"}</Text>
      </Animated.View>
      <ScrollView
        contentContainerStyle = {styles.innerContainerStyle}
      >
        <Formik
          initialValues = {{ 
            customerName: '',
            phoneNumber: '',
            items: '',
            deliveryDate: ''
          }}
          onSubmit = {() => {}}       // shall we remove this abinaya
          validationSchema = {
            Yup.object().shape({
              customerName: Yup.string().required('Required'),
              phoneNumber: Yup.string()
                .required('Required')
                .min(10, 'Enter a valid phone number')
                .matches(/^\d+$/, 'Enter a valid phone number'),
              items: Yup.string().required('Required'),
              deliveryDate: Yup.string().required('Required'),
            })
          }
          validateOnMount
          validateOnBlur
          validateOnChange
          component = {({ handleChange, handleBlur, touched, values, errors, isValid }) => {
            return (
              <KeyboardAvoidingView
                keyboardVerticalOffset = {Platform.select({ ios: 0, android: 0 })}
                behavior = {Platform.OS === "ios" ? "padding" : null}
                style={styles.containerStyle}
              >
              <View style={styles.containerStyle}>
                <View>
                  <Label title={'Place your Order'} labelStyle = {{fontWeight: '600', paddingBottom: moderateScale(30)}}/>
              
                  <TextInputWithLabel
                    label = "Customer Name"
                    value = {values.customerName}
                    onChangeText = {handleChange("customerName")}
                    onBlur = {handleBlur("customerName")}
                    error = {touched.customerName && errors.customerName}
                    viewStyle = {styles.textInputViewStyle}
                  />
                  <TextInputWithLabel
                    label = "Phone Number"
                    value = {values.phoneNumber}
                    keyboardType = "phone-pad"
                    maxLength = {10}
                    onChangeText = {handleChange("phoneNumber")}
                    onBlur = {handleBlur("phoneNumber")}
                    error = {touched.phoneNumber && errors.phoneNumber}
                    viewStyle = {styles.textInputViewStyle}
                  />
                  <TextInputWithLabel
                    label = "Items to be ordered"
                    value = {values.items}
                    onChangeText={handleChange("items")}
                    onBlur = {handleBlur("items")}
                    error = {touched.items && errors.items}
                    viewStyle = {styles.textInputViewStyle}
                  />
                  <TouchableOpacity onPress={() => {
                    console.log("TouchableOpacity");
                    setCalendarVisible(true)}
                  }>
                    <Text>Select a date</Text>
                  </TouchableOpacity>
                  {isCalendarVisible ? <DateTimePickerModal
                    mode="date"
                    value={date}
                    onChange={handleDateConfirm}
                    minimumDate={new Date()}
                    animationType="fade"
                  /> : null}
                </View>
                <View>
                  <CustomButton 
                    title = "Place order" 
                    disableButton = {!isValid}
                    onPress={placeOrder.bind(
                      this,
                      values.customerName, 
                      values.phoneNumber, 
                      values.items, 
                      values.deliveryDate
                    )} 
                  />
                </View>
                <View>
                  <View style={styles.iconContainerStyle}>
                    <TouchableOpacity 
                      onPress={toggleModal}
                      activeOpacity = {1}
                    >
                      <ChatIcon name="hipchat" color='#4AADE8' size={45} style={styles.iconStyle}/>
                      {
                        newMessageCount !== 0 &&
                        <View style = {styles.badgeViewStyle}>
                          <Label title = {newMessageBadgeCount} labelStyle = {{fontSize: moderateScale(14)}}/>
                        </View>
                      }
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              </KeyboardAvoidingView>    
            );
          }}
        />  
       
         {/* <DateTimePickerModal
          isVisible={isCalendarVisible}
          mode="date"
          onConfirm={date => {
            // Update the deliveryDate field with the selected date
            //setFieldValue('deliveryDate', date);
            // Hide the calendar modal
            setCalendarVisible(false);
          }}
          value={new Date()}
          onCancel={() => setCalendarVisible(false)}
          // You can customize the calendar style and props here
          headerTextIOS="Pick a date"
          cancelTextIOS="Cancel"
          confirmTextIOS="Confirm"
          minimumDate={new Date()}
          maximumDate={new Date(2022, 6, 3)}
          locale="en_US"
          display="calendar"
          textColor="#000000"
          backgroundColor="#FFFFFF"
          borderRadius={4}
          animationType="fade"
        />  */}
        <ChatModal 
        modalVisible = {modalVisibility}
        hideModal = {() => setModalVisibility(false)}
        resetNewMessageCount = {() => setNewMessageCount(0)}
        webSocket = {ws}
        messageRef = {listRef}
        messagesList = {messagesList}
        newMessageCount = {newMessageCount}
        isOffline = {isOffline}  
        />
      <WebSocket
        ref={ws}
        reconnect={true}
        url="wss://c208-121-200-48-218.in.ngrok.io"
        onMessage={(event) => {
          console.log("Message event: ", JSON.parse(event.data), messagesList); 
          setMessagesList([...messagesList, JSON.parse(event.data)]);
          if(!modalVisibility && JSON.parse(event.data)) {
            setNewMessageCount(newMessageCount + 1);
          }
          handleNewMessage();
        }
        }
        
      />
      </ScrollView>
      </>
  )
};
