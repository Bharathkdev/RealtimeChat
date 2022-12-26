import React, { forwardRef } from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import {moderateScale} from 'react-native-size-matters';

const styles = StyleSheet.create({
  labelStyle: {
    marginBottom: moderateScale(10),
    fontSize: moderateScale(15),
    fontWeight: '500',
    color: '#000000',
    fontFamily: 'Poppins-Medium'
  },
  textInputStyle: {
    backgroundColor: '#FFFFFF',
    borderRadius: moderateScale(10),
    height: moderateScale(50),
    paddingHorizontal: moderateScale(15),
    fontSize: moderateScale(14),
    borderWidth: moderateScale(1),
    borderColor: '#CEEAFF',
    fontFamily: 'Poppins-Regular',
  },
  validationLabelStyle: {
    fontSize: moderateScale(15),
    fontWeight: '500',
    color: '#FE295C',
    paddingVertical: moderateScale(6)
  },
});

export const TextInputWithLabel = forwardRef((props, ref) => {

  return (
    <View style={props.viewStyle}>
      <Text style={[styles.labelStyle, props.labelStyle]}> {props.label} </Text>

      <TextInput
        ref = {ref} 
        placeholder = {props.placeholder}
        style = {[styles.textInputStyle, props.textInputStyle]}
        returnKeyType = {props.returnKeyType}
        keyboardType = {props.keyboardType}
        onSubmitEditing = {props.onSubmitEditing}
        blurOnSubmit = {props.blurOnSubmit}
        value = {props.value}
        maxLength = {props.maxLength}
        onChangeText = {props.onChangeText}
        onBlur = {props.onBlur}  
      />

      {props.error && (
        <Text style = {{ ...styles.validationLabelStyle, ...props.validationLabelStyle }}> {props.error} </Text>
      )}
    </View>
  );
});
