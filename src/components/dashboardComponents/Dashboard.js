import React, {Component} from 'react';
import { StyleSheet, View, Text, Dimensions} from 'react-native';
import DrawerIcon from '../../Navigation/assets/drawerNav/DrawerIcon';
import Colors from '../../constants/Colors'
import Accordian from './Accordian'
import * as firebase from 'firebase'

import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart
  } from 'react-native-chart-kit'

export default class Dashboard extends Component {

  constructor(props) {
    super(props);
    console.log("constructing Dashboard")
    this.state = {
      menu :[],

      
      currentUser : null,
      userId : null,
      rendered : false,

      personalData : [],
      workspaceData  :{}
      
     }
  }

  static navigationOptions = () => {
    return {
        headerTitle: 'Dashboard',
        headerRight: <DrawerIcon/>,
        headerStyle: {
            backgroundColor: Colors.headerBackgoundColor,
        },
        headerTitleStyle:{
          color: Colors.headerTitleColor,
        }
    };
  };


  installMenu(userId, personalData, workspaceData){
    var newMenu = []

    newMenu.push(
        { 
            title: 'Personal',
            data: {
            
            userId: userId,
            data: personalData,
            type: "Personal"
            }
        }
    )

    for(var workspaceKey in workspaceData){
        newMenu.push({
            title: workspaceData[workspaceKey].info.workspaceTitle,
            data: {
            info: workspaceData[workspaceKey].info,
            userId: userId,
            data: workspaceData[workspaceKey].data,
            type: "Workspace"
            }
        })
        
    }

    
    this.setState({
        menu: newMenu
    })
  }
  componentDidMount(){

    var self = this
    firebase.auth().onAuthStateChanged(async function(user){
        if(user){
            // self.setState({
            //     userId: user.uid,
            //     currentUser: user
            // })

            //load all the relevant data from the user
            console.log("in onAuthStateChanged")
            var personalReports = {}
            var workspaceReports = {}

            //gather personal Reports
            await firebase.database().ref('/Reports/Users/'+ user.uid).once('value').then(function(snapshot){
                if(snapshot){
                    personalReports = snapshot.val()
                }
            })
            
            //get user information
            await firebase.database().ref('/Users/' + user.uid + '/').once('value').then(async function(snapshot){
                var userInfo = snapshot.val()

                if(snapshot.hasChild('workspaces')){
                    //iterate through each workspace
                    for(var i = 0; i < userInfo['workspaces'].length ; i++){
                        
                        var WSkey = userInfo['workspaces'][i]

                        //get workspace info
                        await firebase.database().ref('/workspaces/').once('value').then(async function(snapshot){
                            
                            var workspaceInfo = snapshot.val()
                            console.log("workspace key below")
                            console.log(WSkey)
                             //add index for new workspace Report
                            if(snapshot.hasChild(WSkey)){
                                console.log("workspace exists")
                                await firebase.database().ref('/Reports/workspaces/'+ WSkey + '/').once('value').then(function(snapshot){

                                    if(snapshot){
                                        console.log("report of workspace exists")
                                        workspaceReports[WSkey] = {
                                            info: workspaceInfo[WSkey],
                                            data: snapshot.val()
                                        }
                                    }
                                })
                        }
                        })
                       
                    }
                }
            })
            console.log("finished rendering")

            // console.log(personalReports)

            console.log("workspace reports")
            console.log(workspaceReports)

            self.installMenu(user.uid, personalReports,workspaceReports)

            self.setState({
                currentUser : user,
                userId : user.uid,
                personalData: personalReports ,
                workspaceData : workspaceReports,
                rendered : true,

            })
            

        }
        else{

        }
    })
  }

  render() {
    console.log("myMenu rendering")
    //console.log(this.state.menu)
    return (
      <View style={styles.container}>
        { this.renderAccordians() }
      </View>
    );
  }

  renderAccordians=()=> {
    const items = [];
    for (item of this.state.menu) {
        items.push(
            <Accordian 
                title = {item.title}
                data = {item.data}
            />
        );
    }
    return items;
}
}

const styles = StyleSheet.create({
  container: {
   flex:1,
   paddingTop:100,
   backgroundColor: '#4fc3f7'
   
  }
});