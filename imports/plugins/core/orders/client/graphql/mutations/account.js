import gql from "graphql-tag";

export const createAccountMutation = gql`
    mutation createAccount($input: CreateAccountInput!) {
  	createAccountWithoutCredentials(input: $input) {
    account {
      _id
      userId
      createdAt
      firstName
      lastName
      name
      username
      primaryEmailAddress
      emailRecords {
        address
        provides
        verified
      }
    }
  }
}
`;

export const addAccountAddressBookEntryMutation = gql`
mutation addAccountAddressBookEntryMutation($input: AddAccountAddressBookEntryInput!) {
  addAccountAddressBookEntry(input: $input) {
    address {
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
}
`;