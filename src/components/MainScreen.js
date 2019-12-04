import React, {Component} from 'react';
import {View, Text, Button, Platform, TouchableHighlight,StyleSheet, Picker, Image} from 'react-native';
import DrawerIcon from '../Navigation/assets/drawerNav/DrawerIcon';

import {ScrollView} from 'react-native'

import * as firebase from 'firebase'
import * as Location from 'expo-location'
import * as Permisisons from 'expo-permissions';
import { TouchableOpacity } from 'react-native-gesture-handler';

import SpaceCard from './SpaceCard'
import {NavigationEvents} from 'react-navigation'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 430,
    alignItems: 'center',
    justifyContent: 'flex-end',
    color: '#DDF6F6'
  },
  userNameText:{
      fontSize: 15,
      textAlign: 'center',
  },
  workspaceNameText:{
    fontSize: 20,
    textAlign: 'center',
},
  timerButton: {
    marginBottom: 120,
    width: 180,
    height: 100,
    alignItems: 'center',
    backgroundColor: '#feccc1',
    borderWidth: 2,
    borderColor: "grey"
  },
  timerButtonText: {
    textAlign: 'center',
    padding: 5,
    fontSize: 35,
    color: '#505050',
    fontWeight: 'bold'
  },
  timerText:{
    fontSize: 30,
    color: 'grey'
  }
});

export default class MainScreen extends Component {

  constructor(props){

    super(props);

    this.state={
        timer: null,
        hourCount: '00',
        minCount: '00',
        secCount: '00',
        trueStart: null,
        showTimerText: false,
        trueTime: null,
        isStarted: false,
        timerButtonText: 'Start\nStudying',

        //using user information
        userId : null,
        currentUser : null,
        location : null,
        errorMessage : null,

        //using study space information
        inBoundSpaces : [],
        renderList : [],

        activeSessions : [],

    }

    this.initialState = this.state
  }

  static navigationOptions = () => {
    return {
        headerRight: <DrawerIcon/>,
        headerStyle: {
            backgroundColor: '#E0E0E0',
        },
    };
  };


  _getLocationAsync = async () => {

    let location = await Location.getCurrentPositionAsync({

      accuracy : Location.Accuracy.BestForNavigation
    });
    this.setState({ location: location });
  };

