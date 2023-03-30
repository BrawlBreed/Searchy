import React from 'react'
import { Image, View } from 'react-native'
import Swiper from 'react-native-swiper'
import styles from './style'

function Slider(props) {
    return (
        <Swiper style={styles.wrapper} >
            {props.IMG_LIST.map((item, i) => (
                <View style={styles.slide} key={i}>
                    <Image
                        style={styles.image}
                        source={item}
                        resizeMode='cover'
                    />
                </View>
            ))}
        </Swiper>
    )
}
export default React.memo(Slider)