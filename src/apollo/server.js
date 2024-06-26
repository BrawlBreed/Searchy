import { gql } from "@apollo/client"

export const nearByItems = gql` query MyQuery($zone: String!) {
    nearByItems(zone: $zone) {
      value {
        _id
        condition
        createdAt
        description
        itemId
        likes
        price
        status
        title
        images
        zoneId
        views
        promotionScore
        zone {
          zone
          coordinates {
            longitude 
            latitude
          }
        }
        subCategory {
          _id
          categoryParent
          title
          category {
            _id
            image
            title
          }
        }
        address {
          address
            coordinates{
              latitude
              longitude
            }
        }
        user {
          _id
          avatar
          description
          callingCode
          createdAt
          email
          active
          name 
          ownedItems
          notifications{
            recommendations
            specialOffers
          }
          phone
          likes
          followers
          following
          favorites
        }
      }
      name
    }
  }
  `

  export const getCategories = gql`  query MyQuery {
    getCategories {
      name
      value {
        _id
        image
        title
      }
    }
  }`

  export const getSubCategories = gql `query getZones {
    getSubCategories {
      name
      value {
        _id
        title
        category {
          _id
          image
          title
        }
      }
    }
  }`

  export const getItems = gql`  query getZones {
    getItems {
      value {
        _id
        condition
        createdAt
        description
        itemId
        likes
        price
        status
        title
        images
        zoneId
        views
        zone {
          zone
          coordinates {
            longitude 
            latitude
          }
        }
        subCategory {
          _id
          categoryParent
          title
          category {
            _id
            image
            title
          }
        }
        address {
          address
            coordinates{
              latitude
              longitude
            }
        }
        user {
          _id
          avatar
          description
          callingCode
          createdAt
          email
          active
          name
          notifications{
            recommendations
            specialOffers
          }
          phone
          likes
          followers
          following
          ownedItems
        }
      }
      name
    }
  }
  
  `

  export const getZones = gql`query getZones {
    getZones {
      name
      value {
        zone
        coordinates {
          latitude
          longitude
        }
      }
    }
  }`

export const GET_ZONES_QUERY = gql`
  query getZones($userId: ID!) {
    getUserById(user: $userId) {
      _id
      avatar
      callingCode
      createdAt
      description
      followers
      following
      favorites
      ownedItems
      active 
      likes
      name
      notifications{
        recommendations
        specialOffers
      }
      phone
    }
  }
`;
export const DELETE_ITEM = gql`
  mutation MyMutation($id: String!) {
    deleteItem(id: $id)
  }
`;
export const ADD_TO_FAVORITES = gql`
  mutation MyMutation($uid: String!, $favorites: [String!]) {
    addToFavorites(uid: $uid, favorites: $favorites, )
  }
`;
export const LIKE_ITEM_MUTATION = gql`
    mutation MyMutation($likes: [String], $name: String!) {
        likeItem(likes: $likes, name: $name)
    }
`;
export const GET_ITEM_BY_ID = gql`
  query MyQuery($id: String!) {
    getItemById(id: $id) {
        _id
        condition
        createdAt
        description
        itemId
        likes
        price
        promotionScore
        status
        title
        images
        zoneId
        views
        zone {
          zone
          coordinates {
            longitude 
            latitude
          }
        }
        subCategory {
          _id
          categoryParent
          title
          category {
            _id
            image
            title
          }
        }
        address {
          address
            coordinates{
              latitude
              longitude
            }
        }
        user {
          _id
          avatar
          description
          callingCode
          createdAt
          email
          active
          name
          ownedItems
          notifications{
            recommendations
            specialOffers
          }
          phone
          likes
          followers
          following
        }
    }
  }
`;

export const ADD_OWNED_ITEM = gql`
  mutation MyMutation($uid: String!, $ownedItems: [String!]) {
    addOwnedItem( uid: $uid, ownedItems: $ownedItems)
  }
`;

export const ADD_ID_TO_ITEM = gql`
  mutation MyMutation($id: String!, $_id: String!) {
    addIdToItem(id: $id, _id: $_id)
  }
`;

export const EDIT_ITEM = gql`
  mutation MyMutation($id: String!, $title: String!, $description: String!, $price: Float!, $condition: String!, $images: [String!]!, $address: AddressInput!) {
    editItem(id: $id, title: $title, description: $description, price: $price, condition: $condition, images: $images, address: $address)
  }
`
export const PROMOTE_ITEM = gql`
  mutation MyMutation($id: String!, $promotionScore: Float!) {
    promoteItem(id: $id, promotionScore: $promotionScore)
  }`
export const INCREMENT_VIEWS = gql`
  mutation MyMutation($id: String!, $views: Float!) {
    incrementViewCount(id: $id, views: $views)
  }
`
export const DEACTIVATE_ITEM = gql`
  mutation MyMutation($id: String!, $status: String!) {
    deactivateItem(id: $id, status: $status)
  }
`
export const FOLLOW_USER = gql`
  mutation MyMutation($uid: String!, $followers: [String!]) {
    followUser(uid: $uid, followers: $followers)
  }
`
export const FOLLOWING_USER = gql`
  mutation MyMutation($uid: String!, $following: [String!]) {
    followingUser(uid: $uid, following: $following)
  }
`
export const GET_NUMBER = gql`
  query MyQuery($userId: ID!) {
    getUserById(user: $userId) {
      _id
      phone 
    }
  }
`
export const GET_AVATAR_NAME_DESCRIPTION_CREATED_AT = gql`
  query MyQuery($userId: ID!) {
    getUserById(user: $userId) {
      _id
      avatar
      description
      createdAt
      name
      following
      followers
      ownedItems
    }
  }
`

export const SEND_REPORT = gql`
  mutation MyMutation(    
    $userId: String!,
    $itemId: String!,
    $reason: String!,
    $additionalInfo: String,
    $sentAt: String!
  ) {
    sendReport(
      userId: $userId,
      itemId: $itemId
      reason: $reason
      additionalInfo: $additionalInfo
      sentAt: $sentAt
    )
  }
`

export const DELETE_PROFILE = gql`
  	mutation MyMutation($uid: ID!) {
      deleteUser(user: $uid)
    }
`