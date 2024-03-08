import React from 'react'
import { View, FlatList, Image } from 'react-native'
import { TextDefault } from '../../../components'
import { alignment, colors } from '../../../utilities'
import styles from './styles'

function Notifications() {

    function emptyView() {
        return (
            <View style={[styles.flex, styles.emptyContainer]}>
                <Image
                    style={styles.emptyImage}
                    source={require('../../../assets/images/emptyView/notification.png')}
                />
                <TextDefault H4 center bold style={alignment.MTlarge}>
                    {'No Notifications'}
                </TextDefault>
                <TextDefault textColor={colors.fontSecondColor} center style={alignment.MTmedium}>
                    {'Check back here for updates!'}
                </TextDefault>
            </View>
        )
    }

    return (
        <View style={[styles.flex, styles.mainContainer]}>
            <FlatList
                style={[styles.flex, styles.flatList]}
                contentContainerStyle={{ flexGrow: 1, backgroundColor: colors.containerBox }}
                keyExtractor={item => item.id}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={emptyView}
            />
        </View>
    )
}

export default React.memo(Notifications)