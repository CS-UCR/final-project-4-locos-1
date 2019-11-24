import React from 'react';
import MapView, {Polygon, ProviderPropType, MAP_TYPES,} from 'react-native-maps';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import DrawerIcon from '../Navigation/assets/drawerNav/DrawerIcon';

//TO DO:
/*
1.-Be able to make polygons stay on the map everytime it is reopened (firebase?)                              - P1
2.-Be able to make polygons by using only two points (or at least 4 only)                                     - P0
3.-Be able to fix distortions on the polygons                                                                 - P4
4.-Be able to delete polygons                                                                                 - P2
5.-Try to create a button to start creating polyongs rather than just starting when clicking in the map       - P3
6.-Have a button to go back to users location                                                                 - P5
7.-Edit colors                                                                                                - P6
*/

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height; 
const LATITUDE = 33.9737;       //UC RIVERSIDE LATITUDE
const LONGITUDE = -117.3281;    //UC RIVERSIDE LONGITUDE
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
let id = 0;

export default class myMap extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      region:{
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,

      },

      coord:{
        latitude: null,
        longitude: null,
      },

      polygons: [],
      editing: null,
    }
  }
  
  finish(){
    const{polygons, editing} = this.state;
    this.setState({
      polygons: [...polygons, editing],
      editing: null,
    });
  }

  static navigationOptions = () => {
    return {
        headerRight: <DrawerIcon/>,
        headerStyle: {
            backgroundColor: '#E0E0E0',
        },
    };
  };

  onPress(e){
    const{editing, coord} = this.state;
    if(!editing){
      this.setState({
        editing: {
          id: id++,
          coordinates: [e.nativeEvent.coordinate],
        },
        coord: {
          latitude: e.nativeEvent.coordinate.latitude,
          longitude: e.nativeEvent.coordinate.longitude,
        }
      });
    } else{
      this.setState({
        editing:{
          ...editing,
          coordinates:  [...editing.coordinates, {latitude: e.nativeEvent.coordinate.latitude, longitude: coord.longitude }, 
                        e.nativeEvent.coordinate, {latitude: coord.latitude, longitude: e.nativeEvent.coordinate.longitude}],
        },
      });
    } 
  }

  componentDidMount(){
    navigator.geolocation.getCurrentPosition(
      position =>{
        this.setState({
          initialRegion:{
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA
          }
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
          provider={this.props.provider}
          style={styles.mapStyle}
          //mapType = {MAP_TYPES.HYBRID}       //CHOOSE THE TYPE OF MAP YOU WANT TO USE
          showsUserLocation={true}
          initialRegion={this.state.initialRegion}
            onPress={e => this.onPress(e)}
          >
            {this.state.polygons.map(polygon => (
              <Polygon
                key={polygon.id}
                coordinates={polygon.coordinates}
                strokeColor={'red'}
                fillColor={'hsla(240, 100%, 50%, 0.5)'}
                strokeColor={1}
              />
            ))}
            {this.state.editing && (
              <Polygon
                key={this.state.editing.id}
                coordinates={this.state.editing.coordinates}
                strokeColor={'red'}
                fillColor={'hsla(240, 100%, 50%, 0.5)'}
                strokeColor={1}
              />
            )}
        </MapView>
        <View style={styles.buttonContainerStyle}>
          {this.state.editing && (
            <TouchableOpacity
              onPress={() => this.finish()}
              style={styles.buttonStyle}
            >
              <Text>Finish</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>                                                                                                                                                                                                    
    );
  }
}

myMap.propTypes ={
  provider: ProviderPropType,
};

const styles = StyleSheet.create({
  container:{
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  mapStyle: {
    ...StyleSheet.absoluteFillObject,
  },
  buttonContainerStyle:{
    position: 'absolute',
    alignSelf: 'center',
    bottom: 20,
  },
  buttonStyle:{
    backgroundColor: '#hsla(60, 100%, 50%, 0.5)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,    
  },

});