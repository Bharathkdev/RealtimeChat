import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Modal from 'react-native-modal';
import { CustomButton, TextInputWithLabel } from '../common/components';
import { moderateScale } from 'react-native-size-matters';
import strings from '../common/strings';
import colors from '../common/colors';
 
const styles = StyleSheet.create({
    textInputViewStyle: {
        marginBottom: moderateScale(16),
    },
    labelStyle: {
        textAlign: 'center',
        fontFamily: 'Poppins-Medium',
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
        color: colors.defaultDark
    }
});

export default NameModal = ({nameModalVisible, handleNameSubmit}) => {
    const [name, setName] = useState('');
    
    return (
        <Modal 
            isVisible={nameModalVisible}
            backdropTransitionOutTiming={0}
            animationIn="slideInUp" 
            animationOut="slideOutDown"
            animationInTiming={500} 
            animationOutTiming={500}
        >
            <View style = {styles.nameModal}>
                <TextInputWithLabel
                    label = {strings.NameModal.name}
                    value = {name}
                    onChangeText = {setName}
                    viewStyle = {styles.textInputViewStyle}
                    labelStyle = {styles.labelStyle}
                />
                <Text style = {styles.textStyle}>{strings.NameModal.info}</Text>
                <CustomButton 
                    title = {strings.NameModal.submit}
                    onPress={() => handleNameSubmit(name, true)} 
                    buttonStyle={styles.customButtonStyle}
                />
            </View>  
        </Modal>
    )
} 

