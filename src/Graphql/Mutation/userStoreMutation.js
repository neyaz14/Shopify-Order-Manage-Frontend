import { gql } from '@apollo/client';

// export const Delete_USER = gql`
//     mutation deleteClient($id: ID!){
//         deleteClient(id: $id){
//             id
//             name
//             email
//             phone
//         }
//     }
// `


export const ADD_USER = gql`
  mutation AddUser($displayName: String!, $email: String!) {
    addUser(displayName: $displayName, email: $email) {
      displayName
      email
    }
  }
`;






export const ADD_STORE = gql`
  mutation addStore(
    $storeName: String!,
    $storeUrl: String!,
    $accessToken: String!,
    $apiVersion: String!,
    $user: ID!
  ) {
    addStore(
      storeName: $storeName,
      storeUrl: $storeUrl,
      accessToken: $accessToken,
      apiVersion: $apiVersion,
      user: $user
    ) {
      id
      storeName
      storeUrl
      accessToken
      apiVersion
      user {
        id
        displayName
      }
    }
  }
`;

// ! ----------  Pathao 


export const ADD_PATHAO_CREDENTIAL = gql`
  mutation addPathaoCredential(
    $base_url: String!
    $client_id: String!
    $client_secret: String!
    $user: ID!
    
  ) {
    addPathaoCredential(
      base_url: $base_url
      client_id: $client_id
      client_secret: $client_secret
      user: $user
      
    ) {
      id
      base_url
      client_id
    }
  }
`;

export const DELETE_PATHAO_CREDENTIAL = gql`
  mutation DeletePathaoCredential($id: ID!) {
    deletePathaoCredential(id: $id) {
      id
    }
  }
`;


// ! steadfast mutation code 


export const ADD_STEADFAST_CREDENTIAL = gql`
  mutation addSteadfastCredential(
    $api_url: String!
    $api_key: String!
    $secret_key: String!
    $user: ID!
  ) {
    addSteadfastCredential(
      api_url: $api_url
      api_key: $api_key
      secret_key: $secret_key
      user: $user
    ) {
      id
      api_url
      api_key
    }
  }
`;

export const UPDATE_STEADFAST_CREDENTIAL = gql`
  mutation updateSteadfastCredential(
    $id: ID!
    $api_url: String
    $api_key: String
    $secret_key: String
  ) {
    updateSteadfastCredential(
      id: $id
      api_url: $api_url
      api_key: $api_key
      secret_key: $secret_key
    ) {
      id
      api_url
      api_key
    }
  }
`;

export const DELETE_STEADFAST_CREDENTIAL = gql`
  mutation deleteSteadfastCredential($id: ID!) {
    deleteSteadfastCredential(id: $id) {
      id
    }
  }
`;




// ! ---------------------------------   Add order 

export const ADD_ORDER = gql`
  mutation AddOrder(
    $name: String!
    $note: String
    $processedAt: String!
    $shopDomain: String!
    $displayFinancialStatus: String!
    $displayFulfillmentStatus: String!
    $shopifyId: String
    $courierId: ID
    $customer: CustomerInput!
    $shippingAddress: ShippingAddressInput!
    $tags: [String]
    $totalPriceSet: PriceSetInput!
    $lineItems: [LineItemEdgeInput]
    $ownerId: ID!   # ✅ New variable
  ) {
    addOrder(
      name: $name
      note: $note
      processedAt: $processedAt
      shopDomain: $shopDomain
      displayFinancialStatus: $displayFinancialStatus
      displayFulfillmentStatus: $displayFulfillmentStatus
      shopifyId: $shopifyId
      courierId: $courierId
      customer: $customer
      shippingAddress: $shippingAddress
      tags: $tags
      totalPriceSet: $totalPriceSet
      lineItems: $lineItems
      ownerId: $ownerId   # ✅ New field
    ) {
      id
      name
      processedAt
      displayFinancialStatus
      displayFulfillmentStatus
      shopDomain
      customer {
        email
        firstName
        lastName
        phone
      }
      shippingAddress {
        address1
        address2
        city
        province
        country
        zip
        phone
      }
      tags
      totalPriceSet {
        shopMoney {
          amount
          currencyCode
        }
      }
      lineItems {
        edges {
          node {
            title
            quantity
            sku
            variantTitle
            originalUnitPriceSet {
              shopMoney {
                amount
                currencyCode
              }
            }
          }
        }
      }
      courierId
      ownerId     # ✅ You can include this in the return type too if needed
    }
  }
`;




// ? ---------------------       currier          --------------

export const ADD_COURIER = gql`
mutation AddCourier(
  $consignment_id: Int!,
  $invoice: String!,
  $tracking_code: String!,
  $recipient_name: String!,
  $recipient_phone: String!,
  $recipient_address: String!,
  $cod_amount: Int!,
  $status: String!,
  $note: String,
  $shopifyId: String,
  $orderId: String
) {
  addCourier(
    consignment_id: $consignment_id,
    invoice: $invoice,
    tracking_code: $tracking_code,
    recipient_name: $recipient_name,
    recipient_phone: $recipient_phone,
    recipient_address: $recipient_address,
    cod_amount: $cod_amount,
    status: $status,
    note: $note,
    shopifyId: $shopifyId,
    orderId: $orderId
  ) {
    id
    tracking_code
    status
  }
}
`;
 