import * as React from 'react';
import { StyleSheet, Text } from 'react-native';
import { moderateScale } from 'react-native-size-matters';

const styles = StyleSheet.create({
    labelStyle: {
        fontSize: moderateScale(14),
        fontFamily: 'Poppins-SemiBold'
    }
});

export const Label = ({title, labelStyle}) => {

    return (
        <Text style = {[styles.labelStyle, labelStyle]}> {title} </Text>
    );
};