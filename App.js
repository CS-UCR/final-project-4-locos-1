import React, {Component} from 'react';
import {StyleSheet, Text, View,} from 'react-native';
import {credentials} from './src/config';
import AuthenticationMenu from './src/Navigation/navigation'



credentials();

export default function App(){
  return (
    <AuthenticationMenu/>
  )
}