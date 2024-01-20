import { showMessage } from 'react-native-flash-message'
import styles from './styles'
import PropTypes from 'prop-types'

export const FlashMessage = props => {
  showMessage({
    duration: 50000,
    hideOnPress: true,
    hideStatusBar: false,
    message: props.message,
    type: props.type,
    position: props.position ?? 'top',
    floating: false,
    titleStyle: styles.text,
  })
}
FlashMessage.propTypes = {
  message: PropTypes.string.isRequired,
  duration: PropTypes.number.isRequired,
}
