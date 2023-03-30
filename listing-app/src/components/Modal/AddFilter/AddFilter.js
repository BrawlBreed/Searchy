import React from 'react';
import { FlatList, Modal, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ModalHeader from '../../Header/ModalHeader/ModalHeader';
import { TextDefault } from '../../Text';
import styles from './styles';

const OPTIONS = [
    {
        value: 0,
        title: 'View all (2)'
    },
    {
        value: 1,
        title: 'Active Ads (0)'
    },
    {
        value: 2,
        title: 'Inactive Ads (0)'
    },
    {
        value: 3,
        title: 'Pending Ads (0)'
    },
    {
        value: 4,
        title: 'Moderated Ads (0)'
    },
]

function AddFilter(props) {
    const inset = useSafeAreaInsets()

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
                        data={OPTIONS}
                        contentContainerStyle={{ flexGrow: 1 }}
                        style={styles.body}
                        ItemSeparatorComponent={() => <View style={styles.seperator} />}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => (
                            <TouchableOpacity
                                style={styles.stateBtn}
                                onPress={props.onModalToggle}>
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