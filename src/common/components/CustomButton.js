import * as React from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
    fontWeight: '500',
    color: colors.defaultLight,
  }
});
export const CustomButton = (props) => {

  const disableButtonStyle = props.disableButton === true ? { opacity: 0.35 } : {};

  return (
    <TouchableOpacity
      style = {{ ...styles.buttonStyle, ...props.buttonStyle, ...disableButtonStyle }}
      onPress = {props.onPress}
      disabled = {props.disableButton}
    >
      <Text style={[styles.textStyle, props.textStyle]}>{props.title}</Text>
    </TouchableOpacity>
  );
};