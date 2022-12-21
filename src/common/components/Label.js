import * as React from 'react';
import { StyleSheet, Text } from 'react-native';
import { moderateScale } from 'react-native-size-matters';

const styles = StyleSheet.create({
    labelStyle: {
        alignSelf: 'center',
        fontSize: moderateScale(22),
        color: '#000000'
    }
});

export const Label = (props) => {

    return (
        <Text style={[styles.labelStyle, props.labelStyle]}> {props.title} </Text>
    );
};