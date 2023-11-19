import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react'
import { Image, View, TouchableOpacity, FlatList, Modal } from 'react-native';
import { AddFilter, EmptyButton, TextDefault } from '../../../../components';
import { alignment, colors, scale } from '../../../../utilities';
import styles from './styles';
import { Feather, MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons'
import useOwnedItems from '../../../../hooks/useOwnedItems';
import Card from './Card';
import { useDispatch, useSelector } from 'react-redux';
import { set } from 'firebase/database';
import { RefreshControl } from 'react-native-gesture-handler';

function Ads() { 
    const navigation = useNavigation()
    const [visible, setVisible] = useState(false)
    const { changed } = useSelector(state => state.user)
    const { items, loading, error, refetch } = useOwnedItems(navigation);
    const [ads, setAds] = useState([])
    const [state, setState] = useState('Виж всички')
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        refetch().then(() => {
          setRefreshing(false);
        }).catch(() => {
          setRefreshing(false);
        });
      }, [refetch]);    

    function onModalToggle() {
        setVisible(prev => !prev)
    }

    useEffect(() => {
        setAds(items)
    }, [items, refetch])

    function emptyView() {
        return (
            <View style={[styles.flex, styles.emptyContainer]}>
                <Image
                    style={styles.emptyImage}
                    source={require('../../../../assets/images/emptyView/ads.png')}
                />
                <TextDefault H4 center bold style={alignment.MTlarge}>
                    {"Все още нямаш обяви."}
                </TextDefault>
                <TextDefault H5 center light style={alignment.MTsmall}>
                    {"Излишни вещи или идея за продукт? Продавай чрез нас ги сега!"}
                </TextDefault>
                <EmptyButton
                    title='Продай сега'
                    onPress={() => navigation.navigate('Sell', { screen: 'Home' })}
                />
            </View>
        )
    } 

    function header() {
        return (
            <TouchableOpacity style={styles.smallContainer}
                onPress={onModalToggle}>
                <TextDefault bolder H5 style={alignment.PRsmall}>
                    {`${state} (${items?.length})`}
                </TextDefault>
                <Feather name="chevron-down" size={scale(15)} color={colors.fontSecondColor} />
            </TouchableOpacity>
        )
    }

    return (
        <View onRefresh={onRefresh} style={[styles.flex, styles.mainContainer]}>
            <FlatList
                data={ads}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}
                style={styles.flex}
                contentContainerStyle={{ flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={emptyView}
                ListHeaderComponent={header}
                keyExtractor={(item, index) => index.toString()}
                stickyHeaderIndices={[0]}
                renderItem={({ item, index }) => (
                    <Card refetch={refetch} navigation={navigation} {...item} />
                )}
            />

            <AddFilter visible={visible} onModalToggle={onModalToggle} setState={setState} setAds={setAds} items={items} active={items?.length} />
        </View>
    )
}

export default React.memo(Ads)