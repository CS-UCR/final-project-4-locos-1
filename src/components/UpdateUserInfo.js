import React, {Component} from 'react';
import {Alert, View, Text, Button, KeyboardAvoidingView, TouchableHighlight, StyleSheet, ScrollView} from 'react-native';
import { Col, Row, Grid } from "react-native-easy-grid";
import t from 'tcomb-form-native';
import DialogInput from 'react-native-dialog-input';
import * as firebase from 'firebase';

import DrawerIcon from '../Navigation/assets/drawerNav/DrawerIcon';
import Colors from '../constants/Colors';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        //alignItems: 'center',
        backgroundColor: '#FFFF',
        padding: 25,
    },
    pageTitleText:{
        fontSize: 15,
        fontWeight: 'bold',
    },
    userInfoContainer: {
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: Colors.darkGreyColor,
        height: 180,
    },
    userInfoTextContainer: {
        alignItems: 'flex-start',
        height: 30,
        padding: 10,
    },
    userInfoText :{
        textAlign: 'left',
        padding: 2,
        fontSize: 15,
        fontWeight: 'bold',
        color: Colors.darkGreyColor,
        marginTop: 5,
    },
    colInfoText :{
        textAlign: 'left',
        padding: 2,
        fontSize: 15,
        color: '#000000',
        marginTop: 5,
    },
    updateInfoButton: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.darkGreyColor,
        display: 'flex',
        padding: 1,
        marginTop: 5,
        height: 35,
    },
    updateInfoButtonText: {
        textAlign: 'center',
        padding: 2,
        fontSize: 10,
        fontWeight: 'bold',
        color: '#FFFF',
    },
});

const Form = t.form.Form;

