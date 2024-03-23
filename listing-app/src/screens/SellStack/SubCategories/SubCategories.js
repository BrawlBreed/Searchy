import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextDefault } from '../../../components';
import styles from './styles';

function SubCategories({ route }) {
    const navigation = useNavigation()
    const [subCategories, setSubCategories] = useState([])
    const headerTitle = route?.params?.headerTitle ?? null

    useEffect(() => { 
        setSubCategories(route.params.subCategories) 
    }, [])
    useLayoutEffect(() => {
        navigation.setOptions({
            title: headerTitle
        })
    }, [navigation, headerTitle])
    return (
        <SafeAreaView edges={['bottom']} style={[styles.flex, styles.safeAreaview]}>
            <View style={[styles.flex, styles.container]}>
                <FlatList
                    data={subCategories}
                    style={styles.flatList}
                    contentContainerStyle={styles.categoryContainer}
                    showsHorizontalScrollIndicator={false}
                    ItemSeparatorComponent={() => <View style={styles.line} />}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            activeOpacity={0.5}
                            style={styles.categoryRow}
                            onPress={() => navigation.navigate('SellingForm', { types: item.value})}
                        >
                            <TextDefault light H5 style={styles.fontText}>
                                {item.value.title}
                            </TextDefault>
                        </TouchableOpacity>
                    )}
                />
            </View>
        </SafeAreaView>
    );
}

export default SubCategories
