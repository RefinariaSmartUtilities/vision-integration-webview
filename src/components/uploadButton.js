import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export const UploadButton = (props) => {
  const { counter, onPress, load = false } = props;
  return (
    <TouchableOpacity style={styles.container} onPress={!load ? onPress : ()=>{}}>
      {counter > 0 &&
        <View style={styles.badge}>
          <Text style={styles.label}>{counter < 100 ? counter : '•'}</Text>
        </View>
      }
      {load
        ? <ActivityIndicator color={'white'}/>
        : <MaterialCommunityIcons name="cloud-upload" size={40} color="white" />
      }
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: '#2B7032',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 20,
    right: 20,
  },
  badge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#F00',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: -5,
    right: -5,
  },
  label: {
    color: 'white',
    fontSize: 12,
  }
});