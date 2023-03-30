import { colors, scale } from "../../../utilities";

const { StyleSheet, Dimensions } = require("react-native");
const { height } = Dimensions.get('window')

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    safeAreaViewStyles: {
        backgroundColor: colors.headerbackground,
        overflow: "hidden"
    },
    mainContainer: {
        backgroundColor: colors.themeBackground
    },
    logoContainer: {
        height: height * 0.5,
        backgroundColor: colors.headerbackground,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: "center",
        backgroundColor: colors.buttonbackground,
    },
    textTitle: {
        fontSize: scale(52),
        letterSpacing: scale(5),
    },
    image: {
        width: scale(200),
        height: scale(100),
    },
    imgResponsive: {
        flex: 1,
        width: undefined,
        height: undefined
    }
})
export default styles