import { gql, useMutation, useQuery } from '@apollo/client';
import { useEffect, useLayoutEffect, useState } from 'react';
import { setZoneId } from '../store/reducers/Item/addItemSlice';
import { useDispatch, useSelector } from 'react-redux';
import { getZones } from '../apollo/server';

const addZone = () => {
    const { zone } = useSelector(state => state.addItem)
    const dispatch = useDispatch()
    const zones = useQuery(getZones, {
        variables: {}, 
    }) 
    const [mutateFunction, { data, loading, error }] = useMutation(gql`
        mutation MyMutation($zone: String!, $coordinates: CoordinatesInput!) {
            addZone(zone: $zone, coordinates: $coordinates)
        }
    `, {
        variables: {
            zone: zone.zone,
            coordinates: {
                longitude: zone.coordinates.longitude,
                latitude: zone.coordinates.latitude
            }
        },
    })

    useLayoutEffect(() => {
        const targetZone = zones.data?.getZones.filter((item) => {
            return item.value.zone === zone.zone && item.value.zone !== ''
        });
        if(targetZone){
            dispatch(setZoneId(targetZone[0]?.name))
        }
        if(targetZone?.length === 0 && zone.zone !== '') {
            const zoneId = mutateFunction() 
            
            dispatch(setZoneId(zoneId))
        }
    }, [zones])

    return ({ ...zones })
}

export default addZone