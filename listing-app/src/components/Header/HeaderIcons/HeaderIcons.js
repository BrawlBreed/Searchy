import React, { useEffect, useState } from 'react'
import {
  Ionicons,
  EvilIcons,
  MaterialIcons,
  MaterialCommunityIcons
} from '@expo/vector-icons'
import styles from './styles'
import { StackActions, useNavigation } from '@react-navigation/native'
import { HeaderBackButton } from '@react-navigation/stack'
import PropTypes from 'prop-types'
import { alignment, colors, scale } from '../../../utilities'
import { View, TouchableOpacity, Modal, Dimensions, Share } from 'react-native'
import { BorderlessButton } from 'react-native-gesture-handler'
import { TextDefault } from '../../Text'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import BlockModal from '../../Modal/BlockModal/BlockModal'
import { FlashMessage } from '../../FlashMessage/FlashMessage'
import { updateUserProperty } from '../../../firebase'
import { setBlockedUsers } from '../../../store/reducers/User/userSlice'
import { useDispatch, useSelector } from 'react-redux'

function BackButton(props) {
  if (props.icon === 'leftArrow') {
    return (
      <Ionicons
        name="ios-arrow-back"
        size={scale(30)}
        style={styles.leftIconPadding}
        color={props.iconColor}
      />
    )
  } else if (props.icon === 'menu') {
    return (
      <MaterialIcons
        name="menu"
        size={scale(30)}
        style={styles.leftIconPadding}
        color={props.iconColor}
      />
    )
  } else if (props.icon === 'share') {
    return (
      <EvilIcons
        name="share-google"
        size={scale(30)}
        style={styles.leftIconPadding}
        color={props.iconColor}
      />
    )
  } else if (props.icon === 'dots') {
    return (
      <MaterialCommunityIcons
        name="dots-vertical"
        size={scale(30)}
        style={styles.rightIconPadding}
        color={props.iconColor}
      />
    )
  } else {
    return (
      <Ionicons
        name="md-close"
        size={scale(30)}
        style={styles.leftIconPadding}
        color={props.iconColor}
      />
    )
  }
}

