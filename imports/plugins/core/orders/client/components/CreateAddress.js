import React, { useState } from "react";
import PropTypes from "prop-types";
import { Dialog, DialogContent, DialogTitle, DialogActions, Typography, IconButton, Grid } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { Form } from "reacto-form";
import { Button, TextField } from "@reactioncommerce/catalyst";
import styled from "styled-components";
import CloseIcon from "mdi-material-ui/Close";
import GoogleMapComponent from "./GoogleMapComponent";
import { SearchBox } from "react-google-maps/lib/components/places/SearchBox";
import withGoogleMaps from "../containers/withGoogleMap";
import { useReactOidc } from "@axa-fr/react-oidc-context";

const ColFull = styled.div`
  flex: 1 1 100%;
  padding-top: 5px;
  padding-bottom: 5px;
`;

const CustomTitleLayout = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    font-size: 20px;
    font-weight: 600;
`;

const PlacesWithSearchBox = (props) => {
    return <SearchBox
        ref={props.onSearchBoxMounted}
        onPlacesChanged={() => {
            props.onPlacesChanged(props.accessToken)
        }}
        controlPosition={google.maps.ControlPosition.TOP_LEFT}
    >
        <div style={{ width: "50%", padding: "10px" }}>
            {props.children}
        </div>
    </SearchBox>;
};

/**
 * @name CreateAddress
 * @param {Object} props Component props
 * @returns {React.Component} returns a React component
 */
function CreateAddress(props) {
    const { open, handleClose, googleProps, handleCreateAddress, isAddingAddress } = props;
    const { oidcUser } = useReactOidc();
    const { access_token: accessToken } = oidcUser || {};
    const [value, setValue] = useState({});

    const onSubmit = () => {
        const input = value;

        if (googleProps.locationRef.latitude && googleProps.locationRef.longitude) {
            Object.assign(input, {
                geolocation: googleProps.locationRef,
                metaddress: { ...googleProps.metadataMarker }
            });
        }
        handleCreateAddress(input);
    };

    const handleChange = (event) => {
        event.persist();
        setValue(prev => ({
            ...prev,
            [event.target.id]: event.target.value
        }));
    };

    function renderForm() {

        return (
            <Grid item xs={12} sm={6} md={6}>
                <ColFull>
                    <TextField
                        label="Descripción"
                        placeholder="Mi casa"
                        name="description"
                        id="description"
                        onChange={handleChange} />
                </ColFull>
                <ColFull>
                    <TextField label="Dirección completa"
                        placeholder="5av Edificio europlaza zona 14 guatemala"
                        name="address"
                        id="address"
                        onChange={handleChange} />
                </ColFull>
                <ColFull>
                    <TextField label="Referencias"
                        placeholder="frente embajada de costa rica"
                        name="reference"
                        id="reference"
                        multiline
                        onChange={handleChange} />
                </ColFull>
                <ColFull>
                    <TextField label="¿Quién recibe la orden?"
                        placeholder="Escribe aquí"
                        name="receiver"
                        id="receiver"
                        onChange={handleChange} />
                </ColFull>
                <ColFull>
                    <TextField label="Teléfono de quien recibe"
                        placeholder="Escribe aquí"
                        name="phone"
                        id="phone"
                        onChange={handleChange} />
                </ColFull>
            </Grid>
        );
    }

    function renderMap() {

        return (
            <Grid item xs={12} sm={6} md={6}>
                <div style={{ minHeight: "500px", height: "100%", width: "100%" }}>
                    <GoogleMapComponent
                        {...googleProps}
                        SearchBox={
                            <PlacesWithSearchBox
                                {...googleProps}
                                accessToken={accessToken}
                            >
                                <TextField
                                    name="search"
                                    id="search"
                                    placeholder="Ingresa la posición"
                                />
                            </PlacesWithSearchBox>
                        }
                    />
                </div>
            </Grid>
        );
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth={true}
            maxWidth="lg"
        >
            <DialogTitle>
                <CustomTitleLayout>
                    <div>{"Crear Nueva Dirección"}</div>
                    <IconButton
                        onClick={handleClose}
                    >
                        <CloseIcon />
                    </IconButton>
                </CustomTitleLayout>
            </DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    {renderForm()}
                    {renderMap()}
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button
                    color="primary"
                    variant="outlined"
                    onClick={handleClose}
                >{"Cancelar"}</Button>
                <Button
                    color="primary"
                    variant="contained"
                    onClick={onSubmit}
                    isWaiting={isAddingAddress}
                >{"Guardar"}</Button>
            </DialogActions>
        </Dialog>
    );
}

CreateAddress.propTypes = {
    open: PropTypes.bool,
    handleClose: PropTypes.func,
    googleProps: PropTypes.any,
    handleCreateAddress: PropTypes.func,
    isAddingAddress: PropTypes.bool
};

CreateAddress.defaultProps = {
    open: false,
    handleClose() { },
    handleCreateAddress() { },
    isAddingAddress: false
};

export default withGoogleMaps(CreateAddress);
