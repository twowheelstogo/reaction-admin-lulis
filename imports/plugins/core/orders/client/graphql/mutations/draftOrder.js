import gql from "graphql-tag";

export const createDraftOrderCartMutation = gql`
    mutation createDraftOrderCartMutation($input: CreateDraftOrderCartInput!) {
  createDraftOrderCart(input: $input) {
    draftOrder {
      _id
      cartId
      cartToken
      accountId
      shopId
    }
  }
}
`;

export const addDraftOrderAccountMutation = gql`
    mutation addDraftOrderAccountMutation($input: AddDraftOrderAccountInput!) {
  addDraftOrderAccount(input:$input) {
    draftOrder {
      _id
      cartId
      cartToken
      accountId
      shopId
    }
  }
}
`;

export const placeDraftOrderMutation = gql`
    mutation placeDraftOrderMutation($input: PlaceDraftOrderInput!) {
  placeDraftOrder(input: $input) {
    draftOrder {
      _id
      cartId
      cartToken
      accountId
      shopId
    }
  }
}
`;

export const updateDraftOrderMutation = gql`
  mutation updateDraftOrderMutation($input: UpdateDraftOrderInput!){
  	updateDraftOrder(input: $input) {
    draftOrder{
      _id
      referenceId
      cartId
      createdAt
      orderId
      order{
        status
        referenceId
      }
      updatedAt
      cartToken
      account{
        name
        primaryEmailAddress
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
}
`;