import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react'
import { Image, View, TouchableOpacity, FlatList, Modal } from 'react-native';
import { AddFilter, EmptyButton, TextDefault } from '../../../../components';
import { alignment, colors, scale } from '../../../../utilities';
import styles from './styles';
import { Feather, MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons'
import useOwnedItems from '../../../../hooks/useOwnedItems';
import Card from './Card';
import { set } from 'firebase/database';
import { RefreshControl } from 'react-native-gesture-handler';
import { fetchSearchy } from '../../../../firebase';
import { useSelector } from 'react-redux';
import SearchyCard from './SearchyCard';

function Ads() { 
    const navigation = useNavigation()
    const [visible, setVisible] = useState(false)    
    const [state, setState] = useState('Виж всички')
    const [searchyItems, setSearchyItems] = useState([])
    const { uid } = useSelector(state => state.user)
    const { initalItems, items, setItems, loading, error, onRefresh, refreshing, refetch } = useOwnedItems();

    function onModalToggle() {
        setVisible(prev => !prev)
    }

    async function appendSearchyItems(){
        const searchyList = await fetchSearchy(uid)

        setSearchyItems(searchyList)
    }

    useEffect(() => {
        appendSearchyItems()
    }, [refreshing])

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
                {/* <EmptyButton
                    title='Продай сега'
                    onPress={() => navigation.navigate('Sell', { screen: 'Home' })}
                /> */}
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
            <AddFilter visible={visible} onModalToggle={onModalToggle} setState={setState} setAds={setItems} items={initalItems} active={items?.length} />
                <FlatList
                    data={[...items, ...searchyItems]}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}
                    style={styles.flex}
                    contentContainerStyle={{ flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={emptyView}
                    ListHeaderComponent={header}
                    keyExtractor={(item, index) => index.toString()}
                    stickyHeaderIndices={[0]}
                    renderItem={({ item, index }) => item.type === 'searchy' ? 
                    <SearchyCard refetch={appendSearchyItems} setAds={setItems} navigation={navigation} {...item} /> :
                        <Card refetch={refetch} setAds={setItems} navigation={navigation} {...item} />
                    }
                />
        </View>
    )
}

export default React.memo(Ads)