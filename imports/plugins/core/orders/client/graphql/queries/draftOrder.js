import gql from "graphql-tag";

export default gql`
   query draftOrder($draftOrderId: ID!) {
  draftOrder(draftOrderId: $draftOrderId) {
    _id
    cartId
    accountId
    cartToken
    shopId
    account {
      _id
      name
      username
      firstName
      lastName
      primaryEmailAddress
      addressBook{
        edges{
          node{
            _id
            description
            address
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
              distance{
                text
                value
              }
              sublocality
            }
          }
        }
      }
    }
    notes
      giftNote{
        sender
        receiver
        message
      }
      billing{
        customerName
        nit
        country
        city
        address
        depto
        name
        isCf
        partnerId
      }
  }
}
`;