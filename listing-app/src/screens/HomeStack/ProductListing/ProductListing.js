import { MaterialIcons } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useLayoutEffect, useState } from 'react'
import { FlatList, TouchableOpacity, View } from 'react-native'
import { FilterModal, TextDefault } from '../../../components'
import SearchHeader from '../../../components/Header/SearchHeader/SearchHeader'
import { alignment, colors, scale } from '../../../utilities'
import ProductCard from './ProductCard/ProductCard'
import styles from './styles'
import navigationOption from './navigationOption'

const data = [
    {
        id: '10',
        title: 'Japanese 28 inches cycle',
        price: 'Rs: 22,900',
        location: 'Peshawar Road, Rawalpindi, Punjab',
        image: require('../../../assets/images/products/cycle.jpg'),
        date: 'SEP 13',
        featured: true
    },
    {
        id: '11',
        title: 'PS4 Pro 1TB With Nacon Controller',
        price: 'Rs: 74,900',
        location: 'Agha Shahi Avenue, Islamabad, Islamabad Capital Territory',
        image: require('../../../assets/images/products/Ps4.jpg'),
        date: 'SEP 23',
        featured: true
    },
    {
        id: '12',
        title: 'OnePlus Nord Dual Sim Onyx Grey 8GB RAM 128GB 5G - Global Version',
        price: 'Rs: 71,900',
        location: 'Model Town Extension, Lahore, Punjab',
        image: require('../../../assets/images/products/nord.jpg'),
        date: 'AUG 13'
    }
]

function ProductListing() {
    const navigation = useNavigation()
    const route = useRoute()
    const searchCategory = route.params?.search ?? null
    const [modalVisible, setModalVisible] = useState(false);

    useLayoutEffect(() => {
        navigation.setOptions(
            navigationOption({ searchCategory: searchCategory })
        )
    }, [navigation])

    function toggleModal() {
        setModalVisible(prev => !prev)
    }

    function headerView() {
        return (
            <View style={styles.headingRow}>
                <TextDefault >
                    {'6,123 ads'}
                </TextDefault>
                <TouchableOpacity style={styles.filterBtn}
                    onPress={() => navigation.navigate('FilterModal', { visible: modalVisible, searchCategory: searchCategory })}>
                    <MaterialIcons name='tune' size={scale(20)} color={colors.buttonbackground} />
                    <TextDefault style={styles.fontText} right>
                        {'Filter'}
                    </TextDefault>
                </TouchableOpacity>
            </View>
        )
    }
    return (
        <View style={[styles.flex, styles.mainContainer]}>
            <FlatList
                data={data}
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
export default React.memo(ProductListing)