import { MaterialIcons } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { FlatList, TouchableOpacity, View } from 'react-native'
import { FilterModal, TextDefault } from '../../../components'
import SearchHeader from '../../../components/Header/SearchHeader/SearchHeader'
import { alignment, colors, scale } from '../../../utilities'
import ProductCard from './ProductCard/ProductCard'
import styles from './styles'
import navigationOption from './navigationOption'
import useItems from '../../../hooks/useItems'

function ProductListing() {  
    const navigation = useNavigation()
    const route = useRoute()
    const searchSubCategory = route.params?.search
    const searchCategory = route.params?.category ?? ''
    const searchInput = route.params?.input ?? ''

    const { loading, error, items } = useItems(searchSubCategory, searchCategory, searchInput)
    const [modalVisible, setModalVisible] = useState(false);

    useLayoutEffect(() => {
        navigation.setOptions(
            navigationOption({ searchCategory: searchSubCategory })
        )
    }, [navigation])

    function toggleModal() {
        setModalVisible(prev => !prev)
    }

    function headerView() {
        return (
            <View style={styles.headingRow}>
                <TextDefault >
                    {items.length} оферти
                </TextDefault>
                <TouchableOpacity style={styles.filterBtn}
                    onPress={() => navigation.navigate('FilterModal', { visible: modalVisible, searchCategory: searchCategory })}>
                    <MaterialIcons name='tune' size={scale(20)} color={colors.buttonbackground} />
                    <TextDefault style={styles.fontText} right>
                        Филтър
                    </TextDefault>
                </TouchableOpacity>
            </View>
        )
    }
    return (
        <View style={[styles.flex, styles.mainContainer]}>
            <FlatList
                data={items}
                style={styles.flex}
                contentContainerStyle={{ flexGrow: 1, ...alignment.PBlarge }}
                ListHeaderComponent={headerView}
                ItemSeparatorComponent={() => <View style={styles.spacer} />}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <ProductCard {...item} />
                )}
            />
            {/* <FilterModal visible={modalVisible} onModalToggle={toggleModal} searchCategory={searchCategory} /> */}
        </View>
    )
}
export default ProductListing