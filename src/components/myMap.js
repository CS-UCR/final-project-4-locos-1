/*

import React, { Component } from "react";
import {StyleSheet, Text, View } from 'react-native';

export default class myMap extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    this.googleMapRef = React.createRef();
    }

    componentDidMount() {
        const googleMapScript = document.createElement("script");
        googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDEkGijSUn59Urd96tftpKsizYGqkUaMFQ&libraries=places`;
        window.document.body.appendChild(googleMapScript);
        googleMapScript.addEventListener("load", () => {
            this.googleMap = this.createGoogleMap();
            this.marker = this.createMarker();
        });
    }
    
    createGoogleMap = () =>
    new window.google.maps.Map(this.googleMapRef.current, {
        zoom: 16,
        center: {
            lat: 43.642567,
            lng: -79.387054
        },
        disableDefaultUI: true
    });
    
    createMarker = () =>
    new window.google.maps.Marker({
        position: { lat: 43.642567, lng: -79.387054 },
        map: this.googleMap
    });
    
    render() {
        return (
        <div>
        <Text>
        I am a very simple card. I am good at containing small bits of
        information. I am convenient because I require little markup
        to use effectively. I am similar to what is called a panel in
        other frameworks.
        </Text>
        
        <div
        ref={this.googleMapRef}
        id="google-map"
        />
        </div>
        );
        }
    }

*/