import React, { useEffect, useState } from 'react';
import { Entypo } from '@expo/vector-icons';
import { Image, View } from 'react-native';
import Swiper from 'react-native-swiper';
import styles from './style';
import { TextDefault } from '../../../components';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { removeImage } from '../../../store/reducers/Item/addItemSlice';
import { useDispatch } from 'react-redux';

function Slider(props) {  
    const dispatch = useDispatch()
    return (
      <View style={[styles.container, { height: props.remover ? '75%' : 'auto' }]}>
        <Swiper style={styles.wrapper}>
          {props.images.map((uri, i) => (
            <View style={[styles.slide]} key={i}>
              {props.remover && (
                  <Entypo name="trash" 
                  style={{zIndex: 100,alignContent: 'center',alignItems: 'center',alignSelf: 'center',position: 'absolute',}} 
                  size={100} color="#ed6d6b"
                    onPress={() => {
                      dispatch(removeImage(i))
                    }}
                />
              )}
              <Image
                style={styles.image}
                source={{ uri: uri }}
                resizeMode='cover'
              />
            </View>
          ))}
        </Swiper>
      </View>
    );
  }
  
  export default Slider;
  