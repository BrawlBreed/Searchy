import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { TouchableOpacity, View, Share } from 'react-native'
import { FlashMessage, TextDefault } from '../../../components'
import { alignment, colors, scale } from '../../../utilities'
import styles from './styles'
import { Entypo } from '@expo/vector-icons'

const links = [
    {
        title: 'За нас',
        description: 'Кои сме ние и какво правим'
    }
]

function Help() {
    const navigation = useNavigation()

    async function share() {
        try {
            const result = await Share.share({
                title: 'App link',
                message:
                    'Install this app and enjoy your friend community',
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                    FlashMessage({ message: 'The invitation has been sent', type: 'success' });
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            FlashMessage({ message: error.message, type: 'warning' });
        }
    }

    return (
        <View style={[styles.flex, styles.mainContainer]}>
            {links.map(({ title, url, description }, index) => (
                <TouchableOpacity key={url} style={styles.smallContainer}
                    onPress={() => navigation.navigate('HelpBrowser', { title, url })}>
                    <View style={[styles.flex]}>
                        <TextDefault bold H5 style={alignment.PLlarge}>
                            {title}
                        </TextDefault>
                        <TextDefault light style={[alignment.PLlarge, alignment.MTxSmall]}>
                            {description}
                        </TextDefault>
                    </View>
                    <Entypo name="chevron-small-right" size={scale(30)} color={colors.buttonbackground} />
                </TouchableOpacity>
            )
            )}
            {/* <TouchableOpacity style={styles.smallContainer}>
                <View style={[styles.flex]}>
                    <TextDefault bold H5 style={alignment.PLlarge}>
                        {'Get Help'}
                    </TextDefault>
                    <TextDefault light style={[alignment.PLlarge, alignment.MTxSmall]}>
                        {'See FAQ and contact support'}
                    </TextDefault>
                </View>
                <Entypo name="chevron-small-right" size={scale(30)} color={colors.buttonbackground} />
            </TouchableOpacity> */}
            {/* <TouchableOpacity style={styles.smallContainer}>
                <View style={[styles.flex]}>
                    <TextDefault bold H5 style={alignment.PLlarge}>
                        {'Rate us'}
                    </TextDefault>
                    <TextDefault light style={[alignment.PLlarge, alignment.MTxSmall]}>
                        {'If you love our app. Please take a moment to rate it'}
                    </TextDefault>
                </View>
                <Entypo name="chevron-small-right" size={scale(30)} color={colors.buttonbackground} />
            </TouchableOpacity> */}
            <TouchableOpacity style={styles.smallContainer} onPress={share}>
                <View style={[styles.flex]}>
                    <TextDefault bold H5 style={alignment.PLlarge}>
                        {'Покани приятели'}
                    </TextDefault>
                    <TextDefault light style={[alignment.PLlarge, alignment.MTxSmall]}>
                        {'Покани приятелите си да се присъединят към нас!'}
                    </TextDefault>
                </View>
                <Entypo name="chevron-small-right" size={scale(30)} color={colors.buttonbackground} />
            </TouchableOpacity>
            <View style={styles.smallContainer}>
                <View style={[styles.flex]}>
                    <TextDefault bold H5 style={alignment.PLlarge}>
                        {'Версия на приложението'}
                    </TextDefault>
                    <TextDefault light style={[alignment.PLlarge, alignment.MTxSmall]}>
                        {'11.46.0 (435)'}
                    </TextDefault>
                </View>
            </View>
        </View>
    )
}

export default React.memo(Help)