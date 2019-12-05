import React, {Component} from 'react';
import { StyleSheet, View, Text, Dimensions} from 'react-native';
import Accordian from './Accordian'
import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart
  } from 'react-native-chart-kit'

/*
  Data Schema:
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

*/
//assume the data is given

export default class PersonalDashboard extends Component{
    constructor(props){
        super(props)
        console.log("in constructor")
        this.state = {
            data :this.props.data,
            past7daysData : [],


            rendered : false
        }


        
    }

    
    getPast7Days(){

        //line graph of recent activity
        /*
        need unique aggregated data by date
        */
        var myData = this.state.data.data
        var uniqueDateList = []

        console.log("creating study values")
        for(var i = 0 ; i < myData.length ;i++){
            var myDate = new Date(myData[i].date).getDate()
            var studyValue = (myData[i].hours * 60) + myDate[i].mins + (myData[i].secs / 60)

            if(myDate in uniqueList){
                uniqueDateList[myDate] += studyValue
            }
            else{
                uniqueDateList[myDate] = studyValue
            }
            
        }
        //now 

        console.log("get past 7 days for loop")
        var today = new Date().getDate()
        lineData = {
            labels : [],
            datasets: [
                {
                    data : [],
                    strokeWidth : 2
                }
            ]
        }
        //get past 7 days
        for (var i = 8; i >1  ;i--){
            var nextDate = today - i;
            if(nextDate in uniqueDateList){
                //push label
                lineData.labels.push(nextDate)
                //push data
                lineData.datasets.data.push(uniqueDateList[nextDate])

            }
            else{
                lineData.labels.push(nextDate)
                lineData.datasets.data.push(0)
            }
        }

        console.log("myLineData")
        console.log(lineData)

        console.log("rendering 7PastDays")
        this.setState({
            
            past7daysData : lineData
        })
    }

    componentDidMount(){

        this.getPast7Days()

        this.setState({
            rendered: true
        })
    }
    render(){
        console.log("tryng to render PersonalDasboard")
        return(
            <View>
                {this.state.rendered ? () => {
                <View>
                <Text>
                    7 Past Days
                </Text>
                <LineChart
                    data={lineData}
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
                            
                }: null}
            </View>
        )
    }
}