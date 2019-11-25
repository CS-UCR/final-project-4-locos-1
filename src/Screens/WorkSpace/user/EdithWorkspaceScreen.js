import React, {  useReducer, useCallback , useEffect , useState} from 'react'
import {View, ScrollView, StyleSheet, Alert, KeyboardAvoidingView , Platform} from 'react-native'
import {  HeaderButtons, Item } from 'react-navigation-header-buttons'

import ImagePicker from '../../../authentication/component/utilites/ImagePicker'

import { useSelector, useDispatch } from 'react-redux';

import * as workspacesAction from '../../../authentication/store/Action/workspace'
import Input from '../../../authentication/component/utilites/Input'
import HeaderButton from '../../../authentication/component/utilites/HeaderButton'

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE'
const IMAGE_INPUT_UPDATE = 'IMAGE_INPUT_UPDATE'

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
        default:
            return state


    }
}


const EditWorkspaceScreen = props => {
    const workspaceId = props.navigation.getParam('workspaceId')
    const editedWorkspace = useSelector(state => 
        state.WorkSpaces.userWorkspaces.find(workspace => workspace.id == workspaceId)
    );

    const dispatch = useDispatch();

    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
            workspaceTitle: editedWorkspace ? editedWorkspace.workspaceTitle: '',
            color: editedWorkspace ?  editedWorkspace.color: '',
            imageUri: editedWorkspace ?  editedWorkspace.imageUri: '',
        },
        inputValidities: {
            workspaceTitle:  editedWorkspace ? true: false,
            color: editedWorkspace ? true : false,
            imageUri: true
        },
        formIsValid: editedWorkspace ? true : false
    })

    const submitHandler = useCallback(()=> {
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

    return(
        <KeyboardAvoidingView
            style= {{flex:1}}
            behavior="padding"
            keyboardVerticalOffset={100}
        >

            <ScrollView>
                <View style={styles.form}>
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
                </View>
                <ImagePicker onImageTaken={imageTakenHandler}/>
            </ScrollView>
        </KeyboardAvoidingView>
    )
    
}

EditWorkspaceScreen.navigationOptions = navigationData => {
    const submitHandler = navigationData.navigation.getParam('submit');
    return {
        headerTitle: 'Edit Workspace',
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