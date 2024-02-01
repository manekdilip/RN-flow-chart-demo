import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';

const FlowList = ({flows, onSelect, onCreate}) => {
  return (
    <View style={styles.flowContainer}>
      {flows?.map(item => {
        return (
          <TouchableOpacity
            style={styles.flowCard}
            onPress={() => onSelect(item)}>
            <Text>{item.name}</Text>
          </TouchableOpacity>
        );
      })}
      {!flows?.length && (
        <TouchableOpacity style={styles.createButton} onPress={onCreate}>
          <Text>Create Flow</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default FlowList;

const styles = StyleSheet.create({
  flowContainer: {
    flex: 1,
    padding: 8,
  },
  flowCard: {
    height: 48,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 8,
  },
  createButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    height: 48,
    borderRadius: 16
  }
});
