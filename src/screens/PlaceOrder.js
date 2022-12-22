import React, { useState, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import WebSocket from 'react-native-websocket';
import DeviceInfo from 'react-native-device-info';
import { moderateScale } from 'react-native-size-matters';
import ChatIcon from 'react-native-vector-icons/Fontisto';
import {TextInputWithLabel} from '../common/components/TextInputWithLabel';
import { Label } from '../common/components/Label';
import { CustomButton } from '../common/components/CustomButton';
import ChatModal from './ChatModal';

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    padding: moderateScale(30),
    justifyContent: 'space-between'
  },
  textInputViewStyle: {
    marginBottom: moderateScale(18),
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
    right: moderateScale(-15),
    top: moderateScale(-15),
  },
  iconStyle: {
    padding: moderateScale(10),
    borderRadius: moderateScale(10),
    backgroundColor: '#F3FAFF',
    shadowColor: "#000",
    shadowOffset: {
    	width: 0,
    	height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default PlaceOrder = () => {
  const [modalVisibility, setModalVisibility] = useState(false);
  const [messagesList, setMessagesList] = useState([]);
  const [newMessageCount, setNewMessageCount] = useState(0);
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [items, setItems] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const ws = useRef(null);
  const listRef = useRef(null);
  const newMessageBadgeCount = `${newMessageCount > 10 ? '10+' : newMessageCount}`;

  const handleNewMessage = () => {
    if(modalVisibility) {
      setTimeout(() => listRef?.current?.scrollToEnd({ animated: true }), 500);
    }
  };

  const toggleModal = () => {
    setModalVisibility(true);
  };

  const placeOrder = (name, contact, itemsPlaced, delivery) => {
    ws.current.send(JSON.stringify({id: new Date().getTime(), type: 'order', name, contact, itemsPlaced, delivery, deviceId: DeviceInfo.getUniqueId()._j, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).toUpperCase()}));
    setCustomerName('');
    setPhoneNumber('');
    setItems('');
    setDeliveryDate('');
  }

  const handleCustomerName = (e) => {
    setCustomerName(e.nativeEvent.text);
  };

  const handlePhoneNumber = (e) => {
    //if (MOBILE_NUMBER_REGEX.test(text)) {
      setPhoneNumber(e.nativeEvent.text);
    //}
  };

  const handleItems = (e) => {
    setItems(e.nativeEvent.text);
  };

  const handleDeliveryDate = (e) => {
    setDeliveryDate(e.nativeEvent.text);
  };

  return (
    <View style={styles.containerStyle}>
      <Label title={'Place your Order'} labelStyle = {{fontWeight: '600'}}/>
      <View>
        <TextInputWithLabel
          label="Customer Name"
          value={customerName}
          onChangeText={handleCustomerName}
          viewStyle={styles.textInputViewStyle}
        />
        <TextInputWithLabel
          label="Phone Number"
          value={phoneNumber}
          keyboardType="phone-pad"
          maxLength={10}
          onChangeText={handlePhoneNumber}
          viewStyle={styles.textInputViewStyle}

        />
        <TextInputWithLabel
          label="Items to be ordered"
          value={items}
          onChangeText={handleItems}
          viewStyle={styles.textInputViewStyle}

        />
        <TextInputWithLabel
          label="Expected delivery date/time"
          value={deliveryDate}
          onChangeText={handleDeliveryDate}
          viewStyle={styles.textInputViewStyle}

        />
        <View style = {{margin: 20}}>
          <CustomButton 
            title="Place order" 
            onPress={placeOrder.bind(this, customerName, phoneNumber, items, deliveryDate)} 
          />
        </View>
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
      <ChatModal 
        modalVisible = {modalVisibility}
        hideModal = {() => setModalVisibility(false)}
        resetNewMessageCount = {() => setNewMessageCount(0)}
        webSocket = {ws}
        messageRef = {listRef}
        messagesList = {messagesList}
        newMessageCount = {newMessageCount}
        />
      <WebSocket
        ref={ws}
        url="wss://26c6-49-206-114-174.in.ngrok.io"
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
    </View>
  );
};
