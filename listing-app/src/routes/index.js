 import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
 //import { createMaterialTopTabNavigator  } from '@react-navigation/material-top-tabs';
 import { NavigationContainer } from '@react-navigation/native';
 import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
 import React from 'react';
 import { AccountScreens, AddScreens, ChatScreens, HomeScreens, SellScreens } from '../screens';
 import { colors, scale } from '../utilities';
 import { StackOptions, tabIcon, tabOptions, TopBarOptions } from './screenOptions';
import { useSelector } from 'react-redux';
import EditAd from '../screens/AddStack/MainAdd/Ads/EditAd';

 const Tabs = createBottomTabNavigator()
 const MainStack = createStackNavigator()
 const HomeStack = createStackNavigator()
 const AccountStack = createStackNavigator()
 const EditAccountStack = createStackNavigator()
 const ChatStack = createStackNavigator()
 const AddStack = createStackNavigator()
 const SellStack = createStackNavigator()
 const FilterStack = createStackNavigator()
 const AccountTOP = createBottomTabNavigator()
 const ChatTOP = createBottomTabNavigator()
 const AdsTOP = createBottomTabNavigator()
 const AdStack = createStackNavigator();

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

function AdStackScreen() {
    return (
      <AdStack.Navigator>
        <AdStack.Screen name="Ads" component={AddScreens.Ads} />
        <AdStack.Screen name="EditAd" component={EditAd} />
      </AdStack.Navigator>
    );
  }
  
function InboxTabs() {
    return (
        <ChatTOP.Navigator initialRouteName='All'
            tabBarOptions={TopBarOptions()}
        >
            <ChatTOP.Screen name='All' options={{tabBarButton: () => null, title: '', tabBarStyle: { display: 'none' }}} component={ChatScreens.All} />
            {/* <ChatTOP.Screen name='Buying' component={ChatScreens.Buying} />
            <ChatTOP.Screen name='Selling' component={ChatScreens.Selling} /> */}
        </ChatTOP.Navigator>
    )
}

function FilterScreen() {
    return (
        <FilterStack.Navigator initialRouteName='FilterModal' headerMode='screen' screenOptions={StackOptions()}>
            <FilterStack.Screen name='FilterModal' component={HomeScreens.FilterModal} />
            <FilterStack.Screen name='Categories' component={HomeScreens.Categories} options={{ title: 'Категории'}} />
            <FilterStack.Screen name='SubCategories' component={HomeScreens.SubCategories} />
        </FilterStack.Navigator>
    )
}

function HomeTabs() {
    return (
        <HomeStack.Navigator initialRouteName='Main' headerMode='screen' screenOptions={StackOptions()}>
            <HomeStack.Screen name='Main' component={HomeScreens.MainHome} />
            <HomeStack.Screen name='Categories' component={HomeScreens.Categories} options={{ title: 'Категории'}} />
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
            <ChatStack.Screen name='MainChat' component={InboxTabs} options={{
                title: 'Съобщения',
                headerStyle: {
                    backgroundColor: colors.headerbackground,
                },
                headerTitleContainerStyle: {
                    marginLeft: scale(0),
                },
            }} />
            {/* <ChatStack.Screen name='LiveChat' component={ChatScreens.LiveChat} /> */}
        </ChatStack.Navigator>
    )
}

function SellTabs() {
    return ( 
        <SellStack.Navigator initialRouteName='Home' screenOptions={StackOptions()}>
            <SellStack.Screen name='Home' component={SellScreens.MainSell} />
            <SellStack.Screen name='Categories' component={SellScreens.Categories} options={{ title: 'Choose a category' }} />
            <SellStack.Screen name='SubCategories' component={SellScreens.SubCategories} />
            <SellStack.Screen name='SellingForm' component={SellScreens.SellingFrom} options={{ title: 'Повече информация' }} />
            <SellStack.Screen name='UploadImage' component={SellScreens.UploadImage} />
            <SellStack.Screen name='Price' component={SellScreens.Price} />
            <SellStack.Screen name='LocationConfirm' component={SellScreens.LocationConfirm} />
            <SellStack.Screen name='AdPosting' component={SellScreens.AdPosting} />
            <SellStack.Screen name='AdPosted' component={SellScreens.AdPosted} />
        </SellStack.Navigator>
    )
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
            <AccountStack.Screen name='Help' component={AccountScreens.Help} options={{ title: 'Help and Support' }} />
            <AccountStack.Screen name='Settings' component={AccountScreens.Settings} />
            <AccountStack.Screen name='Profile' component={AccountScreens.Profile} />
            <AccountStack.Screen name='UserProfile' component={HomeScreens.UserProfile} />
            <AccountStack.Screen name='Privacy' component={AccountScreens.Privacy} />
            <AccountStack.Screen name='Notifications' component={AccountScreens.Notifications} />
            <AccountStack.Screen name='HelpBrowser' component={AccountScreens.HelpBrowser} />
            <AccountStack.Screen name='Network' component={NetworkTabs} options={{
                title: 'Моята социална мрежа',
                headerStyle: {
                    backgroundColor: colors.headerbackground,
                },
            }} />
        </AccountStack.Navigator>
    )
}


function BottomTabs() {
    const user = useSelector(state => state.user)
    const { isLoggedIn } = user
    return (
        <Tabs.Navigator initialRouteName='Home' backBehavior='history' tabBarOptions={tabOptions()}
            screenOptions={({ route }) => tabIcon(route)}>
            <Tabs.Screen name='Home' component={HomeTabs} />
            <Tabs.Screen name='Chat' component={isLoggedIn ? ChatTabs : AccountScreens.Registration} options={{ tabBarVisible: isLoggedIn ? true : false }} />
            <Tabs.Screen name='Sell' component={isLoggedIn ? SellTabs : AccountScreens.Registration} options={{
                tabBarVisible: false
            }} />
            <Tabs.Screen name='Add' component={isLoggedIn ? AddTabs : AccountScreens.Registration} options={{ tabBarVisible: isLoggedIn ? true : false }} />
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
                <MainStack.Screen name='Entry' component={AccountScreens.Entry} options={{ headerShown: false }}/>
                <MainStack.Screen name='ForgotPassword' component={AccountScreens.ForgotPassword}  options={{ headerShown: false }}/>
                <MainStack.Screen name='EditAd' component={EditAd}/>
                <MainStack.Screen name='FilterModal' component={FilterScreen} options={{
                    headerShown: false,
                    ...TransitionPresets.ModalSlideFromBottomIOS
                }} />
                <MainStack.Screen name='LiveChat' component={isLoggedIn ? ChatScreens.LiveChat : AccountScreens.Registration} options={{
                    ...TransitionPresets.ModalSlideFromBottomIOS
                }} />
            </MainStack.Navigator>
        </NavigationContainer>
    )
}

export default AppContainer;