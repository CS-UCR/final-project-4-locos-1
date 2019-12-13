import React, {Component} from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Dimensions} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Col, Row, Grid } from "react-native-easy-grid";
import Colors from '../../constants/Colors';
import {PersonalDashboard} from './PersonalDashboard';
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart} from "react-native-chart-kit";
import { ScrollView } from 'react-native-gesture-handler';
//import { styles } from '../../styles/styles';

export default class Accordian extends Component{

    constructor(props) {
        super(props);
        this.state = { 
          data: this.props.data,
          expanded : false,
          day1Time: 45, 
          day2Time: 24,
          day3Time: 21,
          day4Time: 33,
          day5Time: 78,
          day6Time: 12,
          day7Time: 44,
          day1Txt: 'Sun',
          day2Txt: 'Mon',
          day3Txt: 'Tue',
          day4Txt: 'Wed',
          day5Txt: 'Thur',
          day6Txt: 'Fri',
          day7Txt: 'Sat',
          day1DateTxt: '2019-12-06',
          day2DateTxt: '2019-12-07',
          day3DateTxt: '2019-12-08',
          day4DateTxt: '2019-12-09',
          day5DateTxt: '2019-12-10',
          day6DateTxt: '2019-12-11',
          day7DateTxt: '2019-12-12',
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

<<<<<<< HEAD
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

        // return(
          
        // )
=======
>>>>>>> kev-Dashboards
    }
  configurePersonal(){

    console.log("firing getPast7days")
    console.log(this.getPast7Days())
    return(
<<<<<<< HEAD
                <View>
                  <View height={20}/>
                  <View height={20}>
                  <Text style = {{fontSize: 15, fontWeight: "bold", alignItems: "center", color: Colors.deepPurpleColor, marginTop: 4}}> Last 7 Days In Minutes Spent Studying </Text>
                  </View>
                  <View height={200}>
                  <BarChart
                      data={{
                        labels: [
                          this.state.day1Txt,
                          this.state.day2Txt,
                          this.state.day3Txt,
                          this.state.day4Txt,
                          this.state.day5Txt,
                          this.state.day6Txt,
                          this.state.day7Txt,
                        ],
                        datasets: [
                          {
                            data: [this.state.day1Time, this.state.day2Time, this.state.day3Time, this.state.day4Time, this.state.day5Time, this.state.day6Time, this.state.day7Time],
                          },
                        ],
                      }}
                      width={Dimensions.get('window').width - 2}
                      height={200}
                      yAxisLabel={''}
                      chartConfig={{
                        backgroundColor: '#FFFFFF',
                        backgroundGradientFrom: '#FFFFFF',
                        backgroundGradientTo: '#FFFFFF',
                        decimalPlaces: 0,
                        color: (opacity = 1) => `rgba(74, 20, 140, ${opacity})`,
                        style: {
                          //borderRadius: 16,
                        },
                      }}
                      style={{
                        marginVertical: 8,
                       // borderRadius: 16,
                      }}
                    />
                  </View>
                  <View height={30}/>
                  <View height={20}>
                  <Text style = {{fontSize: 15, fontWeight: "bold", alignItems: "center", color: Colors.deepPurpleColor, marginTop: 0}}> How well did you spread out your time? </Text>
                  </View>
                    <View height={200}>
                  <ContributionGraph
                      values={[
                        { date: this.state.day1DateTxt, count: this.state.day1Time },
                        { date: this.state.day2DateTxt, count: this.state.day2Time },
                        { date: this.state.day3DateTxt, count: this.state.day3Time },
                        { date: this.state.day4DateTxt, count: this.state.day4Time },
                        { date: this.state.day5DateTxt, count: this.state.day5Time },
                        { date: this.state.day6DateTxt, count: this.state.day6Time },
                        { date: this.state.day7DateTxt, count: this.state.day7Time },
                        { date: '2019-11-04', count: 3},
                        { date: '2019-11-07', count: 30},
                        { date: '2019-11-10', count: 89},
                        { date: '2019-11-15', count: 3},
                        { date: '2019-11-19', count: 35},
                        { date: '2019-11-24', count: 3},
                        { date: '2019-11-25', count: 30},
                        { date: '2019-11-26', count: 89},
                        { date: '2019-11-28', count: 3},
                        { date: '2019-11-30', count: 35},
                        { date: '2019-10-04', count: 3},
                        { date: '2019-10-07', count: 30},
                        { date: '2019-10-10', count: 89},
                        { date: '2019-10-15', count: 3},
                        { date: '2019-10-16', count: 35},
                        { date: '2019-10-30', count: 35},
                        { date: '2019-10-17', count: 3},
                        { date: '2019-10-14', count: 30},
                        { date: '2019-10-01', count: 89},
                        { date: '2019-09-29', count: 3},
                        { date: '2019-09-30', count: 35},
                        { date: '2019-09-18', count: 3},
                        { date: '2019-09-12', count: 35},
                        { date: '2019-09-04', count: 3},
                        { date: '2019-09-15', count: 30},
                      ]}
                      endDate={new Date(this.state.day7DateTxt)}
                      numDays={100}
                      width={Dimensions.get('window').width - 2}
                      height={200}
                      chartConfig={{
                        backgroundColor: '#FFFFFF',
                        backgroundGradientFrom: '#FFFFFF',
                        backgroundGradientTo: '#FFFFFF',
                        color: (opacity = 1) => `rgba(74, 20, 140, ${opacity})`,
                        strokeWidth: 60,
                        style: {
                          //borderRadius: 16,
                        },
                      }}
                    />
                    </View>
                </View>
=======
      <View>


      </View>
>>>>>>> kev-Dashboards
    )
  }

  configureWorkspace(){

  }
  configureRender(){

    
    //check if type

    if(this.state.data.type == "Personal"){
        //render Personal
<<<<<<< HEAD
=======
        console.log("firing getPast7days in configureRender")
>>>>>>> kev-Dashboards
        return(this.configurePersonal())
    }
    else if(this.state.data.type == "Workspace"){
        //render workspace
    }
    
  }
  render() {
    console.log("rerendering accordian 8")
    return (
     // <View style= {styles.container}>
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
     // </View>
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
        color: Colors.deepPurpleColor,
        
    },
    container: {
      flex: 1,
      justifyContent: 'flex-start',
     // backgroundColor: '#FFFF',
      padding: 0,
    }, 
    row:{
        flexDirection: 'row',
        justifyContent:'space-between',
        height:56,
        paddingLeft:25,
        paddingRight:18,
        alignItems:'center',
        backgroundColor: '#FFFFFF',
    },
    parentHr:{
        height:1,
        color: 0xFFFFFF,
        width:'100%'
    },
    child:{
        backgroundColor: '#FFFFFF',
        padding:16,
    },
    GraphBoxStyle:{
      height: '80%',
      borderColor: Colors.darkGreyColor,
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      padding: 2,
      marginTop:10,
      backgroundColor:'#FFFFFF',
      borderWidth:2,
    }
    
});