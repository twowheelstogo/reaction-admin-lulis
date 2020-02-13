import React, { useState } from "react";
import i18next from "i18next";
import SimpleSchema from "simpl-schema";
import Button from "@reactioncommerce/catalyst/Button";
import TextField from "@reactioncommerce/catalyst/TextField";
import useReactoForm from "reacto-form/cjs/useReactoForm";
import muiOptions from "reacto-form/cjs/muiOptions";
import {
  Card,
  CardContent,
  CardHeader,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Grid,
  makeStyles
} from "@material-ui/core";
import ChevronUp from "mdi-material-ui/ChevronUp";
import useShopSettings from "../hooks/useShopSettings";

const useStyles = makeStyles((theme) => ({
  card: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3)
  },
  textField: {
    minWidth: 350
  },
  saveButton: {
    textAlign: "right"
  }
}));

const generalSettings = new SimpleSchema({
  "name": {
    type: String,
    min: 1
  },
  "emails": {
    type: Array
  },
  "emails.$": new SimpleSchema({
    address: {
      type: String,
      regEx: SimpleSchema.RegEx.Email
    }
  }),
  "slug": {
    type: String,
    min: 1
  },
  "description": {
    type: String,
    optional: true
  },
  "keywords": {
    type: String,
    optional: true
  }
});

const validator = generalSettings.getFormValidator();

/**
 * Shop settings form block component
 * @returns {Node} React node
 */
function ShopSettings() {
  const classes = useStyles();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { onUpdateShop, shop } = useShopSettings();
  const {
    getFirstErrorMessage,
    getInputProps,
    hasErrors,
    submitForm
  } = useReactoForm({
    async onSubmit(formData) {
      setIsSubmitting(true);
      await onUpdateShop(generalSettings.clean(formData));
      setIsSubmitting(false);
    },
    validator(formData) {
      return validator(generalSettings.clean(formData));
    },
    value: shop
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    submitForm();
  };

  return (
    <Card className={classes.card}>
      <CardHeader title={i18next.t("admin.settings.general.label")} />
      <CardContent>
        <ExpansionPanel>
          <ExpansionPanelSummary
            expandIcon={<ChevronUp />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            {i18next.t("admin.settings.general.header")}
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Grid container spacing={1}>
              <Grid item sm={12}>
                <TextField
                  className={classes.textField}
                  error={hasErrors(["name"])}
                  fullWidth
                  helperText={getFirstErrorMessage(["name"])}
                  label={i18next.t("admin.settings.general.nameLabel")}
                  placeholder={i18next.t("admin.settings.general.namePlaceholder")}
                  {...getInputProps("name", muiOptions)}
                />
              </Grid>
              <Grid item sm={12}>
                <TextField
                  className={classes.textField}
                  error={hasErrors(["emails[0].address"])}
                  fullWidth
                  helperText={getFirstErrorMessage(["emails[0].address"])}
                  label={i18next.t("admin.settings.general.emailLabel")}
                  placeholder={i18next.t("admin.settings.general.emailPlaceholder")}
                  {...getInputProps("emails[0].address", muiOptions)}
                />
              </Grid>
              <Grid item sm={12}>
                <TextField
                  className={classes.textField}
                  error={hasErrors(["slug"])}
                  fullWidth
                  helperText={getFirstErrorMessage(["slug"])}
                  label={i18next.t("admin.settings.general.slugLabel")}
                  placeholder={i18next.t("admin.settings.general.slugPlaceholder")}
                  {...getInputProps("slug", muiOptions)}
                />
              </Grid>
              <TextField
                className={classes.textField}
                error={hasErrors(["description"])}
                fullWidth
                helperText={getFirstErrorMessage(["description"])}
                label={i18next.t("admin.settings.general.descriptionLabel")}
                placeholder={i18next.t("admin.settings.general.descriptionPlaceholder")}
                {...getInputProps("description", muiOptions)}
              />
              <Grid item sm={12}>
                <TextField
                  className={classes.textField}
                  error={hasErrors(["keywords"])}
                  fullWidth
                  helperText={getFirstErrorMessage(["keywords"])}
                  label={i18next.t("admin.settings.general.keywordsLabel")}
                  placeholder={i18next.t("admin.settings.general.keywordsPlaceholder")}
                  {...getInputProps("keywords", muiOptions)}
                />
              </Grid>
              <Grid classes={{ root: classes.saveButton }} item sm={12}>
                <Button
                  color="primary"
                  disabled={isSubmitting}
                  variant="contained"
                  type="submit"
                  onClick={handleSubmit}
                  isWaiting={isSubmitting}
                >
                  {i18next.t("app.save")}
                </Button>
              </Grid>
            </Grid>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </CardContent>
    </Card>
  );
}

export default ShopSettings;
