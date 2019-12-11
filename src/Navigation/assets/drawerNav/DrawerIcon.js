import React, {Component} from 'react';
import { withNavigation } from 'react-navigation';
import { TouchableOpacity } from "react-native-gesture-handler";
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import Colors from '../../../constants/Colors';
class DrawerIcon extends Component{
    render() {
    return (
        <TouchableOpacity
        style={{
            width: 44,
            height: 44,
            marginLeft: 20,
            marginTop: 10,
        }}
        onPress={()=>{
            this.props.navigation.openDrawer();
        }}>
            <Icon name='menu' size={24} color={Colors.drawerIconColor}/>
        </TouchableOpacity>
    )
    };
}
export default withNavigation(DrawerIcon);