import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

const Diamond = ({description}: {description: string}) => {
  return (
    <View style={styles.diamond}>
      <Text style={styles.text}>{description}</Text>
    </View>
  );
};

export default Diamond;

const styles = StyleSheet.create({
  diamond: {
    width: 100,
    height: 100,
    backgroundColor: 'red',
    transform: [{rotate: '45deg'}],
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    transform: [{rotate: '-45deg'}],
  },
});
