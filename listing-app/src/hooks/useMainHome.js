import { gql, useLazyQuery } from '@apollo/client';
import { GET_ZONES_QUERY, nearByItems } from '../apollo/server';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFavorites, setLoading, setOwnedItems } from '../store/reducers/User/userSlice';
import { calculatePromotionScore } from '../utilities/methods';
import { fetchItems } from '../firebase';

const useMainHome = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [items, setItems] = useState([]);
  const [lastId, setLastId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentLimit, setCurrentLimit] = useState(10);
  const { zone, zoneId } = useSelector((state) => state.addItem);
  const { uid } = useSelector((state) => state.user);
  const dispatch = useDispatch(); 
  const prevZone = useRef(zoneId); // Store the previous value of zone
  const [getUser] = useLazyQuery(GET_ZONES_QUERY, {
    fetchPolicy: 'network-only', // Ensures fresh data is fetched
  }); 

  async function getItems(loadingFlag = false) {
    if(loading) return;
    setLoading(loadingFlag);
    const { items, lastId } = await fetchItems(zoneId, currentLimit, lastId)
    console.log(items)
    setItems(prevItems => {
      if (!items || items.length === 0) {
        return prevItems;
      }
      else if (prevItems.length === 0) {
        return items;
      }
      const existingIds = new Set(prevItems?.map(item => item.id));
      const newItems = items.filter(item => !existingIds.has(item.id));
      return [...prevItems, ...newItems];
    });
    setLoading(false);
  }

  useLayoutEffect(() => {
    getItems(true)
  }, [zoneId, refreshing]);

  useEffect(() => {
    setLastId(null)
    setItems([])
  }, [zoneId])
  
  useEffect(() => {
    const fetchUser = async () => {
      if(!uid) return;
      try {
        const response = await getUser({ variables: { userId: uid } });
        if (response.data?.getUserById) {
          return response.data.getUserById;
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };
  
    fetchUser().then(user => {
      if (user?.favorites) {
        dispatch(setFavorites(user.favorites));
      }
      if(user?.ownedItems){
        dispatch(setOwnedItems(user.ownedItems));
      }
    });
    
  }, [uid]);

  // useEffect(() => {
  //   if(error) console.log(error)
  // }, [error])
  
  // Expose the refetch function to allow manual refreshing of the query
  return { loading, items, refreshing, setRefreshing, setCurrentLimit, currentLimit, fetchItems, lastId, getItems };
};

export default useMainHome;

  // const [getNearByItems, { loading, error, data, refetch }] = useLazyQuery(nearByItems, {
  //   variables: { zone: zone.zone },
  //   fetchPolicy: 'network-only', // Ensures fresh data is fetched
  // });

  // useEffect(() => {
  //   if (zone.zone && prevZone.current !== zone.zone) {
  //     getNearByItems(); // Execute the query manually
  //   }else{
  //     refetch();
  //   }
  //   prevZone.current = zone.zone; // Update the previous value of zone
  // }, [getNearByItems]);

  // useEffect(() => {
  //   if (!data) return;
  //   if (data.nearByItems.length) {
  //     const items = data.nearByItems.map(({ value }) => ({
  //       id: value._id,
  //       title: value.title, 
  //       price: value.price,
  //       location: value.address.address,
  //       image: value.images[0],
  //       ...value,
  //     })).filter(item => item.status === 'active' && item.user?._id !== uid && Boolean(item.id) )
  //     .sort((a, b) => {
  //       if (a.zoneId === zone.zone && b.zoneId !== zone.zone) {
  //         return -1;
  //       }
  //       if (a.zoneId !== zone.zone && b.zoneId === zone.zone) {
  //         return 1;
  //       }
  //       return 0;
  //     }).sort((a, b) => {
  //       return a.promotionScore - b.promotionScore;
  //     });
  //     setItems(items);
  //   }
  // }, [data, zone]);

