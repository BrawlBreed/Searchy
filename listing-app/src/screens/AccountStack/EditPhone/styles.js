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
    },
    basicInfoContainer: {
        ...alignment.PTsmall,
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
        width: "70%",
        borderBottomWidth: scale(1),
    },
    buttonView: {
        width: "90%",
        alignSelf: "center",
        ...alignment.PBsmall
    },
    smallContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        ...alignment.MTlarge,
        ...alignment.PTlarge
        // ...alignment.Pmedium
    }
})

export default styles