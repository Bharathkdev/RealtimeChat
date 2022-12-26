import React, {useEffect, useState, useRef} from "react";
import { View, TextInput, Easing, Text, FlatList, Animated, StyleSheet, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import Modal from 'react-native-modal';
import DeviceInfo from 'react-native-device-info';
import Icon from 'react-native-vector-icons/Ionicons'
import { moderateScale } from 'react-native-size-matters';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    backgroundColor: '#F2F3F5',
    borderRadius: moderateScale(10),
    overflow: 'hidden',
    padding: moderateScale(15),
    marginVertical: moderateScale(20)
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  filterModal: {
    position: "absolute",
    top: moderateScale(60),
    left: moderateScale(20),
    borderRadius: moderateScale(5),
    overflow: 'hidden',
    backgroundColor: '#CEEAFF'
  },
  filterOptions: {
    padding: moderateScale(10),
    textAlign: 'center',
    color: '#000000',
    fontFamily: 'Poppins-SemiBold'
  },
  filterLine: {
    borderBottomWidth: moderateScale(1),
    borderBottomColor: 'black',
    borderBottomStyle: 'solid'
  },
  searchBar: {
    marginLeft: moderateScale(10),
    borderColor: "black",
    borderWidth: moderateScale(1),
    borderRadius: moderateScale(10),
    backgroundColor: 'white',
  },
  searchBarInput: {
    padding: moderateScale(10)
  },
  list: {
    flex: 1,
    marginVertical: moderateScale(10),
  },
  closeButton: {
    padding: moderateScale(8)
  },
  messageView: {
    padding: moderateScale(8), 
    borderRadius: moderateScale(10),
    marginBottom: moderateScale(15),
    justifyContent: 'flex-end',
  },
  messageText: {
    color: 'black',
    fontSize: moderateScale(14),
    fontFamily: 'Poppins-Regular',
  },
  messageHeaderView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  messageNameText: {
    color: '#328CDB', 
    fontSize: moderateScale(15), 
    paddingBottom: moderateScale(2), 
    paddingRight: moderateScale(15),
    fontFamily: 'Poppins-SemiBold',
  },
  messageTimeText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: moderateScale(14), 
  },
  orderDetailsHeaderText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: moderateScale(14)
  },
  floatingIcon: {
    position: 'absolute',
    right: moderateScale(-5),
    bottom: moderateScale(-10)
  },
  emptyListView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyText: {
    textAlign: 'center',
    fontFamily: 'Poppins-SemiBold'
  },
  modalFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  messageInput: {
    flex: 1,
    borderWidth: moderateScale(1),
    borderRadius: moderateScale(15),
    paddingHorizontal: moderateScale(20),
    height: moderateScale(45),
    marginRight: moderateScale(10),
    backgroundColor: '#FFFFFF',
  },
  textInputWithIcon: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center'
  },
  wifiOffIcon: {
    paddingRight: moderateScale(10),
},
});

