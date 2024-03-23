import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import { FlatList, Image, Share, View } from 'react-native'
import { EmptyButton, FlashMessage, TextDefault } from '../../../components'
import { alignment, colors } from '../../../utilities'
import Card from './Card'
import styles from './styles'
import { useSelector, useDispatch } from 'react-redux'
import { fetchObjectsByUids } from '../../../firebase'

function Blocked() {
    const { blockedUsers } = useSelector(state => state.user)
    const [blockedUsersList, setBlockedUsersList] = useState([])

    const fetchBlockedUsers = async () => {
        const usersArray = await fetchObjectsByUids(blockedUsers.filter((user) => user !== ''))
        setBlockedUsersList(usersArray)
    }
    useEffect(() => {
        fetchBlockedUsers()
    }, [blockedUsers])
    function emptyView() {
        return (
            <View style={[styles.flex, styles.emptyContainer]}>
                <Image
                    style={styles.emptyImage}
                    source={require('../../../assets/images/emptyView/emptyBlocked.png')}
                />
                <TextDefault H4 center bold style={alignment.MTlarge}>
                    {"Не си блокирал никой :)"}
                </TextDefault>
                <TextDefault H5 center light style={alignment.MTsmall}>
                    {'Когато блокираш някой - ще се появи тук!'}
                </TextDefault>
            </View>
        )
    }

    function header() {
        return (
            <View style={styles.notificationContainer}>
                <View style={styles.imgResponsive}>
                    <Image style={styles.img} source={require('../../../assets/images/emptyView/blockedView.png')} />
                </View>
                <View style={styles.notificationText}>
                    <TextDefault textColor={colors.buttonbackground} H5 center >
                        {'Блокирани Потребители'}
                    </TextDefault>
                </View>
            </View>
        )
    }

    return (
        <View style={[styles.flex, styles.mainContainer]}>
            <FlatList
                style={styles.flex}
                contentContainerStyle={[styles.mainContainer, { flexGrow: 1 }]}
                data={blockedUsersList}
                ListEmptyComponent={emptyView()}
                ListHeaderComponent={blockedUsers?.length > 0 && header()}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    item &&
                    <Card {...item} />
                )}
            />
        </View>
    )
}
export default React.memo(Blocked)