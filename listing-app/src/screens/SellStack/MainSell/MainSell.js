import { useNavigation } from '@react-navigation/native';
import React, { useLayoutEffect } from 'react';
import { FlatList, TouchableOpacity, View, Image } from 'react-native';
import { FlashMessage, LeftButton, TextDefault } from '../../../components';
import { alignment, colors, scale } from '../../../utilities';
import { TransitionPresets, TransitionSpecs } from '@react-navigation/stack';
import styles from './styles';
import { SafeAreaView } from 'react-native-safe-area-context';


const CATEGORY = [
    { id: '0', title: 'Mobiles', image: require('../../../assets/icons/categoryIcon/mobile.png') },
    { id: '1', title: 'Vehicles', image: require('../../../assets/icons/categoryIcon/car.png') },
    { id: '2', title: 'Property For Sale', image: require('../../../assets/icons/categoryIcon/sale.png') },
    { id: '3', title: 'Animals', image: require('../../../assets/icons/categoryIcon/pet(1).png') },
    { id: '4', title: 'Electronics', image: require('../../../assets/icons/categoryIcon/monitor.png') },
    { id: '5', title: 'Bikes', image: require('../../../assets/icons/categoryIcon/motorcycle.png') },
    { id: '6', title: 'Jobs', image: require('../../../assets/icons/categoryIcon/work.png') },
    { id: '7', title: 'See all categories', image: require('../../../assets/icons/categoryIcon/more.png') },

]

function MainSell() {
    const navigation = useNavigation()

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'What are you offering?',
            headerLeft: (props) => <LeftButton icon='close' iconColor={colors.headerText} />
        })

    })
    return (
        <SafeAreaView edges={['bottom']} style={styles.flex}>
            <FlatList
                data={CATEGORY}
                style={[styles.flex, styles.container]}
                contentContainerStyle={styles.flatListContent}
                ItemSeparatorComponent={() => <View style={styles.seperator} />}
                numColumns={2}
                renderItem={({ item, index }) => (
                    <TouchableOpacity
                        style={[styles.mainContainer, index % 2 == 0 && styles.borderStyle]}
                        onPress={() => index === CATEGORY.length - 1 ? navigation.navigate('Categories') : navigation.navigate('SubCategories', { headerTitle: item.title })}>
                        <View style={styles.imageView}>
                            <Image
                                style={styles.imgResponsive}
                                source={item.image}
                                resizeMode='cover'
                            />
                        </View>
                        <TextDefault light center>
                            {item.title}
                        </TextDefault>
                    </TouchableOpacity>
                )
                }
            />
        </SafeAreaView>
    );
}

export default MainSell
