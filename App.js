import React, {useState, useRef, useEffect } from 'react';
import {View, TextInput, Button, Text, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/Ionicons'
import WebSocket from 'react-native-websocket';
import DeviceInfo from 'react-native-device-info';
import {TextInputWithLabel} from './src/common/components/TextInputWithLabel';
import { moderateScale } from 'react-native-size-matters';
import { Label } from './src/common/components/Label';
import { CustomButton } from './src/common/components/CustomButton';

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    backgroundColor: '#F3FAFF',
    padding: moderateScale(30),
    justifyContent: 'space-between'
  },
  textInputViewStyle: {
    marginBottom: moderateScale(18),
  },
  modal: {
    flex: 1,
    backgroundColor: 'lightblue',
    borderRadius: 10,
    overflow: 'hidden',
    padding: 16
  },
  closeButton: {
    padding: 8
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  messageInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 20,
    marginRight: 10,
    backgroundColor: 'white',
  },
  list: {
    flex: 1,
    marginVertical: 20,
  },
  messageView: {
    padding: 10, 
    borderRadius: 10,
    marginBottom: 15,
    justifyContent: 'flex-end',
  },
  messageText: {
    color: 'black',
    fontSize: 15
  },
  orderDetailsHeaderText: {
    fontWeight: 'bold',
  },
  messageHeaderView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  messageNameText: {
    color: 'green', 
    fontSize: 15, 
    paddingBottom: 2, 
    paddingRight: 15,
  }
});

const App = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [messageCount, setMessageCount] = useState(0);
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [items, setItems] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const ws = useRef(null);
  const input = useRef(null);
  const listRef = useRef(null);


  const deviceId = DeviceInfo.getUniqueId()._j;
  const MOBILE_NUMBER_REGEX = /^\d{10}$/;

  useEffect(() => {
    if(isModalVisible) {
     input.current.focus();
     setMessageCount(messages.length);
    }
  }, [isModalVisible]);

  useEffect(() => {
    if(!isModalVisible) {
      setMessageCount(messages.length);
    }
  }, [messages, isModalVisible]);

  const handleNewMessage = () => {
    if(isModalVisible) {
      listRef.current.scrollToEnd({ animated: true });
    }
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleMessage = (e) => {
    setMessage(e.nativeEvent.text);
  };

  const sendMessage = () => {
    ws.current.send(JSON.stringify({id: new Date().getTime(), message, deviceId, time: new Date()}));
    setMessage('');
  };

  const placeOrder = (name, contact, itemsPlaced, delivery) => {
    ws.current.send(JSON.stringify({id: new Date().getTime(), name, contact, itemsPlaced, delivery, deviceId, time: new Date()}));
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
      <Label title={'Place your Order'} />
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

      </View>
      <View style = {{margin: 20}}>
      <CustomButton 
          title="Open Chat" 
          onPress={toggleModal} 
        />
      </View>
      <Text>Message Count: {messageCount}</Text>
      <Modal 
        isVisible={isModalVisible} 
        backdropTransitionOutTiming={0}
        animationIn="slideInUp" 
        animationOut="slideOutDown"
        animationInTiming={500} 
        animationOutTiming={500} 
      >
        <View style={styles.modal}>
          <View style = {styles.modalHeader}>
            <TouchableOpacity onPress={toggleModal} style = {styles.closeButton}>
              <Icon name="close" color="black" size={25}/>
            </TouchableOpacity>
          </View>  
          <View style={styles.list}>
            {messages ? 
            <FlatList
            ref={listRef}
            data={messages}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => 
              <View style={{flexDirection: 'row', justifyContent: item.deviceId === deviceId ? 'flex-end' : 'flex-start', paddingLeft: item.deviceId === deviceId ? 20 : 0, paddingRight: item.deviceId === deviceId ? 0 : 20}}>
                <View style={{...styles.messageView,  backgroundColor: item.deviceId === deviceId ? '#B1D8B7' : 'white' }}>
                  <View style = {styles.messageHeaderView}>
                    <Text style = {styles.messageNameText}>{(item.name && item.deviceId !== deviceId) ? item.name.length > 30 ? item.name.substring(0, 30) + '...' : item.name : (item.deviceId === deviceId) ? 'You' : 'Anonymous'}</Text>
                    <Text>{new Date(item.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).toUpperCase()}</Text>
                  </View>
                  {item.name ? 
                      <>
                        <Text style = {styles.orderDetailsHeaderText}>{item.name} order details:</Text>
                        <Text style = {styles.messageText}>
                          Customer Name: {item.name}
                          {"\n"}
                          Mobile: {item.contact}
                          {"\n"}
                          Order Items: {item.itemsPlaced}
                          {"\n"}
                          Expected Delivery date: {item.delivery}
                        </Text> 
                      </> : 
                      <Text style = {styles.messageText}>{item.message}</Text>
                    }
                </View> 
              </View>
            }
          />: null}
        </View>
            <View style = {styles.modalFooter}>
              <TextInput ref={input} style = {styles.messageInput} placeholder="Type your message here..." value={message} onChange={handleMessage} />
              <TouchableOpacity disabled={message ? false : true} style = {{opacity: message ? 1 : 0.3}} onPress={sendMessage}>
                <Icon name="send" color="black" size={25}/>
              </TouchableOpacity>
            </View>
        </View>
      </Modal>
      <WebSocket
        ref={ws}
        url="wss://251b-49-206-114-174.in.ngrok.io"
        onMessage={(event) => {
          console.log("Message event: ", JSON.parse(event.data), messages); 
          setMessages([...messages, JSON.parse(event.data)]);
          handleNewMessage();
        }
        }
      />
    </View>
  );
};



export default App;