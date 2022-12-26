import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {moderateScale} from 'react-native-size-matters';
import DateTimePickerModal from "@react-native-community/datetimepicker";
import colors from '../../common/colors';
 
const styles = StyleSheet.create({
  labelStyle: {
    marginBottom: moderateScale(10),
    fontSize: moderateScale(15),
    color: colors.defaultDark,
    fontFamily: 'Poppins-Medium'
  },
  textStyle: {
    fontSize: moderateScale(14),
    color: colors.defaultDark,
    fontFamily: 'Poppins-Regular'
  },
  validationLabelStyle: {
    fontSize: moderateScale(15),
    fontFamily: 'Poppins-Medium',
    color: colors.error,
    paddingVertical: moderateScale(6)
  },
  textWrapperStyle: {
    minHeight: moderateScale(50),
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: moderateScale(15),
    borderColor: colors.base,
    backgroundColor: colors.defaultLight,
    borderWidth: moderateScale(1),
    borderRadius: moderateScale(10),
  },
});

export const DatePicker = ({mode, onChange, viewStyle, validationLabelStyle, labelStyle, label, value, error}) => {
  const [calendarVisibility, setCalendarVisibility] = useState(false);

  const handleDateConfirm = (event, newDate) => {
        const selectedDate = newDate || new Date();
        setCalendarVisibility(false);
        onChange(selectedDate)
  };  

  return (
    <View style = {[styles.viewStyle, viewStyle]}>
      <Text style = {[styles.labelStyle, labelStyle]}> {label} </Text>

      <TouchableOpacity onPress = {() => {
        setCalendarVisibility(true);
      }}
      activeOpacity = {1}
      style = {{ ...styles.textWrapperStyle}}>
        <Text style = {styles.textStyle}>
          {value ? value.toLocaleDateString() : ''}
        </Text>
      </TouchableOpacity>

      {calendarVisibility ? 
      <DateTimePickerModal
        mode = {mode}
        value = {value ? value : new Date()}
        onChange = {handleDateConfirm}
        minimumDate = {new Date()}
        animationType = "fade"
       /> 
       : 
      null}
      {error && (
        <Text style = {{ ...styles.validationLabelStyle, ...validationLabelStyle }}> {error} </Text>
      )}
    </View>
  );
};
