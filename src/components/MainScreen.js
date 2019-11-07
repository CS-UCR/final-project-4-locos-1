import React, {Component} from 'react';
import {View, Text, Button, Platform, TouchableHighlight,StyleSheet} from 'react-native';

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
    }
  }

//TIMER ---
  onPressTimerButton = () => {
    if(!this.state.isStarted){
        var startTime = new Date()
        this.state.trueStart=startTime.getTime()
        //alert("start Time=" + startTime.getTime())
        //alert("trueStart=" + this.state.trueStart)

        let timer = setInterval(() => {
    
            var num = (Number(this.state.secCount) + 1).toString(),
                mCount = this.state.minCount,
                hCount = this.state.hourCount;
    
            if (Number(this.state.secCount) == 59) {
                mCount = (Number(this.state.minCount) + 1).toString();
                num = '00';
            }

            if (Number(this.state.minCount) == 59) {
                hCount = (Number(this.state.hourCount) + 1).toString();
                mCounnt = '00';
            }
            
            this.setState({
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
        var endTime = new Date()
        this.state.trueTime=endTime.getTime()-this.state.trueStart
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