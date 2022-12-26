import * as React from 'react';
import { StyleSheet, Text } from 'react-native';
import { moderateScale } from 'react-native-size-matters';

const styles = StyleSheet.create({
    labelStyle: {
        alignSelf: 'center',
        fontSize: moderateScale(22),
        color: '#000000',
        fontFamily: 'Poppins-SemiBold'
    }
});

export const Label = ({title, labelStyle}) => {

    return (
        <Text style={[styles.labelStyle, labelStyle]}> {title} </Text>
    );
};