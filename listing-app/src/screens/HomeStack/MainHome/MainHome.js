import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { FlatList, Image, TouchableOpacity, View, RefreshControl } from 'react-native';
import { LocationModal, MainHeader, TextDefault } from '../../../components';
import SearchModal from '../../../components/Modal/SearchModal/SearchModal';
import { alignment, colors } from '../../../utilities';
import Card from './Card/Card';
import styles from './styles'; 
import useMainHome from '../../../hooks/useMainHome';
import useCategories from '../../../hooks/useCategories';
import { setZone } from '../../../store/reducers/Item/addItemSlice';
import { useDispatch, useSelector } from 'react-redux';
import { checkUserAuth } from '../../../store/reducers/User/userSlice';
import { ScrollView } from 'react-native-gesture-handler';

const COLORS = ['#ffd54d', '#6df8f3', '#ff7a7a', '#d5b09f', '#eccbcb']

function MainHome() {
  const navigation = useNavigation()
  const [modalVisible, setModalVisible] = useState(false);
  const [searchVisible, setSerachVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { zone, userId } = useSelector(state => state.addItem)
  const { isLoggedIn } = useSelector(state => state.user)
  const dispatch = useDispatch()
  const { refetch, loading, error, items } = useMainHome();


  useEffect(() => {
    refetch()
  }, [])

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refetch().then(() => {
      setRefreshing(false);
    }).catch(() => {
      setRefreshing(false);
    });
  }, [refetch]);

  useEffect(() => {
    dispatch(checkUserAuth())
  }, [])

  useEffect(() => {
    console.log(error)
  }, [error])
  
  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => <MainHeader onModalToggle={toggleModal} toggleSearch={toggleSearch} locationText={zone.zone} />
    })
  }, [navigation, zone.zone])

  useLayoutEffect(() => {
    fetch('https://geolocation-db.com/json/')
      .then(response => response.json())
      .then((data) => {
        dispatch(setZone({
          zone: data.city,
          coordinates: {
            latitude: data.latitude,
            longitude: data.longitude
          }
        }))
      })
      .catch(error => console.log(error))  
  }, [])

  function toggleModal() {
    setModalVisible(prev => !prev)
  }

  function toggleSearch() {
    setSerachVisible(prev => !prev)
  }

  function emptyView() {
    return (
      <View style={[styles.flex, styles.emptyContainer]}> 
        <Image
          style={styles.emptyImage}
          source={require('../../../assets/images/emptyView/noData.png')}
        />
        <TextDefault H5 center bold style={alignment.MTlarge}>
          Не намерихме нищо!
        </TextDefault>
        <TextDefault center light>
          Моля свържете се с оператор!
        </TextDefault>
      </View>
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
 
  function renderHeader() {
    const { loading, error, categories } = useCategories()

    return (
      <>
        {loading ? <TextDefault>Loading...</TextDefault> : 
        error ? <TextDefault center>Грешка!</TextDefault> :
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
                  onPress={() => navigation.navigate('SubCategories', { headerTitle: item.title })}>
                  <View style={styles.textViewContainer}>
                    <View style={[styles.iconContainer, { backgroundColor: COLORS[index % 5] }]}>
                      <Image
                        style={styles.imgResponsive}
                        source={item.image}
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
            <TextDefault H5 bold>
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
      loading ? <TextDefault>Loading...</TextDefault> :
      error ? <TextDefault center>Грешка!</TextDefault> :
      items.length === 0 ? emptyView() : 
        <View style={[styles.flex, styles.container]}>
            {/* Browser Container */}
            <FlatList
              data={items}
              style={[styles.flex, styles.flatList]}
              contentContainerStyle={{ flexGrow: 1, backgroundColor: colors.containerBox, ...alignment.PBlarge }}
              keyExtractor={item => item.id}
              showsVerticalScrollIndicator={false}
              refreshing={refreshing}
              onRefresh={onRefresh}
              ListEmptyComponent={emptyView}
              ListHeaderComponent={renderHeader}
              numColumns={2}
              renderItem={({ item }) => (
                <Card {...item} />
              )}
            />

            {/* Modal */}
            <LocationModal visible={modalVisible} onModalToggle={toggleModal}/>
            <SearchModal visible={searchVisible} onModalToggle={toggleSearch} />
          </View>
    }
      
    </>
    
  );
}

export default MainHome
