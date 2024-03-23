import { StyleSheet } from 'react-native';
import { colors, scale } from '../../../utilities';

const styles = StyleSheet.create({
    flex: {
        flex: 1,
        // justifyContent: "center",
        // alignItems: "center"
    },
    safeAreaViewStyles: {
        backgroundColor: colors.white,
    },
    mainContainer: {
        backgroundColor: colors.themeBackground,
        // justifyContent: 'space-between'
    },
    box: {
        height: 100,
        width: 100,
        backgroundColor: 'red'
    },
    noMoreRepliesContainer: {
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
      },
      noMoreRepliesText: {
        textAlign: 'center',
        color: '#666', // Example color
        // Add more styling as needed
      },
      chatListView: {
        // Add styles for the chat list view if needed
      },    
})
export default styles