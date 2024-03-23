import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
//import { createMaterialTopTabNavigator  } from '@react-navigation/material-top-tabs';
import { getFocusedRouteNameFromRoute, NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import React, { useState } from 'react';
import { AccountScreens, AddScreens, ChatScreens, HomeScreens, SellScreens } from '../screens';
import { colors, scale } from '../utilities';
import { StackOptions, tabIcon, tabOptions, TopBarOptions } from './screenOptions';
import { useSelector } from 'react-redux';
import EditAd from '../screens/AddStack/MainAdd/Ads/EditAd';
import { Text, View, TouchableOpacity } from 'react-native';
import { SimpleLineIcons, Fontisto, MaterialCommunityIcons, Ionicons, FontAwesome5, AntDesign } from '@expo/vector-icons'
import { isDeviceTablet } from '../utilities/methods';

const Tabs = createBottomTabNavigator()
const TopTabs = createMaterialTopTabNavigator()
const MainStack = createStackNavigator()
const HomeStack = createStackNavigator()
const AccountStack = createStackNavigator()
const EditAccountStack = createStackNavigator()
const ChatStack = createStackNavigator()
const AddStack = createStackNavigator()
const SellStack = createStackNavigator()
const FilterStack = createStackNavigator()
const AccountTOP = createBottomTabNavigator()
const AdsTOP = createBottomTabNavigator()
const HomeTOP = createBottomTabNavigator()

function NetworkTabs() {
    return (
        <AccountTOP.Navigator initialRouteName='Following' tabBarOptions={TopBarOptions()}>
            <AccountTOP.Screen name='Следваш' component={AccountScreens.Following} />
            <AccountTOP.Screen name='Последователи' component={AccountScreens.Followers} />
        </AccountTOP.Navigator>
    )
}

function AdsTabs() {
    return (
        <AdsTOP.Navigator initialRouteName='Ads' tabBarOptions={TopBarOptions()}>
            <AdsTOP.Screen name='Моите Обяви' component={AddScreens.Ads} />
            <AdsTOP.Screen name='Любими' component={AddScreens.Favourite} />
        </AdsTOP.Navigator>
    )
}

function FilterScreen() {
    return (
        <FilterStack.Navigator initialRouteName='FilterModal' headerMode='screen' screenOptions={StackOptions()}>
            <FilterStack.Screen name='FilterModal' component={HomeScreens.FilterModal} />
            <FilterStack.Screen name='Categories' component={HomeScreens.Categories} options={{ title: 'Категории' }} />
            <FilterStack.Screen name='SubCategories' component={HomeScreens.SubCategories} />
        </FilterStack.Navigator>
    )
}

function HomeTabs() {
    return (
        <HomeStack.Navigator initialRouteName='Main' headerMode='screen' screenOptions={StackOptions()}>
            <HomeStack.Screen name='Main' component={HomeScreens.MainHome} />
            <HomeStack.Screen name='Categories' component={HomeScreens.Categories} options={{ title: 'Категории' }} />
            <HomeStack.Screen name='SubCategories' component={HomeScreens.SubCategories} />
            <HomeStack.Screen name='ProductListing' component={HomeScreens.ProductListing} />
            <HomeStack.Screen name='Notifications' component={HomeScreens.Notifications} />
            <HomeStack.Screen name='UserProfile' component={HomeScreens.UserProfile} />
        </HomeStack.Navigator>
    )
}
function ChatTabs() {
    return (
        <ChatStack.Navigator initialRouteName='MainChat' headerMode='screen' screenOptions={StackOptions()}>
            <ChatStack.Screen name='MainChat' component={ChatScreens.All} options={{
                title: 'Съобщения',
                headerStyle: {
                    backgroundColor: colors.headerbackground,
                },
                headerTitleContainerStyle: {
                    marginLeft: scale(0),
                },
            }} />
        </ChatStack.Navigator>
    )
}

function SellTabs() {
    return (
        <SellStack.Navigator initialRouteName='Home' screenOptions={StackOptions()}>
            <SellStack.Screen name='Home' component={SellScreens.MainSell} />
            <SellStack.Screen name='Categories' component={SellScreens.Categories} options={{ title: 'Изберете категория' }} />
            <SellStack.Screen name='SubCategories' component={SellScreens.SubCategories} />
            <SellStack.Screen name='SellingForm' component={SellScreens.SellingFrom} options={{ title: 'Повече информация' }} />
            <SellStack.Screen name='UploadImage' component={SellScreens.UploadImage} />
            <SellStack.Screen name='Price' component={SellScreens.Price} />
            <SellStack.Screen name='LocationConfirm' component={SellScreens.LocationConfirm} />
            <SellStack.Screen name='AdPosting' component={SellScreens.AdPosting} />
            <SellStack.Screen name='AdPosted' component={SellScreens.AdPosted} options={{ title: '' }} />
        </SellStack.Navigator>
    )
}

function CustomTabBar({ activeTab, setActiveTab }) {
    const textStyle = {
        fontSize: isDeviceTablet() ? 20 : 16,
        fontWeight: 'bold',
        textShadowColor: 'black',
        textShadowOpacity: 0.1,
        // textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 4,
        padding: scale(10),
        color: colors.white
        // backgroundColor: colors.buttonbackground,
    }
    return (
        <TouchableOpacity onPress={() => setActiveTab(activeTab === 'Търся си' ? 'Продавам' : 'Търся си')}>
            <View style={{
                flexDirection: 'row', justifyContent: 'space-around', width: '100%',
                backgroundColor: activeTab === 'Търся си' ? colors.searchy2 : colors.searchy1
            }}>
                {activeTab === 'Търся си' ? (
                    <Text style={textStyle}>Продавам</Text>
                ) : (
                    <Text style={textStyle}>Търся си</Text>
                )}
            </View>
        </TouchableOpacity>

    );
}

function CombinedTabs() {
    const [activeTab, setActiveTab] = useState('Търся си');
    const navigation = useNavigation();
    const { uid, isLoggedIn } = useSelector(state => state.user)

    return (
        <Tabs.Navigator
            tabBar={(props) => <CustomTabBar {...props} activeTab={activeTab} setActiveTab={setActiveTab} />}
            screenOptions={{
                tabBarVisible: false, // This will hide the default tab bar
            }}
        >
            {/* Always render both tabs but switch visibility based on activeTab */}
            {activeTab === 'Търся си' ? (
                <Tabs.Screen name="Търся си" component={HomeTabs} options={{ unmountOnBlur: true }} />
            ) : <Tabs.Screen name="Продавам" component={isLoggedIn ? SellTabs : AccountScreens.Registration} options={[{ unmountOnBlur: true }, !isLoggedIn && { tabBarButton: () => null, tabBarVisible: false }]} initialParams={{ hideBackButton: true }} />
            }
        </Tabs.Navigator>
    );
}

function AddTabs() {
    return (
        <AddStack.Navigator initialRouteName='MainAds' screenOptions={StackOptions()}>
            <AddStack.Screen name='MainAds' component={AdsTabs} options={{
                title: 'Обяви',
                headerStyle: {
                    backgroundColor: colors.headerbackground,
                },
            }} />
        </AddStack.Navigator>
    )
}

function EditAccount() {
    return (
        <EditAccountStack.Navigator initialRouteName='EditProfile' headerMode='screen' screenOptions={StackOptions()}>
            <EditAccountStack.Screen name='EditProfile' component={AccountScreens.EditProfile} />
            <EditAccountStack.Screen name='EditPhone' component={AccountScreens.EditPhone} />
            <EditAccountStack.Screen name='EditEmail' component={AccountScreens.EditEmail} />
        </EditAccountStack.Navigator>
    )
}

function AccountTabs() {
    return (
        <AccountStack.Navigator initialRouteName='MainAccount' headerMode='screen' screenOptions={StackOptions()}>
            <AccountStack.Screen name='MainAccount' component={AccountScreens.MainAccount} options={{ title: 'Моят Акаунт' }} />
            <AccountStack.Screen name='Help' component={AccountScreens.Help} options={{ title: 'Информация' }} />
            <AccountStack.Screen name='Settings' component={AccountScreens.Settings} options={{ title: 'Настройки' }} />
            <AccountStack.Screen name='Profile' component={AccountScreens.Profile} />
            <AccountStack.Screen name='UserProfile' component={HomeScreens.UserProfile} />
            <AccountStack.Screen name='Privacy' component={AccountScreens.Privacy} />
            <AccountStack.Screen name='Notifications' component={AccountScreens.Notifications} />
            <AccountStack.Screen name='HelpBrowser' component={AccountScreens.HelpBrowser} options={{ title: 'За Нас' }} />
            <AccountStack.Screen name='Network' component={NetworkTabs} options={{
                title: 'Моята социална мрежа',
                headerStyle: {
                    backgroundColor: colors.headerbackground,
                },
            }} />
            <AccountStack.Screen options={{ title: false }} name='Blocked' component={AccountScreens.Blocked} />
        </AccountStack.Navigator>
    )
}

const tabBarIcon = (focused, color, route) => {
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
}

function MyTabBar({ state, descriptors, navigation }) {
    return (
        <View style={{
            flexDirection: 'row',
            marginBottom: 20,
            backgroundColor: colors.bottomTabColor,
        }}>
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const label =
                    options.tabBarLabel !== undefined
                        ? options.tabBarLabel
                        : options.title !== undefined
                            ? options.title
                            : route.name;

                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name, route.params);
                    }
                };


                return (

                    options?.tabBarVisible == undefined || options?.tabBarVisible == true ?
                        <TouchableOpacity
                            accessibilityRole="button"
                            accessibilityState={isFocused ? { selected: true } : {}}
                            accessibilityLabel={options.tabBarAccessibilityLabel}
                            testID={options.tabBarTestID}
                            onPress={onPress}
                            style={{
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: colors.bottomTabColor,
                                padding: scale(5),
                            }}
                        >
                            {tabBarIcon(isFocused, isFocused ? colors.searchy1 : colors.searchy2, route)}
                        </TouchableOpacity>
                        :
                        null

                );
            })}
        </View>
    );
}


