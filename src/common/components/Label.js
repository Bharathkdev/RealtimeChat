import * as React from 'react';
import { StyleSheet, Text } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import colors from '../colors';

const styles = StyleSheet.create({
    labelStyle: {
        alignSelf: 'center',
        fontSize: moderateScale(22),
        color: colors.defaultDark,
        fontFamily: 'Poppins-SemiBold'
    }
});

export const Label = (props) => {

    return (
        <Text style={[styles.labelStyle, props.labelStyle]}> {props.title} </Text>
    );
};