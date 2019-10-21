import React from 'react';
import {StyleSheet, Text, View } from 'react-native';
import {credentials} from './src/config';

export default function App() {

  credentials(); //firebase api key config
  
  return (
    <View style={styles.container}>
      <Text>updated 7</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
