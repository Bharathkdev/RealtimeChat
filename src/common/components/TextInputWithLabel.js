import React, { forwardRef } from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import {moderateScale} from 'react-native-size-matters';
import colors from '../colors';

const styles = StyleSheet.create({
  labelStyle: {
    marginBottom: moderateScale(10),
    fontSize: moderateScale(15),
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
    fontFamily: 'Poppins-Medium',
    color: colors.error,
    paddingTop: moderateScale(3)
  },
});

export const TextInputWithLabel = forwardRef(({viewStyle, error, value, onBlur, validationLabelStyle, onChangeText, maxLength, blurOnSubmit, onSubmitEditing, keyboardType, returnKeyType, labelStyle, textInputStyle, label, placeholder}, ref) => {

  return (
    <View style = {viewStyle}>
      <Text style = {[styles.labelStyle, labelStyle]}> {label} </Text>

      <TextInput
        ref = {ref} 
        placeholder = {placeholder}
        style = {[styles.textInputStyle, textInputStyle]}
        returnKeyType = {returnKeyType}
        keyboardType = {keyboardType}
        onSubmitEditing = {onSubmitEditing}
        blurOnSubmit = {blurOnSubmit}
        value = {value}
        maxLength = {maxLength}
        onChangeText = {onChangeText}
        onBlur = {onBlur}  
      />

      {error && (
        <Text style = {{ ...styles.validationLabelStyle, ...validationLabelStyle }}> {error} </Text>
      )}
    </View>
  );
});
