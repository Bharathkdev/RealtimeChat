import React, { useState, useRef, useEffect } from 'react';
import { KeyboardAvoidingView, View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { moderateScale } from 'react-native-size-matters';
import ChatIcon from 'react-native-vector-icons/Fontisto';
import {CustomButton, DatePicker, Label, TextInputWithLabel} from '../common/components';
import ChatModal from './ChatModal';
import { Formik } from 'formik';
import * as Yup from 'yup';
import NameModal from './NameModal';
import colors from '../common/colors';
import strings from '../common/strings';

const styles = StyleSheet.create({
  containerStyle: {
    flex:1, 
    padding: moderateScale(10), 
    marginVertical: moderateScale(20),
    justifyContent:'space-between'
  },
  titleStyle: {
    fontFamily: 'Poppins-SemiBold',
    paddingBottom: moderateScale(30), 
    fontSize: moderateScale(22),
    alignSelf: 'center',
    color: colors.defaultDark
  },
  innerContainerStyle: {
    flexGrow: 1,
  },
  textInputViewStyle: {
    marginBottom: moderateScale(16),
  },
  iconContainerStyle: {
    marginVertical: moderateScale(30),
    padding: moderateScale(10),
    alignItems: 'flex-end',
  },
  itemsInfoStyle: {
    marginBottom: moderateScale(16),
    fontFamily: 'Poppins-Regular'
  },
  badgeViewStyle:{
    position: "absolute",
    minHeight:moderateScale(32),
    minWidth:moderateScale(32),
    borderRadius: moderateScale(16),
    borderWidth: moderateScale(2),
    borderColor: colors.tertiary,
    backgroundColor: colors.defaultLight,
    justifyContent: Platform.OS === 'android' ? 'flex-end' : 'center',
    alignItems: 'center',
    right: moderateScale(-15),
    top: moderateScale(-15),
  },
  iconStyle: {
    padding: moderateScale(10),
    borderRadius: moderateScale(10),
    backgroundColor: colors.defaultLight,
    shadowColor: colors.defaultDark,
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
  const [chatModalVisibility, setChatModalVisibility] = useState(false);
  const [nameModalVisibility, setNameModalVisibility] = useState(true);
  const [messagesList, setMessagesList] = useState([]);
  const [userName, setUserName] = useState('');
  const [newMessageCount, setNewMessageCount] = useState(0);
  const ws = useRef(null);
  const secondInputRef = useRef(null);
  const thirdInputRef = useRef(null);
  const newMessageBadgeCount = `${newMessageCount > 10 ? '10+' : newMessageCount}`;
  let reconnectInterval;
  
  useEffect(() => {
    // Create a WebSocket object and store it in a variable
    ws.current = new WebSocket('ws://medichat.eu-4.evennode.com');
    
    // Set an event listener for the 'close' event
    ws.current.addEventListener('close', () => {
      console.log('WebSocket connection closed');
      // Attempt to reconnect to the WebSocket server
      // Set an interval to try to reconnect every second
      reconnectInterval = setInterval(reconnect, 1000);
    });

    // Set an event listener for the 'error' event
    ws.current.addEventListener('error', (error) => {
      clearInterval(reconnectInterval);
      console.log('WebSocket connection error ', error );
    });

     // Set an event listener for the 'message' event
    ws.current.addEventListener('message', updateMessageList);

    // Set an event listener for the 'open' event
    ws.current.addEventListener('open', () => {
      console.log('Connected to WebSocket server');
      // Clear the reconnection interval when the connection is established
      clearInterval(reconnectInterval);
    });

    return () => {
      // Clean up the WebSocket connection when the component unmounts
      ws.current.close();
      clearInterval(reconnectInterval);
    };
  }, []); 

  // To track new messages count
  useEffect(() => {
    if(!chatModalVisibility && messagesList.length > 0) {
      setNewMessageCount((newMessageCount) => {
        return newMessageCount + 1;
      })
    }
  }, [messagesList]);

   // Function to attempt to reconnect to the WebSocket server
   const reconnect = () => {
    console.log('Trying to reconnect...');
    ws.current = new WebSocket('ws://medichat.eu-4.evennode.com');
    ws.current.addEventListener('close', () => {
      console.log('WebSocket connection closed inside reconnect');
      reconnectInterval = setInterval(reconnect, 1000);
    });
    ws.current.addEventListener('open', () => {
      console.log('Reconnected to WebSocket server');
      clearInterval(reconnectInterval);
    });
    ws.current.addEventListener('error', (error) => {
      clearInterval(reconnectInterval);
      console.log('WebSocket connection error inside reconnect', error );
    });
    ws.current.addEventListener('message', updateMessageList);
  };

  // To update message list
  const updateMessageList = (event) => {
    setMessagesList((messagesList) => {
      return [...messagesList, JSON.parse(event.data)];
    })
  }

  // To place the order
  const placeOrder = (name, contact, itemsPlaced, delivery) => {
    if(!offline) {
      try{
        ws?.current?.send(JSON.stringify({id: new Date().getTime(), type: 'order', name, userName, contact, itemsPlaced, delivery, deviceId: DeviceInfo.getUniqueId()._j, time: new Date().getTime()}));
        Alert.alert(strings.PlaceOrder.successful, strings.PlaceOrder.orderSuccess)
      } catch(error){
        throw new Error(error);
      }
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
          onSubmit = {(values, {resetForm}) => {
            resetForm({values: ''});
          }}      
          validationSchema = {
            Yup.object().shape({
              customerName: Yup.string().required(strings.PlaceOrder.required),
              phoneNumber: Yup.string()
                .required(strings.PlaceOrder.required)
                .min(10, strings.PlaceOrder.phoneNumberValidation)
                .matches(/^\d+$/, strings.PlaceOrder.phoneNumberValidation),
              items: Yup.string().required(strings.PlaceOrder.required),
              deliveryDate: Yup.string().required(strings.PlaceOrder.required),
            })
          }
          validateOnMount
          validateOnBlur
          validateOnChange
          component = {({ handleChange, handleBlur, submitForm, touched, values, errors, isValid, setFieldValue }) => {
            return (
              <KeyboardAvoidingView
                keyboardVerticalOffset = {Platform.select({ ios: 0, android: 0 })}
                behavior = {Platform.OS === "ios" ? "padding" : null}
                style={styles.containerStyle}
              >
              <View style={styles.containerStyle}>
                <View>
                  <Label title={strings.PlaceOrder.title} labelStyle = {styles.titleStyle}/>
                  <TextInputWithLabel
                    label = {strings.PlaceOrder.customerName}
                    value = {values.customerName}
                    returnKeyType = "next"
                    onSubmitEditing={() => {
                      secondInputRef.current.focus();
                    }}
                    blurOnSubmit={false}
                    onChangeText = {handleChange("customerName")}
                    onBlur = {handleBlur("customerName")}
                    error = {touched.customerName && errors.customerName}
                    viewStyle = {styles.textInputViewStyle}
                  />
                  <TextInputWithLabel
                    ref={secondInputRef}
                    label = {strings.PlaceOrder.phoneNumber}
                    value = {values.phoneNumber}
                    keyboardType = "phone-pad"
                    returnKeyType = "next"
                    onSubmitEditing={() => {
                      thirdInputRef.current.focus();
                    }}
                    maxLength = {10}
                    onChangeText = {handleChange("phoneNumber")}
                    onBlur = {handleBlur("phoneNumber")}
                    error = {touched.phoneNumber && errors.phoneNumber}
                    viewStyle = {styles.textInputViewStyle}
                  />
                  <TextInputWithLabel
                    ref = {thirdInputRef}
                    label = {strings.PlaceOrder.items}
                    value = {values.items}
                    returnKeyType = "done"
                    onChangeText={handleChange("items")}
                    onBlur = {handleBlur("items")}
                    error = {touched.items && errors.items}
                    viewStyle = {styles.textInputViewStyle}
                  />
                  <Text style = {styles.itemsInfoStyle}>{strings.PlaceOrder.itemsInfo}</Text> 
                  <DatePicker
                      label = {strings.PlaceOrder.deliveryDate}
                      iOSPickerTitle = {strings.PlaceOrder.pickDate}
                      mode = {"date"}
                      date = {new Date()}
                      minimumDate = {new Date()}
                      value = {values.deliveryDate}
                      onChange = {(value) => {
                        setFieldValue("deliveryDate", value);
                      }}
                      viewStyle = {styles.textInputViewStyle}/>
                </View>
                <View style = {{marginVertical: moderateScale(10)}}>
                  <CustomButton 
                    title = {strings.PlaceOrder.placeOrder}
                    disableButton = {!isValid || offline}
                    onPress={() => {
                      placeOrder(
                      values.customerName, 
                      values.phoneNumber, 
                      values.items, 
                      values.deliveryDate
                      )
                      submitForm();  
                    }}
                  />
                </View>
                <View>
                  <View style={styles.iconContainerStyle}>
                    <TouchableOpacity 
                      onPress={() => setChatModalVisibility(true)}
                      activeOpacity = {1}
                    >
                      <View style={styles.iconStyle}>
                        <ChatIcon name="hipchat" color={colors.tertiary} size={moderateScale(45)} />
                      </View>
                      {
                        newMessageCount !== 0 &&
                        <View style = {styles.badgeViewStyle}>
                          <Label title = {newMessageBadgeCount} labelStyle = {{color: colors.defaultDark}}/>
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
        chatModalVisible = {chatModalVisibility}
        hideChatModal = {() => setChatModalVisibility(false)}
        resetNewMessageCount = {() => setNewMessageCount(0)}
        webSocket = {ws}
        messagesList = {messagesList}
        newMessageCount = {newMessageCount} 
        offline = {offline}
        userName = {userName}
        />
        <NameModal 
        nameModalVisible = {nameModalVisibility}
        handleNameSubmit = {(name) => {
          setNameModalVisibility(false);
          setUserName(name);
        }}
        />
      </ScrollView>
  )
};