function LeftButton(props) {
  const navigation = useNavigation()
  if (props.icon === 'back') {
    return (
      <HeaderBackButton
        labelVisible={false}
        backImage={() =>
          BackButton({ iconColor: props.iconColor, icon: 'leftArrow' })
        }
        onPress={() => {
          navigation.goBack()
        }}
      />
    )
  } else if (props.icon === 'close' && props.action === 'POP') {
    return (
      <HeaderBackButton
        labelVisible={false}
        backImage={() =>
          BackButton({ iconColor: props.iconColor, icon: 'close' })
        }
        onPress={() => {
          navigation.dispatch(StackActions.pop())
        }}
      />
    )
  } else if (props.icon === 'close') {
    return (
      <HeaderBackButton
        labelVisible={false}
        backImage={() =>
          BackButton({ iconColor: props.iconColor, icon: 'close' })
        }
        onPress={() => {
          if (props.navigate)
            props.navigate()
          else
            navigation.goBack()
        }}
      />
    )
  }
}
function RightButton(props) {
  const [password, setPassword] = useState(false)
  const inset = useSafeAreaInsets()
  const [open, setOpen] = useState(false)

  function togglePassword() {
    setPassword(prev => !prev)
  }
  if (props.icon === 'share') {
    return (
      <HeaderBackButton
        labelVisible={false}
        backImage={() =>
          BackButton({ iconColor: props.iconColor, icon: 'share' })
        }
      />
    )
  } else if (props.icon === 'dots') {
    async function share() {
      try {
        const result = await Share.share({
            title: 'App link',
            message:
                'Изтегли приложението от тук: ',
        });
        if (result.action === Share.sharedAction) {
            if (result.activityType) {
                // shared with activity type of result.activityType
                FlashMessage({ message: 'Линка беше изпратен!', type: 'success' });
            } else {
                // shared
            }
        } else if (result.action === Share.dismissedAction) {
            // dismissed
        }
      } catch (error) {
          FlashMessage({ message: error.message, type: 'warning' });
      } finally {
          togglePassword()
      }
    }
  }
}
export function UserButton(props) {
  const navigation = useNavigation()
  const [password, setPassword] = useState(false)
  const inset = useSafeAreaInsets()
  const [modalVisible, setModalVisible] = useState(false)
  const dispatch = useDispatch()
  const { uid } = useSelector(state => state.user)

  async function handleUnblockUser() {
    try {
        await updateUserProperty(uid, 'blockedUsers', props.blockedUsers)
        .then((res) => {
            if (!res) {
                throw new Error('Failed to delete user profile');
            }          
        })
        .then(() => {
            dispatch(setBlockedUsers(props.blockedUsers))
            console.log(props.blockedUsers)
            FlashMessage({ message: 'Потребителя е успешно отблокиран.', type: 'success' })
        })
        .finally(() => {
            navigation.goBack()
        })
        .catch((error) => {
            throw new Error('Failed to delete user profile');
        })
    } catch (error) {
        FlashMessage({ message: 'Нещо се обърка! Опитайте отново по-късно.', type: 'danger' })
        console.error('Error during profile blocking process:', error);
    }
  }
  
  function onModalToggle(){
    setPassword(false)
    setModalVisible(!modalVisible)
  }

  function togglePassword() {
    setPassword(prev => !prev)
  }
  if (props.icon === 'share') {
    return (
      <HeaderBackButton
        labelVisible={false}
        backImage={() =>
          BackButton({ iconColor: props.iconColor, icon: 'share' })
        }
      />
    )
  } else if (props.icon === 'dots') {
    return (
      <View>
        { modalVisible && <BlockModal blockedUsers={props.blockedUsers} onModalToggle={onModalToggle}/>}
        {password ? (
            <Modal
              animationType="fade"
              transparent={true}
              onRequestClose={togglePassword}  
              visible={password}
            >
              {props.isBlocked ? (
                <TouchableOpacity activeOpacity={1} onPress={handleUnblockUser} >
                <BorderlessButton
                  onPress={props.onPress}
                  borderless={false}
                  style={[styles.shareBtn, { top: inset.top }]}
                >
                  <TextDefault textColor={colors.headerText} H5 bold style={styles.flex}>
                    {'Отблокирай'}
                  </TextDefault>
                </BorderlessButton>
              </TouchableOpacity>
              ) : (<TouchableOpacity activeOpacity={1} onPress={onModalToggle} >
                <BorderlessButton
                  onPress={props.onPress}
                  borderless={false}
                  style={[styles.shareBtn, { top: inset.top }]}
                >
                  <TextDefault textColor={colors.headerText} H5 bold style={styles.flex}>
                    {'Блокирай'}
                  </TextDefault>
                </BorderlessButton>
              </TouchableOpacity>)}
            </Modal>
        ) : (
            <HeaderBackButton
              labelVisible={false}
              backImage={
                () => BackButton({ iconColor: props.iconColor, icon: 'dots' })
              }
              onPress={togglePassword}
            />
          )
        }
      </View >
    )
  }
  else if (props.icon === 'text') {
    return (
      <BorderlessButton
        onPress={props.onPress}
        borderless={false}
        style={styles.rightOuter}
      >
        <TextDefault textColor={props.iconColor} H5 style={styles.textIcon}>
          {props.title}
        </TextDefault>
      </BorderlessButton>
    )
  }
}

BackButton.propTypes = {
  icon: PropTypes.string,
  iconColor: PropTypes.string.isRequired
}
LeftButton.propTypes = {
  action: PropTypes.string,
  icon: PropTypes.string,
  iconColor: PropTypes.string.isRequired
}
RightButton.propTypes = {
  icon: PropTypes.string,
  iconColor: PropTypes.string.isRequired
}

export { BackButton, LeftButton, RightButton }
