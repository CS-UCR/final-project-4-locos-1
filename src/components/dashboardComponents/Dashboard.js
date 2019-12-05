import React, {Component} from 'react';
import { StyleSheet, View, Text, Dimensions} from 'react-native';
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

                //get workspace reports
                if(snapshot.hasChild('workspaces')){
                    for(var workspaceKey in userInfo['workspaces']){
                        console.log(workspaceKey)

                        

                        await firebase.database().ref('/workspaces/').once('value').then(async function(snapshot){
                            
                            var workspaceInfo = snapshot.val()
                             //add index for new workspace Report
                            if(snapshot.hasChild(workspaceKey)){
                                await firebase.database().ref('/Reports/workspaces/'+ workspaceKey + '/').once('value').then(function(snapshot){

                                    if(snapshot){
                                        workspaceReports[workspaceKey] = {
                                            info: workspaceInfo,
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

            console.log(personalReports)

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
  renderData(){
      return(
    <View>
        <Text>fuck this shit</Text>    
    </View>
      )
  }
  render() {
    console.log("myMenu")
    console.log(this.state.menu)
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