const UserI = t.struct({
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
        shareInfo: {
            label: 'Share information?',
           // default: this.state.shareInfoDB,
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
            userId: null,
            firstnameDB : 'First Name',
            lastnameDB : 'Last Name',
            majorDB: 'Major',
            sharedInfoDB: false,
            fnDialogue : false,
            lnDialogue : false,
            mjDialogue : false,
            phDialogue: false,
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
                })

                firebase.database().ref('/Users/' + user.uid + '/profile').on('value', (snapshot) =>{
                    console.log("USER SNAPSHOT\n")
                    console.log(snapshot)
                    console.log(user.uid)      
                    self.setState({
                        firstnameDB: snapshot.val().firstname,
                        lastnameDB: snapshot.val().lastname,
                        majorDB: snapshot.val().major,
                        phonenumDB: snapshot.val().phoneNum,
                        //shareInfoDB: snapshot.val().shareInfo,
                    })
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
            alert("Your info has been updated, " + value.firstnameUP + "!")
        }else{
            alert("Please correct the errors")
        }
    }

    fnDialog = () => {
        this.setState({fnDialogue: true})
    }
    updateFirstname = (inputText) => {
        this.setState({firstnameDB: inputText,
                        fnDialogue: false})
        setTimeout(() => {
            this.updateFirebase();
        }, 500);
    }

    lnDialog = () => {
        this.setState({lnDialogue: true})
    }
    updateLastname = (inputText) => {
        this.setState({lastnameDB: inputText,
                        lnDialogue: false})
        setTimeout(() => {
            this.updateFirebase();
        }, 500);
    }

    mjDialog = () => {
        this.setState({mjDialogue: true})
    }
    updateMajor = (inputText) => {
        this.setState({majorDB: inputText,
                        mjDialogue: false})
                        setTimeout(() => {
                            this.updateFirebase();
                        }, 500);
    }

    phDialog = () => {
        this.setState({phDialogue: true})
    }
    updatePhonenum = (inputText) => {
        this.setState({phonenumDB: inputText,
                        phDialogue: false})
                        setTimeout(() => {
                            this.updateFirebase();
                        }, 500);
    }

    updateShareInfo = () => {
        var formValues = this._form.getValue()
        if(formValues.shareInfo) {this.setState({shareInfoDB : formValues.shareInfo})}
        setTimeout(() => {
            this.updateFirebase();
        }, 500);
    }

    closeDialog = () => {
        this.setState({
            fnDialogue : false,
            lnDialogue : false,
            mjDialogue : false,
            phDialogue: false,
        })
    }

    //TODO:Update info into firebase
    updateFirebase = async() => {

            var output = {
                email: this.state.currentUser.email,
                profile: {firstname : this.state.firstnameDB,
                        lastname: this.state.lastnameDB,
                        major : this.state.majorDB,
                        shareInfo : this.state.shareInfoDB,
                        phoneNum : this.state.phonenumDB,
                }
            }
            console.log("OUTPUT")
            console.log(output)
            console.log("pushing into firebase")
            await firebase.database().ref('Users/' + this.state.userId + '/').update(output)
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
                    <Text style={styles.pageTitleText}>Your curent information is displayed below</Text>
                </View>
                <View style={styles.userInfoContainer}>
                    <Grid>
                        <Col size={30}>
                            <Row>
                                <Text style={styles.colInfoText}>First Name</Text>
                            </Row>
                            <Row>
                                <Text style={styles.colInfoText}>Last Name</Text>
                            </Row>
                            <Row>
                                <Text style={styles.colInfoText}>Major</Text>
                            </Row>
                            <Row>
                                <Text style={styles.colInfoText}>Phone Number</Text>
                            </Row>
                        </Col>
                        <Col size={5}></Col>
                        <Col size={40}>
                            <Row>
                                <Text style={styles.userInfoText}>{this.state.firstnameDB}</Text>
                            </Row>
                            <Row>
                                <Text style={styles.userInfoText}>{this.state.lastnameDB}</Text>
                            </Row>
                            <Row>
                                <Text style={styles.userInfoText}>{this.state.majorDB}</Text>
                            </Row>
                            <Row>
                                <Text style={styles.userInfoText}>{this.state.phonenumDB}</Text>
                            </Row>
                        </Col>
                        <Col size={2}></Col>
                        <Col size={13}>
                            <Row>
                            <TouchableHighlight syles={styles.updateInfoButton} onPress={() => this.fnDialog()} underlayColor="white">
                                <View style={styles.updateInfoButton}>
                                    <Text style={styles.updateInfoButtonText}>Update</Text>
                                </View>
                            </TouchableHighlight>
                            </Row>
                            <Row>
                            <TouchableHighlight syles={styles.updateInfoButton} onPress={() => this.lnDialog()} underlayColor="white">
                                <View style={styles.updateInfoButton}>
                                    <Text style={styles.updateInfoButtonText}>Update</Text>
                                </View>
                            </TouchableHighlight>
                            </Row>
                            <Row>
                            <TouchableHighlight syles={styles.updateInfoButton} onPress={() => this.mjDialog()} underlayColor="white">
                                <View style={styles.updateInfoButton}>
                                    <Text style={styles.updateInfoButtonText}>Update</Text>
                                </View>
                            </TouchableHighlight>
                            </Row>
                            <Row>
                            <TouchableHighlight syles={styles.updateInfoButton} onPress={() => this.phDialog()} underlayColor="white">
                                <View style={styles.updateInfoButton}>
                                    <Text style={styles.updateInfoButtonText}>Update</Text>
                                </View>
                            </TouchableHighlight>
                            </Row>
                        </Col>
                    </Grid>
                </View>
                <KeyboardAvoidingView>
                <DialogInput isDialogVisible={this.state.fnDialogue}
                    message={"Enter new first name"}
                    initValueTextInput={this.state.firstnameDB}
                    submitInput={ (inputText) => {this.updateFirstname(inputText)} }
                    closeDialog={ () => {this.closeDialog()}}>
                </DialogInput>

                <DialogInput isDialogVisible={this.state.lnDialogue}
                    message={"Enter new last name"}
                    initValueTextInput={this.state.lastnameDB}
                    submitInput={ (inputText) => {this.updateLastname(inputText)} }
                    closeDialog={ () => {this.closeDialog()}}>
                </DialogInput>

                <DialogInput isDialogVisible={this.state.mjDialogue}
                    message={"Enter new major"}
                    initValueTextInput={this.state.majorDB}
                    submitInput={ (inputText) => {this.updateMajor(inputText)} }
                    closeDialog={ () => {this.closeDialog()}}>
                </DialogInput>

                <DialogInput isDialogVisible={this.state.phDialogue}
                    message={"Enter new phone number"}
                    initValueTextInput={this.state.phonenumDB}
                    submitInput={ (inputText) => {this.updatePhonenum(inputText)} }
                    closeDialog={ () => {this.closeDialog()}}>
                </DialogInput>
                </KeyboardAvoidingView>

                <View style={{height: 20}}></View>
                <View style={{height: 50}}>
                    <Grid>
                        <Col>
                            <Form 
                                ref={c => this._form = c}
                                type={UserI}
                                options={formOptions} />
                        </Col>
                        <Col>
                            <TouchableHighlight onPress={() => this.updateShareInfo()} underlayColor="white">    
                                <View style={styles.updateInfoButton}>
                                    <Text style={styles.updateInfoButtonText}>Update Share Information</Text>
                                </View>
                            </TouchableHighlight>
                        </Col>    
                    </Grid>
                </View>
            </View>
          );
    }
}