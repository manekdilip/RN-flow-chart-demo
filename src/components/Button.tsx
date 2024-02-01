import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';

const Button = (props: {
  text: string;
  isDisabled?: boolean;
  onPress: () => void;
}) => {
  const {text, isDisabled, onPress} = props;
  const color = isDisabled ? 'grey' : 'white';
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, {backgroundColor: color}]}>
      <Text>{text}</Text>
    </TouchableOpacity>
  );
};
export default Button;

const styles = StyleSheet.create({
  button: {
    padding: 8,
    borderWidth: 1,
    borderRadius: 16,
    margin: 6,
    height: 48,
    justifyContent: 'center',
  },
});
