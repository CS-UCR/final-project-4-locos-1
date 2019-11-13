import React, {Component} from 'react';
import {Alert, View, Text, Button, Platform, TouchableHighlight, StyleSheet} from 'react-native';
import t from 'tcomb-form-native';
import * as firebase from 'firebase'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        //alignItems: 'center',
        backgroundColor: '#FFE9EC',
        padding: 25,
    },
    pageTitleText:{
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'center',
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
    firstname: t.String,
    lastname: t.String,
    major: t.String,
    phonenum: t.maybe(t.String),
    shareInfo: t.Boolean
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
    errorBlock: {
        fontSize: 12,
        marginBottom: 0,
        color: 'red',
    },
}

const formOptions = {
    fields: {
        firstname:{
            label: 'First Name',
            error: 'Please input a first name',
        },
        lastname:{
            label: 'Last Name',
            error: 'Please input a last name',
        },
        major:{
            label: 'Major',
            error: 'Please input a major name',
        },
        phonenum:{
            label: 'Phone Number',
        },
        shareInfo: {
            label: 'Share information with Workspace Owners?',
        },
    },
    stylesheet: formStyles,
  };

export default class UserInfo extends Component{

    constructor(props){
        super(props);
    
        this.state={
            info: null,
            currentUser : "",
            firstname : null,
            lastname : null,
            major : null,
            sharedInfo: null
        }
    }

    componentDidMount(){
        
        var self = this
        firebase.auth().onAuthStateChanged(function(user){
            if(user){
                //logged on
                console.log("user\n")
                console.log(user)
                self.setState({currentUser: user,
                                userId : user.uid})
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
        //console.log('value: ', value);
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
            this.props.navigation.navigate('MainRoute')
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
                    <Text refstyle={styles.pageTitleText}>Create Profile</Text>
                </View>
                <View style={{height: 40}}></View>
                <View style={{height: 400}}>
                    <Form 
                        ref={c => this._form = c}
                        type={UserI}
                        options={formOptions} />
                </View>
                <TouchableHighlight onPress={this.updateFirebase} underlayColor="white">    
                    <View style={styles.updateInfoButton}>
                        <Text style={styles.updateInfoButtonText}>Create</Text>
                    </View>
                </TouchableHighlight>
            </View>
          );
    }
}