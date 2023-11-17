import { gql, useLazyQuery } from '@apollo/client';
import { GET_ZONES_QUERY, nearByItems } from '../apollo/server';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFavorites, setOwnedItems } from '../store/reducers/User/userSlice';

const useMainHome = () => {
  const [items, setItems] = useState([]);
  const { zone } = useSelector((state) => state.addItem);
  const { uid } = useSelector((state) => state.user);
  const dispatch = useDispatch(); 
  const prevZone = useRef(zone.zone); // Store the previous value of zone
  const [getNearByItems, { loading, error, data, refetch }] = useLazyQuery(nearByItems, {
    variables: { zone: zone.zone },
    fetchPolicy: 'network-only', // Ensures fresh data is fetched
  });
  const [getUser] = useLazyQuery(GET_ZONES_QUERY);

  useEffect(() => {
    const fetchUser = async () => {
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
  }, [dispatch, getUser, uid]);

  useEffect(() => {
    if (zone.zone && prevZone.current !== zone.zone) {
      getNearByItems(); // Execute the query manually
    }else{
      refetch();
    }
    prevZone.current = zone.zone; // Update the previous value of zone
  }, [getNearByItems]);

  useEffect(() => {
    if (!data) return;
    if (data.nearByItems.length) {
      const items = data.nearByItems.map(({ name, value }) => ({
        id: name,
        title: value.title,
        price: value.price,
        location: value.address.address,
        image: value.images[0],
        ...value,
      })).filter(item => item.status === 'active')
      .sort((a, b) => {
        if (a.zoneId === zone.zone && b.zoneId !== zone.zone) {
          return -1;
        }
        if (a.zoneId !== zone.zone && b.zoneId === zone.zone) {
          return 1;
        }
        return 0;
      });
      setItems(items);
    }
  }, [data, zone]);

  // Expose the refetch function to allow manual refreshing of the query
  return { loading, error, items, refetch: getNearByItems };
};

export default useMainHome;
