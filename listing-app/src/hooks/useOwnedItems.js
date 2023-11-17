import { gql, useLazyQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GET_ITEM_BY_ID, GET_ZONES_QUERY } from '../apollo/server';
import { useFocusEffect } from '@react-navigation/native';
// import { setownedItems, appendownedItems, removeFavorite } from '../store/reducers/User/userSlice';

const useOwnedItems = (navigation) => {
  const [items, setItems] = useState([]);
  const { uid, ownedItems, changed } = useSelector(state => state.user);
  const [getUser] = useLazyQuery(GET_ZONES_QUERY);  
  const [getItemById, { loading, error, refetch }] = useLazyQuery(GET_ITEM_BY_ID);

  async function fetchOwnedItems() {
    try {
      const filteredOwnedItems = ownedItems.filter(favorite => favorite !== '');

      if(filteredOwnedItems.length) { 
        await refetch();
        // Fetch each favorite item details
        const favoriteItemsPromises = filteredOwnedItems.map(favoriteId =>
          getItemById({ variables: { id: favoriteId } })
        );

        // Wait for all the items to be fetched
        const ownedItemsResponse = await Promise.all(favoriteItemsPromises);

        // Extract the data and set the items
        const newItems = ownedItemsResponse.map(response => response.data.getItemById).filter(item => item !== null);
        setItems(newItems);
      }      
    } catch (error) {
      console.error('Error fetching user ownedItems:', error);
    }
  };


  // Fetch user ownedItems initially and when `uid` changes
  useFocusEffect(
    React.useCallback(() => {
      if (uid) {
        fetchOwnedItems();
      }
      return () => {
        // Any cleanup logic goes here
    }}, [uid, getUser, refetch, ownedItems])
  ) // Removed navigation from dependencies

  return {
    refetch,
    items,
    loading,
    error,
  };
};

export default useOwnedItems;
