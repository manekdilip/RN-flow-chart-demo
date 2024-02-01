import React from 'react';
import {StyleSheet, View} from 'react-native';

const Line = ({transform, top}: {transform?: string; top?: number}) => {
  const transformDeg = `${transform}deg`;
  return (
    <View
      style={[
        styles.line,
        {marginTop: top, transform: [{rotate: transformDeg}]},
      ]}
    />
  );
};

export default Line;

const styles = StyleSheet.create({
  line: {
    width: 1,
    height: 60,
    backgroundColor: 'blue',
    transform: [{rotate: 'deg'}],
    left: '13%',
  },
});