export default ChatModal = ({userName, chatModalVisible, hideChatModal, webSocket, messageRef, messagesList, resetNewMessageCount, newMessageCount, offline}) => { 

  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const [isSearchBarVisible, setSearchBarVisible] = useState(false);
  const [filterOption, setFilterOption] = useState("all");
  const [searchInput, setSearchInput] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [hasDataLongerThanScreen, setHasDataLongerThanScreen] = useState(false);
  const input = useRef(null);
  const [searchBarHeight] = useState(new Animated.Value(0));
  const [searchBarWidth] = useState(new Animated.Value(0));
  const deviceId = DeviceInfo.getUniqueId()._j;
  const filters = [
    {option: 'All', value: 'all'}, 
    {option: 'Orders', value: 'order'}, 
    {option: 'Messages', value: 'message'}, 
    {option: 'My Orders', value: 'myOrder'}, 
    {option: 'My Messages', value: 'myMessage'}];

  useEffect(() => {

    console.log("scroll position: ", scrollPosition);
    if (filteredData?.length > 0 && hasDataLongerThanScreen && scrollPosition >= 0 && scrollPosition < 0.99) {
      fadeIn();
    } else {
      fadeOut();
    }
  }, [scrollPosition, filteredData, hasDataLongerThanScreen]);

  useEffect(() => {
    if(chatModalVisible) {
     input.current.focus();
    }
  }, [chatModalVisible]);

  useEffect(() => {
    if(chatModalVisible) {
     
     if(filteredData?.length > 0 && newMessageCount !== 0) {
      messageRef?.current?.scrollToIndex({index: filteredData?.length - newMessageCount, animated: false});
     }
     if(newMessageCount === 0) {
      messageRef?.current?.scrollToEnd({ animated: false });
     }
    }
  }, [chatModalVisible, messageRef, newMessageCount, filteredData]);

  useEffect(() => {
    
    const lowerCaseSearchInput = searchInput.toLowerCase();
    const filteredMessages = messagesList?.filter((item) =>
      item.message?.toLowerCase().includes(lowerCaseSearchInput) ||
      item.name?.toLowerCase().includes(lowerCaseSearchInput) ||
      item.contact?.toLowerCase().includes(lowerCaseSearchInput) ||
      item.itemsPlaced?.toLowerCase().includes(lowerCaseSearchInput) ||
      item.delivery?.toLowerCase().includes(lowerCaseSearchInput) 
    ).filter((item) => {
      console.log("item.message: ", item, filterOption);
      if(filterOption === 'all' || filterOption === item.type) return item 
      if(filterOption === 'myOrder' && item.type === 'order' && item.deviceId === deviceId) return item
      if(filterOption === 'myMessage' && item.type === 'message' && item.deviceId === deviceId) return item
    });
    setFilteredData(filteredMessages);
  }, [searchInput, messagesList, filterOption]);

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const fadeOut = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const handleScroll = (event) => {
    const { contentSize, layoutMeasurement, contentOffset } = event.nativeEvent;
    const scrollPosition = contentOffset.y / (contentSize.height - layoutMeasurement.height);
    const hasDataLongerThanScreen = contentSize.height > layoutMeasurement.height;
    setScrollPosition(scrollPosition);
    setHasDataLongerThanScreen(hasDataLongerThanScreen);
  };

  const handleNewMessage = () => {
    if(chatModalVisible) {
      messageRef?.current?.scrollToEnd({ animated: false });
    }
  };

  const closeModal = () => {
    hideChatModal();
    resetNewMessageCount();
    setSearchBarVisible(false);
    setSearchInput("");
  }

  const handleMessage = (e) => {
    setNewMessage(e.nativeEvent.text);
  };

  const sendMessage = () => {
    if(!offline) {
      webSocket.current.send(JSON.stringify({id: new Date().getTime(), type: 'message', message: newMessage, userName, deviceId: DeviceInfo.getUniqueId()._j, time: new Date().getTime()}));
      setNewMessage('');
    } 
  };

  const handleFilterOptions = (option) => {
    setFilterModalVisible(!isFilterModalVisible);
    setFilterOption(option);
  };

  const searchBarHandler = () => {
   
    if (isSearchBarVisible) {
      // Animate the search bar's height to 0 (collapsed)
      Animated.parallel([
        Animated.timing(searchBarHeight, {
          toValue: 0,    // 0 is the desired height of the search bar
          duration: 10, // duration of the animation in milliseconds
          easing: Easing.ease,
          useNativeDriver: false,
        }),
        Animated.timing(searchBarWidth, {
          toValue: 0,    // 0 is the desired width of the search bar
          duration: 10, 
          easing: Easing.ease,
          useNativeDriver: false,
        })
      ]).start(() => {
          setSearchBarVisible(false);
          setSearchInput('');
        });
    } else {
      // Animate the search bar's height to 40 (expanded)
      Animated.parallel([
        Animated.timing(searchBarHeight, {
          toValue: 40, // 40 is the desired height of the search bar
          duration: 100, // duration of the animation in milliseconds
          useNativeDriver: false,
        }),
        Animated.timing(searchBarWidth, {
          toValue: 210, // 210 is the desired width of the search bar
          duration: 100, 
          useNativeDriver: false,
        })
      ]).start();
      setSearchBarVisible(true);
    }
  };

  const handleMessageTimestamp = (timestamp) => {
    const date = new Date(timestamp);

    const options = {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    };

    const formattedTimestamp = new Intl.DateTimeFormat('en-US', options).format(date);

    return formattedTimestamp;
  }

  const handleUserName = (userDeviceId, messageSentBy) => {
    if(userDeviceId === deviceId) {
      return 'You';
    }
    if(messageSentBy) {
      if(messageSentBy.length > 15) {
        return messageSentBy.substring(0, 15) + '...';
      } else {
        return messageSentBy;
      } 
    } else {
      return 'Anonymous';
    }
  }

    return (
        <Modal 
        isVisible={chatModalVisible} 
        backdropTransitionOutTiming={0}
        animationIn="slideInUp" 
        animationOut="slideOutDown"
        animationInTiming={500} 
        animationOutTiming={500} 
        onBackButtonPress={() => hideChatModal()}
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
                  {filters.map(filter => (
                    <TouchableOpacity activeOpacity={0.7} key={filter.option} style={{backgroundColor: filterOption === filter.value ? '#C5C7C4' : '#CEEAFF'}} onPress={() => handleFilterOptions(filter.value)}>
                      <Text style = {styles.filterOptions}>{filter.option}</Text>
                      {filter.option !== 'My Messages' ? <View style={styles.filterLine}></View> : null}
                    </TouchableOpacity>
                  )
                  )}
              </Modal>
              <TouchableOpacity style = {{marginLeft: 20}} onPress={searchBarHandler}>
                  <MaterialIcon name= {isSearchBarVisible ? "search-off" : "search"} color="black" size={25}/>
              </TouchableOpacity> 
              {isSearchBarVisible ? <Animated.View style={[styles.searchBar,  {height: searchBarHeight, width: searchBarWidth} ]}>
                  <TextInput
                  autoFocus
                  value={searchInput}
                  onChangeText={setSearchInput}
                  placeholder="Search"
                  style={styles.searchBarInput}
                  />
              </Animated.View> : null}
            </View>
              <TouchableOpacity onPress={closeModal} style = {styles.closeButton}>
              <Icon name="close" color="black" size={25}/>
              </TouchableOpacity>
            </View>  
          <View style={styles.list}>
          {filteredData?.length > 0 ? <FlatList
              ref={messageRef}
              onScroll={handleScroll}
              onScrollToIndexFailed={(info) => {
              console.log(`Failed to scroll to index ${JSON.stringify(info)}.`);
              }}
              data={filteredData}
              keyExtractor={item => item.id}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) =>
              <View style={{flexDirection: 'row', justifyContent: item.deviceId === deviceId ? 'flex-end' : 'flex-start', paddingLeft: item.deviceId === deviceId ? moderateScale(20) : 0, paddingRight: item.deviceId === deviceId ? 0 : moderateScale(20)}}>
                  <View style={{...styles.messageView,  backgroundColor: item.deviceId === deviceId ? '#CEEAFF' : '#FFFFFF' }}>
                  <View style = {styles.messageHeaderView}>
                      <Text style = {styles.messageNameText}>{handleUserName(item.deviceId, item.userName)}</Text>
                      <Text style = {styles.messageTimeText}>{handleMessageTimestamp(item.time)}</Text>
                  </View>
                  {item.type === 'order' ? 
                      <>
                          <Text style = {styles.orderDetailsHeaderText}>{item.name} order details:</Text>
                          <Text style = {styles.messageText}>
                            Customer Name: {item.name}
                            {"\n"}
                            Mobile: {item.contact}
                            {"\n"}
                            Order Items: {item.itemsPlaced}
                            {"\n"}
                            Expected Delivery date: {new Date(item.delivery).toLocaleDateString()}
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
          <Animated.View style={{...styles.floatingIcon, opacity: fadeAnim}}>
          <TouchableOpacity onPress = {handleNewMessage}>
              <Icon name="chevron-down-circle-outline" size={40} color="black"/>
          </TouchableOpacity>
          </Animated.View>
          </View>
          <View style = {styles.modalFooter}>
            <View style={styles.textInputWithIcon}>
              {offline ? <Feather style = {styles.wifiOffIcon} name="wifi-off" color="red" size={25}/> : null}
              <TextInput ref={input} onTouchStart = {handleNewMessage} style = {styles.messageInput} placeholder="Type your message here..." value={newMessage} onChange={handleMessage} />
            </View>
            <TouchableOpacity disabled={(newMessage && !offline ) ? false : true} style = {{opacity: (newMessage && !offline )   ? 1 : 0.3}} onPress={sendMessage}>
              <Icon name="send" color="#328CDB" size={25}/>
            </TouchableOpacity>
          </View>
        </View>
        </Modal>
    )
};