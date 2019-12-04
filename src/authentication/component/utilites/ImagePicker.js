import React, { useState } from 'react'
import * as firebase from 'firebase'

import { View, Button, Text, StyleSheet, Image , Alert}  from 'react-native'
import * as ImgPicker from 'expo-image-picker'
import * as Permissions from 'expo-permissions'
import Colors from '../../../constants/Colors';

const ImagePicker = props => {
    const [pickedImage, setPickedImage] = useState(props.currentImage)
    const verifyPermissions = async () => {
        const result = await Permissions.askAsync(Permissions.CAMERA_ROLL)
        if(result.status !== 'granted'){
             Alert.alert('Insufficient Permissions!', 'You need to grant gallery permission to use upload image',
             [{text: 'Okay'}])
             return false
        }
        return true
     }

    const takeImageHandler = async () => {
        const hasPermission = await verifyPermissions();
        if(!hasPermission){
            return
        }
        const image = await ImgPicker.launchImageLibraryAsync({
            allowsEditing:true,
            aspect: [16,9],
            quality: 0.5
        })

        const hello = await uploadImage(image.uri)
            .then(()=> {
                console.log("Success")
            })
            .catch((err) => {
                console.log(err)
            }) 

        setPickedImage(image.uri)
    };


    const uploadImage = async(uri) => {
        const response = await fetch(uri);
        const blob = await response.blob();
        const image = blob['_data']['name']
        var ref = firebase.storage().ref().child(`images/workspaces/${image}`)
        props.onImageTaken(image);

        return ref.put(blob)
    }

    return(
        <View style ={styles.imagePicker}> 
            <View style={styles.imagePreview}>
                {!pickedImage ? (
                <Text> No image Picked yet</Text>):(
                <Image style={styles.image} source={{uri: pickedImage}} />
                )}
            </View>
            <Button title="Take Image" color={Colors.workSpaceNavigationPrimaryColor} onPress={takeImageHandler} />
        </View>
    )
}

const styles = StyleSheet.create({
    imagePicker:{
        alignItems: 'center',
        marginBottom: 15
    },
    imagePreview:{
        width: '100%',
        height: 200,
        marginBottom:10,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#ccc',
        borderWidth:1
    },
    image:{
        width: '100%',
        height: '100%'
    }
})

export default ImagePicker