  //coordinates2 must be upper left coordinates
  //coordinates1 must be bottom right coordinates
  //currentPos is the position of the user  
  ifInBound(currentPos, coordinates1, coordinates2){
      
      //check for inverted squares
      if(coordinates1.latitude < coordinates2.latitude){
        //swap
        var temp = coordinates1
        coordinates1 = coordinates2
        coordinates2 = temp
      }
      else{

      }

    if((currentPos.coords.latitude <= coordinates1.latitude) && (currentPos.coords.latitude >= coordinates2.latitude)){
      console.log("latitude inbound")
      if((currentPos.coords.longitude >= coordinates1.longitude) && (currentPos.coords.longitude <= coordinates2.longitude)){
        console.log("longitude inbound")
        return true
      }
    }
    return false

  }
  async getInboundStudySpaces(){

    //update location
    await this._getLocationAsync() //updates this.state.location

    // console.log("Users location")
    // console.log(this.state.location)


    var self = this
    var myList = []
    var renderList = {}
    //check study spaces and workspaces and see if there are any inbound study spaces
    await firebase.database().ref('/Users/' + this.state.userId).once('value').then(async function(snapshot){

      var userInfo = snapshot.val()
      
      //collect study spaces from workspaces
      if(snapshot.hasChild("Workspaces")){
        
        
      }

      if(snapshot.hasChild("StudySpaces")){

        await firebase.database().ref('/StudySpaces/').once('value').then(function(snapshot){

          var allStudySpaces = snapshot.val()
  
          //iterate user's studyspaces and retrieve points
          for(var key in userInfo["StudySpaces"]){
            console.log("current key: " + key)
          
            //check if studyspace has key
            if(snapshot.hasChild(key)){
              
              console.log("/studyspaces has key")
              if (self.ifInBound(self.state.location , allStudySpaces[key].point2,allStudySpaces[key].point1)){

                console.log("inbound")
                var payload = {

                  ref: allStudySpaces[key]["refName"],
                  imageLink: '../../assets/location-symbol.jpg'
                  
                }
                myList.push({
                  key : key,
                  payload: payload,
                  highlight: false,
                  style: {backgroundColor : 'transparent',
                  borderColor : '#404040',
                  
                  },
                  type : 1
                })
                
                //get unique list of refName
                renderList[payload.ref]= {
                  key : key,
                  payload: payload,
                  highlight: false,
                  style: {backgroundColor : 'transparent',
                  borderColor : '#404040',
                  
                  },
                  type: 1 
                }


                
              }
              
            }
            
          }

          // if(myList.length > 0){
          //   renderList.push(myList[0])
          // }
          
        })        

      }          

    })

    
    //convert dictionary into a list
    console.log(renderList)
    var outputList = []
    for(var key in renderList){
      outputList.push(renderList[key])
    }

    console.log("outputList")
    console.log(outputList)
    self.setState({
      inBoundSpaces :myList,
      renderList: outputList      
    })


  }
  componentDidMount(){

    var self = this
    firebase.auth().onAuthStateChanged(function(user){

      if(user){
        //logged

        
        self.setState({
          currentUser: user,
          userId : user.uid,
        })

        //self.getInboundStudySpaces()

      }
      else{
        //no one logged
      }

    })


  }
//TIMER ---
  onPressTimerButton = () => {
  
    var self = this
    if(!this.state.isStarted){
        var startTime = new Date()
        this.state.trueStart=startTime.getTime()
       

        var self = this
        var locationInterval = 0

        //record active Sessions
        var myActiveSessions = []
        var myList = this.state.renderList

        console.log("myList")
        console.log(myList)

        
        for(var i =0; i< myList.length; i++){
          console.log(myList[i]) 
          if(myList[i].highlight == true){
            //if highlighted -> stores info in active sessions
            myActiveSessions.push(myList[i])

          }

        }
        //update storage variable without rerendering
        this.state.activeSessions = myActiveSessions
        

        let timer = setInterval((interval) => {
    
            console.log(locationInterval)
            if(locationInterval > 2){
              locationInterval = 0
              self._getLocationAsync() 
              console.log("current Location")
              console.log(self.state.location)
              
            }
            locationInterval += 1

            var num = (Number(self.state.secCount) + 1).toString(),
                mCount = self.state.minCount,
                hCount = self.state.hourCount;
    
            if (Number(self.state.secCount) == 59) {
                mCount = (Number(self.state.minCount) + 1).toString();
                num = '00';
            }

            if (Number(self.state.minCount) == 59) {
                hCount = (Number(self.state.hourCount) + 1).toString();
                mCounnt = '00';
            }
            
            self.setState({
                hourCount: hCount.length == 1 ? '0' + hCount : hCount,
                minCount: mCount.length == 1 ? '0' + mCount : mCount,
                secCount: num.length == 1 ? '0' + num : num,
            });

        }, 1000);
        
        this.setState({ timer });
        this.setState({
            isStarted : true,
            showTimerText: true,
            timerButtonText: 'Stop\nStudying'
        })
    }else if(this.state.isStarted){

        //end time
        var endTime = new Date()

        this.state.trueTime = endTime.getTime()-this.state.trueStart
        
        //store in firebase
        //can be in multilple study spaces
        var payload = {
          date: endTime,
          hours : this.state.hourCount,
          mins : this.state.minCount,
          secs : this.state.secCount,
        }

        console.log("going in storeReports")
        console.log(this.state.activeSessions)
        this.storeReports(payload)

        //store in /Reports/Workspaces/WorkspaceID/StudySpaceID
        alert('Time Studied: ' + (this.state.trueTime/(1000 * 60)).toFixed(2) + "min")
        clearInterval(this.state.timer)

        

        this.setState({
            isStarted: false,
            showTimerText: false,
            hourCount: '00',
            minCount: '00',
            secCount: '00',
            timerButtonText: 'Start\nStudying'
        });
    }

  }

