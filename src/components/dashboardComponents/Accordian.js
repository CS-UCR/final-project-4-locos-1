import React, {Component} from 'react';
import { View, TouchableOpacity, Text, StyleSheet} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import {PersonalDashboard} from './PersonalDashboard'
export default class Accordian extends Component{

    constructor(props) {
        super(props);
        this.state = { 
          data: this.props.data,
          expanded : false,
        }
    }

    getPast7Days(){
        
        //line graph of recent activity
        /*
        need unique aggregated data by date
        */
        var myData = this.state.data.data     
        var dataMap = {}

        //load data
        for(var i = 0 ; i<myData.length; i++){
          var myDate = new Date(myData[i].date)
          var generateKey = myDate.getMonth() + '/' + myDate.getDate()
          if (generateKey in dataMap){
            dataMap[generateKey] += myData[i].secs / 60 + myData[i].mins + myData[i].hours * 60
          }
          else{
            dataMap[generateKey] = myData[i].secs / 60 + myData[i].mins + myData[i].hours * 60
          }
          console.log("datamap[key]")
          console.log(dataMap[generateKey])
        }
        
        
        //traverse through dates
        var now = new Date()
        now.setDate(now.getDate()+1)
        var newDate = new Date(now)
        newDate.setDate(newDate.getDate()- 7)

        var barData = {
          labels: [],
          datasets: [
            {
              data: [],
            },
          ],
        };
    
        for(var i = new Date(newDate); i < now  ; i.setDate(i.getDate()+1)){
          //load data
          var generateKey = i.getMonth() + '/' + i.getDate()
          barData.labels.push(generateKey)
          var result = -1;
          if(generateKey in dataMap){
            result = dataMap[generateKey]
          }
          else{
            result = 0
          }

          barData.datasets[0].data.push(result)

        }

        console.log(barData)

        return barData

    }
  configurePersonal(){

    console.log("firing getPast7days")
    console.log(this.getPast7Days())
    return(
      <View>


      </View>
    )
  }

  configureWorkspace(){

  }
  configureRender(){

    
    //check if type

    if(this.state.data.type == "Personal"){
        //render Personal
        console.log("firing getPast7days in configureRender")
        return(this.configurePersonal())
    }
    else if(this.state.data.type == "Workspace"){
        //render workspace
    }
    
  }
  render() {
    console.log("rerendering accordian 8")
    return (
       <View style = {{backgroundColor : '#FFFFFF'}}>
            <TouchableOpacity style={styles.row} onPress={()=>this.toggleExpand()}>
                <Text style={styles.title}>{this.props.title}</Text>
                <Icon name={this.state.expanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} size={30} color={'#404040'} />
            </TouchableOpacity>
            <View style={styles.parentHr}/>
            {
                this.state.expanded &&
                <View style = {{flex : 1    }}>
                    {this.configureRender()}
                </View>
            }
       </View>
    )
  }

  toggleExpand=()=>{
    this.setState({expanded : !this.state.expanded})
  }

}

const styles = StyleSheet.create({
    title:{
        
        fontSize: 14,
        fontWeight:'bold',
        color: 0xFFFFFF,
        
    },
    row:{
        flexDirection: 'row',
        justifyContent:'space-between',
        height:56,
        paddingLeft:25,
        paddingRight:18,
        alignItems:'center',
        backgroundColor: '#FFFFF',
    },
    parentHr:{
        height:1,
        color: 0xFFFFFF,
        width:'100%'
    },
    child:{
        backgroundColor: '#FFFFFF',
        padding:16,
    }
    
});