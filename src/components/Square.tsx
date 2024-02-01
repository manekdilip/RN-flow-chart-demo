import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

const Square = ({description}: {description: string}) => {
  return (
    <View style={styles.square}>
      <Text>{description}</Text>
    </View>
  );
};

export default Square;

const styles = StyleSheet.create({
  square: {
    width: 100,
    height: 100,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
