import React, { useState, useEffect, useCallback, useReducer} from 'react'
import { View, ScrollView, StyleSheet, Platform, Alert, KeyboardAvoidingView, ActivityIndicator } from 'react-native'
import { useSelector, useDispatch } from 'react-redux';
import {  HeaderButtons , Item } from 'react-navigation-header-buttons'
import email from 'react-native-email'

import * as workspacesAction from '../../../authentication/store/Action/workspace'
import Input from '../../../authentication/component/utilites/Input'
import HeaderButton from '../../../authentication/component/utilites/HeaderButton'
import Colors from '../../../constants/Colors'
import ImagePicker from '../../../authentication/component/utilites/ImagePicker'

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
        case  IMAGE_INPUT_UPDATE:
            const updatedImage = {
                ...state.inputValues,
                imageUri:action.value
            };

            return{
                ...state,
                inputValue: updatedImage
            }
        default:
            return state
    }
}

const EditWorkspaceScreen = props => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState()

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
    });

    useEffect(() => {
        if(error) {
            Alert.alert('An error occurred!', error, [{ text: 'Okay' }]);
        }
    }, [error])


    const submitHandler = useCallback(async() => {
        if (!formState.formIsValid) {
            Alert.alert('Wrong input!', 'Please check the errors in the form.', [
              { text: 'Okay' }
            ]);
            return;
        }

        setError(null);
        setIsLoading(true);
        try{
            if(editedWorkspace){
                await dispatch(
                    workspacesAction.updateWorkSpace(
                        workspaceId,
                        formState.inputValues.workspaceTitle,
                        formState.inputValues.color,
                        formState.inputValues.imageUri
                    )
                )

            }
            else{
                await dispatch(
                    workspacesAction.createWorkSpace(
                        formState.inputValues.workspaceTitle,
                        formState.inputValues.color,
                        formState.inputValues.imageUri
                    )
                )
            }

            if(functionality !== 'Edit Workspace' && formState.inputValue.email.length !== 0){
                await workspacesAction.addMembers(
                    formState.inputValue.email,
                    formState.inputValues.workspaceTitle,
                    '544332'
                )
            }

            props.navigation.goBack();
        }catch(error){
            setError(error.message)
        }
        setIsLoading(false);
    },[dispatch,workspaceId, formState])

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

    if(isLoading){
        return(
            <View style ={styles.centered}>
                <ActivityIndicator size='large' color={Colors.LoadIndicatorColor} />
            </View>
        )
    }

    return(
        <KeyboardAvoidingView
            style = {{flex:1}}
            behavior= "padding"
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
                    {
                        functionality !== 'Add Members' &&
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
                        onInputChange={inputChangeHandler}
                        initialValue={''}
                        initiallyValid={!!editedWorkspace}
                    />
                     }

                     {
                     functionality !== 'Add Members' &&
                         <ImagePicker onImageTaken={imageTakenHandler}/>
                     }
                    </View>
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