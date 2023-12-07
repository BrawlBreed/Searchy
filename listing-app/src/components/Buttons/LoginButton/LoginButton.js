import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { alignment, colors, scale } from '../../../utilities';
import styles from './styles';
import PropTypes from 'prop-types'
import { TextDefault } from '../../Text';
import { SimpleLineIcons } from '@expo/vector-icons';

function LoginButton(props) {

    return (
        <TouchableOpacity
            disabled={props.disabled ?? false}
            activeOpacity={0.7}
            style={StyleSheet.compose(styles.emptyButton, props.style )}
            onPress={props.onPress}>
            {props.icon &&
                <SimpleLineIcons name={props.icon} size={scale(30)} color={colors.buttonbackground} />}
            <TextDefault textColor={colors.buttonbackground} H4 style={[styles.flex, alignment.PLmedium, { fontSize: 25 }]}>
                {props.title}
            </TextDefault>
        </TouchableOpacity>
    )
}
LoginButton.propTypes = {
    onPress: PropTypes.func,
    title: PropTypes.string.isRequired
}

export default React.memo(LoginButton)