function BottomTabs() {
    const user = useSelector(state => state.user)
    const { isLoggedIn } = user
    return (
        <Tabs.Navigator
            tabBar={props => <MyTabBar {...props} />}
            initialRouteName='Home'
            backBehavior='history'
            tabBarOptions={tabOptions()}
            screenOptions={({ route }) => ({
                ...tabIcon(route)
            })}
        >
            <Tabs.Screen name='Home' component={CombinedTabs} />
            {/* <Tabs.Screen name='Home' component={HomeTabs} /> */}
            <Tabs.Screen name='Chat' component={isLoggedIn ? ChatTabs : AccountScreens.Registration} options={{ tabBarVisible: isLoggedIn ? true : false }} />
            <Tabs.Screen name='Add' component={isLoggedIn ? AddTabs : AccountScreens.Registration} options={{ tabBarVisible: isLoggedIn ? true : false }} />
            {/* <Tabs.Screen name='Sell' component={isLoggedIn ? SellTabs : AccountScreens.Registration} options={{
                tabBarVisible: false
            }} /> */}
            <Tabs.Screen name='Account' component={AccountTabs} />
            <Tabs.Screen name='ProductDescription' component={HomeScreens.ProductDescription} options={{ tabBarButton: () => null, tabBarVisible: false }} />
            <Tabs.Screen name='EditProfile' component={isLoggedIn ? EditAccount : AccountScreens.Registration} options={{ tabBarButton: () => null, tabBarVisible: false }} />
        </Tabs.Navigator >
    )
}

