import React from 'react';
import MapView, {Permissions, Marker, Polygon, ProviderPropType,} from 'react-native-maps';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import * as Location from 'expo-location';


export default class myMap extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      latitude: 33.9737,
      longitude: 117.3281,
      polygons:[]    
    }
  }
  componentDidMount(){
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

  _onPress = () =>{
    
  }

  render() {
    return (
      <View style={styles.mapStyle}>
        <MapView
          style={styles.mapStyle}
          showsUserLocation={true}
          showsMyLocationButton={true}
          region={{
            latitude: this.state.latitude,
            longitude: this.state.longitude,
            latitudeDelta: 0.09,
            longitudeDelta: 0.09 }}>
          <Polygon 
            coordinates={[
              {name: '1', latitude: this.state.latitude + 0.01, longitude: this.state.longitude - 0.01},
              {name: '2', latitude: this.state.latitude + 0.01, longitude: this.state.longitude + 0.01},
              {name: '3', latitude: this.state.latitude - 0.01, longitude: this.state.longitude + 0.01},
              {name: '4', latitude: this.state.latitude - 0.01, longitude: this.state.longitude - 0.01},
            ]}
            strokeWidth={2}
            strokeColor={'red'}
            fillColor={'hsla(360, 100%, 50%, 0.5)'}>
          </Polygon> 
        </MapView>
        <View style={styles.buttonContainerStyle}>
          <TouchableOpacity 
            style={styles.buttonBoxStyle}
            onPress={this._onPress}>
            <Text style={styles.buttonTextStyle}>
              New Study Space
            </Text>
          </TouchableOpacity> 
        </View> 
      </View>                                                                                                                                                                                                    
    );
  }
}

const styles = StyleSheet.create({
  mapStyle: {
    flex: 1
    //  width: Dimensions.get('window').width,
    //  height: Dimensions.get('window').height - 105,
  },
  buttonContainerStyle:{
    position: 'absolute',
    alignSelf: 'center',
     bottom: 20,
  },
  buttonBoxStyle:{
    alignSelf:'center',
    alignItems: 'center',
    backgroundColor: '#hsla(60, 100%, 50%, 0.5)',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 12,
    width: 100,

  },
  buttonTextStyle:{
    textAlign: 'center',
    fontWeight: '900',
    color: 'black'
  },
});
