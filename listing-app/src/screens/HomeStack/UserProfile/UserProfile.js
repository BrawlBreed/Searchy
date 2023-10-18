import { useNavigation } from '@react-navigation/native'
import React, { useEffect, useLayoutEffect } from 'react'
import { Image, View } from 'react-native'
import { EmptyButton, RightButton, TextDefault } from '../../../components'
import { alignment, colors } from '../../../utilities'
import styles from './styles'

function UserProfile({ route }) {
    const navigation = useNavigation()
    const { avatar, createdAt, email, followers, following, isActive, name, description } = route.params

    useLayoutEffect(() => {
        navigation.setOptions({
            title: null,
            headerRight: () => <RightButton iconColor={colors.headerText} icon='dots' />
        })
    }, [navigation])

    return (
        <View style={[styles.flex, styles.mainContainer]}>
            <View style={styles.profileContainer}>
                <View style={styles.upperContainer}>
                    <View style={styles.imageContainer}>
                        <Image
                            style={styles.imgResponsive}
                            source={require('../../../assets/images/avatar.png')}
                            resizeMode='cover'
                        />
                    </View>
                    <View style={[styles.flex, styles.subContainer]}>
                        <View style={styles.profileInfo}>
                            <View style={styles.follower}>
                                <TextDefault textColor={colors.fontMainColor} H3 bold>
                                    {followers ? followers.length : '0'}
                                </TextDefault>
                                <TextDefault textColor={colors.fontSecondColor} light uppercase>
                                    {'Followers'}
                                </TextDefault>
                            </View>
                            <View style={styles.follower}>
                                <TextDefault textColor={colors.fontMainColor} H3 bold>
                                    {following ? following.length : '0'}
                                </TextDefault>
                                <TextDefault textColor={colors.fontSecondColor} light uppercase>
                                    {'Following'}
                                </TextDefault>
                            </View>
                        </View>
                        <View style={styles.editButton}>
                            <EmptyButton title='Follow'
                                onPress={() => navigation.goBack()} />
                        </View>
                    </View>
                </View>
                <TextDefault H4 bold style={[alignment.MBxSmall, alignment.PLsmall, alignment.MTlarge]}>
                    {name}
                </TextDefault>
                <TextDefault textColor={colors.fontSecondColor} bold style={[alignment.MBxSmall, alignment.PLsmall]} uppercase>
                    {`Член от ${createdAt}`}
                </TextDefault>
                <TextDefault textColor={colors.fontSecondColor} bold style={[alignment.MBxSmall, alignment.PLsmall, alignment.MTlarge]} uppercase>
                    Описание
                </TextDefault>
                <TextDefault textColor={colors.black} style={[alignment.MBxSmall, alignment.PLsmall]}>
                    { description ? description : 'Няма описание' }
                </TextDefault>
            </View>
        </View >
    )
}

export default React.memo(UserProfile)