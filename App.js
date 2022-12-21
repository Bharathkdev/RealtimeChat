import React, { useState, useRef, useEffect } from 'react';
import { View, TextInput, Button, Text, FlatList, Dimensions, Animated, StyleSheet, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/Ionicons'
import WebSocket from 'react-native-websocket';
import DeviceInfo from 'react-native-device-info';
import {TextInputWithLabel} from './src/common/components/TextInputWithLabel';
import { moderateScale } from 'react-native-size-matters';
import { Label } from './src/common/components/Label';
import { CustomButton } from './src/common/components/CustomButton';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import ChatIcon from 'react-native-vector-icons/Fontisto';

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
    justifyContent: 'space-between',
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
  },
  floatingIcon: {
      position: 'absolute',
      right: -5,
      bottom: -15,
  },
  filterModal: {
    position: "absolute",
    top: 60,
    left: 20,
    backgroundColor: 'lightgrey',
    borderRadius: 5,
  },
  filterOptions: {
    padding: 10,
    textAlign: "center",
    color: 'black',
    fontWeight: 'bold',
  },
  searchBar: {
    width: 210,
    height: 40,
    marginLeft: 10,
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: 'white',
  },
  searchBarInput: {
    padding: 10
  },
  emptyListView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyText: {
    textAlign: 'center',
    fontWeight: 'bold',
  }
});