function AppContainer() {
    const user = useSelector(state => state.user)
    const { isLoggedIn } = user
    return (

        <NavigationContainer>
            <MainStack.Navigator initialRouteName='BottomTabs' headerMode='screen' >
                <MainStack.Screen name='BottomTabs' component={BottomTabs} options={{ headerShown: false }} />
                <MainStack.Screen name='Registration' component={AccountScreens.Registration} options={{ headerShown: false }} />
                <MainStack.Screen name='Entry' component={AccountScreens.Entry} options={{ headerShown: false }} />
                <MainStack.Screen name='ForgotPassword' component={AccountScreens.ForgotPassword} options={{ headerShown: false }} />
                <MainStack.Screen name='EditAd' options={{ title: 'Редактирай Обява' }} component={EditAd} />
                <MainStack.Screen name='Promote' component={AddScreens.Promote} options={{ title: 'Промотирай' }} />
                <MainStack.Screen name='FilterModal' component={FilterScreen} options={{
                    headerShown: false,
                    ...TransitionPresets.ModalSlideFromBottomIOS
                }} />
                <MainStack.Screen name='LiveChat' component={isLoggedIn ? ChatScreens.LiveChat : AccountScreens.Registration} options={{
                    ...TransitionPresets.ModalSlideFromBottomIOS
                }} />
                <MainStack.Screen name='Sell' component={isLoggedIn ? SellTabs : AccountScreens.Registration} options={{ headerShown: false }} />
            </MainStack.Navigator>
        </NavigationContainer>
    )
}


export default AppContainer;