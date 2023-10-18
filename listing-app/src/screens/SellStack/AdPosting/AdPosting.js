import { SimpleLineIcons } from '@expo/vector-icons'
import { StackActions, useNavigation } from '@react-navigation/native'
import React, { useEffect } from 'react'
import { Image, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { DisconnectButton, TextDefault } from '../../../components'
import { alignment, colors, scale } from '../../../utilities'
import styles from './styles'
import { useSelector } from 'react-redux'


function AdPosting() {
    const navigation = useNavigation()

    useEffect(() => {
        navigation.setOptions({
            headerShown: false
        })
    }, [])

    function NavigateScreen() {
        navigation.dispatch(StackActions.popToTop())
        navigation.navigate('ProductDescription')
    }

    return (
        <SafeAreaView style={[styles.safeAreaViewStyles, styles.flex]}>
            <View style={[styles.flex, styles.mainContainer]}>
                <View style={styles.logoContainer}>
                    <SimpleLineIcons name="check" size={scale(80)} color={colors.white} />
                    <TextDefault textColor={colors.white} H4 uppercase bold style={alignment.MTmedium}>
                        {'congratulations!'}
                    </TextDefault>
                    <TextDefault textColor={colors.white} style={alignment.MTsmall}>
                        {'Your ad will go live shortly!'}
                    </TextDefault>
                </View>
                <View style={styles.buttonContainer}>
                    <View style={styles.imgContainer}>
                        <View style={styles.imgResponsive}>
                            <Image style={styles.img}
                                source={require('../../../assets/images/emptyView/price-tag.png')} />
                        </View>
                        <TextDefault bold H5>
                            {'Reach more buyers and sell faster'}
                        </TextDefault>
                        <TextDefault light style={alignment.MTxSmall}>
                            {'Upgrading an ad helps you to reach more buyer'}
                        </TextDefault>
                    </View>

                    <DisconnectButton
                        title='Preview Ad'
                        onPress={NavigateScreen}
                    />
                </View>
            </View>
        </SafeAreaView>
    )
}


export default React.memo(AdPosting)