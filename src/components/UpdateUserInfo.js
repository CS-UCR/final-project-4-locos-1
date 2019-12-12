import React, {Component} from 'react';
import {Alert, View, Text, Button, Platform, TouchableHighlight, StyleSheet, ScrollView} from 'react-native';
import t from 'tcomb-form-native';
import * as firebase from 'firebase';

import DrawerIcon from '../Navigation/assets/drawerNav/DrawerIcon';
import Colors from '../constants/Colors';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        //alignItems: 'center',
        backgroundColor: '#FFE9EC',
        padding: 25,
    },
    pageTitleText:{
        fontSize: 45,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    userInfoContainer: {
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#493029',
        height: 180,
    },
    userInfoTextContainer: {
        alignItems: 'flex-start',
        height: 30,
        padding: 3,
    },
    userInfoText :{
        textAlign: 'left',
        padding: 2,
        fontSize: 20,
        color: '#000000'
    },
    updateInfoButton: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#feccc1',
        borderWidth: 2,
        borderColor: "grey"
    },
    updateInfoButtonText: {
        textAlign: 'center',
        padding: 5,
        fontSize: 20,
        color: '#505050',
    },
});

const Form = t.form.Form;

const UserI = t.struct({
    firstname: t.maybe(t.String),
    lastname: t.maybe(t.String),
    major: t.maybe(t.String),
    phonenum: t.maybe(t.String),
    shareInfo: t.Boolean,
})

const formStyles = {
    ...Form.stylesheet,
    formGroup: {
        normal: {
          marginBottom: 5
        },
        error: {
          marginBottom: 5
        }
    },
    controlLabel: {
      normal: {
        fontSize: 15,
        marginBottom: 5,
      },
      error: {
        color: 'red',
        fontSize: 15,
        marginBottom: 5,
      }
    },
}

const formOptions = {
    fields: {
        // firstname:{
        //     label: this.state.firstnameDB ? this.state.firstnameDB : 'First Name',
        // },
        // lastname:{
        //     label: this.state.lastnameDB,
        // },
        // major:{
        //     label: this.state.majorDB,
        // },
        // phonenum:{
        //     label: this.state.phoneNumDB,
        // },
        // shareInfo: {
        //     label: 'Share information with Workspace Owners?',
        // },
        firstname:{
            label: 'First Name',
        },
        lastname:{
            label: 'Last Name',
        },
        major:{
            label: 'Major',
        },
        phonenum:{
            label: 'Phone Num',
        },
        shareInfo: {
            label: 'Share information with Workspace Owners?',
        },
    },
    stylesheet: formStyles,
  };

export default class UpdateUserInfo extends Component{

    constructor(props){
        super(props);
    
        this.state={
            info: null,
            currentUser : "",
            firstname : null,
            lastname : null,
            major : null,
            sharedInfo: null,
            firstnameDB : 'First Name',
            lastnameDB : 'Last Name',
            majorDB: 'Major',
            sharedInfoDB: 'Share information with Workspace Owners?',
        }
    }

    static navigationOptions = () => {
        return {
            headerTitle: 'Update User Info',
            headerRight: <DrawerIcon/>,
            headerStyle: {
                backgroundColor: Colors.headerBackgoundColor,
            },
            headerTitleStyle:{
              color: Colors.headerTitleColor,
            }
        };
      };

    componentDidMount(){
        
        var self = this
        firebase.auth().onAuthStateChanged(function(user){
            if(user){
                //logged on
                console.log("user\n")
                console.log(user)
                self.setState({currentUser: user,
                                userId : user.uid,
                                firstnameDB : user.firstname,
                                lastnameDB: user.lastname,
                                majorDB: user.major,
                                shareInfoDB: user.shareInfo,
                                phoneNumDB: user.phoneNum,
                })
            }
            else{
                //not logged on
                console.log("no user logged on")
            }
        })
    }

    handleSubmit = () => {
        const value = this._form.getValue();
        if(value){
            info = value
            alert("Your info has been updated, " + value.firstname + "!")
        }else{
            alert("Please correct the errors")
        }
    }
    //TODO:Update info into firebase
    updateFirebase = async() => {
        console.log("in button")
            //Constants to be updated into firebase
    
            //if(info.phonenum) {phonenum = info.phonenum} else {phonenum = 0};
            
            var formValues = this._form.getValue()
            var output = {
                email: this.state.currentUser.email,
                profile: {firstname : formValues.firstname,
                        lastname: formValues.lastname,
                        major : formValues.major,
                        shareInfo : formValues.shareInfo,
                        phoneNum : formValues.phonenum
                }
            }
            console.log("OUTPUT")
            console.log(output)
            console.log("pushing into firebase")
            await firebase.database().ref('Users/' + this.state.userId + '/').update(output)
            this.props.navigation.navigate('Main Screen')
            Alert.alert('Notice','Successfully updated profile!',[{text:'Okay'}])

    }
    
    
    onPressUpdateInfoButton = () => {
        this.handleSubmit()
        if(this.state.info){
            this.updateFirebase()
        }
    }

    render(){
        return (
            <View style={styles.container}>
                <View style={{height: 30}}>
                    <Text refstyle={styles.pageTitleText}>User Info</Text>
                </View>
                <View style={styles.userInfoContainer}>
                    <ScrollView>
                    <View style={styles.userInfoTextContainer}>
                        <Text style={styles.userInfoText}> First Name: {this.state.firstnameDB} </Text>
                    </View>
                    <View style={styles.userInfoTextContainer}>
                        <Text style={styles.userInfoText}> Last Name: {this.state.lastnameDB} </Text>
                    </View>
                    <View style={styles.userInfoTextContainer}>
                        <Text style={styles.userInfoText}> Major: {this.state.majorDB} </Text>
                    </View>
                    <View style={styles.userInfoTextContainer}>
                        <Text style={styles.userInfoText}> Phone Number: {this.state.phonenumDB} </Text>
                    </View>
                    </ScrollView>
                </View>
                <View style={{height: 40}}></View>
                <View style={{height: 200}}>
                    <Form 
                        ref={c => this._form = c}
                        type={UserI}
                        options={formOptions} />
                </View>
                <TouchableHighlight onPress={this.updateFirebase} underlayColor="white">    
                    <View style={styles.updateInfoButton}>
                        <Text style={styles.updateInfoButtonText}>Update Info</Text>
                    </View>
                </TouchableHighlight>
            </View>
          );
    }
}