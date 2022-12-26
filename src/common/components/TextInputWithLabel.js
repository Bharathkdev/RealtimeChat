import React, { forwardRef } from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import {moderateScale} from 'react-native-size-matters';
import colors from '../colors';

const styles = StyleSheet.create({
  labelStyle: {
    marginBottom: moderateScale(10),
    fontSize: moderateScale(15),
    fontWeight: '500',
    color: colors.defaultDark,
    fontFamily: 'Poppins-Medium'
  },
  textInputStyle: {
    backgroundColor: colors.defaultLight,
    borderRadius: moderateScale(10),
    height: moderateScale(50),
    paddingHorizontal: moderateScale(15),
    fontSize: moderateScale(14),
    borderWidth: moderateScale(1),
    borderColor: colors.base,
    fontFamily: 'Poppins-Regular',
  },
  validationLabelStyle: {
    fontSize: moderateScale(15),
    fontWeight: '500',
    color: colors.error,
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
