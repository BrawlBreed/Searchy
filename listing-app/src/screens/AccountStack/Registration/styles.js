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
        backgroundColor: colors.themeBackground,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%'
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
        flex: 1,
        width: '70%',
        height: '100%',
        resizeMode: 'contain',
        marginBottom: '30%',
        marginLeft: '7.5%'
    },
    imgResponsive: {
        flex: 1,
        width: '90%',
        height: 'auto',
    }
})
export default styles