import { StyleSheet } from 'react-native'
import { alignment, colors, scale, textStyles } from '../../../utilities'

const styles = StyleSheet.create({
    flex: {
        flex: 1
    },
    safeAreaView: {
        backgroundColor: colors.headerbackground
    },
    mainContainer: {
        backgroundColor: colors.themeBackground,
        ...alignment.PBlarge
    },
    basicInfoContainer: {
        ...alignment.PTlarge,
        ...alignment.PLmedium,
        ...alignment.PRmedium
    },
    imageContainer: {
        backgroundColor: colors.containerBox,
        width: scale(90),
        height: scale(90),
        borderRadius: scale(45),
        overflow: 'hidden'
    },
    imgResponsive: {
        flex: 1,
        width: undefined,
        height: undefined
    },
    phoneRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        ...alignment.MTmedium
    },
    countryBox: {
        width: "20%",
        borderBottomColor: colors.horizontalLine,
        borderBottomWidth: scale(1)
    },
    numberBox: {
        width: '100%',
        // height: scale(50),
        ...alignment.MTlarge,
        borderBottomWidth: scale(1),
    },
    buttonView: {
        width: "90%",
        alignSelf: "center",
        ...alignment.PBsmall
    }
})

export default styles