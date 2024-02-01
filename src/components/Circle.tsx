import React from 'react';
import {StyleSheet, View, Text} from 'react-native';

const Circle = ({description}: {description: string}) => {
  return (
    <View style={styles.circle}>
      <Text>{description}</Text>
    </View>
  );
};

export default Circle;

const styles = StyleSheet.create({
  circle: {
    width: 100,
    height: 100,
    borderRadius: 100 / 2,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
