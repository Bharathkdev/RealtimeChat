import React, {useEffect, useState, useRef} from "react";
import { View, TextInput, Text, FlatList, Animated, StyleSheet, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import DeviceInfo from 'react-native-device-info';
import Icon from 'react-native-vector-icons/Ionicons'
import { moderateScale } from 'react-native-size-matters';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    backgroundColor: 'lightblue',
    borderRadius: 10,
    overflow: 'hidden',
    padding: 16
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  filterLine: {
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    borderBottomStyle: 'solid'
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
  list: {
    flex: 1,
    marginVertical: 20,
  },
  closeButton: {
    padding: 8
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
  orderDetailsHeaderText: {
    fontWeight: 'bold',
  },
  floatingIcon: {
    position: 'absolute',
    right: -5,
    bottom: -15,
  },
  emptyListView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyText: {
    textAlign: 'center',
    fontWeight: 'bold',
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
  }
});

export default ChatModal = ({modalVisible, hideModal, webSocket, messageRef, messagesList, resetNewMessageCount, newMessageCount}) => { 

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

  const deviceId = DeviceInfo.getUniqueId()._j;

  useEffect(() => {
    console.log("scroll position: ", scrollPosition);
    if (filteredData?.length > 0 && hasDataLongerThanScreen && scrollPosition >= 0 && scrollPosition < 0.99) {
      fadeIn();
    } else {
      fadeOut();
    }
  }, [scrollPosition, filteredData, hasDataLongerThanScreen]);

  useEffect(() => {
    if(modalVisible) {
     input.current.focus();
     
     if(filteredData?.length > 0 && newMessageCount !== 0) {
      setTimeout(() => messageRef?.current?.scrollToIndex({index: filteredData?.length - newMessageCount, animated: true}), 1000);
     }
     if(newMessageCount === 0) {
      setTimeout(() => messageRef?.current?.scrollToEnd({ animated: true }), 1000);
     }
    }
  }, [modalVisible, input, messageRef]);

  useEffect(() => {
    console.log("Filtered data: ", filteredData);
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
    if(modalVisible) {
      setTimeout(() => messageRef?.current?.scrollToEnd({ animated: true }), 500);
    }
  };

  const closeModal = () => {
    hideModal();
    resetNewMessageCount();
    setSearchBarVisible(false);
    setSearchInput("");
  }

  const handleMessage = (e) => {
    setNewMessage(e.nativeEvent.text);
  };

  const sendMessage = () => {
    webSocket.current.send(JSON.stringify({id: new Date().getTime(), type: 'message', message: newMessage, deviceId: DeviceInfo.getUniqueId()._j, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).toUpperCase()}));
    setNewMessage('');
  };

  const handleFilterOptions = (option) => {
    setFilterModalVisible(!isFilterModalVisible);
    setFilterOption(option);
  };

  const searchBarHandler = () => {
    LayoutAnimation.configureNext(
      LayoutAnimation.Types.easeInEaseOut,
      () => {
        setSearchBarVisible(!isSearchBarVisible);
        setSearchInput("");
      },
      {
        duration: 300, // duration of the animation in milliseconds
      }
    );
  };


    return (
        <Modal 
        isVisible={modalVisible} 
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
                <TouchableOpacity style={{backgroundColor: filterOption === 'all' ? 'grey' : 'lightgrey'}} onPress={() => handleFilterOptions('all')}>
                    <Text style = {styles.filterOptions}>All</Text>
                    <View style={styles.filterLine}></View>
                </TouchableOpacity>
                <TouchableOpacity style={{backgroundColor: filterOption === 'order' ? 'grey' : 'lightgrey'}} onPress={() => handleFilterOptions('order')}>
                    <Text style = {styles.filterOptions}>Orders</Text>
                    <View style={styles.filterLine}></View>
                </TouchableOpacity>
                <TouchableOpacity style={{backgroundColor: filterOption === 'message' ? 'grey' : 'lightgrey'}} onPress={() => handleFilterOptions('message')}>
                    <Text style = {styles.filterOptions}>Messages</Text>
                    <View style={styles.filterLine}></View>
                </TouchableOpacity>
                <TouchableOpacity style={{backgroundColor: filterOption === 'myOrder' ? 'grey' : 'lightgrey'}} onPress={() => handleFilterOptions('myOrder')}>
                    <Text style = {styles.filterOptions}>My Orders</Text>
                    <View style={styles.filterLine}></View>
                </TouchableOpacity>
                <TouchableOpacity style={{backgroundColor: filterOption === 'myMessage' ? 'grey' : 'lightgrey'}} onPress={() => handleFilterOptions('myMessage')}>
                    <Text style = {styles.filterOptions}>My Messages</Text>
                </TouchableOpacity>
            </Modal>
            <TouchableOpacity style = {{marginLeft: 20}} onPress={searchBarHandler}>
                <MaterialIcon name= {isSearchBarVisible ? "search-off" : "search"} color="black" size={25}/>
            </TouchableOpacity> 
            {isSearchBarVisible ? <View style={styles.searchBar}>
                <TextInput
                autoFocus
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
            <View style={{flexDirection: 'row', justifyContent: item.deviceId === deviceId ? 'flex-end' : 'flex-start', paddingLeft: item.deviceId === deviceId ? 20 : 0, paddingRight: item.deviceId === deviceId ? 0 : 20}}>
                <View style={{...styles.messageView,  backgroundColor: item.deviceId === deviceId ? '#B1D8B7' : 'white' }}>
                <View style = {styles.messageHeaderView}>
                    <Text style = {styles.messageNameText}>{(item.name && item.deviceId !== deviceId) ? item.name.length > 30 ? item.name.substring(0, 30) + '...' : item.name : (item.deviceId === deviceId) ? 'You' : 'Anonymous'}</Text>
                    <Text>{item.time}</Text>
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
            <TextInput ref={input} onTouchStart = {handleNewMessage} style = {styles.messageInput} placeholder="Type your message here..." value={newMessage} onChange={handleMessage} />
            <TouchableOpacity disabled={newMessage ? false : true} style = {{opacity: newMessage ? 1 : 0.3}} onPress={sendMessage}>
                <Icon name="send" color="black" size={25}/>
            </TouchableOpacity>
            </View>
        </View>
        </Modal>
    )
};