// Single component
import { gql, useQuery } from '@apollo/client';
import { nearByItems } from '../apollo/server';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { resetForm } from '../store/reducers/Item/addItemSlice';

const useMainHome = () => {
  const [items, setItems] = useState([]);
  const { zone } = useSelector((state) => state.addItem); 
  const prevZone = useRef(zone.zone); // Store the previous value of zone

  const { loading, error, data, refetch } = useQuery(nearByItems, {
    variables: { zone: zone.zone },
    skip: !zone.zone,
    key: zone.zone,
  });

  useEffect(() => {
    if (zone.zone && prevZone.current !== zone.zone) {
      refetch();
    }
    prevZone.current = zone.zone; // Update the previous value of zone
  }, [zone, refetch]);

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

  return { loading, error, items };
};

export default useMainHome;
