import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { FlatList, Image, TouchableOpacity, View, RefreshControl, Platform } from 'react-native';
import { LocationModal, MainHeader, TextDefault } from '../../../components';
import SearchModal from '../../../components/Modal/SearchModal/SearchModal';
import { alignment, colors } from '../../../utilities';
import Card from './Card/Card';
import styles from './styles'; 
import useMainHome from '../../../hooks/useMainHome';
import useCategories from '../../../hooks/useCategories';
import { setZone } from '../../../store/reducers/Item/addItemSlice';
import { useDispatch, useSelector } from 'react-redux';
import { checkUserAuth, setCurrentUser } from '../../../store/reducers/User/userSlice';
import { ScrollView } from 'react-native-gesture-handler';
import { getRemainingCountOrTen } from '../../../utilities/methods';
import { ActivityIndicator } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import EULAModal from '../../../components/Modal/EULAModal/EULAModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { AppOpenAd, InterstitialAd, RewardedAd, BannerAd, TestIds, BannerAdSize } from 'react-native-google-mobile-ads';

const COLORS = [colors.searchy1, colors.searchy2]

function MainHome() {
  const navigation = useNavigation()
  const [loadingFooter, setLoadingFooter] = useState(false)
  const [modalVisible, setModalVisible] = useState(true);
  const [searchVisible, setSerachVisible] = useState(false);
  const [EULAModalVisible, setEULAModal] = useState(false);
  const { loading: loadingCategories, error: errorCategories, categories } = useCategories()
  const { zone } = useSelector(state => state.addItem)
  const dispatch = useDispatch()
  const { loading, items, refreshing, setRefreshing, fetchItems, setCurrentLimit, currentLimit, lastId, getItems } = useMainHome(refreshing);
  const adUnitId = Platform.OS === 'ios' ? 'ca-app-pub-6009235772551043~5795958407' : 'ca-app-pub-6009235772551043~3123878820';

  const checkEULAAcceptance = async () => {
    try {
        const value = await AsyncStorage.getItem('EULA_KEY');
        console.log(value)
        if(value !== null) {
            // EULA was already accepted
            return
        }else{
            setEULAModal(true)
        }
    } catch(e) {
    }
  };

  const onEULAModalToggle = () => {
    setEULAModal(prev => !prev)
  }

  useEffect(() => {
    checkEULAAcceptance();
  }, []);
  
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchItems().then(() => {
      setRefreshing(false);
    }).catch(() => {
      setRefreshing(false);
    });
  }, [refreshing]);
 
  useEffect(() => {
    dispatch(checkUserAuth())
  }, [])

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => <MainHeader onModalToggle={toggleModal} toggleSearch={toggleSearch} locationText={zone.zone} />
    })
  }, [navigation, zone.zone])

  function toggleModal() {
    setModalVisible(prev => !prev)
  }

  function toggleSearch() {
    setSerachVisible(prev => !prev)
  }

  function emptyView() {
    return (
      <ScrollView refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={[styles.emptyContainer, {height: '100%'}]} style={[styles.flex]}> 
                    <LocationModal visible={modalVisible} onModalToggle={toggleModal}/>
            <SearchModal categories={categories} visible={searchVisible} onModalToggle={toggleSearch} />              

        <Image
          style={styles.emptyImage}
          source={require('../../../assets/images/emptyView/emptyBox1.png')}
        />
        <TextDefault H5 center bold style={alignment.MTlarge}>
          Продължавай да търсиш...
        </TextDefault>
        <TextDefault center light>
          Не намерихме нищо във вашия регион.
        </TextDefault>
      </ScrollView>
    )
  }
  function categoryHeader() {
    return (
      <View style={styles.categoryHeader}>
        <TextDefault H5 bold>
          {'Разгледай категориите'}
        </TextDefault>
        <TouchableOpacity style={styles.rightBtn}
          onPress={() => navigation.navigate('Categories')}
        >
          <TextDefault H5 bolder>Вижте всички</TextDefault>
        </TouchableOpacity>
      </View>
    )
  }

  const fetchAnother10 = async () => {
    const length = getRemainingCountOrTen(items.length)
    if(length === 0) return;
    setLoadingFooter(true);
    await getItems();
    setLoadingFooter(false);

    setCurrentLimit(items.length + length)
  }

  function renderHeader() {
    function navigateScreen(category) {
        navigation.navigate('ProductListing', { search: 'View All', category: category })
    }
    return (
      // <></>
      <>
        {loadingCategories ?       
        <View style={[styles.flex, styles.container]}>
          <ActivityIndicator size={100} color={colors.searchy1} />
        </View> : 
        errorCategories ? <TextDefault center>Грешка!</TextDefault> :
        categories.length === 0 ? emptyView() : 
        <>
          <ScrollView style={styles.headerContainer} 
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}>
            {categoryHeader()}
            <FlatList
              data={categories}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.categoryContainer}
              refreshing={refreshing}
              onRefresh={onRefresh}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item, index }) => (
                <TouchableOpacity 
                  activeOpacity={0.5}
                  style={styles.cardContainer}
                  onPress={() => navigateScreen(item.title)}>
                  <View style={styles.textViewContainer}>
                    <View style={[styles.iconContainer, { backgroundColor: COLORS[Math.round(Math.random())] }]}>
                      <Image
                        style={styles.imgResponsive}
                        source={{uri: item.image}}
                      />
                    </View>
                    <TextDefault numberOfLines={1} uppercase small light>
                      {item.title}
                    </TextDefault>
                  </View>
                </TouchableOpacity>
              )}
            />
          </ScrollView>
          <View style={styles.spacer} />
          <View style={styles.headerTitle}>
            <TextDefault center H5 bold>
              {'Предложения за теб'}
            </TextDefault>
          </View>
        </>}
        
      </>
    )
  }
  return (
  <>
    {
      loading ?         
      <View style={[styles.flex, styles.container]}>
        <ActivityIndicator color={colors.searchy2} />
      </View> :
      // error ? <TextDefault center>Грешка!</TextDefault> :
      items.length === 0 ? emptyView() : 
        <View style={[styles.flex, styles.container]}>
            <EULAModal onModalToggle={onEULAModalToggle} visible={EULAModalVisible} />
            <LocationModal visible={modalVisible} onModalToggle={toggleModal}/>
            <SearchModal categories={categories} visible={searchVisible} onModalToggle={toggleSearch} />              
            <FlatList
              data={items}
              style={[styles.flex, styles.flatList]}
              contentContainerStyle={{ flexGrow: 1, backgroundColor: colors.containerBox, ...alignment.PBlarge }}
              keyExtractor={item => item.id}
              showsVerticalScrollIndicator={false}
              refreshing={refreshing}
              onRefresh={onRefresh}
              onEndReached={() => fetchAnother10()}
              onEndReachedThreshold={0.5}
              ListEmptyComponent={emptyView}
              ListHeaderComponent={renderHeader}
              ListFooterComponent={<></>}
              numColumns={2}
              renderItem={({ item }) => (
                <Card {...item} /> 
              )}
            />
          </View>
    }
  </>

  )
}
export default MainHome
