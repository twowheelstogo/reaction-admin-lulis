import React from "react";
import { Card, CardContent, CardHeader, Grid } from "@material-ui/core";
import { TextField, Button } from "@reactioncommerce/catalyst";
import styled from "styled-components";
import BillingServices from "../helpers/billingServices";
import PropTypes from "prop-types";
import { useReactOidc } from "@axa-fr/react-oidc-context";
import { applyTheme } from "@reactioncommerce/components/utils";

const InputGrid = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    gap: 10px;
    width: 100%;
    padding-top: 5px;
    padding-bottom: 5px;
`;

const FormGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const ColFull = styled.div`
    flex: 1 1 100%;
    padding-top: 5px;
    padding-bottom: 5px;
`;

const InputCol = styled.div`
    display: flex;
    flex: 1 1 auto;
`;

const ColHalf = styled.div`
flex: 0 1 calc(50% - 5px);
  padding-top: 5px;
  padding-bottom: 5px;
  @media (min-width: ${applyTheme("sm", "breakpoints")}px) {
    flex: 0 1 calc(50% - 5px);
  }
`;

/**
 * @name MoreDetailsOrder
 * @param {Object} props Component props
 * @returns {React.Component} returns a React component
 */
function MoreDetailsOrder(props) {
    const { handleChangeBillingDetails, value, handleChangeGiftDetails, giftDetails } = props;
    const { oidcUser } = useReactOidc();
    const { access_token: accessToken } = oidcUser || {};

    const handleSearchCustomer = async () => {
        const service = await BillingServices.getNit(value?.nit, accessToken);
        console.log(service);
        if (service.hasData) {
            handleChangeBillingDetails({
                ...value,
                name: service.name,
                address: service.street,
                isCf: false,
                partnerId: service.partnerId
            });
        }
    };

    const handleChange = (event) => handleChangeBillingDetails({
        ...value,
        [event.target.id]: event.target.value
    });

    const handleChangeGift = (event) => handleChangeGiftDetails(prev => ({
        ...prev,
        [event.target.id]: event.target.value
    }));

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Card>
                    <CardHeader title={"Datos de facturación"} />
                    <CardContent>
                        <Grid item xs={12}>
                            <InputGrid>
                                <InputCol>
                                    <TextField
                                        name="nit"
                                        id="nit"
                                        placeholder="Nit"
                                        onChange={handleChange}
                                    />
                                </InputCol>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    onClick={handleSearchCustomer}
                                >{"Buscar"}</Button>
                            </InputGrid>
                            <ColFull>
                                <TextField
                                    id="name"
                                    name="name"
                                    placeholder="Nombre completo"
                                    onChange={handleChange}
                                />
                            </ColFull>
                            <ColFull>
                                <TextField
                                    id="address"
                                    name="address"
                                    placeholder="Dirección"
                                    onChange={handleChange}
                                />
                            </ColFull>
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12}>
                <Card>
                    <CardHeader title={"Notas de regalo"} />
                    <CardContent>
                        <FormGrid>
                            <ColHalf>
                                <TextField
                                    id="sender"
                                    name="sender"
                                    placeholder="De"
                                    onChange={handleChangeGift}
                                />
                            </ColHalf>
                            <ColHalf>
                                <TextField
                                    id="receiver"
                                    name="receiver"
                                    placeholder="Para"
                                    onChange={handleChangeGift}
                                />
                            </ColHalf>
                            <ColFull>
                                <TextField
                                    id="message"
                                    name="message"
                                    placeholder="Escribe algo..."
                                    multiline
                                    onChange={handleChangeGift}
                                />
                            </ColFull>
                        </FormGrid>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
}

MoreDetailsOrder.propTypes = {
    value: PropTypes.shape({
        nit: PropTypes.string,
        name: PropTypes.string,
        address: PropTypes.string
    }),
    giftDetails: PropTypes.shape({
        sender: PropTypes.string,
        receiver: PropTypes.string
    }),
    handleChange: PropTypes.func,
    handleChangeGiftDetails: PropTypes.func
};

MoreDetailsOrder.defaultProps = {
    value: {
        nit: "",
        name: "",
        isCf: true,
        address: "ciudad",
        country: "GUATEMALA",
        depto: "GUATEMALA",
        city: "GUATEMALA"
    },
    handleChangeBillingDetails() { },
    handleChangeGiftDetails() { }
};

export default MoreDetailsOrder;
