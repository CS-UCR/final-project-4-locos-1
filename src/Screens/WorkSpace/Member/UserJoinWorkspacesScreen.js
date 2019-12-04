import React, {  useReducer, useCallback , useEffect} from 'react'
import {View, ScrollView, StyleSheet, Alert, KeyboardAvoidingView , Platform, Button} from 'react-native'
import {  HeaderButtons , Item } from 'react-navigation-header-buttons'

import ImagePicker from '../../../authentication/component/utilites/ImagePicker'

import { useSelector, useDispatch } from 'react-redux';

import * as workspacesAction from '../../../authentication/store/Action/workspace'
import Input from '../../../authentication/component/utilites/Input'
import HeaderButton from '../../../authentication/component/utilites/HeaderButton'
import Colors from '../../../constants/Colors'


const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE'

const formReducer = (state, action) => {
    switch(action.type){
        case FORM_INPUT_UPDATE:
                const updatedValues = {
                    ...state.inputValues,
                    [action.input]: action.value
                };
                const updatedValidities = {
                    ...state.inputValidities,
                    [action.input]: action.isValid
                };
        
                let updatedFormIsValid = true;
                for (const key in updatedValidities){
                    updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
                }
                return{
                    formIsValid: updatedFormIsValid,
                    inputValidities: updatedValidities,
                    inputValues: updatedValues
                };
        default:
            return state


    }
}


const UserWorkspaceSettings = props => {
    const workspaceId = props.navigation.getParam('workspaceId')
    const functionality = props.navigation.getParam('functionality')
    const availableWorkspaces = useSelector(state => 
        state.WorkSpaces.availableWorkspaces
    );
    const AuthID = useSelector(state => state.userAuth.userId)

    const dispatch = useDispatch();

    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
            accessCode: ''
        },
        inputValidities: {
            accessCode:  false
        },
        formIsValid: false
    })

    const submitHandler = useCallback(async()=> {
        if (!formState.formIsValid) {
            Alert.alert('Wrong input!', 'Please check the errors in the form.', [
              { text: 'Okay' }
            ]);
            return;
        }

        const findWorkspace = availableWorkspaces.find(workspace => workspace.accessCode === formState.inputValues.accessCode)

        let validAccessCode = false

        let memberList = []

        if(findWorkspace){
            validAccessCode = findWorkspace.members.includes(AuthID)
            memberList = findWorkspace.members
        }


        if(findWorkspace && !validAccessCode){
            console.log("Hello world")
            const updatedMemberList  = memberList.concat(AuthID)
            console.log("After append, ", updatedMemberList)
            dispatch(
                workspacesAction.joinWorkspace(
                    findWorkspace.id,
                    updatedMemberList
                )
            )
            props.navigation.goBack();
        }
        else if(!findWorkspace){
            Alert.alert('Wrong access code!', 'Please recheck access code provided.', [
                { text: 'Okay' }
              ]);
              return;
        }
        else{
            Alert.alert('Wrong access code!', 'You are a member of this workspace already.', [
                { text: 'Okay' }
              ]);
              return;
        }
        console.log("Submited")
    }, [dispatch, workspaceId, formState, AuthID])

    useEffect(()=> {
        props.navigation.setParams({submit: submitHandler})
    },[submitHandler])

    const inputChangeHandler = useCallback(
        (inputIdentifier, inputValue, inputValidities) => {
            dispatchFormState({
                type: FORM_INPUT_UPDATE,
                value:inputValue,
                isValid: inputValidities,
                input:inputIdentifier
            })
        },
        [dispatchFormState]
    );

    return(
        <KeyboardAvoidingView
            style= {{flex:1}}
            behavior="padding"
            keyboardVerticalOffset={100}
        >

            <ScrollView>
                <View style={styles.form}>
                    {functionality === 'Join Workspace' &&
                        <Input
                        id="accessCode"
                        label="Input Access Code"
                        errorText="Please enter a valid access code"
                        keyboardType = "default"
                        autoCapitalize="sentences"
                        returnKeyType="next"
                        onInputChange={inputChangeHandler}
                        initialValue={''}
                        initiallyValid={false}
                    />
                    }   
     
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
    
}

UserWorkspaceSettings.navigationOptions = navigationData => {
    const submitHandler = navigationData.navigation.getParam('submit');
    const functionality = navigationData.navigation.getParam('functionality')
    return {
        headerTitle: functionality ? functionality : 'Edit Workspace',
        headerRight: <HeaderButtons HeaderButtonComponent={HeaderButton}> 
                        <Item
                            title='Save'
                            iconName={
                                Platform.OS === 'android' ? 'md-checkmark' : 'ios-checkmark'
                              }
                            onPress={submitHandler}
                        />
                     </HeaderButtons>
        
    }
}

const styles = StyleSheet.create({
    form: {
        margin:20
    }
})

export default UserWorkspaceSettings