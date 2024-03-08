import React, { useEffect } from 'react';
import { FlatList, Modal, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ModalHeader from '../../Header/ModalHeader/ModalHeader';
import { TextDefault } from '../../Text';
import styles from './styles';

function AddFilter(props) {
    const inset = useSafeAreaInsets()

    function selectHandler({title, value}){
        props.setState(title.split('(')[0].trim(''))
        props.setAds(value)
        props.onModalToggle()
    }

    function OPTIONS(items) {
        const activeItems = items?.filter(ad => ad?.status === 'active')
        const inactiveItems = items?.filter(ad => ad?.status === 'inactive')
        const soldItems = items?.filter(ad => ad?.status === 'sold')
        return([
            {
                value: items,
                title: `Виж всички обяви (${items?.length || 0})`
            },
            {
                value: activeItems,
                title: `Активни обяви (${activeItems?.length || 0})`
            },
            {
                value: inactiveItems,
                title: `Неактивни обяви (${inactiveItems?.length || 0})`
            },
            {
                value: soldItems,
                title: `Продадени (${soldItems?.length || 0})`
            }
        ])
    }   

    return ( 
        <Modal
            animationType="slide"
            transparent={true}
            visible={props.visible}
        >
            <View style={[
                styles.safeAreaViewStyles,
                styles.flex,
                { paddingTop: inset.top, paddingBottom: inset.bottom }]}>
                <View style={[styles.flex, styles.mainContainer]}>
                    <ModalHeader closeModal={props.onModalToggle} title={'Filters'} />
                    <FlatList
                        data={OPTIONS(props.items)}
                        contentContainerStyle={{ flexGrow: 1 }}
                        style={styles.body}
                        ItemSeparatorComponent={() => <View style={styles.seperator} />}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => (
                            <TouchableOpacity
                                style={styles.stateBtn}
                                onPress={() => {
                                    selectHandler(item)}}>
                                <TextDefault style={[styles.flex, styles.font]} H5>
                                    {item.title}
                                </TextDefault>
                            </TouchableOpacity>
                        )} />
                </View>
            </View>
        </Modal > 
    )
}
export default React.memo(AddFilter)