  async storeReports(payload){        

      for(var i = 0 ;  i< this.state.activeSessions.length ;i++){
          console.log("activeSessions[i]")
          console.log(this.state.activeSessions)
          if(this.state.activeSessions[i].type == 1){ 

            var self = this
            await firebase.database().ref('/Reports/Users/'+this.state.userId + '/').once('value').then(async function(snapshot){

              var reports = snapshot.val()
              console.log(reports)
              if(reports){
                reports.push(payload)
              }
              else{
                console.log("null")
                reports = []
                reports.push(payload)
                
              }
              await firebase.database().ref('/Reports/Users/'+self.state.userId + '/').update(reports)
              
              

            })
          }
          else if(this.state.activeSessions[i].type == 2){ 
            await firebase.database().ref('/Reports/Workspaces/' + this.state.activeSessions[i].workspaceID +"/" +this.state.userId +'/').update(payload)
          }
        
        
      }
  }


  toggleHighlight(index){
    console.log(this.state.renderList)
    var myArray = this.state.renderList[index]
    var background = myArray.style.backgroundColor

    if(background == 'transparent'){
      myArray.style = {
        backgroundColor : '#fafad2',
        borderColor : '#404040',
      }
      myArray.highlight = true
    }
    else{
      myArray.style = {
        backgroundColor : 'transparent',
        borderColor : '#404040',
      }
      myArray.highlight = false
    }
    console.log("====after manipulation====")
    console.log(myArray)

    var newList = this.state.renderList
    newList[index] = myArray
    this.setState({
      renderList: newList
    })
  }
  render() {
    console.log("rerender with scrollview with center text ")
    return (
      <View style={styles.container}>
        <NavigationEvents
        onWillFocus={() => {
          console.log("tab change")

          var newState = this.initialState
          newState.userId = this.state.userId
          newState.currentUser = this.state.currentUser
          this.setState(this.newState);

          this.getInboundStudySpaces()

          
        }}
      />

      <View style={{width: 300, height: 300, textAlign: 'center'}}>
        <Text style = {styles.workspaceNameText}>Workspaces</Text>
        <ScrollView
        
        showsHorizontalScrollIndicator= {false}
        >
        {this.state.renderList.slice(0,this.state.renderList.length).map((item,key) => 
          
          <TouchableOpacity 
          style={{ justifyContent: 'center', }}
          onPress= {()=>{
            console.log("item")
            console.log(item)
            console.log("key")
            console.log(key)
            this.toggleHighlight(key)
          }}
          key = {key}
          style = {item.style}
          >
          <View style = {{flexDirection: 'row', justifyContent: 'center', alignItems: 'center',}}>
          <Image style = {{width :   25, height : 25}} source = {require("../../assets/location-symbol.jpg")}/>
          <Text  style ={{textAlign : 'center'}}> {item.payload.ref}</Text>
          </View>
          </TouchableOpacity>

        )}

        </ScrollView>

      </View>
      <View style={{height: 40}}>
     {this.state.showTimerText && <Text style={styles.timerText}>{this.state.hourCount} : {this.state.minCount} : {this.state.secCount}</Text>}
    </View>
        <TouchableHighlight onPress={this.onPressTimerButton} underlayColor="white">    
            <View style={[styles.timerButton, {backgroundColor: this.state.isStarted ? '#ECB4B4' : '#B4ECB4'}]}>
            <Text style={styles.timerButtonText}> {this.state.timerButtonText}</Text>
            </View>
        </TouchableHighlight>
      </View>


    );
  }
}