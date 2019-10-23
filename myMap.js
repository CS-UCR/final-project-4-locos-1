import React from 'react';
import MapView, {Permissions} from 'react-native-maps';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import * as Location from 'expo-location';

export default class App extends React.Component {

  state = {
    latitude: null,
    longitude: null
  }


  //ASK USER IF HE/SHE ALLOWS TO ACCES DEVICES LOCATION
  async componentDidMount(){
      const {status} = await Location.hasServicesEnabledAsync()
      //const {status} = await Permissions.getAsync(Permissions.LOCATION)
    if(status != 'granted'){
      const response = await Location.requestPermissionsAsync()
      //const response = await Permissions.askAsync(Permissions.LOCATION)
    }
  }

  

  render() {
    return (
        <MapView style={styles.mapStyle}
          Region = {{
            latitudeDelta: 0.0922,
            longitudeDelta:  0.0421,
          }}
        />
    );
  }
}

const styles = StyleSheet.create({
  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});