export default App = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const [isSearchBarVisible, setSearchBarVisible] = useState(false);
  const [filterOption, setFilterOption] = useState("all");
  const [searchInput, setSearchInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [newMessageCount, setNewMessageCount] = useState(0);
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [items, setItems] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [filteredData, setFilteredData] = useState(messages);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [hasDataLongerThanScreen, setHasDataLongerThanScreen] = useState(false);
  const ws = useRef(null);
  const input = useRef(null);
  const listRef = useRef(null);
  const newMessageBadgeCount = `${newMessageCount > 10 ? '10+' : newMessageCount}`;


  const deviceId = DeviceInfo.getUniqueId()._j;
  const MOBILE_NUMBER_REGEX = /^\d{10}$/;


  useEffect(() => {
    console.log("scroll position: ", scrollPosition);
    if (filteredData.length > 0 && hasDataLongerThanScreen && scrollPosition >= 0 && scrollPosition < 0.99) {
      fadeIn();
    } else {
      fadeOut();
    }
  }, [scrollPosition, filteredData, hasDataLongerThanScreen]);

  useEffect(() => {
    if(isModalVisible) {
     input.current.focus();
     
     if(filteredData.length > 0 && newMessageCount !== 0) {
      setTimeout(() => listRef?.current?.scrollToIndex({index: filteredData.length - newMessageCount, animated: true}), 1000);
     }
     if(newMessageCount === 0) {
      setTimeout(() => listRef?.current?.scrollToEnd({ animated: true }), 1000);
     }
    }
  }, [isModalVisible, input, listRef]);

  useEffect(() => {
    const lowerCaseSearchInput = searchInput.toLowerCase();
    const filteredData = messages.filter((item) =>
      item.message?.toLowerCase().includes(lowerCaseSearchInput) ||
      item.name?.toLowerCase().includes(lowerCaseSearchInput) ||
      item.contact?.toLowerCase().includes(lowerCaseSearchInput) ||
      item.itemsPlaced?.toLowerCase().includes(lowerCaseSearchInput) ||
      item.delivery?.toLowerCase().includes(lowerCaseSearchInput) 
    ).filter((item) => filterOption === 'all' ? item : item.type === filterOption ? item : null);
    setFilteredData(filteredData);
  }, [searchInput, messages, filterOption]);

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 0.3,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const fadeOut = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleScroll = (event) => {
    const { contentSize, layoutMeasurement, contentOffset } = event.nativeEvent;
    const scrollPosition = contentOffset.y / (contentSize.height - layoutMeasurement.height);
    const hasDataLongerThanScreen = contentSize.height > layoutMeasurement.height;
    setScrollPosition(scrollPosition);
    console.log("Has Longer data: ", hasDataLongerThanScreen);
    setHasDataLongerThanScreen(hasDataLongerThanScreen);
  };

  const handleNewMessage = () => {
    if(isModalVisible) {
      setTimeout(() => listRef?.current?.scrollToEnd({ animated: true }), 500);
    }
  };

  const toggleModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setNewMessageCount(0);
    setSearchBarVisible(false);
    setSearchInput("");
  }

  const handleMessage = (e) => {
    setMessage(e.nativeEvent.text);
  };

  const sendMessage = () => {
    ws.current.send(JSON.stringify({id: new Date().getTime(), type: 'message', message, deviceId, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).toUpperCase()}));
    setMessage('');
  };

  const placeOrder = (name, contact, itemsPlaced, delivery) => {
    ws.current.send(JSON.stringify({id: new Date().getTime(), type: 'order', name, contact, itemsPlaced, delivery, deviceId, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).toUpperCase()}));
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

  const handleFilterOptions = (option) => {
    setFilterModalVisible(!isFilterModalVisible);
    setFilterOption(option);
  };

  const searchBarHandler = () => {
    setSearchBarVisible(!isSearchBarVisible);
    setSearchInput("");
  };

  // contentSizeChangeHandler = (contentWidth, contentHeight) => {
  //   console.log("Check if the content height is greater than the screen height", contentHeight, Dimensions.get('window').height);
  //   if (contentHeight > Dimensions.get('window').height) {
  //     fadeIn();
  //   } else {
  //     fadeOut();
  //   }
  // };

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
      <Text>Message Count: {newMessageCount}</Text>
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
            <View style = {{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
              <TouchableOpacity onPress={() => {setFilterModalVisible(!isFilterModalVisible)}}>
                <Icon name="filter" color="black" size={25}/>
              </TouchableOpacity>
              <Modal 
                style={styles.filterModal}
                visible={isFilterModalVisible}
                onBackdropPress={() => {setFilterModalVisible(!isFilterModalVisible)}}>
                  <TouchableOpacity style={{backgroundColor: filterOption === 'order' ? 'grey' : 'lightgrey'}} onPress={() => handleFilterOptions('order')}>
                    <Text style = {styles.filterOptions}>Orders</Text>
                    <View style={{
                      borderBottomWidth: 1,
                      borderBottomColor: 'black',
                      borderBottomStyle: 'solid',
                    }}></View>
                  </TouchableOpacity>
                  <TouchableOpacity style={{backgroundColor: filterOption === 'message' ? 'grey' : 'lightgrey'}} onPress={() => handleFilterOptions('message')}>
                    <Text style = {styles.filterOptions}>Messages</Text>
                    <View style={{
                      borderBottomWidth: 1,
                      borderBottomColor: 'black',
                      borderBottomStyle: 'solid',
                    }}></View>
                  </TouchableOpacity>
                  <TouchableOpacity style={{backgroundColor: filterOption === 'all' ? 'grey' : 'lightgrey'}} onPress={() => handleFilterOptions('all')}>
                    <Text style = {styles.filterOptions}>All</Text>
                  </TouchableOpacity>
              </Modal>
              <TouchableOpacity style = {{marginLeft: 20}} onPress={searchBarHandler}>
                <MaterialIcon name= {isSearchBarVisible ? "search-off" : "search"} color="black" size={25}/>
              </TouchableOpacity> 
              {isSearchBarVisible ? <View style={styles.searchBar}>
                <TextInput
                  value={searchInput}
                  onChangeText={setSearchInput}
                  placeholder="Search"
                  style={styles.searchBarInput}
                />
              </View> : null}
            </View>
            <TouchableOpacity onPress={closeModal} style = {styles.closeButton}>
              <Icon name="close" color="black" size={25}/>
            </TouchableOpacity>
          </View>  
          <View style={styles.list}>
          {filteredData.length > 0 ? <FlatList
            ref={listRef}
            //onContentSizeChange={contentSizeChangeHandler}
            onScroll={handleScroll}
            onScrollToIndexFailed={(info) => {
              console.log(`Failed to scroll to index ${JSON.stringify(info)}.`);
            }}
            data={filteredData}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) =>
              <View style={{flexDirection: 'row', justifyContent: item.deviceId === deviceId ? 'flex-end' : 'flex-start', paddingLeft: item.deviceId === deviceId ? 20 : 0, paddingRight: item.deviceId === deviceId ? 0 : 20}}>
                <View style={{...styles.messageView,  backgroundColor: item.deviceId === deviceId ? '#B1D8B7' : 'white' }}>
                  <View style = {styles.messageHeaderView}>
                    <Text style = {styles.messageNameText}>{(item.name && item.deviceId !== deviceId) ? item.name.length > 30 ? item.name.substring(0, 30) + '...' : item.name : (item.deviceId === deviceId) ? 'You' : 'Anonymous'}</Text>
                    <Text>{item.time}</Text>
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
          /> : <View style={styles.emptyListView}>
          <Text style={styles.emptyText}>No messages/orders yet. 
            {"\n"}
            Please send a message or place an order or try with another filter.
          </Text>
        </View> }
        <Animated.View style={{
          ...styles.floatingIcon,
          opacity: fadeAnim,  
        }}>
          <TouchableOpacity onPress = {handleNewMessage}>
            <Icon name="chevron-down-circle-outline" size={40} color="black"/>
          </TouchableOpacity>
        </Animated.View>
        </View>
            <View style = {styles.modalFooter}>
              <TextInput ref={input} onTouchStart = {filteredData.length > 0 ? fadeIn : null} style = {styles.messageInput} placeholder="Type your message here..." value={message} onChange={handleMessage} />
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
          if(!isModalVisible) {
            setNewMessageCount(newMessageCount + 1);
          }
          handleNewMessage();
        }
        }
      />
    </View>
  );
};
