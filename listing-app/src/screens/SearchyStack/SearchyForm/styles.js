import { alignment, colors, scale, textStyles } from "../../../utilities";

const { StyleSheet } = require("react-native");

const styles = StyleSheet.create({
    flex: {
        flex: 1
    }, 
    width100: {
        width: "100%",
    },
    safeAreaview: {
        backgroundColor: colors.bottomTabColor,
    },
    mainContainer: {
        backgroundColor: colors.themeBackground,
        // alignItems: "center"
    },
    subContainer: {
        ...alignment.Psmall,
    },
    line: {
        borderBottomColor: colors.horizontalLine,
        borderBottomWidth: StyleSheet.hairlineWidth
    },
    subContainerRow: {
        width: "95%",
        flexDirection: 'row',
        alignItems: "center",
        ...alignment.PTsmall,
        ...alignment.PBsmall
    },
    conditionBox: {
        width: '30%',
        height: scale(35),
        ...alignment.MRsmall
    },
    boxContainer: {
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: scale(5),
        alignItems: "center",
        justifyContent: "center"
    },
    notSelected: {
        backgroundColor: colors.themeBackground,
        borderColor: colors.buttonbackground
    },
    selected: {
        backgroundColor: colors.selected,
        borderColor: colors.selectedText
    },
    unSelectedText: {
        color: colors.fontMainColor,
    },
    selectedText: {
        color: colors.selectedText,
        ...textStyles.Bold
    },
    scrollviewContent: {
        alignItems: "center",
        ...alignment.PTsmall,
        ...alignment.PBsmall
    },
    typeBox: {
        width: scale(100),
        height: scale(35),
        ...alignment.PLsmall,
        ...alignment.PRsmall,
        ...alignment.MRsmall
    },
    textContainer: {
        backgroundColor: colors.themeBackground,
        borderWidth: StyleSheet.hairlineWidth * 2,
        borderRadius: scale(5),
        height: scale(40),
        ...alignment.MTsmall
    },
    descriptionContainer: {
        backgroundColor: colors.themeBackground,
        borderWidth: StyleSheet.hairlineWidth * 2,
        borderRadius: scale(5),
        height: scale(70),
        ...alignment.MTsmall
    },
    inputText: {
        flex: 1,
        ...textStyles.H4,
        ...alignment.PLsmall,
        ...alignment.PRsmall
    },
    buttonView: {
        width: "90%",
        alignSelf: "center",
        ...alignment.PBsmall
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
    imgResponsive: {
        flex: 1,
        width: undefined,
        height: undefined
    }
})

export default styles;