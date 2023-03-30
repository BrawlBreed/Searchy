import { useNavigation } from '@react-navigation/native'
import React, { useContext } from 'react'
import { View, Image } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { ModalHeader, TextDefault } from '../../../components'
import LoginButton from '../../../components/Buttons/LoginButton/LoginButton'
import UserContext from '../../../context/user'
import { colors } from '../../../utilities'
import styles from './styles'

const icon = require('../../../assets/icon.png')

function Registration() {
    const navigation = useNavigation()
    const inset = useSafeAreaInsets()
    const { logIn } = useContext(UserContext)

    return (
        <View style={[
            styles.safeAreaViewStyles,
            styles.flex,
            { paddingTop: inset.top, paddingBottom: inset.bottom }]}>
            <View style={[styles.flex, styles.mainContainer]}>
                <ModalHeader closeModal={() => navigation.goBack()} />
                <View style={styles.logoContainer}>
                    <View style={styles.image}>
                        <Image
                            source={icon}
                            style={styles.imgResponsive}
                            resizeMode='contain' />
                    </View>

                </View>
                <View style={styles.buttonContainer}>
                    <LoginButton
                        style={{ width: '85%' }}
                        icon='screen-smartphone'
                        title='Continue with Phone'
                        onPress={() => {
                            logIn()
                            navigation.goBack()
                        }} />
                    <LoginButton
                        style={{ width: '85%' }}
                        icon='social-google'
                        title='Continue with Gmail'
                        onPress={() => {
                            logIn()
                            navigation.goBack()
                        }} />
                    <LoginButton
                        style={{ width: '85%' }}
                        icon='social-facebook'
                        title='Continue with Facebook'
                        onPress={() => {
                            logIn()
                            navigation.goBack()
                        }} />
                    <LoginButton
                        style={{ width: '85%' }}
                        icon='envelope'
                        title='Continue with Email'
                        onPress={() => {
                            logIn()
                            navigation.goBack()
                        }} />
                    <TextDefault textColor={colors.fontPlaceholder} bold center small>
                        {'If you Continue, you are accepting'}
                    </TextDefault>
                    <TextDefault textColor={colors.fontPlaceholder} bold center small style={{ textDecorationLine: "underline" }}>
                        {'APP Terms and Conditions and Privacy Policy'}
                    </TextDefault>
                </View>
            </View>
        </View>
    )
}


export default React.memo(Registration)