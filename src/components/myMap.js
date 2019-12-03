import React from 'react';
import MapView, {Polygon, ProviderPropType, MAP_TYPES,} from 'react-native-maps';
import { StyleSheet, Text, View, Button, TouchableOpacity, Dimensions, Alert } from 'react-native';
import DrawerIcon from '../Navigation/assets/drawerNav/DrawerIcon';
import { Updates } from 'expo';
import * as firebase from 'firebase'
import {NavigationEvents} from 'react-navigation'

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
      polygons: [],
      currentUser : null,
      userId : null,
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

  makeCoordinates(point1, point2){
    coordinates = []

    coordinates.push(
      {latitude : point1.latitude,
      longitude : point1.longitude}
    )
    coordinates.push(
      {latitude : point2.latitude,
      longitude : point1.longitude}
    ) 
    coordinates.push(
      {latitude : point2.latitude,
      longitude : point2.longitude}
    )
    coordinates.push(
      {latitude : point1.latitude,
      longitude : point2.longitude}
    )
    return coordinates
  }

  async loadUserPolygons(){
    //get all the polygons the user is a part of
    //take out the ones already in this.state.polygons
    //update state of this.state.polygons
    var self = this
    await firebase.auth().onAuthStateChanged(function(user){
      if(user){
        //get user studyspaces
        firebase.database().ref('/Users/'+ user.uid + "/StudySpaces/").once('value').then(function(snapshot){
          
          var spaces = snapshot.val()

          //iterate polygons current state
          for(var i = 0 ; i < self.state.polygons.length; i++){
            //check if polygon key is in spaces
            if(self.state.polygons[i].studySpaceKey in spaces){
              delete spaces[self.state.polygons[i].studySpaceKey]
            }
          }

          firebase.database().ref('/StudySpaces/').once('value').then(function(snapshot){
            renderingPolygons = self.state.polygons

            spaceCoordinates = snapshot.val()
            //add new spaces
            for(var key in spaces){
                var polygon = {
                    id : id,
                    coordinates : self.makeCoordinates(spaceCoordinates[key].point1, spaceCoordinates[key].point2),
                    points : [spaceCoordinates[key].point1,spaceCoordinates[key].point2],
                    studySpaceKey : key
                }
                //put polygon in polygons state
                renderingPolygons.push(polygon)
                id+=1
            }

            self.setState({
              polygons : renderingPolygons
            })
          })
        })   
      }
      else{
      }
    })
  }

  componentDidMount(){
    //get user information
    var self = this
    firebase.auth().onAuthStateChanged(function(user){
      if(user){
        //logged on
        self.setState({currentUser: user,
                        userId : user.uid})
      }
      else{
        //not logged on
        console.log("no user logged on")
      }
    })

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
        <NavigationEvents
          onWillFocus={() => {
            //rerender and display all polygons
            this.loadUserPolygons()
          }}
        />
        <MapView
          provider={this.props.provider}
          style={styles.mapStyle}
          //mapType = {MAP_TYPES.HYBRID}       //CHOOSE THE TYPE OF MAP YOU WANT TO USE
          showsUserLocation={true}
          showsMyLocationButton={true}
          initialRegion={this.state.initialRegion}
          >
            {this.state.polygons.map(polygon => (
              <Polygon
                key={polygon.id}
                coordinates={polygon.coordinates}
                strokeColor={'red'}
                fillColor={'hsla(240, 100%, 50%, 0.5)'}
                strokeColor={1}
                onPress={() => this.onPolygonPress(polygon)}
              />
            ))}
        </MapView>
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
});