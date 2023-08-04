import { useState } from "react";
import { Formik } from "formik";
import { View } from "react-native";
import FormGroup from "../FormGroup";
import CityIcon from "../../assets/icons/City";
import MapIcon from "../../assets/icons/Map";
import WorldIcon from "../../assets/icons/World";
import { allowedCountries, getCountryName } from "../../utils/ISO3166";
import Button from "../../components/Button";
import Transaction from "../../assets/icons/Transaction";
import { styles } from "./styles";
import DropDownPicker from "react-native-dropdown-picker";

export const Address = ({
  profileData,
  compact,
  showChangeRequest,
}: {
  profileData: any;
  compact?: boolean;
  showChangeRequest: any;
}) => {
  const [country, setCountry] = useState(profileData?.country);
  const [countryOpen, setCountryOpen] = useState(false);
  return (
    <Formik
      enableReinitialize
      initialValues={{
        street: profileData?.address_line_1,
        subStreet: profileData?.address_line_2,
        town: profileData?.town,
        state: profileData?.state,
        postCode: profileData?.postal_code,
        country: profileData?.country,
      }}
      validate={(values) => {
        let errors: any = {};
        if (!values.street) errors.street = "Required";
        if (!values.subStreet) errors.subStreet = "Required";
        if (!values.town) errors.town = "Required";
        if (!values.state) errors.state = "Required";
        if (!values.postCode) errors.postCode = "Required";
        if (!values.country) errors.country = "Required";
        return errors;
      }}
      onSubmit={(values) => {
        console.log({ values });
      }}
    >
      {({ handleChange, handleBlur, values, errors, setValues }) => (
        <View style={styles.tabContent}>
          <View style={compact ? styles.compact : null}>
            <FormGroup validationError={errors.street}>
              <FormGroup.Input
                style={compact ? styles.compactInput : styles.input}
                icon={<CityIcon />}
                // editable={false}
                onChangeText={handleChange("street")}
                onBlur={handleBlur("street")}
                value={values.street}
                placeholder="Street"
              />
            </FormGroup>
            <FormGroup validationError={errors.subStreet}>
              <FormGroup.Input
                style={compact ? styles.compactInput : styles.input}
                icon={<CityIcon />}
                // editable={false}
                onChangeText={handleChange("subStreet")}
                onBlur={handleBlur("subStreet")}
                value={values.subStreet}
                placeholder="Street 2"
              />
            </FormGroup>
          </View>
          <View style={compact ? styles.compact : null}>
            <FormGroup validationError={errors.town}>
              <FormGroup.Input
                style={compact ? styles.compactInput : styles.input}
                icon={<CityIcon />}
                // editable={false}
                onChangeText={handleChange("town")}
                onBlur={handleBlur("town")}
                value={values.town}
                placeholder="Town"
              />
            </FormGroup>
            <FormGroup validationError={errors.state}>
              <FormGroup.Input
                style={compact ? styles.compactInput : styles.input}
                icon={<CityIcon />}
                // editable={false}
                onChangeText={handleChange("state")}
                onBlur={handleBlur("state")}
                value={values.state}
                placeholder="State"
              />
            </FormGroup>
          </View>
          <View style={compact ? styles.compact : null}>
            <FormGroup validationError={errors.postCode}>
              <FormGroup.Input
                style={compact ? styles.compactInput : styles.input}
                icon={<MapIcon />}
                // editable={false}
                onChangeText={handleChange("postCode")}
                onBlur={handleBlur("postCode")}
                value={values.postCode}
                placeholder="Post Code"
              />
            </FormGroup>
            {/* <FormGroup validationError={errors.country}>
              <FormGroup.Select
                style={compact ? styles.compactInput : styles.input}
                icon={<WorldIcon />}
                // editable={false}
                items={allowedCountries}
                onChangeText={handleChange("country")}
                onBlur={handleBlur("country")}
                selectedValue={values.country}
                placeholder="Country"
              />
            </FormGroup> */}
            <DropDownPicker
              schema={{ label: "label", value: "value" }}
              onSelectItem={(value: any) => {
                const { value: salutationValue } = value;
                setValues({
                  ...values,
                  country: salutationValue,
                });
              }}
              listMode="SCROLLVIEW"
              setValue={setCountry}
              items={allowedCountries}
              value={values.country}
              setOpen={setCountryOpen}
              open={countryOpen}
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
              dropDownDirection="TOP"
            />
            {showChangeRequest == 'Y' ? 
            <View style={{ flexDirection: "row", paddingLeft: 12 }}>
              <Button
                leftIcon={<Transaction color="pink" />}
                color="light-pink"
              >
                Change request
              </Button>
            </View>
            : '' }
          </View>
        </View>
      )}
    </Formik>
  );
};
