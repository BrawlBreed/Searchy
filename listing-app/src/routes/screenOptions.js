import React from 'react'
import { colors, scale, textStyles } from '../utilities'
import { SimpleLineIcons, Fontisto, MaterialCommunityIcons, Ionicons, FontAwesome5, AntDesign } from '@expo/vector-icons'
import { BackButton } from '../components'
import { StyleSheet } from 'react-native'


function StackOptions() {
    return ({
        headerTitleAlign: 'center',
        headerBackTitleVisible: false,
        headerStyle: {
            backgroundColor: colors.headerbackground,
            borderBottomColor: colors.horizontalLine,
            borderBottomWidth: StyleSheet.hairlineWidth,
        },
        headerTitleContainerStyle: {
            marginLeft: scale(45),
        },
        headerTitleStyle: {
            color: colors.headerText,
            ...textStyles.H3,
            ...textStyles.Bold
        },
        headerBackImage: () =>
            BackButton({ iconColor: colors.headerText, icon: 'leftArrow' }),
    })
}

function TopBarOptions() {
    return ({
        labelStyle: {
            fontSize: 16,
            paddingTop: 8,
            fontWeight: 'bold',
            textShadowColor: 'black',
            textShadowOpacity: 0.1,
            textShadowOffset: { width: 1, height: 1 },
            textShadowRadius: 4,
        },
        indicatorStyle: { height: 0 }, // Removes the tab indicator line
        underlineColor: 'transparent', // Makes sure no underline color
        activeTintColor: colors.searchy1,
        inactiveTintColor: colors.white,
        style: {
            height: scale(60),
            backgroundColor: colors.searchy2,
            borderTopWidth: 0,
            borderTopColor: 'transparent',
            borderBottomWidth: 0,
            borderBottomColor: 'transparent',
            elevation: 0, // For Android shadow
            shadowColor: 'transparent', // For iOS shadow color
            shadowOffset: { width: 0, height: 0 }, // For iOS shadow offset
            shadowRadius: 0, // For iOS shadow radius
            shadowOpacity: 0, // For iOS shadow opacity
        },
    })
}

function tabOptions() {
    return ({
        showLabel: false,
        activeTintColor: colors.searchy1,
        inactiveTintColor: colors.searchy2,
        keyboardHidesTabBar: true,
        tabStyle: {
            backgroundColor: colors.bottomTabColor,
            padding: scale(5),
            justifyContent: "center",
            alignItems: "center",
        },
        labelStyle: {
            ...textStyles.Bold,
            ...textStyles.UpperCase,
            justifyContent: "center",
        },
        style: {
            backgroundColor: colors.bottomTabColor,
        },
    })
}

function tabIcon(route) {
    return ({
        tabBarIcon: ({ focused, color, size }) => {
            let icon
            if (route.name === 'Home') {
                focused ? icon = <Fontisto name='home' size={scale(21)} color={color} /> :
                    icon = <SimpleLineIcons name='home' size={scale(21)} color={color} />
            } else if (route.name === 'Chat') {
                focused ? icon = <MaterialCommunityIcons name='chat' size={scale(25)} color={color} /> :
                    icon = <SimpleLineIcons name='bubble' size={scale(20)} color={color} />
            } else if (route.name === 'Sell') {
                focused ? icon = <AntDesign name='pluscircle' size={scale(22)} color={color} /> :
                    icon = <SimpleLineIcons name='plus' size={scale(22)} color={color} />
            } else if (route.name === 'Add') {
                focused ? icon = <AntDesign name='heart' size={scale(21)} color={color} /> :
                    icon = <SimpleLineIcons name='heart' size={scale(21)} color={color} />
            } else if (route.name === 'Account') {
                focused ? icon = <FontAwesome5 name='user-alt' size={scale(25)} color={color} /> :
                    icon = <SimpleLineIcons name='user' size={scale(22)} color={color} />
            }
            return icon
        },
    })
}

export { tabOptions, tabIcon, TopBarOptions, StackOptions }