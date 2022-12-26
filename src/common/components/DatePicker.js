import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {moderateScale} from 'react-native-size-matters';
import DateTimePickerModal from "react-native-modal-datetime-picker";
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

export const DatePicker = ({mode, iOSPickerTitle, onChange, viewStyle, labelStyle, label, date, value}) => {
  const [calendarVisibility, setCalendarVisibility] = useState(false);

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
      <DateTimePickerModal
        display = {"default"}
        headerTextIOS = {iOSPickerTitle}
        isVisible = {calendarVisibility}
        mode = {mode}
        date = {value ? value : date}
        onConfirm = {(value) => {
          setCalendarVisibility(false);
          onChange(value)
        }}
        onCancel = {() => {
          setCalendarVisibility(false);
        }}
        minimumDate = {new Date()}
      />
    </View>
  );
};
