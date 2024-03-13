import { gql, useLazyQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GET_ITEM_BY_ID, GET_ZONES_QUERY } from '../apollo/server';
import { setFavorites, appendFavorites, removeFavorite } from '../store/reducers/User/userSlice';
import { fetchBlockedUsers } from '../firebase';

const useFavorites = () => {
  const [items, setItems] = useState([]);
  const { uid, favorites, blockedUsers } = useSelector(state => state.user);
  const [getUser] = useLazyQuery(GET_ZONES_QUERY);  
  const [getItemById, { loading, error }] = useLazyQuery(GET_ITEM_BY_ID);
 
  const setIsBlocked = async (userId) => {
    const userBlockedUsers = await fetchBlockedUsers(userId)
    return((userBlockedUsers || [])?.includes(uid) || (blockedUsers || [])?.includes(userId))
  }

  useEffect(() => {
    const fetchUserFavorites = async () => {
      try {
        // const response = await getUser({ variables: { userId: uid } });
        // if (response.data?.getUserById) {
        const filteredFavorites = favorites?.filter(favorite => favorite !== '') || [];

        // Fetch each favorite item details
        const favoriteItemsPromises = filteredFavorites.map(favoriteId =>
            getItemById({ variables: { id: favoriteId } }) 
        );

        // Wait for all the items to be fetched
        const favoriteItemsResponses = await Promise.all(favoriteItemsPromises);

        // Extract the data and set the items
        let newItems = favoriteItemsResponses.map((response) => response?.data?.getItemById).reduce((unique, item) => {
          if (item !== null && !unique.some(i => i._id === item._id)) {
            unique.push(item);
          }
          return unique;
        }, []);

        // Check if items are blocked, then filter out blocked ones
        newItems = await Promise.all(newItems.map(async favorite => {
          const blocked = await setIsBlocked(favorite.user?._id);
          return blocked || favorite.status !== 'active' ? null : favorite;
        }));

        setItems(newItems);
        // }
      } catch (error) {
        console.error('Error fetching user favorites:', error);
      }
    };
    if (uid) {
      fetchUserFavorites();
    }
  }, [uid, getUser, getItemById, favorites]);

  return {
    items,
    loading,
    error,
  };
};

export default useFavorites;
