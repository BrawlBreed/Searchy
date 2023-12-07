import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { View, Image } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { ModalHeader, TextDefault } from '../../../components'
import LoginButton from '../../../components/Buttons/LoginButton/LoginButton'
import { colors } from '../../../utilities'
import styles from './styles'
import { useSelector, useDispatch } from 'react-redux'
import { signInWithGoogle } from '../../../firebase'
import { gql, useMutation } from '@apollo/client'

const icon = require('../../../../assets/icon.png')

function Registration() {
    const { name, phoneCode, description, phone, email, favorites, avatar, createdAt, active, followers, following, notifications, userId } = useSelector(state => state.user)
    const dispatch = useDispatch()
    const navigation = useNavigation()
    const inset = useSafeAreaInsets()

    const [mutateFunction, { data, loading, error }] = useMutation(gql`
    mutation MyMutation(
        $name: String!,
        $phoneCode: String!,
        $description: String!,
        $phone: String!,
        $email: String!,
        $avatar: String!,
        $createdAt: String!,
        $active: Boolean!,
        $followers: [String]!,
        $following: [String]!,
        $favorites: [String]!,
        $notifications: NotificationsInput!,
        $userId: String!,
    ) {
        register(
          name: $name
          callingCode: $phoneCode
          description: $description
          phone: $phone
          email: $email
          avatar: $avatar
          createdAt: $createdAt
          active: $active
          followers: $followers
          following: $following
          favorites: $favorites
          notifications: $notifications
          _id: $userId
        )
    }
  `, {
    variables: {
        name,
        phoneCode,
        description,
        phone,
        email,
        avatar,
        createdAt,
        active,
        followers,
        following,
        favorites,
        notifications,
        userId
    }})  

    return ( 
        <View style={[
            styles.safeAreaViewStyles,
            styles.flex,
            { paddingTop: inset.top, paddingBottom: inset.bottom }]}>
            <View style={[styles.flex, styles.mainContainer]}>
                <ModalHeader type='close' closeModal={() => navigation.goBack()} />
                <View style={styles.logoContainer}>
                    <View style={styles.image}>
                        <Image
                            source={icon}
                            style={styles.imgResponsive}
                            resizeMode='contain' />
                    </View>

                </View>
                <View style={styles.buttonContainer}>
                    {/* <LoginButton
                        style={{ width: '85%' }}
                        icon='screen-smartphone'
                        title='Продължи с телефон'
                        keyboardType="numeric"
                        onPress={() => {
                            navigation.navigate('Entry', { email: false })
                        }} /> */}
                    <LoginButton
                        style={{ width: '85%', height: '30%' }}
                        icon='envelope'
                        title='Продължи с имейл'
                        onPress={async () => {
                            navigation.navigate('Entry', { email: true })
                        }} 
                    />
                    {/* <LoginButton
                        style={{ width: '85%' }}
                        icon='social-google'
                        title='Продължи с Google'
                        keyboardType="numeric"
                        onPress={async () => {
                            // navigation.navigate('Entry', { email: true })
                        }} 
                    /> */}
                    <TextDefault textColor={colors.fontPlaceholder} bold center small>
                        {'Ако продължите, вие се съгласявате с нашите'}
                    </TextDefault>
                    <TextDefault textColor={colors.fontPlaceholder} bold center small style={{ textDecorationLine: "underline" }}>
                        {'Условия за ползване'}
                    </TextDefault>
                </View>
            </View>
        </View>
    )
}


export default React.memo(Registration)