import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  TouchableOpacity,
  ImageBackground
} from 'react-native';


const WorkSpaceItem = props => {
    return(
        <View style={styles.workspaceItem}>
        <TouchableOpacity style={{flex:1}} onPress={props.onSelectWorkSpace}>
          <View>
            <View style={{ ...styles.workSpaceRow, ...styles.workSpaceHeader }}>
              <ImageBackground
                source={require('../../../assets/StuddyBuddyLogo.png')}
                style={styles.bgImage}
              >
                <View style={styles.titleContainer}>
                  <Text style={styles.title} numberOfLines={1}>
                    {props.workspaceTitle}
                  </Text>
                </View>
              </ImageBackground>
            </View>
          </View>
        </TouchableOpacity>
      </View>

    )
}

const styles = StyleSheet.create({
    workspaceItem: {
      flex:1,
      height: 150,
      width: '100%',
      backgroundColor: '#f5f5f5',
      borderRadius: 10,
      overflow: 'hidden'
    },
    bgImage: {
      width: '100%',
      height: '100%',
      justifyContent: 'flex-end',
    },
    workSpaceRow: {
      flexDirection: 'row'
    },
    workSpaceHeader: {
      height: '85%'
    },
    titleContainer: {
      backgroundColor: 'rgba(0,0,0,0.5)',
      paddingVertical: 5,
      paddingHorizontal: 12
    },
    title: {
      fontFamily: 'open-sans-bold',
      fontSize: 20,
      color: 'white',
      textAlign: 'center'
    }
  });
  
  export default WorkSpaceItem;