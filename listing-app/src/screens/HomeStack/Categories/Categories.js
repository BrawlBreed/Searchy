import { Entypo } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import { FlatList, Image, TouchableOpacity, View } from 'react-native';
import { TextDefault } from '../../../components';
import { alignment, colors, scale } from '../../../utilities';
import styles from './styles';

const COLORS = ['#ffd54d', '#6df8f3', '#ff7a7a', '#d5b09f', '#eccbcb']

const category = [
    { id: '0', title: 'Mobiles', image: require('../../../assets/icons/categoryIcon/mobile.png') },
    { id: '1', title: 'Vehicles', image: require('../../../assets/icons/categoryIcon/car.png') },
    { id: '2', title: 'Animals', image: require('../../../assets/icons/categoryIcon/pet(1).png') },
    { id: '3', title: 'Kids', image: require('../../../assets/icons/categoryIcon/stroller.png') },
    { id: '4', title: 'Property For Sale', image: require('../../../assets/icons/categoryIcon/sale.png') },
    { id: '5', title: 'Electronics', image: require('../../../assets/icons/categoryIcon/monitor.png') },
    { id: '6', title: 'Bikes', image: require('../../../assets/icons/categoryIcon/motorcycle.png') },
    { id: '7', title: 'Jobs', image: require('../../../assets/icons/categoryIcon/work.png') },
]

function Categories() {
    const navigation = useNavigation()
    const route = useRoute()
    const screen = route.params?.screen ?? null


    function emptyView() {
        return (
            <View style={[styles.flex, styles.emptyContainer]}>
                <Image
                    style={styles.emptyImage}
                    source={require('../../../assets/images/emptyView/noData.png')}
                />
                <TextDefault H5 center bold style={alignment.MTlarge}>
                    {'No category found.'}
                </TextDefault>
            </View>
        )
    }

    return (
        <View style={[styles.flex, styles.container]}>
            <FlatList
                data={category}
                style={styles.flatList}
                contentContainerStyle={styles.categoryContainer}
                ListEmptyComponent={emptyView}
                showsHorizontalScrollIndicator={false}
                ItemSeparatorComponent={() => <View style={styles.spacer} />}
                renderItem={({ item, index }) => (
                    <TouchableOpacity
                        activeOpacity={0.5}
                        style={styles.categoryRow}
                        // onPress={() => navigation.dispatch(StackActions.push('SubCategories', { headerTitle: item.title, screen: screen }))}>
                        onPress={() => navigation.navigate('SubCategories', { headerTitle: item.title, screen: screen })}>
                        <View style={styles.rowContainer}>
                            <View style={[styles.image, { backgroundColor: COLORS[index % 5] }]}>
                                <Image
                                    style={styles.imgResponsive}
                                    source={item.image}
                                />
                            </View>
                            <TextDefault H5 style={styles.fontText}>
                                {item.title}
                            </TextDefault>
                            <View style={styles.rightIcon}>
                                <Entypo name='chevron-small-right' size={scale(20)} color={colors.buttonbackground} />
                            </View>
                        </View>

                    </TouchableOpacity>
                )
                }
            />

        </View >
    );
}

export default React.memo(Categories)
