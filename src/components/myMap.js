import React from 'react';
import MapView, {Permissions, Marker} from 'react-native-maps';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import * as Location from 'expo-location';

export default class myMap extends React.Component {

  // //ASK USER IF HE/SHE ALLOWS TO ACCES DEVICES LOCATION
  // async componentDidMount(){
  //   const {status} = await Location.hasServicesEnabledAsync()
  //   //const {status} = await Permissions.getAsync(Permissions.LOCATION)
  //   if(status != 'granted'){
  //     const response = await Location.requestPermissionsAsync()
  //     //const response = await Permissions.askAsync(Permissions.LOCATION)
  //   }
  // }  

  constructor(props) {
    super(props);
    this.state = {
      latitude: 0,
      longitude: 0,
      error: null
    }
  }

  componentDidMount(){
    navigator.geolocation.getCurrentPosition(
      position =>{
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null
        })
      },
      error => this.setState({error: error.message}),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 10000}
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <MapView
          showsUserLocation={true} 
          style={styles.mapStyle}
          initialRegion={{
            latitude: this.state.latitude,
            longitude: this.state.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
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