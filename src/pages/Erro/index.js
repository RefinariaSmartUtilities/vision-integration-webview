import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import React from 'react';

export default function Erro({navigation}) {
 
  return (
    <View style={styles.container}>
        <View style={styles.erro}>
          <TouchableOpacity style={styles.closeButton}>  
            <Image source={require('../../../assets/buttonClose.png')} />
          </TouchableOpacity >
          <Text style={styles.textError}>Não foi possível identificar o instrumento</Text>
        </View>      
    </View>
  );
 }
 const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent:'center',
      alignItems:'center',
      backgroundColor:'#2E2E2E',
    },
    erro: {
      backgroundColor:'#2B7032',
      width:320,
      height:220,
      borderRadius:12,
      textAlign:'center',
      justifyContent:'center',
      alignItems:'center',
      padding:10,
    },
    textError: {
        color:'#fff',
        fontSize:20,
        textAlign:'center',
    },
    closeButton:{
      position:'absolute',
      top:-20,
      right:280,
      
    },
});