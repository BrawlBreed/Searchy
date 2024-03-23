import { StyleSheet } from "react-native";
import { alignment, colors } from '../../../utilities'

const styles = StyleSheet.create({
    flex: {
        flex: 1
    },
    mainContainer: {
        backgroundColor: colors.themeBackground,
        justifyContent: "space-between"
    },
    safeAreaview: {
        backgroundColor: colors.bottomTabColor,
    },
    inputBorder: {
        flexDirection: "row",
        borderBottomWidth: StyleSheet.hairlineWidth,
        ...alignment.PBxSmall,
        ...alignment.Mlarge,
    },
    buttonView: {
        width: "90%",
        alignSelf: "center",
        ...alignment.PBsmall
    },
    leftText: {
        borderRightColor: colors.fontSecondColor,
        borderRightWidth: StyleSheet.hairlineWidth,
        ...alignment.PRxSmall,
        ...alignment.MRmedium
    },
    smallContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomColor: colors.horizontalLine,
        borderBottomWidth: StyleSheet.hairlineWidth,
        ...alignment.Pmedium
    },
})
export default styles