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
const IMAGE_INPUT_UPDATE = 'IMAGE_INPUT_UPDATE'
const ADD_MEMBERS_UPDATE = 'ADD_MEMBERS_UPDATE'

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
        case IMAGE_INPUT_UPDATE:
            const updatedImage = {
                    ...state.inputValues,
                    imageUri: action.value
            };
            return {
                ...state,
                inputValues: updatedImage
            };
        
        case ADD_MEMBERS_UPDATE:
            const addMembers = {
                ...state.inputValue,
                emails: action.value
            }
            return {
                ...state,
                inputValues:addMembers
            }
        default:
            return state


    }
}


const EditWorkspaceScreen = props => {
    const workspaceId = props.navigation.getParam('workspaceId')
    const functionality = props.navigation.getParam('functionality')
    const editedWorkspace = useSelector(state => 
        state.WorkSpaces.userWorkspaces.find(workspace => workspace.id == workspaceId)
    );

    const dispatch = useDispatch();

    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
            workspaceTitle: editedWorkspace ? editedWorkspace.workspaceTitle: '',
            color: editedWorkspace ?  editedWorkspace.color: '',
            imageUri: editedWorkspace ?  editedWorkspace.imageUri: '',
            emails: ''
        },
        inputValidities: {
            workspaceTitle:  editedWorkspace ? true: false,
            color: editedWorkspace ? true : false,
            imageUri: true,
            email: true
        },
        formIsValid: editedWorkspace ? true : false
    })

    const submitHandler = useCallback(async()=> {
        if (!formState.formIsValid) {
            Alert.alert('Wrong input!', 'Please check the errors in the form.', [
              { text: 'Okay' }
            ]);
            return;
        }

        if(editedWorkspace){
            dispatch(
                workspacesAction.updateWorkSpace(
                    workspaceId,
                    formState.inputValues.workspaceTitle,
                    formState.inputValues.color,
                    formState.inputValues.imageUri
                )
            )
        }
        else{
            dispatch(
                workspacesAction.createWorkSpace(
                    formState.inputValues.workspaceTitle,
                    formState.inputValues.color,
                    formState.inputValues.imageUri
                )
            )
        }
        console.log("FormState value : ", formState.inputValues.email)
        // if(functionality !== 'Edit Workspace' && !formState.inputValue.email){
        //     console.log("insid eif")
        //     await workspacesAction.addMembers(
        //         formState.inputValue.email,
        //         formState.inputValues.workspaceTitle,
        //         '544332'
        //     )
        // }
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

    const imageTakenHandler = useCallback(imagePath => {
        dispatchFormState({
            type: IMAGE_INPUT_UPDATE,
            value:imagePath,
        })
    }, [dispatchFormState])

    const addMembersHandler = useCallback(
        (inputValue) => {
            dispatchFormState({
                type:ADD_MEMBERS_UPDATE,
                value:inputValue
            })
        }
    )

    return(
        <KeyboardAvoidingView
            style= {{flex:1}}
            behavior="padding"
            keyboardVerticalOffset={100}
        >

            <ScrollView>
                <View style={styles.form}>
                    {functionality !== 'Add Members' &&
                        <Input
                            id="workspaceTitle"
                            label="WorkSpace Name"
                            errorText="Please enter a valid workspace name!"
                            keyboardType = "default"
                            autoCapitalize="sentences"
                            autoCorrect
                            returnKeyType="next"
                            onInputChange={inputChangeHandler}
                            initialValue={editedWorkspace ? editedWorkspace.workspaceTitle : ''}
                            initiallyValid={!!editedWorkspace}
                            required
                        />
                    }

                    {functionality !== 'Add Members' &&
                        <Input
                        id="color"
                        label="Color"
                        errorText="Please enter a valid color"
                        keyboardType = "default"
                        autoCapitalize="sentences"
                        returnKeyType="next"
                        onInputChange={inputChangeHandler}
                        initialValue={editedWorkspace ? editedWorkspace.color : ''}
                        initiallyValid={!!editedWorkspace}
                        required
                    />
                    }

                    {functionality !== 'Edit Workspace' &&
                        <Input
                        id="Add Members"
                        label="Add Members (Separate Emails with Commas)"
                        errorText="Please enter valid email address"
                        keyboardType = "default"
                        autoCapitalize="sentences"
                        returnKeyType="next"
                        onInputChange={addMembersHandler}
                        initialValue={''}
                        initiallyValid={!!editedWorkspace}
                    />
                    }
                    
                </View>

                {functionality !== 'Add Members' &&
                    <ImagePicker onImageTaken={imageTakenHandler}/>
                }

                {functionality === 'Edit Workspace' &&
                        <Button
                            title= "Study Spaces"
                            onPress = { props.navigation.navigate('MapRoute',{workspaceId: workspaceId})}
                            color={Colors.workSpaceNavigationPrimaryColor}
                        />
                }
            </ScrollView>
        </KeyboardAvoidingView>
    )
    
}

EditWorkspaceScreen.navigationOptions = navigationData => {
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

export default EditWorkspaceScreen