import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

export default function Textarea(props){
  return <TextInput multiline {...props} style={[styles.input, props.style]} />
}

const styles = StyleSheet.create({ input: { borderWidth:1, borderColor:'#ddd', padding:8, borderRadius:6 } });
