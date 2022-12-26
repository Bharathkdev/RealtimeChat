import React, {useEffect, useState, useRef} from "react";
import { View, TextInput, Easing, FlatList, Text, Animated, StyleSheet, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import DeviceInfo from 'react-native-device-info';
import Icon from 'react-native-vector-icons/Ionicons'
import { moderateScale } from 'react-native-size-matters';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import colors from "../common/colors";
import { Label } from '../common/components';
import strings from "../common/strings";

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    backgroundColor: colors.secondary,
    borderRadius: moderateScale(10),
    padding: moderateScale(15),
    marginVertical: moderateScale(20),
    overflow: 'hidden'
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  filterModal: {
    position: "absolute",
    top: moderateScale(60),
    left: moderateScale(20),
    borderRadius: moderateScale(5),
    backgroundColor: colors.base,
    overflow: 'hidden'
  },
  filterOptions: {
    textAlign: 'center',
    padding: moderateScale(10),
    color: colors.defaultDark,
    fontFamily: 'Poppins-SemiBold',
    fontSize: moderateScale(10)
  },
  filterLine: {
    borderBottomWidth: moderateScale(1),
    borderBottomColor: 'black',
    borderBottomStyle: 'solid'
  },
  searchBar: {
    backgroundColor: 'white',
    borderColor: "black",
    borderWidth: moderateScale(1),
    borderRadius: moderateScale(10),
    marginLeft: moderateScale(10)
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
    justifyContent: 'flex-end'
  },
  messageText: {
    color: colors.defaultDark,
    fontSize: moderateScale(14),
    fontFamily: 'Poppins-Regular',
  },
  messageHeaderView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  messageNameText: {
    color: colors.primary, 
    fontSize: moderateScale(15), 
    paddingBottom: moderateScale(2), 
    paddingRight: moderateScale(15),
    fontFamily: 'Poppins-SemiBold'
  },
  messageTimeText: {
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
    alignItems: 'center',
    justifyContent: 'center'
  },
  emptyText: {
    textAlign: 'center',
    fontFamily: 'Poppins-SemiBold'
  },
  modalFooter: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  messageInput: {
    flex: 1,
    borderWidth: moderateScale(1),
    borderRadius: moderateScale(15),
    paddingHorizontal: moderateScale(20),
    height: moderateScale(45),
    marginRight: moderateScale(10),
    backgroundColor: colors.defaultLight
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

export default ChatModal = ({userName, chatModalVisible, hideChatModal, webSocket, messagesList, resetNewMessageCount, newMessageCount, offline}) => { 

  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const [isSearchBarVisible, setSearchBarVisible] = useState(false);
  const [filterOption, setFilterOption] = useState("all");
  const [searchInput, setSearchInput] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [modalOpenComplete, setModalOpenComplete] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [hasDataLongerThanScreen, setHasDataLongerThanScreen] = useState(false);
  const input = useRef(null);
  const messageRef = useRef(null);
  const [searchBarHeight] = useState(new Animated.Value(0));
  const [searchBarWidth] = useState(new Animated.Value(0));
  const deviceId = DeviceInfo.getUniqueId()._j;

  // Message/Order filter options
  const filters = [
    {option: 'All', value: 'all'}, 
    {option: 'Orders', value: 'order'}, 
    {option: 'Messages', value: 'message'}, 
    {option: 'My Orders', value: 'myOrder'}, 
    {option: 'My Messages', value: 'myMessage'}
  ];

  // To search and filter messages/orders
  useEffect(() => {
    const lowerCaseSearchInput = searchInput.toLowerCase();
    const filteredMessages = messagesList?.filter((item) =>
      item?.message?.toLowerCase().includes(lowerCaseSearchInput) ||
      item?.name?.toLowerCase().includes(lowerCaseSearchInput) ||
      item?.contact?.toLowerCase().includes(lowerCaseSearchInput) ||
      item?.itemsPlaced?.toLowerCase().includes(lowerCaseSearchInput) ||
      new Date(item.delivery).toLocaleDateString()?.includes(lowerCaseSearchInput) 
    ).filter((item) => {
      if(filterOption === 'all' || filterOption === item?.type) return item 
      if(filterOption === 'myOrder' && item?.type === 'order' && item?.deviceId === deviceId) return item
      if(filterOption === 'myMessage' && item?.type === 'message' && item?.deviceId === deviceId) return item
    });
    setFilteredData(filteredMessages);
  }, [searchInput, messagesList, filterOption]);

  useEffect(() => {
    if(chatModalVisible) {
     input.current.focus();
    }
  }, [chatModalVisible]);

  // To handle scroll to bottom button
  useEffect(() => {
    if (filteredData?.length > 0 && hasDataLongerThanScreen && scrollPosition >= 0 && scrollPosition < 0.99) {
      fadeIn();
    } else {
      fadeOut();
    }
  }, [scrollPosition, filteredData, hasDataLongerThanScreen]);

  useEffect(() => {
    if(chatModalVisible && modalOpenComplete) {
      if(filteredData?.length > 0 && newMessageCount !== 0) {
        messageRef?.current?.scrollToIndex({index: filteredData?.length - newMessageCount, animated: false});
        resetNewMessageCount();
        return;
      }
      messageRef?.current?.scrollToIndex({index: filteredData?.length - 1, animated: false});
    }
  }, [chatModalVisible, filteredData, modalOpenComplete]);

  function onModalOpen() {
    setModalOpenComplete(true);
  }
  
  function onModalClose() {
    setModalOpenComplete(false);
  }

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
      messageRef?.current?.scrollToIndex({index: filteredData?.length - 1, animated: false});
    }
  };

  const closeModal = () => {
    hideChatModal();
    setSearchBarVisible(false);
    setSearchInput("");
  }

  const handleMessage = (e) => {
    setNewMessage(e.nativeEvent.text);
  };

  // To send messages to the web socket server
  const sendMessage = () => {
    if(!offline) {
      try{  
        webSocket?.current?.send(JSON.stringify({id: new Date().getTime(), type: 'message', message: newMessage, userName, deviceId: DeviceInfo.getUniqueId()._j, time: new Date().getTime()}));
        setNewMessage('');
      }catch(error){
        throw new Error(error);
      }
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

  // To display messages in user's local timezone
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

  // To handle sender and receiver user name
  const handleUserName = (userDeviceId, messageSentBy) => {
    if(userDeviceId === deviceId) {
      return strings.ChatModal.you;
    }
    if(messageSentBy) {
      if(messageSentBy?.length > 15) {
        return messageSentBy.substring(0, 15) + '...';
      } else {
        return messageSentBy;
      } 
    } else {
      return strings.ChatModal.anonymous;
    }
  }

    return (
      <Modal 
        onModalShow={onModalOpen}
        onModalHide={onModalClose}
        isVisible={chatModalVisible} 
        backdropTransitionOutTiming={0}
        animationIn="slideInUp" 
        animationOut="slideOutDown"
        animationInTiming={500} 
        animationOutTiming={500} 
        onBackButtonPress={closeModal}
        >
        <View style={styles.modal}>
          <View style = {styles.modalHeader}>
            <View style = {{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
              <TouchableOpacity onPress={() => {setFilterModalVisible(!isFilterModalVisible)}}>
                  <Icon name="filter" color={colors.defaultDark} size={25}/>
              </TouchableOpacity>

              <Modal 
                style={styles.filterModal}
                visible={isFilterModalVisible}
                onBackdropPress={() => {setFilterModalVisible(!isFilterModalVisible)}}>
                {filters.map(filter => (
                  <TouchableOpacity activeOpacity={0.7} key={filter?.option} style={{backgroundColor: filterOption === filter?.value ? colors.filterSelection : colors.base}} onPress={() => handleFilterOptions(filter?.value)}>
                    <Label title={filter?.option} labelStyle = {styles.filterOptions}/>
                    {filter?.option !== 'My Messages' ? <View style={styles.filterLine}></View> : null}
                  </TouchableOpacity>
                )
                )}
              </Modal>

              <TouchableOpacity style = {{marginLeft: 20}} onPress={searchBarHandler}>
                  <MaterialIcon name= {isSearchBarVisible ? "search-off" : "search"} color={colors.defaultDark} size={moderateScale(25)}/>
              </TouchableOpacity> 

              {isSearchBarVisible ? 
                <Animated.View style={[styles.searchBar,  {height: searchBarHeight, width: searchBarWidth} ]}>
                  <TextInput
                    autoFocus
                    value={searchInput}
                    onChangeText={setSearchInput}
                    placeholder= {strings.ChatModal.searchPlaceHolder}
                    style={styles.searchBarInput}
                  />
                </Animated.View> 
              : null}
            </View>
            <TouchableOpacity onPress={closeModal} style = {styles.closeButton}>
              <Icon name="close" color={colors.defaultDark} size={25}/>
            </TouchableOpacity>
          </View>  

          <View style={styles.list}>
            {filteredData?.length > 0 ? 
            <FlatList
              ref={messageRef}
              onScroll={handleScroll}
              removeClippedSubviews
              onScrollToIndexFailed={(error) => {
                console.log(`Failed to scroll to index ${JSON.stringify(error)}.`);
                messageRef.current.scrollToOffset({ offset: error.averageItemLength * error.index, animated: false });
                  setTimeout(() => {
                    if (filteredData.length !== 0 && messageRef.current !== null) {
                      messageRef.current.scrollToIndex({ index: error.index, animated: false });
                    }
                  }, 100);
                }
              }
              data={filteredData}
              keyExtractor={item => item.id}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) =>

              <View style={{flexDirection: 'row', justifyContent: item?.deviceId === deviceId ? 'flex-end' : 'flex-start', paddingLeft: item?.deviceId === deviceId ? moderateScale(20) : 0, paddingRight: item?.deviceId === deviceId ? 0 : moderateScale(20)}}>
                <View style={{...styles.messageView,  backgroundColor: item?.deviceId === deviceId ? colors.base : colors.defaultLight }}>
                  <View style = {styles.messageHeaderView}>
                    <Label title={handleUserName(item?.deviceId, item?.userName)} labelStyle = {styles.messageNameText}/>
                    <Label title={handleMessageTimestamp(item?.time)} labelStyle = {styles.messageTimeText}/>
                  </View>
                  {item.type === 'order' ? 
                    <View style={{paddingLeft: moderateScale(4)}}>
                      <Text style = {[styles.messageNameText, {color: colors.defaultDark}]}>{item?.name} {strings.ChatModal.orderDetails}</Text>
                      <Text style = {styles.messageText}>
                        {strings.ChatModal.customerName}: {item?.name}
                        {"\n"}
                        {strings.ChatModal.mobile}: {item?.contact}
                        {"\n"}
                        {strings.ChatModal.orderItems}: {item?.itemsPlaced}
                        {"\n"}
                        {strings.ChatModal.deliveryDate}: {new Date(item?.delivery)?.toLocaleDateString()}
                      </Text> 
                    </View> : 
                    <Text style = {[styles.messageText, {paddingLeft: moderateScale(4)}]}>{item?.message}</Text>
                  }
                </View> 
              </View>
              }
            /> 
            : 
            <View style={styles.emptyListView}>
              <Label title={strings.ChatModal.noData} labelStyle = {styles.emptyText}/>
            </View> 
            }
            <Animated.View style={{...styles.floatingIcon, opacity: fadeAnim}}>
              <TouchableOpacity onPress = {handleNewMessage}>
                <Icon name="chevron-down-circle-outline" size={moderateScale(40)} color={colors.defaultDark}/>
              </TouchableOpacity>
            </Animated.View>
          </View>

          <View style = {styles.modalFooter}>
            <View style={styles.textInputWithIcon}>
              {offline ? 
                <Feather style = {styles.wifiOffIcon} name="wifi-off" color={colors.networkBanner.offline} size={moderateScale(25)}/> 
                : 
                null
              }
              <TextInput ref={input} style = {styles.messageInput} placeholder={strings.ChatModal.messagePlaceHolder} value={newMessage} onChange={handleMessage} />
            </View>
            <TouchableOpacity disabled={(newMessage && !offline ) ? false : true} style = {{opacity: (newMessage && !offline ) ? 1 : 0.3}} onPress={sendMessage}>
              <Icon name="send" color = {colors.primary} size = {moderateScale(25)}/>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    )
};