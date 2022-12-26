import React from 'react';
import { StyleSheet, View} from 'react-native';
import ErrorBoundary from 'react-native-error-boundary'
import { moderateScale } from 'react-native-size-matters';
import colors from '../colors';
import { CustomButton, Label } from '../components';
import strings from '../strings';
import ErrorIcon from 'react-native-vector-icons/MaterialIcons';

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: colors.base,
    alignItems: 'center',
    justifyContent: 'space-evenly'
  },
  labelStyle: {
    color: colors.defaultDark,
    fontSize: moderateScale(18),
    fontFamily: 'Poppins-SemiBold',
    marginBottom: moderateScale(50)
  },
  buttonStyle: {
    width: '50%',
    alignSelf: 'center'
  },
});

export default ErrorBoundaryComponent = ({children}) => {
  
  const errorHandler = (error, stackTrace) => {
    console.log("Error Boundary", error, stackTrace);
  }

  const fallback = ({error, resetError}) => (
    <View style = {styles.container}>
      <View style = {{alignItems: 'center'}}>
        <Label title = {strings.ErrorBoundary.somethingWrong} labelStyle = {styles.labelStyle}/>
        <ErrorIcon name="error-outline" size = {moderateScale(100)}/>
      </View>
      <CustomButton 
        title = {strings.ErrorBoundary.relaunch}
        onPress = {resetError}
        buttonStyle = {styles.buttonStyle}
      />
    </View>
  )
  
  return (
    <ErrorBoundary 
      onError={errorHandler}
      FallbackComponent={fallback}
    >
      {children}
    </ErrorBoundary>
  );
};
