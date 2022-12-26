import * as React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import colors from '../colors';

const styles = StyleSheet.create({
  buttonStyle: {
    height: moderateScale(50),
    width: "100%",
    borderRadius: moderateScale(100),
    backgroundColor: colors.tertiary,
    justifyContent: "center",
    alignItems: "center"
  },
  textStyle: {
    alignSelf: 'center',
    fontSize: moderateScale(16),
    fontFamily: 'Poppins-Medium',
    color: colors.defaultLight,
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
      <Text style = {[styles.textStyle, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};