import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useLayoutEffect } from 'react';
import { FlatList, TouchableOpacity, View, Image } from 'react-native';
import { FlashMessage, LeftButton, TextDefault } from '../../../components';
import { alignment, colors, scale } from '../../../utilities';
import { TransitionPresets, TransitionSpecs } from '@react-navigation/stack';
import styles from './styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import useSubCategories from '../../../hooks/useSubCategories';

function MainSell() {
    const { loading, error, subCategories } = useSubCategories()
    const navigation = useNavigation()

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Какво продавате?',
            headerLeft: (props) => <LeftButton icon='close' iconColor={colors.headerText} />
        })

    })
    return (
        <SafeAreaView edges={['bottom']} style={styles.flex}>
            <FlatList
                data={subCategories}
                style={[styles.flex, styles.container]}
                contentContainerStyle={styles.flatListContent}
                ItemSeparatorComponent={() => <View style={styles.seperator} />}
                numColumns={2}
                renderItem={({ item, index }) => (
                    <TouchableOpacity
                        style={[styles.mainContainer, index % 2 == 0 && styles.borderStyle]}
                        onPress={() => navigation.navigate('SubCategories', { headerTitle: item.title, subCategories: item.subCategories })}>
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
