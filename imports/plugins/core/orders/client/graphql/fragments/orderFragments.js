import gql from "graphql-tag";

export const OrderCommon = gql`
    fragment OrderCommon on Order {
  _id
  orderId
  account {
    _id
  }
  cartId
  createdAt
  displayStatus(language: $language)
  email
  fulfillmentGroups {
    _id
    data {
      ... on ShippingOrderFulfillmentGroupData {
        shippingAddress {
          _id
          address
          description
          reference
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
              branch
              branchId
            }
          }
        }
      }
    }
    items {
      nodes {
        _id
        addedAt
        createdAt
        imageURLs {
          large
          medium
          original
          small
          thumbnail
        }
        isTaxable
        optionTitle
        parcel {
          containers
          distanceUnit
          height
          length
          massUnit
          weight
          width
        }
        price {
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
        productSlug
        productType
        productVendor
        odooProduct
        categoryVariant
        productTags {
          nodes {
            name
          }
        }
        quantity
        shop {
          _id
        }
        subtotal {
          amount
          currency {
            code
          }
          displayAmount
        }
        taxCode
        title
        updatedAt
        variantTitle
      }
    }
    selectedFulfillmentOption {
      fulfillmentMethod {
        _id
        carrier
        displayName
        fulfillmentTypes
        group
        name
      }
      handlingPrice {
        amount
        currency {
          code
        }
        displayAmount
      }
      price {
        amount
        currency {
          code
        }
        displayAmount
      }
    }
    shop {
      _id
    }
    summary {
      fulfillmentTotal {
        amount
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
        displayAmount
      }
    }
    tracking
    type
  }
  payments {
    _id
    amount {
      displayAmount
    }
    displayName
    method {
      name
    }
  }
  referenceId
  shop {
    _id
    currency {
      code
    }
  }
  status
  summary {
    fulfillmentTotal {
      amount
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
      displayAmount
    }
  }
  totalItemQuantity
  updatedAt
}
`;

export const OrderQueryFragment = gql`
fragment OrderQueryFragment on Order {
  ...OrderCommon
}
${OrderCommon}
`;