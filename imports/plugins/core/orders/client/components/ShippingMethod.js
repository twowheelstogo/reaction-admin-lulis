import React, { useState } from "react";
import { Card, CardContent, FormControl, Radio, RadioGroup, FormControlLabel, Button } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import styled from "styled-components";
import CreateAddressModal from "./CreateAddress";

const styles = (theme) => ({
    radioLabel: {
        fontSize: "14px"
    }
})

const CustomTitle = styled.div`
    font-size: 16px;
    font-weight: 600;
    color: #3c3c3c;
    letter-spacing: 0.5px;
`;

const CardContainer = styled.div`
    padding-top: 10px;
    padding-bottom: 10px;
`;

const StyledRadio = withStyles({
    root: {
        color: "#3c3c3c",
        zIndex: 0
    }
})((props) => <Radio color="default" {...props} />);

const Item = styled.div`
    display: flex;
    flex-direction: row;
    flex-grow: 1;
    padding: 0px;
    justify-content: space-between;
    align-items: center;
`;

const ItemTitle = styled.div`
    font-weight: 600;
    font-size: 14px;
    color: #3B4256;
    display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;  
      overflow: hidden;
`;

const ItemSubtitle = styled.div`
    font-weight: 400;
    font-size: 14px;
    display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;  
      overflow: hidden;
`;

const ItemContent = styled.div`
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    gap: 5px;
    justify-content: center;
`;

const List = styled.div`

`;

const TitleLayout = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

/**
 * @name ShippingMethod
 * @param {Object} props Component props
 * @returns {React.Component} returns a React component
 */

const RadioItem = ({ handleChange, selected, value, title, subtitle }) => (
    <Item>
        <StyledRadio
            checked={selected}
            onChange={handleChange}
            value={value}
            name={title}
        />
        <ItemContent>
            {title && <ItemTitle>{title}</ItemTitle>}
            <ItemSubtitle>{subtitle}</ItemSubtitle>
        </ItemContent>
    </Item>
);

function ShippingMethod(props) {
    const {
        selectedAccount,
        selectedAddress,
        selectedFulfillmentMethod,
        selectedFulfillmentType,
        selectShippingAddress,
        selectFulfillmentMethod,
        selectFulfillmentType,
        classes,
        fulfillmentGroup,
        addAccountAddressBookEntry,
        addingAddressBook
    } = props;
    const [open, setOpen] = useState(false);

    const handleClose = () => setOpen(false);

    const handleChange = (event) => selectFulfillmentType({
        fulfillmentGroupId: fulfillmentGroup._id,
        fulfillmentType: event.target.value
    });

    const { shippingAddress } = fulfillmentGroup || {};

    const handleSelect = (event) => selectShippingAddress(JSON.parse(event.target.value));

    const handleCreateAddress = async (input) => {
        await addAccountAddressBookEntry(input);
        handleClose();
    }

    function renderShippingMethod() {
        return (
            <div>
                <TitleLayout>
                    <CustomTitle>{"Dirección de envío"}</CustomTitle>
                    <Button
                        onClick={() => setOpen(true)}
                    >{"Agregar"}</Button>
                </TitleLayout>
                <CardContainer>
                    {selectedAccount && selectedAccount.addressBook && Array.isArray(selectedAccount?.addressBook.edges) && (
                        <List>
                            {selectedAccount.addressBook.edges.map(({ node }, index) => (
                                <RadioItem
                                    key={`${index}`}
                                    selected={node._id === shippingAddress?._id}
                                    handleChange={handleSelect}
                                    value={JSON.stringify(node)}
                                    subtitle={node.address}
                                    title={node.description}
                                />
                            ))}
                        </List>
                    )}
                    <CreateAddressModal
                        open={open}
                        handleClose={handleClose}
                        isAddingAddress={addingAddressBook}
                        handleCreateAddress={handleCreateAddress}
                    />
                </CardContainer>
            </div>
        );
    }

    function renderPickupMethod() {
        return (
            <div>
                <CustomTitle>{"Fecha de entrega"}</CustomTitle>
            </div>
        );
    }

    return (
        <Card>
            <CardContent>
                <CustomTitle>{"Método de entrega"}</CustomTitle>
                <CardContainer>
                    <RadioItem
                        selected={fulfillmentGroup?.type === "shipping"}
                        handleChange={handleChange}
                        value="shipping"
                        subtitle="Entrega a domicilio"
                    />
                    <RadioItem
                        selected={fulfillmentGroup?.type === "pickup"}
                        handleChange={handleChange}
                        value="pickup"
                        subtitle="Recoger en tienda"
                    />
                </CardContainer>
                {fulfillmentGroup?.type == "shipping" && renderShippingMethod()}
                {fulfillmentGroup?.type == "pickup" && renderPickupMethod()}
            </CardContent>
        </Card>
    );
}

ShippingMethod.propTypes = {
    selectedAccount: PropTypes.object,
    selectedAddress: PropTypes.object,
    selectedFulfillmentMethod: PropTypes.object,
    selectedFulfillmentType: PropTypes.any,
    selectShippingAddress: PropTypes.func,
    selectFulfillmentMethod: PropTypes.func,
    selectFulfillmentType: PropTypes.func,
    classes: PropTypes.any,
    fulfillmentGroup: PropTypes.object,
    addAccountAddressBookEntry: PropTypes.func,
    addingAddressBook: PropTypes.bool
};

ShippingMethod.defaultProps = {
    selectedAccount: null,
    selectShippingAddress() { },
    selectFulfillmentMethod() { },
    selectFulfillmentType() { },
    selectedAddress: null,
    selectedFulfillmentMethod: null,
    selectedFulfillmentType: null,
    addingAddressBook: false,
    addAccountAddressBookEntry() { }
};

export default withStyles(styles)(ShippingMethod);
