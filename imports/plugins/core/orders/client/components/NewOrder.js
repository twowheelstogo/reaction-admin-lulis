import React from "react";
import { Grid, Box } from "@material-ui/core";
import OrderProducts from "./OrderProducts";
import OrderSummary from "./OrderSummary";
import ShippingMethod from "./ShippingMethod";
import MoreDetailsOrder from "./MoreDetailsOrder";
import OrderCustomer from "./OrderCustomer";
import useDraftOrder from "../hooks/useDraftOrder";
import useAccounts from "../hooks/useAccounts";
import { Button } from "@reactioncommerce/catalyst";
import styled from "styled-components";
import PrimaryAppBar from "/imports/client/ui/components/PrimaryAppBar/PrimaryAppBar";
import { makeStyles } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import ArrowLeft from "mdi-material-ui/ArrowLeft";

const GridButtons = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    gap: 10px;
    padding: 5px;
    @media only screen and (max-width: 600px) {
        flex-direction: column;
        justify-content: flex-start;
    }
`;

const useStyles = makeStyles({
    goBackTitleLink: {
      display: "flex",
      alignItems: "center"
    },
    title: {
      marginLeft: 10
    }
  });

/**
 * @name NewOrder
 * @returns {React.Component} A React component
 */
function NewOrder() {
    const {
        isLoadingProducts,
        products,
        selectedProducts,
        addDraftOrderItems,
        changeItemQuantity,
        removeItem,
        setQuery,
        query,
        selectedAccount,
        selectedAddress,
        selectedFulfillmentMethod,
        selectedFulfillmentType,
        setSelectedAccount,
        setSelectedAddress,
        setSelectedFulfillmentMethod,
        setSelectedFulfillmentType,
        addItemsToCart,
        cart,
        draftOrder,
        handlePlaceOrder,
        placingOrder,
        shopId,
        addAccountAddressBookEntry,
        addingAddressbook,
        handleChangeBillingDetails,
        handleChangeGiftDetails,
        billingDetails,
        giftDetails,
        handleUpdateCartItemQuantity,
        handleRemoveCartItems,
        setNote,
        note,
        markAsWithoutBilling,
        saveChangesAsPending,
        handleDeleteOrder,
        handleSelectDeliveryDate,
        handleSelectInstantDelivery,
        deliveryDate,
        instantDelivery
    } = useDraftOrder();
    const {
        accounts,
        isLoadingAccounts,
        accountsQuery,
        setAccountsQuery
    } = useAccounts();
    
    const classes = useStyles();
    const history = useHistory();

    const accountProps = {
        accounts,
        isLoadingAccounts,
        accountsQuery,
        setAccountsQuery,
        selectedAccount,
        setSelectedAccount,
        shopId
    };

    const productProps = {
        handleQuery: setQuery,
        products: products,
        selectedProducts,
        handleAddItems: addItemsToCart,
        handleChangeItemQuantity: changeItemQuantity,
        isLoadingProducts,
        query,
        cart,
        handleUpdateCartItemQuantity,
        handleRemoveItem: handleRemoveCartItems
    };

    const moreDetailsProps = {
        handleChangeBillingDetails,
        value: billingDetails,
        handleChangeGiftDetails,
        giftDetails,
        setNote,
        note,
        markAsWithoutBilling
    };

    // const { checkout: { fulfillmentGroups } } = cart || {
    //     checkout: null
    // };
    const { checkout } = cart || {};
    const { fulfillmentGroups } = checkout || {};
    const [fulfillmentGroup] = fulfillmentGroups || [];


    const shippingProps = {
        selectedAccount,
        selectedAddress,
        selectShippingAddress: setSelectedAddress,
        selectedFulfillmentMethod,
        selectFulfillmentMethod: setSelectedFulfillmentMethod,
        selectedFulfillmentType,
        selectFulfillmentType: setSelectedFulfillmentType,
        fulfillmentGroup: fulfillmentGroup || null,
        addAccountAddressBookEntry,
        addingAddressbook,
        handleSelectDeliveryDate,
        handleSelectInstantDelivery,
        deliveryDate,
        instantDelivery
    }

    const skipDraftOrderPlacing = Boolean(placingOrder || Object.keys(cart || {}).length == 0);

    const backIconTitle = (
        // eslint-disable-next-line jsx-a11y/anchor-is-valid
        <a href="#" className={classes.goBackTitleLink} onClick={(event) => {
          event.preventDefault();
          history.goBack();
        }}
        >
          <ArrowLeft />
          <span className={classes.title}>
            {'Nueva Orden'}
          </span>
        </a>
      );

    return (
        <Grid container spacing={2}>
            <PrimaryAppBar title={backIconTitle}>
                    <Button
                        color="secondary"
                        variant="contained"
                        isWaiting={placingOrder}
                        disabled={skipDraftOrderPlacing}
                        onClick={handlePlaceOrder}
                    >{"Crear / Cobrar Pedido"}</Button>
            </PrimaryAppBar>
            <Grid
                xs={12}
            >
                <GridButtons>
                    <Button
                        color="error"
                        variant="outlined"
                        // disabled
                        onClick={handleDeleteOrder}
                    >{"Eliminar Orden"}</Button>
                    <Button
                        color="primary"
                        variant="outlined"
                        onClick={saveChangesAsPending}
                        // disabled
                    >{"Guardar Cambios"}</Button>
                </GridButtons>
            </Grid>
            <Grid item xs={12} md={8}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <OrderProducts {...productProps} />
                    </Grid>
                    <Grid item xs={12}>
                        <OrderSummary summary={cart && cart.checkout && cart.checkout.summary} />
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} md={4}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <OrderCustomer {...accountProps} />
                    </Grid>
                    <Grid item xs={12}>
                        <ShippingMethod {...shippingProps} />
                    </Grid>
                    <Grid item xs={12}>
                        <MoreDetailsOrder {...moreDetailsProps} />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}

export default NewOrder;