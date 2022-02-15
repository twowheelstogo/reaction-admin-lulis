import gql from "graphql-tag";

export const CartCommon = gql`
fragment CartCommon on Cart {
  _id
  createdAt
  account {
    _id
    emailRecords {
      address
    }
  }
  shop {
    _id
    currency {
      code
    }
  }
  email
  updatedAt
  expiresAt
  checkout {
    fulfillmentGroups {
      _id
      type
      data {
        shippingAddress {
          _id
          description
          address
          reference
          receiver
          phone
          geolocation{
            latitude
            longitude
          }
          metaddress{
            administrative_area_level_1
            administrative_area_level_2
            neighborhood
            street_address
            sublocality
            distance{
              value
              text
            }
          }
        }
        pickupDetails {
          datetime
        }
      }
      availableFulfillmentOptions {
        price {
          amount
          displayAmount
        }
        fulfillmentMethod {
          _id
          name
          displayName
        }
      }
      selectedFulfillmentOption {
        fulfillmentMethod {
          _id
          name
          displayName
        }
        price {
          amount
          displayAmount
        }
        handlingPrice {
          amount
          displayAmount
        }
      }
      shop {
        _id
      }
      shippingAddress {
        _id
          description
          address
          reference
          receiver
          phone
          geolocation{
            latitude
            longitude
          }
          metaddress{
            administrative_area_level_1
            administrative_area_level_2
            neighborhood
            street_address
            sublocality
            distance{
              value
              text
            }
          }
      }
    }
    summary {
      fulfillmentTotal {
        displayAmount
      }
      itemTotal {
        amount
        displayAmount
      }
      surchargeTotal {
        amount
        displayAmount
      }
      taxTotal {
        amount
        displayAmount
      }
      total {
        amount
        currency {
          code
        }
        displayAmount
      }
    }
  }
  totalItemQuantity
}
`; 

export const CartItemConnectionFragment = gql`
    ## Fragment for cart items, used in both queries and mutations
fragment CartItemConnectionFragment on CartItemConnection {
  pageInfo {
    hasNextPage
    endCursor
  }
  edges {
    node {
      _id
      productConfiguration {
        productId
        productVariantId
      }
      addedAt
      attributes {
        label
        value
      }
      createdAt
      isBackorder
      isLowQuantity
      isSoldOut
      imageURLs {
        large
        small
        original
        medium
        thumbnail
      }
      metafields {
        value
        key
      }
      parcel {
        length
        width
        weight
        height
      }
      price {
        amount
        displayAmount
        currency {
          code
        }
      }
      priceWhenAdded {
        amount
        displayAmount
        currency {
          code
        }
      }
      productSlug
      productType
      quantity
      shop {
        _id
      }
      subtotal {
        displayAmount
      }
      title
      productTags {
        nodes {
          name
        }
      }
      productVendor
      variantTitle
      optionTitle
      updatedAt
      inventoryAvailableToSell
      odooProduct
      categoryVariant
    }
  }
}
`;

export const CartQueryFragment = gql`
 fragment CartQueryFragment on Cart {
  ...CartCommon
  items(first: 20, after: $itemsAfterCursor) {
    ...CartItemConnectionFragment
  }
}
 ${CartCommon}
 ${CartItemConnectionFragment}
`;

export const IncorrectPriceFailureDetailsFragment = gql`
    fragment IncorrectPriceFailureDetailsFragment on IncorrectPriceFailureDetails {
  currentPrice {
    amount
    currency {
      code
    }
    displayAmount
  }
  productConfiguration {
    productId
    productVariantId
  }
  providedPrice {
    amount
    currency {
      code
    }
    displayAmount
  }
}
`;

export const MinOrderQuantityFailureDetailsFragment = gql`
    fragment MinOrderQuantityFailureDetailsFragment on MinOrderQuantityFailureDetails {
  minOrderQuantity
  productConfiguration {
    productId
    productVariantId
  }
  quantity
}
`;

export const CartPayloadFragment = gql`
  fragment CartPayloadFragment on Cart {
  ...CartCommon
  items {
    ...CartItemConnectionFragment
  }
}
  ${CartCommon}
  ${CartItemConnectionFragment}
`;