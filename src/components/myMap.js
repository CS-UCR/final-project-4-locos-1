import React from 'react';
import MapView, {Polygon, ProviderPropType, MAP_TYPES,} from 'react-native-maps';
import { StyleSheet, Text, View, Button, TouchableOpacity, Dimensions, Alert } from 'react-native';
import DrawerIcon from '../Navigation/assets/drawerNav/DrawerIcon';
import { Updates } from 'expo';
import * as firebase from 'firebase'
import {NavigationEvents} from 'react-navigation'
import Colors from '../constants/Colors'

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
      creating: false,
      currentUser : null,
      userId : null,
      rendered : false,
    }
  }
  
  static navigationOptions = () => {
    return {
        headerTitle: 'Study Spaces Map',
        headerRight: <DrawerIcon/>,
        headerStyle: {
          backgroundColor: Colors.headerBackgoundColor,
        },
        headerTitleStyle:{
          color: Colors.headerTitleColor,
        }
    };
  };


  finish(){
    const{polygons, editing} = this.state;
    if(editing.coordinates.length < 4){
      Alert.alert('Your study space is incomplete!');
    } else {
        //make a payload to push in /StudySpaces
        var payload = {
            owner : this.state.userId,
            point1 : this.state.editing.points[0],
            point2 : this.state.editing.points[1],
            //need to add a name for workspace or "personal" study space
            wsID : "Personal"

          }

        //push new study space
        firebase.database().ref("/StudySpaces/" + this.state.editing.studySpaceKey).update(payload)
        
        //push ref key to users
        var self = this;
        var newKey = this.state.editing.studySpaceKey
        firebase.database().ref("/Users/" + this.state.userId + "/").once('value').then(function(snapshot){

          var schema = snapshot.val()

          //if already have studyspaces
          if (snapshot.hasChild("StudySpaces")){
            // console.log("has child")
            var points = schema["StudySpaces"]
            points[newKey] = newKey
          }
          //if first study space
          else{
            // console.log("no children")
            var points = {}
            points[newKey] = newKey
          }
          firebase.database().ref("/Users/" + self.state.userId + "/StudySpaces").update(points)
        })

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
  }

  create(){
    this.setState({
      creating: true,
    })
  }

  delete(polygon){
    const{polygons} = this.state;
    //remove from database
    //remove from /StudySpaces
    firebase.database().ref('/StudySpaces/'+polygon.studySpaceKey + "/").remove()

    //remove from Users/id/studyspaces
    firebase.database().ref('/Users/'+this.state.userId + '/StudySpaces/'+ polygon.studySpaceKey).remove()
  
    this.state.polygons.splice(polygon.id, 1)
    for(i = polygon.id; i < this.state.polygons.length; i++){
      this.state.polygons[i].id = this.state.polygons[i].id - 1
    }
    id = id - 1
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
            personal: true,
            coordinates: [e.nativeEvent.coordinate],
            points: [e.nativeEvent.coordinate],
          },
          coord: {
            latitude: e.nativeEvent.coordinate.latitude,
            longitude: e.nativeEvent.coordinate.longitude,
          }
        });
      } else if(editing.coordinates.length < 4){
        var newKey = firebase.database().ref("/StudySpaces/").push().key

        this.setState({
          editing:{
            studySpaceKey: newKey,
            ...editing,
            coordinates:  [...editing.coordinates, {latitude: e.nativeEvent.coordinate.latitude, longitude: coord.longitude }, 
                          e.nativeEvent.coordinate, {latitude: coord.latitude, longitude: e.nativeEvent.coordinate.longitude}],
            points: [...editing.coordinates, e.nativeEvent.coordinate],
          },
        });
      } else{}
      console.log(this.state.polygons)
    }
  }

  onPolygonPress(polygon){
    if(polygon.personal){
      Alert.alert(
        'Do you wish to delete this polygon?',
        '',
        [
          {text: 'No'},
          {text: 'Yes', onPress: () => this.delete(polygon)},
        ],
      );
    }
    else{
      Alert.alert('Sorry, this study space is not personal, you can not delete it!');     
    }
  } 

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
          
          //
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
        //get user studyspaces
        firebase.database().ref('/Users/'+ user.uid + "/workspaces/").once('value').then(function(snapshot){          
          //all the workspaces that the user is part of
          var uWorkspaces = snapshot.val()

          for(var i = 0; i < uWorkspaces.length; i++){
            firebase.database().ref('/workspaces/'+ uWorkspaces[i] + "/StudySpaces/").once('value').then(function(snapshot){
              
              //all the study spaces that are in the workspaces that the user is part of
              var wStudySpaces = snapshot.val()
              //iterate polygons current state
              for(var i = 0 ; i < self.state.polygons.length; i++){
                //check if polygon key is in wStudySpaces
                if(self.state.polygons[i].studySpaceKey in wStudySpaces){
                  delete wStudySpaces[self.state.polygons[i].studySpaceKey]
                }
              }

              firebase.database().ref('/StudySpaces/').once('value').then(function(snapshot){
                renderingPolygons = self.state.polygons

                spaceCoordinates = snapshot.val()

                for(var key in wStudySpaces){
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
                console.log(renderingPolygons)
              })
            })
          }
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
        self.setState({
          currentUser: user,
          userId : user.uid}
        )}
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
              <Text>Add Personal Study Space</Text>
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