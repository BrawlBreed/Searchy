import { gql, useLazyQuery } from '@apollo/client';
import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GET_ITEM_BY_ID, GET_ZONES_QUERY } from '../apollo/server';
import { useFocusEffect } from '@react-navigation/native';
import { setCurrentUser } from '../store/reducers/User/userSlice'; 
import { client } from '../apollo';

const useOwnedItems = () => { 
  const [items, setItems] = useState([]);
  const [ initalItems, setInitialItems ] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const { uid, ownedItems, changed } = useSelector(state => state.user);
  const [getUser, { data: userData, refetch: refetchUser }] = useLazyQuery(GET_ZONES_QUERY, {
    fetchPolicy: 'network-only'
  });
  const [getItemById, { loading, data: itemsData, refetch: refetch, error }] = useLazyQuery(GET_ITEM_BY_ID, {
    fetchPolicy: 'network-only'
  });
  const dispatch = useDispatch();

  async function fetchOwnedItems() {
    try {
      const filteredOwnedItems = ownedItems.filter(favorite => favorite !== '' && favorite !== null && favorite !== undefined);
      if(filteredOwnedItems.length) { 
        // Fetch each favorite item details
        const favoriteItemsPromises = filteredOwnedItems.map(ownedItemId =>
          getItemById({ variables: { id: ownedItemId } })
        );

        // Wait for all the items to be fetched
        const ownedItemsResponse = await Promise.all(favoriteItemsPromises);

        // Extract the data and set the items
        const newItems = ownedItemsResponse.map(({ data }) =>
          data?.getItemById && ({...data?.getItemById , id: data?.getItemById._id })
        )
          .filter(item => item !== null)
          .reduce((unique, item) => {
            if (!unique.some(i => i.id === item.id)) {
              unique.push(item);
            }
            return unique;
          }, []);  
        setInitialItems(newItems);
        setItems(newItems);
      }      
    } catch (error) {
      console.error('Error fetching user ownedItems:', error);
    }
  };

  useEffect(() => {
    if (uid) {
      getUser({ variables: { userId: uid } });
    }
  }, [uid, getUser]);

  useFocusEffect(
    useCallback(() => {
      if (uid) {
        fetchOwnedItems();
      }
    }, [uid, ownedItems, refreshing]) // Ensure to include only relevant dependencies
  );

  useEffect(() => {
    if (userData?.getUserById) {
      dispatch(setCurrentUser(userData.getUserById));
    }
  }, [userData, dispatch]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      // Refetch user data
      await refetchUser();

      // Refetch items data
      await refetch({ variables: { ids: ownedItems } });

      // Update state if needed, based on the new itemsData
      if (itemsData?.getItemsByIds) {
        setItems(itemsData.getItemsByIds);
      }
    } catch (error) {
      console.error('Error during refetch:', error);
    } finally {
      setRefreshing(false);
    }
  }, [refetchUser, refetch, ownedItems]);

      
    return {
    refetch,
    onRefresh,
    refreshing, 
    setRefreshing,
    items,
    initalItems,
    setItems,
    loading,
    error,
  };
};

export default useOwnedItems;