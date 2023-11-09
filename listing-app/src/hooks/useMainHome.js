import { gql, useLazyQuery } from '@apollo/client';
import { nearByItems } from '../apollo/server';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

const useMainHome = () => {
  const [items, setItems] = useState([]);
  const { zone } = useSelector((state) => state.addItem);
  const prevZone = useRef(zone.zone); // Store the previous value of zone

  // useLazyQuery instead of useQuery
  const [getNearByItems, { loading, error, data, refetch }] = useLazyQuery(nearByItems, {
    variables: { zone: zone.zone },
    fetchPolicy: 'network-only', // Ensures fresh data is fetched
  });

  useEffect(() => {
    if (zone.zone && prevZone.current !== zone.zone) {
      getNearByItems(); // Execute the query manually
    }
    prevZone.current = zone.zone; // Update the previous value of zone
  }, [zone, getNearByItems]);

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
      })).sort((a, b) => {
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
