import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {moderateScale} from 'react-native-size-matters';
import DateTimePickerModal from "@react-native-community/datetimepicker";

const styles = StyleSheet.create({
  labelStyle: {
    marginBottom: moderateScale(10),
    fontSize: moderateScale(15),
    fontWeight: '500',
    color: '#000000',
    fontFamily: 'Poppins-Medium'
  },
  textStyle: {
    fontSize: moderateScale(14),
    color: '#000000',
    fontFamily: 'Poppins-Regular'
  },
  validationLabelStyle: {
    fontSize: moderateScale(15),
    fontWeight: '500',
    color: '#FE295C',
    paddingVertical: moderateScale(6)
  },
  textWrapperStyle: {
    minHeight: moderateScale(50),
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: moderateScale(15),
    borderColor: "#CEEAFF",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderRadius: moderateScale(10),
  },
});

export const DatePicker = (props) => {
  const [calendarVisibility, setCalendarVisibility] = useState(false);

  const handleDateConfirm = (event, newDate) => {
        const selectedDate = newDate || new Date();
        setCalendarVisibility(false);
        props.onChange(selectedDate)
  };  

  return (
    <View style={[styles.viewStyle, props.viewStyle]}>
      <Text style={[styles.labelStyle, props.labelStyle]}> {props.label} </Text>

      <TouchableOpacity onPress = {() => {
        setCalendarVisibility(true);
      }}
      activeOpacity = {1}
      style = {{ ...styles.textWrapperStyle}}>
        <Text style = {styles.textStyle}>
          {props.value ? props.value.toLocaleDateString() : ''}
        </Text>
      </TouchableOpacity>
      {calendarVisibility ? 
      <DateTimePickerModal
        mode = {props.mode}
        value = {props.value ? props.value : new Date()}
        onChange = {handleDateConfirm}
        minimumDate = {new Date()}
        animationType = "fade"
       /> 
       : 
      null}
      {props.error && (
        <Text style = {{ ...styles.validationLabelStyle, ...props.validationLabelStyle }}> {props.error} </Text>
      )}
    </View>
  );
};
