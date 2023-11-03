// Single component
import { gql, useMutation } from '@apollo/client';
import { useEffect, useLayoutEffect } from 'react';
import { resetForm, setCreatedAt } from '../../../store/reducers/Item/addItemSlice';
import { useDispatch, useSelector } from 'react-redux';
import { TextDefault } from '../../../components';
import { View } from 'react-native';
import styles from './styles'
import { colors } from '../../../utilities' 
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const AdPosted = () => {
    const item = useSelector(state => state.addItem)
    const { title, description, price, condition, images, createdAt, subCategoryId, zoneId, address, userId } = item
    const navigation = useNavigation()
    const dispatch = useDispatch()

    const [mutateFunction, { data, loading, error }] = useMutation(gql`
        mutation MyMutation(
            $condition: String!,
            $createdAt: String!,
            $description: String!,
            $images: [String!]!,
            $price: Float!,
            $subCategoryId: String!, 
            $title: String!,
            $userId: String!,
            $zoneId: String!, 
            $address: AddressInput!
        ) {
            addItem(
                condition: $condition
                createdAt: $createdAt
                description: $description
                images: $images
                price: $price
                status: "Pending"
                subCategoryId: $subCategoryId
                title: $title
                userId: $userId
                zoneId: $zoneId
                likesCount: 0
                address: $address
            )
        }
    `, {
        variables: {
            condition,
            createdAt,
            description,
            images,
            price,
            subCategoryId,
            title,
            userId,
            zoneId,
            address: {
                address: address.address,
                coordinates: {
                    longitude: address.coordinates.longitude,
                    latitude: address.coordinates.latitude
                }
            }
        },
    })

    useLayoutEffect(() => {
        mutateFunction()
    }, [])

    useEffect(() => {
        if(!loading && !error && data){
            dispatch(resetForm())
            setTimeout(() => {
                navigation.navigate('Home')
            }, 8000)
        }
    }, [loading, error, data])

    return (
        <>
            {
                loading ? 
                <TextDefault>Loading...</TextDefault> 
                : error ? 
                <TextDefault>{String(error)}</TextDefault> 
                : 
                <View style={styles.imgContainer}>
                    <View style={[styles.imgResponsive, { marginTop: 10 }]}>
                        <Ionicons name="checkmark-circle" size={50} color={colors.spinnerColor}/>
                    </View>
                    <View style={{ textAlign: 'center' }}> 
                        <TextDefault style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 20 }}>Твоята обява е публикувана успешно!</TextDefault>
                        <View style={{ display: 'flex', justifyContent: 'space-evenly', flexDirection: 'row'}}>
                            <TextDefault style={{ textAlign: 'center' }}>Номер на обявата: </TextDefault>
                            <TextDefault style={{ textAlign: 'center', fontStyle: 'italic' }}>{String(data?.addItem?.name)}</TextDefault>
                        </View>
                    </View>
                </View>
             }
        </>
    )
}

export default AdPosted    