import React, {Component} from 'react';
import {View, Text, Button, Platform, TouchableHighlight,StyleSheet} from 'react-native';
import DrawerIcon from '../Navigation/assets/drawerNav/DrawerIcon';

import * as firebase from 'firebase'
import * as Location from 'expo-location'
import * as Permisisons from 'expo-permissions';


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

        userId : null,
        currentUser : null,
        location : null,
        errorMessage : null,
        inbound : []
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


  _getLocationAsync = async () => {

    let location = await Location.getCurrentPositionAsync({

      accuracy : Location.Accuracy.BestForNavigation
    });
    this.setState({ location: location });
  };

  async getInboundStudySpaces(){

    //update location
    await this._getLocationAsync()

    //check study spaces and workspaces and see if there are any inbound study spaces
    firebase.database().ref('/Users/' + this.state.userId).once('value').then(async function(snapshot){

      var aggregateList = {}
      //collect study spaces from workspaces
      if(snapshot.hasChild("Workspaces")){
      
        
      }
      if(snapshot.hasChild("StudySpaces")){
        // for(var key in snapshot["StudySpaces"].val()){
        //   //look up studyspace
        //   await firebase.database()
        //   //get coordinates
        // }
        

      }

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

        self.getInboundStudySpaces()

      }
      else{
        //no one logged
      }

    })


  }
//TIMER ---
  onPressTimerButton = () => {
    console.log("states")
    console.log(this.state)
    if(!this.state.isStarted){
        var startTime = new Date()
        this.state.trueStart=startTime.getTime()
       

        var self = this
        var locationInterval = 0
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

  render() {
    return (
      <View style={styles.container}>

      <View style={{width: 250, height: 300}}>
        <Text style={styles.userNameText}>UserName</Text>
        <Text style={styles.workspaceNameText}>Workspace Name</Text>
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