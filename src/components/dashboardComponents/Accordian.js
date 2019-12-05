import React, {Component} from 'react';
import { View, TouchableOpacity, Text, StyleSheet} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import {PersonalDashboard} from './PersonalDashboard'
export default class Accordian extends Component{

    constructor(props) {
        super(props);
        this.state = { 
          data: props.data,
          expanded : false,
        }
    }

    getPast7Days(){
        
        //line graph of recent activity
        /*
        need unique aggregated data by date
        */
        var myData = this.state.data.data 
        var uniqueDateList = []
        

        // console.log("creating study values")
        // console.log("myData")
        // console.log(myData)
        // for(var i = 0 ; i < myData.length ;i++){
        //     console.log("iteration: " + i)
            
        //     var myDate = new Date(myData[i].date).getDate()
        //     console.log("myDate V2")
        //     console.log(myDate)

        //     console.log("myData")
        //     console.log(myData)

        //     console.log("myData[i]")
        //     console.log(myData[i])

           
        //     console.log("this is study Value operations")
        //     var studyValue = (myData[i]["hours"] * 60) + myDate[i]["mins"] + (myData[i]["secs"] / 60)
            
        //     console.log("studyValue")
        //     console.log(studyValue)
            
        //     if(myDate in uniqueList){
        //         uniqueDateList[myDate] += studyValue
        //     }
        //     else{
        //         uniqueDateList[myDate] = studyValue
        //     }
            
        // }
        // //now 

        // console.log("get past 7 days for loop")
        // var today = new Date().getDate()
        // lineData = {
        //     labels : [],
        //     datasets: [
        //         {
        //             data : [],
        //             strokeWidth : 2
        //         }
        //     ]
        // }
        // //get past 7 days
        // for (var i = 8; i >1  ;i--){
        //     var nextDate = today - i;
        //     if(nextDate in uniqueDateList){
        //         //push label
        //         lineData.labels.push(nextDate)
        //         //push data
        //         lineData.datasets.data.push(uniqueDateList[nextDate])

        //     }
        //     else{
        //         lineData.labels.push(nextDate)
        //         lineData.datasets.data.push(0)
        //     }
        // }

        // console.log("myLineData")
        // console.log(lineData)

        // console.log("rendering 7PastDays")
        const line = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June'],
            datasets: [
              {
                data: [20, 45, 28, 80, 99, 43],
                strokeWidth: 2, // optional
              },
            ],
          };

        return(
        <View> 
            {console.log("=====WARNING======")}

        <Text>
            7 Past Days
        </Text>
        <LineChart
            data={line}
            width={Dimensions.get('window').width} // from react-native
            height={220}
            yAxisLabel={'minutes'}
            chartConfig={{
            backgroundColor: '#e26a00',
            backgroundGradientFrom: '#fb8c00',
            backgroundGradientTo: '#ffa726',
            decimalPlaces: 2, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
                borderRadius: 16
            }
            }}
            bezier
            style={{
            marginVertical: 8,
            borderRadius: 16
            }}
        />
        </View>
        )
    }
  configurePersonal(){

    console.log("print personal dashboard")
    
    return(
        <View style = {{flex : 1}}>
        {console.log("personal data going in constructor")}
        {console.log(this.state.data)}
        {this.getPast7Days()}
        {console.log("after render of PersonalDashboard")}
        </View>
    )
  }

  configureWorkspace(){

  }
  configureRender(){

    
    //check if type

    if(this.state.data.type == "Personal"){
        //render Personal
        this.configurePersonal()
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