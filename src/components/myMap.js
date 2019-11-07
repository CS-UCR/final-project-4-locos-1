import React from 'react';
import MapView, {Permissions, Marker} from 'react-native-maps';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import * as Location from 'expo-location';

export default class myMap extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      latitude: 0,
      longitude: 0,
    }
  }

  async componentDidMount(){
   
    const {status} = await Location.hasServicesEnabledAsync()
    if(status != 'granted'){
      const response = await Location.requestPermissionsAsync()
    }

    navigator.geolocation.getCurrentPosition(
      position =>{
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      error => this.setState({error: error.message}),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 10000}
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <MapView
          style={styles.mapStyle}
          showsUserLocation={true}
          region={{
            latitude: this.state.latitude,
            longitude: this.state.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01 
          }}/>
      </View>                                                                                                                                                                                                                         
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',    
  },
  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height - 80,
  },
});