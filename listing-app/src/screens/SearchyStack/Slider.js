import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Entypo } from '@expo/vector-icons';
import { Image, TouchableOpacity, View } from 'react-native';
import Swiper from 'react-native-swiper';
import { useDispatch } from 'react-redux';
import { setImage } from '../../store/reducers/Searchy/searchySlice';
import styles from '../HomeStack/ProductDescription/style';
import { useNavigation } from '@react-navigation/native'
import { LeftButton } from '../../components';
import { colors } from '../../utilities';
 
function Slider(props) {  
  const navigation = useNavigation()
  useLayoutEffect(() => {
    navigation.setOptions({
        header: () => null
    })
  }, [navigation])

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
                      dispatch(setImage(null))
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
  