import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Modal from 'react-native-modal';
import { TextInputWithLabel } from '../common/components/TextInputWithLabel';
import { CustomButton } from '../common/components/CustomButton';
import { moderateScale } from 'react-native-size-matters';
 
const styles = StyleSheet.create({
    textInputViewStyle: {
        marginBottom: moderateScale(16),
    },
    labelStyle: {
        textAlign: 'center',
        fontWeight: '500',
        fontSize: moderateScale(17)
    },
    nameModal: {
        padding: moderateScale(20),
        justifyContent: 'center',
        backgroundColor: 'white',
        borderRadius: moderateScale(10),
        overflow: 'hidden',
    },
    customButtonStyle: {
        width: '50%',
        alignSelf: 'center',
    },
    textStyle: {
        fontFamily: 'Poppins-Regular',
        marginBottom: moderateScale(10),
        color: 'black'
    }
});

export default NameModal = ({nameModalVisible, handleNameSubmit}) => {
    const [name, setName] = useState('');
    
    console.log("Name modal visible: ", nameModalVisible);

    return (
        <Modal 
        isVisible={nameModalVisible}
        backdropTransitionOutTiming={0}
        animationIn="slideInUp" 
        animationOut="slideOutDown"
        animationInTiming={500} 
        animationOutTiming={500}
        
        >
        <View style={styles.nameModal}>
          <TextInputWithLabel
            label = "Name"
            value = {name}
            onChangeText = {setName}
            viewStyle = {styles.textInputViewStyle}
            labelStyle = {styles.labelStyle}
          />
          <Text style = {styles.textStyle}>*If not given, messages will be sent as Anonymous to others</Text>
          <CustomButton 
                title = "Submit" 
                onPress={() => handleNameSubmit(name, true)} 
                buttonStyle={styles.customButtonStyle}
            />
        </View>  
        </Modal>
    )
} 

