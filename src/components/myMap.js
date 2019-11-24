import React from 'react';
import MapView, {Polygon, ProviderPropType, MAP_TYPES,} from 'react-native-maps';
import { StyleSheet, Text, View, Button, TouchableOpacity, Dimensions, Alert } from 'react-native';
import DrawerIcon from '../Navigation/assets/drawerNav/DrawerIcon';
import { Updates } from 'expo';

//TO DO:
/*
1.-Be able to make polygons stay on the map everytime it is reopened (firebase?)                              - P1
4.-Be able to delete polygons                                                                                 - P27                                                                                               - P6
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
      // polypoints: [],
      polygons: [],
      editing: null,
      creating: false,
    }
  }
  
  static navigationOptions = () => {
    return {
        headerRight: <DrawerIcon/>,
        headerStyle: {
            backgroundColor: '#E0E0E0',
        },
    };
  };

  finish(){
    const{polygons, editing} = this.state;
    if(editing.coordinates.length < 4){
      Alert.alert('Your study space is incomplete!');
    } else {
      this.setState({
        polygons: [...polygons, editing],
        editing: null,
        creating: false,
      });
    }
  }

  cancel(){
    const{polygons} = this.state;
    id = id - 1
    this.setState({
      polygons: [...polygons],
      editing: null,
      creating: false,
    })
    console.log(polygons)
  }

  create(){
    this.setState({
      creating: true,
    })
  }

  delete(polygon){
    const{polygons} = this.state;
    console.log(polygon.id)
    this.state.polygons.splice(polygon.id, 1)
    for(i = polygon.id; i < this.state.polygons.length; i++){
      this.state.polygons[i].id = this.state.polygons[i].id - 1
    }
    this.setState({
      polygons: [...polygons]
    })
  }

  onPress(e){
    const{editing, coord, creating} = this.state;
    if(creating == true){
      if(!editing){
        this.setState({
          editing: {
            id: id++,
            coordinates: [e.nativeEvent.coordinate],
            points: [e.nativeEvent.coordinate],
          },
          coord: {
            latitude: e.nativeEvent.coordinate.latitude,
            longitude: e.nativeEvent.coordinate.longitude,
          }
        });
      } else if(editing.coordinates.length < 4){
        this.setState({
          editing:{
            ...editing,
            coordinates:  [...editing.coordinates, {latitude: e.nativeEvent.coordinate.latitude, longitude: coord.longitude }, 
                          e.nativeEvent.coordinate, {latitude: coord.latitude, longitude: e.nativeEvent.coordinate.longitude}],
            points: [...editing.coordinates, e.nativeEvent.coordinate],
          },
        });
      } else{} 
    }
  }

  onPolygonPress(polygon){
    Alert.alert(
      'Do you wish to delete this polygon?',
      '',
      [
        {text: 'No'},
        {text: 'Yes', onPress: () => this.delete(polygon)},
      ],
    );
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
          showsMyLocationButton={true}
          
          initialRegion={this.state.initialRegion}
          onPress={e => this.onPress(e)}
          >
            {this.state.polygons.map(polygon => (
              <Polygon
                key={polygon.id}
                tappable = {true}
                coordinates={polygon.coordinates}
                strokeColor={'red'}
                fillColor={'hsla(240, 100%, 50%, 0.5)'}
                strokeColor={1}
                onPress={() => this.onPolygonPress(polygon)}
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
          {!this.state.creating && (
            <TouchableOpacity
              onPress={() => this.create()}
              style={styles.buttonStyle}
            >
              <Text>Create Study Space</Text>
            </TouchableOpacity>
          )}
          {this.state.editing && (
            <TouchableOpacity
              onPress={() => this.finish()}
              style={styles.buttonStyle}
            >
              <Text>Finish</Text>
            </TouchableOpacity>
          )}
          {this.state.editing && (
            <TouchableOpacity
              onPress={() => this.cancel()}
              style={styles.buttonStyle}
            >
              <Text>Cancel</Text>
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
  },
  mapStyle: {
    ...StyleSheet.absoluteFillObject,
  },
  buttonContainerStyle:{
    flexDirection: 'row',
    justifyContent: 'space-around',
    bottom: 30,
    marginHorizontal: 80
  },
  buttonStyle:{
    backgroundColor: '#hsla(60, 100%, 50%, 0.5)',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,  
  
  },

});