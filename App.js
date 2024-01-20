import { useFonts, Roboto_100Thin, Roboto_300Light, Roboto_400Regular, Roboto_500Medium, Roboto_700Bold, } from '@expo-google-fonts/roboto';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { Text } from 'react-native';
import FlashMessage from 'react-native-flash-message';
import { LogBox } from 'react-native';
import AppContainer from './src/routes';
import { colors } from './src/utilities';
//import { AppLoading } from 'expo';
import AppLoading from 'expo-app-loading';
import * as SplashScreen from 'expo-splash-screen';
import { ApolloProvider } from '@apollo/client';
import { client } from './src/apollo';
import store from './src/store/store';
import { StripeProvider } from '@stripe/stripe-react-native';
import { Provider } from 'react-redux';
import { PUBLISHABLE_KEY } from '@env';
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();//Ignore all log notifications

export default function App() {
  const [fontsLoaded] = useFonts({
    Thin: Roboto_100Thin,
    Light: Roboto_300Light,
    Regular: Roboto_400Regular,
    Bold: Roboto_500Medium,
    Bolder: Roboto_700Bold
  });

  if (!fontsLoaded) {
    return (
      <></>
      // <AppLoading />
    );
  }
  else {
    return (
      <Provider store={store}>
        <ApolloProvider client={client}>
          <StripeProvider merchantIdentifier='merchant.com.{{Searchy}}' publishableKey='pk_test_51OLvKBINs8xtGITdaYDRuYZ4ikWWFig9QPPQDumWd23ZApwUPXfMT4D88msuDicH3I06ndsz18681Ms8M1BQyQWm00ecsh6bFI'>
            <AppContainer />
            <StatusBar style="dark" backgroundColor={colors.buttonbackground} />
            <FlashMessage position="top" />
          </StripeProvider>
        </ApolloProvider>
      </Provider>
    )
  }
} 
