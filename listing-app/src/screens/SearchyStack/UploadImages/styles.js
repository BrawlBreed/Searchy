import { Dimensions, StyleSheet } from "react-native";
import color from "../../../components/Text/TextDefault/styles";
import { alignment, colors, scale } from '../../../utilities'
const { height, width } = Dimensions.get('window')

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
    buttonView: {
        width: "100%",
        backgroundColor: colors.white,
        shadowColor: colors.horizontalLine,
        shadowOffset: {
            width: 1,
            height: -1
        },
        shadowOpacity: 1,
        shadowRadius: 3,
        elevation: 5,
        ...alignment.PBlarge,
        ...alignment.PLlarge,
        ...alignment.PRlarge
    },
    imgResponsive: {
        height: scale(120),
        width: scale(120),
        ...alignment.MBlarge
    },
    img: {
        height: undefined,
        width: undefined,
        flex: 1
    },
    imgContainer: {
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
    },
    buttonContainer: {
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-evenly",
        ...alignment.Psmall,
        ...alignment.MTlarge
    },
    iconBtn: {
        backgroundColor: colors.buttonbackground,
        justifyContent: "center",
        alignItems: "center",
        width: '48%',
        height: scale(110)
    },
    headerView: {
        position: 'absolute',
        top: 0,
        height: height * 0.07,
        width: "100%",
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(0, 46, 51, 0.3)',
    },

})
export default styles