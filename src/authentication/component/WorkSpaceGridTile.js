import React , { useState, useEffect } from 'react'
import {
    TouchableOpacity,
    View,
    Text,
    Image,
    StyleSheet,
    Platform,
    TouchableNativeFeedback
  } from 'react-native';

  import Card from '../component/utilites/InputLayout'
  import * as firebase from 'firebase'

  const WorkSpaceGridTile =  props => {
    const [imageUrl, setImageUrl] = useState('')

    const imageSource = async(image) => {
      const imageRetrieved  = await firebase.storage().ref().child(`images/workspaces/${image}`).getDownloadURL()
        .then(url =>  setImageUrl(url))

    }


      let TouchableCmp = TouchableOpacity

      if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
      }

      useEffect(() => {
        imageSource(props.pickedImage)
      }, []);

      return(
        <Card style={styles.product}>
      <View style={styles.touchable}>
        <TouchableCmp onPress={props.onSelect} useForeground>
          <View>
            <View style={styles.imageContainer}>
             {imageUrl ? (
               <Image style={styles.image} source={{uri: imageUrl}} />
             ):
             <Image style={styles.image} source={require('../../../assets/StuddyBuddyLogo.png')}/>
             }
            </View>
            <View style={styles.details}>
              <Text style={styles.title}>{props.workspaceTitle}</Text>
            </View>
            <View style={styles.actions}>
              {props.children}
            </View>
          </View>
        </TouchableCmp>
      </View>
    </Card>
      )

  }


  const styles = StyleSheet.create({
    product: {
      height: 300,
      margin: 20
    },
    touchable: {
      borderRadius: 10,
      overflow: 'hidden'
    },
    imageContainer: {
      width: '100%',
      height: '60%',
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      overflow: 'hidden'
    },
    image: {
      width: '100%',
      height: '100%'
    },
    details: {
      alignItems: 'center',
      height: '17%',
      padding: 10
    },
    title: {
      fontFamily: 'open-sans-bold',
      fontSize: 18,
      marginVertical: 2
    },
    actions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: '23%',
      paddingHorizontal: 20
    }
  });

  export default WorkSpaceGridTile;