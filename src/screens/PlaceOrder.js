import React, { useState, useRef, useEffect } from 'react';
import { KeyboardAvoidingView, View, StyleSheet, TouchableOpacity, ScrollView   } from 'react-native';
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
import NameModal from './NameModal';

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
    marginVertical: moderateScale(30),
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
    justifyContent: Platform.OS === 'android' ? 'flex-end' : 'center',
    alignItems: 'center',
    right: moderateScale(-15),
    top: moderateScale(-15),
  },
  iconStyle: {
    padding: moderateScale(10),
    borderRadius: moderateScale(10),
    backgroundColor: '#FFFFFF',
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
  const [chatModalVisibility, setChatModalVisibility] = useState(false);
  const [nameModalVisibility, setNameModalVisibility] = useState(true);
  const [messagesList, setMessagesList] = useState([]);
  const [userName, setUserName] = useState('');
  const [newMessageCount, setNewMessageCount] = useState(0);
  const ws = useRef(null);
  const listRef = useRef(null);
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
      // Set an interval to try to reconnect every 5 seconds
      reconnectInterval = setInterval(reconnect, 5000);
    });

    ws.current.addEventListener('error', (error) => {
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

  useEffect(() => {
    if(!chatModalVisibility && messagesList.length > 0) {
      setNewMessageCount((newMessageCount) => {
        return newMessageCount + 1;
      })
    }
    handleNewMessage();
  }, [messagesList]);

   // Function to attempt to reconnect to the WebSocket server
   const reconnect = () => {
    console.log('Trying to reconnect...');
    ws.current = new WebSocket('ws://medichat.eu-4.evennode.com');
    ws.current.addEventListener('close', () => {
      console.log('WebSocket connection closed');
      reconnectInterval = setInterval(reconnect, 5000);
    });
    ws.current.addEventListener('open', () => {
      console.log('Reconnected to WebSocket server');
      clearInterval(reconnectInterval);
    });
    ws.current.addEventListener('error', (error) => {
      console.log('WebSocket connection error inside reconnect', error );
    });
    ws.current.addEventListener('message', updateMessageList);
  };

  const updateMessageList = (event) => {
    console.log("Message event: ", JSON.parse(event.data), messagesList); 
    setMessagesList((messagesList) => {
      return [...messagesList, JSON.parse(event.data)];
    })
  }

  const handleNewMessage = () => {
    if(chatModalVisibility) {
      setTimeout(() => listRef?.current?.scrollToEnd({ animated: false }), 200);
    }
  };

  const placeOrder = (name, contact, itemsPlaced, delivery) => {
    if(!offline) {
      ws.current.send(JSON.stringify({id: new Date().getTime(), type: 'order', name, userName, contact, itemsPlaced, delivery, deviceId: DeviceInfo.getUniqueId()._j, time: new Date().getTime()}));
      alert('Order placed successfully!')
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
          component = {({ handleChange, handleBlur, submitForm, touched, values, errors, isValid, setFieldValue }) => {
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
                    label = "Phone Number"
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
                    label = "Items to be ordered"
                    value = {values.items}
                    returnKeyType = "done"
                    onChangeText={handleChange("items")}
                    onBlur = {handleBlur("items")}
                    error = {touched.items && errors.items}
                    viewStyle = {styles.textInputViewStyle}
                  />
                  
                  <DatePicker
                    label = "Expected Delivery Date"
                    viewStyle = {styles.textInputViewStyle}
                    value = {values.deliveryDate}
                    mode = {"date"}
                    onChange = {(value) => {
                      setFieldValue("deliveryDate", value);
                    }}
                  /> 
                </View>
                <View style = {{marginVertical: moderateScale(10)}}>
                  <CustomButton 
                    title = "Place order" 
                    disableButton = {!isValid}
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
                        <ChatIcon name="hipchat" color='#4AADE8' size={45} />
                      </View>
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
        chatModalVisible = {chatModalVisibility}
        hideChatModal = {() => setChatModalVisibility(false)}
        resetNewMessageCount = {() => setNewMessageCount(0)}
        webSocket = {ws}
        messageRef = {listRef}
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
