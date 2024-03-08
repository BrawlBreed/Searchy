import { StyleSheet } from 'react-native'
import { alignment, colors, scale } from '../../../utilities'

const styles = StyleSheet.create({
    flex: {
        flex: 1
    },
    mainContainer: {
        backgroundColor: colors.themeBackground
    },
    emptyContainer: {
        backgroundColor: colors.containerBox,
        justifyContent: "center",
        alignItems: "center",
        ...alignment.PLmedium,
        ...alignment.PRmedium
    },
    emptyImage: {
        width: scale(150),
        height: scale(150)
    },
    notificationContainer: {
        backgroundColor: colors.lightHorizontalLine,
        alignItems: "center",
        flexDirection: "row",
        ...alignment.Plarge,
        ...alignment.MBsmall
    },
    imgResponsive: {
        height: scale(70),
        width: scale(70)
    },
    img: {
        flex: 1,
        height: undefined,
        width: undefined
    },
    notificationText: {
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
        ...alignment.PLmedium
    },
    userContainer: {
        flexDirection: 'row',
        alignItems: "center",
        ...alignment.Psmall,
        ...alignment.PLlarge
    },
    avatar: {
        height: scale(40),
        width: scale(40)
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
    },
    modalView: {
        margin: scale(20),
        width: '85%',
        backgroundColor: colors.containerBox,
        borderRadius: scale(5),
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        ...alignment.Plarge
    },
    buttonsRow: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignSelf: "flex-end",
        ...alignment.PTsmall
    },
    button: {
        ...alignment.PTmedium,
        ...alignment.PLlarge,
        ...alignment.MLsmall
    },
    buttonText: {
        borderBottomColor: colors.buttonbackground,
        borderBottomWidth: 2,
        ...alignment.PBxSmall,
    }

})
export default styles