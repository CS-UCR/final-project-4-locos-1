import React, {Component, useCallback} from 'react';
import {View, Text, Button, Platform, TouchableHighlight, StyleSheet} from 'react-native';
import t from 'tcomb-form-native';
import * as Workspace from '../authentication/store/Action/workspace';
import DrawerIcon from '../Navigation/assets/drawerNav/DrawerIcon';
import { useSelector, useDispatch } from 'react-redux';

const Form = t.form.Form;

const WorkspaceI = t.struct({
    workspaceName: t.String,
    addUsers: t.maybe(t.Boolean),
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
        workspaceName:{
            label: 'Workspace Name',
            error: 'Please input a workspace name',
        },
        addUsers:{
            label: 'Add Users',
        },
    },
    stylesheet: formStyles,
};


const CreateWorkspace = props => {
    const dispatch = useDispatch();

    navigationOptions = () => {
        return {
            headerRight: <DrawerIcon/>,
            headerStyle: {
                backgroundColor: '#E0E0E0',
            },
        };
    };
 
    const submitHandler = async () => {
        const { addUsers, workspaceName} = this._form.getValue();
        if(this._form.getValue()){
            const settings = {
                workspaceName,addUsers
            }
            let action = Workspace.createWorkSpace(
                settings
            )

            try {
                dispatch(action)
                props.navigation.navigate('MainRoute')
                alert("Workspace has been created")
            }catch(error){
                alert("Please correct the errors")
            }
        }
    }


    return(
        <View style={styles.container}>
                <View style={{height: 30}}>
                    <Text style={styles.pageTitleText}>Create Workspace</Text>
                </View>
                <View style={{height: 40}}></View>
                <View style={{height: 400}}> 
                    <Form 
                        ref={c => _form = c}
                        type={WorkspaceI}
                        options={formOptions} />
                </View>
                <TouchableHighlight onPress={submitHandler} underlayColor="white">    
                    <View style={styles.createWorkspaceButton}>
                        <Text style={styles.createWorkspaceButtonText}>Create</Text>
                    </View>
                </TouchableHighlight>
            </View>
    )

}



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
    createWorkspaceButton: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#feccc1',
        borderWidth: 2,
        borderColor: "grey"
    },
    createWorkspaceButtonText: {
        textAlign: 'center',
        padding: 5,
        fontSize: 20,
        color: '#505050',
    },
});

export default CreateWorkspace;