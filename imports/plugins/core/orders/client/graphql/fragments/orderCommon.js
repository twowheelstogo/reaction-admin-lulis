import gql from "graphql-tag";

export const orderCommonFragment = gql`
  fragment OrderCommon on Order {
    _id
    account {
      _id
      name
      phone
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
            description
            address
            reference
          }
        }
        ... on PickupOrderFulfillmentGroupData {
          pickupDetails {
            datetime
          }
        }
      }
      displayStatus(language: $language)
      items {
        nodes {
          _id
          addedAt
          createdAt
          metafields {
            key
            value
          }
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
          productTags {
            nodes {
              name
              displayTitle
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
      tracking
      type
    }
    payments {
      _id
      amount {
        amount
        displayAmount
      }
      billingAddress 
      captureErrorMessage
      displayName
      method {
        canRefund
        displayName
        name
      }
      mode
      processor
      refunds {
        amount {
          amount
          displayAmount
        }
        createdAt
        paymentDisplayName
        reason
      }
      riskLevel
      status
      transactionId
    }
    referenceId
    refunds {
      amount {
        amount
        displayAmount
      }
      createdAt
      paymentDisplayName
      reason
    }
    shop {
      _id
      currency {
        code
      }
      name
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
    billing {
      customerName
      nit
      address
      city
      country
      depto
    }
    totalItemQuantity
    updatedAt
  }
`;
