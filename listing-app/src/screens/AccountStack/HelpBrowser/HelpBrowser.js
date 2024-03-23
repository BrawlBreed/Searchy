import { useNavigation } from '@react-navigation/native'
import React, { useState, useLayoutEffect } from 'react'
import { View, ActivityIndicator, Text, Image, Touchable, TouchableOpacity, Linking } from 'react-native'
import { WebView } from 'react-native-webview'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors } from '../../../utilities'
import styles from '../../HomeStack/ProductDescription/style'
import { ScrollView } from 'react-native-gesture-handler'
import { TextDefault } from '../../../components'

function HelpBrowser() {
  const [icon, setIcon] = useState(require('../../../../assets/icon.png'))
  const swapIcon = () => {
    icon === require('../../../../assets/icon.png') ? setIcon(require('../../../../assets/splash.png')) : setIcon(require('../../../../assets/icon.png'))
  }
  const handlePress = () => {
    Linking.openURL('https://www.termsfeed.com/live/8857c84c-8248-4ef0-8fdf-54ec7bb362b2')
  }
  return (
    <SafeAreaView style={[styles.flex, styles.safeAreaview]}>
      <ScrollView style={[styles.flex, styles.mainContainer]}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity onPress={swapIcon}>
            <Image
              source={icon}
              style={styles.icon}
              resizeMode='contain'
            />
        </TouchableOpacity>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ 
          textAlign: 'center', 
          fontSize: 18, 
          fontWeight: 'bold', 
          marginBottom: 10 
        }}>
          Относно Searchy
        </Text>
        <Text style={{ 
          textAlign: 'center', 
          fontSize: 16, 
          padding: 10, 
          lineHeight: 24 
        }}>
          Searchy е мобилно приложение, разработено за купуване и продаване на продукти, което предлага лесен и интуитивен интерфейс за навигация между множество категории стоки. Потребителите могат да създават и управляват свои обяви, както и да търсят и разглеждат предложения на други. С функцията за последване, купувачите могат да се абонират за обновления от любимите си продавачи, а продавачите - да изградят своя последователска база и по този начин да увеличат видимостта на своите продукти. Приложението включва и опция за платено промотиране на обяви, което позволява на продавачите да постигнат по-голямо излагане на своите оферти сред потенциални клиенти. Всички транзакции се извършват бързо и безопасно чрез интегрираната платежна система. Searchy предлага удобен и цялостен начин за пазаруване и продажба в движение.
        </Text>
      </View>
      <TouchableOpacity onPress={handlePress}>
        <TextDefault textColor={colors.fontSecondColor} bold center small style={{ textDecorationLine: "underline", paddingBottom: 10  }}>
        {'Условия за ползване'}
      </TextDefault>
      </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
)
}

export default React.memo(HelpBrowser)
