import * as React from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { moderateScale } from 'react-native-size-matters';

const styles = StyleSheet.create({
  buttonStyle: {
    height: moderateScale(50),
    width: "100%",
    borderRadius: moderateScale(100),
    backgroundColor: '#4AADE8',
    justifyContent: "center",
    alignItems: "center"
  },
  textStyle: {
    alignSelf: 'center',
    fontSize: moderateScale(16),
    fontWeight: '500',
    color: '#FFFFFF',
  }
});
export const CustomButton = ({disableButton, buttonStyle, onPress, textStyle, title}) => {

  const disableButtonStyle = disableButton === true ? { opacity: 0.35 } : {};

  return (
    <TouchableOpacity
      style = {{ ...styles.buttonStyle, ...buttonStyle, ...disableButtonStyle }}
      onPress = {onPress}
      disabled = {disableButton}
    >
      <Text style={[styles.textStyle, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};