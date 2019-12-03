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
    // const availableWorkspaces = useSelector(state => 
    //     state.WorkSpaces.availableWorkspaces
    // );


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

        console.log("Access Code: ", formState.inputValues.accessCode)



        // const findWorkspace = useSelector(state => 
        //     state.WorkSpaces.availableWorkspaces.find(workspace => workspace.accessCode === formState.inputValues.accessCode)
        // );

        // useSelector(state => {
        //     console.log("Workspaces Data: ", state.WorkSpaces.availableWorkspaces)
        // })

        // useSelector()

        // console.log("Find workspace: ", findWorkspace)


        // dispatch(
        //     workspacesAction.joinWorkspace(
        //         formState.inputValues.workspaceTitle,
        //         formState.inputValues.color,
        //         formState.inputValues.imageUri
        //     )
        // )
        console.log("Submited")
        props.navigation.goBack();
    }, [dispatch, workspaceId, formState])

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

                    {functionality === 'Study Spaces' &&
                        <Button
                            title= "Study Spaces"
                            onPress = { ( ) => { props.navigation.navigate('AuthMap',{workspaceId: editedWorkspace})}}
                            color={Colors.workSpaceNavigationPrimaryColor}
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