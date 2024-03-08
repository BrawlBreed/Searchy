import { showMessage } from 'react-native-flash-message'
import styles from './styles'
import PropTypes from 'prop-types'
import { Platform, StatusBar } from 'react-native'

export const FlashMessage = props => {
  showMessage({
    duration: 5000,
    hideOnPress: true,
    hideStatusBar: false,
    message: props.message,
    type: props.type,
    position: props.position ?? 'top',
    floating: false,
    titleStyle: styles.text,
    style: {
      paddingTop: Platform.OS == 'ios' ? 60 : StatusBar.currentHeight 
    }
  })
}
FlashMessage.propTypes = {
  message: PropTypes.string.isRequired,
  duration: PropTypes.number.isRequired,
}
