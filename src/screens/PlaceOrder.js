import React, { useState, useRef, useEffect } from 'react';
import { KeyboardAvoidingView, View, StyleSheet, Animated, Text, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { moderateScale } from 'react-native-size-matters';
import ChatIcon from 'react-native-vector-icons/Fontisto';
import {TextInputWithLabel} from '../common/components/TextInputWithLabel';
import { Label } from '../common/components/Label';
import { CustomButton } from '../common/components/CustomButton';
import { DatePicker } from '../common/components/DatePicker';
import ChatModal from './ChatModal';
import { Formik } from 'formik';
import * as Yup from 'yup';

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
  }
});

export default PlaceOrder = ({offline}) => {
  const [modalVisibility, setModalVisibility] = useState(false);
  const [messagesList, setMessagesList] = useState([]);
  const [newMessageCount, setNewMessageCount] = useState(0);
  const [ws, setWS] = useState(null);
  const listRef = useRef(null);
  const newMessageBadgeCount = `${newMessageCount > 10 ? '10+' : newMessageCount}`;

  const updateMessageList = (event) => {
    console.log("Message event: ", JSON.parse(event.data), messagesList); 
    setMessagesList((messagesList) => {
      return [...messagesList, JSON.parse(event.data)];
    })
  }

  const handleWebSocketSetup = () => {
    console.log("Netwok statuis: " , offline);
    const webSocketClient = new WebSocket("wss://b3f0-183-83-148-32.in.ngrok.io");
    webSocketClient.onmessage = updateMessageList;
    webSocketClient.onclose = !offline ? handleWebSocketSetup : webSocketClient.close();
    setWS(webSocketClient);
    return webSocketClient;
  }

  useEffect(() => {
      const client = handleWebSocketSetup();

      return () => client.close();
  }, [offline]);

  useEffect(() => {
    if(!modalVisibility && messagesList.length > 0) {
      setNewMessageCount((newMessageCount) => {
        return newMessageCount + 1;
      })
    }
    handleNewMessage();
  }, [messagesList])

  const handleNewMessage = () => {
    if(modalVisibility) {
      setTimeout(() => listRef?.current?.scrollToEnd({ animated: true }), 500);
    }
  };

  const toggleModal = () => {
    setModalVisibility(true);
  };

  const placeOrder = (name, contact, itemsPlaced, delivery) => {
    if(!offline) {
      ws.send(JSON.stringify({id: new Date().getTime(), type: 'order', name, contact, itemsPlaced, delivery, deviceId: DeviceInfo.getUniqueId()._j, time: new Date().getTime()}));
    }
  }

  return(
      <ScrollView
        contentContainerStyle = {styles.innerContainerStyle}
        keyboardShouldPersistTaps={'handled'}
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
              deliveryDate: Yup.string(),
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
                  
                  <DatePicker
                    label = "Expected Delivery Date"
                    viewStyle = {styles.textInputViewStyle}
                  /> 
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
        <ChatModal 
        modalVisible = {modalVisibility}
        hideModal = {() => setModalVisibility(false)}
        resetNewMessageCount = {() => setNewMessageCount(0)}
        webSocket = {ws}
        messageRef = {listRef}
        messagesList = {messagesList}
        newMessageCount = {newMessageCount} 
        offline = {offline}
        />
      </ScrollView>
  )
};
