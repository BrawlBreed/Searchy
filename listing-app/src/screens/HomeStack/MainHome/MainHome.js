import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { FlatList, Image, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LocationModal, MainHeader, TextDefault } from '../../../components';
import SearchModal from '../../../components/Modal/SearchModal/SearchModal';
import { alignment, colors } from '../../../utilities';
import Card from './Card/Card';
import styles from './styles';
import useMainHome from '../../../hooks/useMainHome';
import useCategories from '../../../hooks/useCategories';

const COLORS = ['#ffd54d', '#6df8f3', '#ff7a7a', '#d5b09f', '#eccbcb']

function MainHome() {
  const inset = useSafeAreaInsets()
  const navigation = useNavigation()
  const [filters, setFilters] = useState('zoneId1')
  const [modalVisible, setModalVisible] = useState(false);
  const [searchVisible, setSerachVisible] = useState(false);
  const { loading, error, items } = useMainHome('zoneId1');

  useEffect(() => {
    console.log(error)
  }, [error])

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => <MainHeader onModalToggle={toggleModal} toggleSearch={toggleSearch} locationText={filters} />
    })
  }, [navigation, filters])

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
          <View style={styles.headerContainer}>
            {categoryHeader()}
            <FlatList
              data={categories}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.categoryContainer}
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
          </View>
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
      loading ? <TextDefault>"Loading..."</TextDefault> :
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
              ListEmptyComponent={emptyView}
              ListHeaderComponent={renderHeader}
              numColumns={2}
              renderItem={({ item }) => (
                <Card {...item} />
              )}
            />

            {/* Modal */}
            <LocationModal visible={modalVisible} onModalToggle={toggleModal}
              setFilters={setFilters} />
            <SearchModal visible={searchVisible} onModalToggle={toggleSearch} />
          </View>
    }
      
    </>
    
  );
}

export default MainHome
