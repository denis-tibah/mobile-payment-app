import { Fragment } from "react";
import { Text } from "react-native";
import Typography from "../../../components/Typography";
import vars from "../../../styles/vars";
import { Divider } from "react-native-paper";
import FormGroup from "../../../components/FormGroup";
import Document from "../../../assets/icons/Document";
import { View } from "react-native-animatable";
import { TouchableOpacity } from "react-native-gesture-handler";
import AntDesign from "react-native-vector-icons/AntDesign";
import { hp, widthGlobal } from "../../../utils/helpers";

type PayeeAttachFileSectionProps = {
  values: any;
  handleChange: any;
  handleBlur: any;
  setFieldValue: any;
  pickDocument: any;
};

const PayeeAttachFileSection: React.FC<PayeeAttachFileSectionProps> = ({
    values,
    handleChange,
    handleBlur,
    setFieldValue,
    pickDocument,
  }) => {

  return (
  <Fragment>
    <Typography
      fontFamily="Nunito-SemiBold"
      fontSize={11}
      color={vars["shade-grey"]}
      style={{ marginVertical: 15 }}
    >
      Please provide supporting information for all transfers above
      $5,000
    </Typography>
      <Divider style={{ marginVertical: 15, backgroundColor: "none" }} />
      <FormGroup
        // validationError={
        //   errors.remarks && touched.remarks && errors.remarks
        // }
      >
        {/* <FormGroup.TextArea
          keyboardType="default"
          name="purpose"
          returnKeyType={"done"}
          onChangeText={handleChange("purpose")}
          onBlur={handleBlur("purpose")}
          value={values.postcode}
          placeholderTextColor={vars["ios-default-text"]}
          placeholder="Purpose of your transfer"
          iconColor="blue"
          editable={values.reason === "N/A" ? false : true}
          icon={<StatementsIcon size={16} />}
        /> */}
        <FormGroup.Input
          keyboardType="text"
          name="remarks"
          onChangeText={handleChange("remarks")}
          onBlur={handleBlur("remarks")}
          value={values.remarks}
          placeholderTextColor={vars["ios-default-text"]}
          placeholder="Purpose of your transfer"
          iconColor="blue"
          style={{ height: 42 }}
          icon={<Document size={18} color={vars['accent-blue']} />}
        />
      </FormGroup>
      <View style={{ paddingHorizontal: 16 }}>
        <TouchableOpacity
          onPress={pickDocument}
          style={{ display: "flex", flexDirection: "row" }}
          disabled={values.amount >= 5000 ? false : true}
        >
          <AntDesign
            name="pluscircleo"
            size={38}
            color={vars["accent-blue"]}
          />
          <Typography
            color={vars["shade-grey"]}
            top={hp(2)}
            paddingLeft={12}
            fontFamily="Nunito-SemiBold"
          >
            Attach a file
          </Typography>
        </TouchableOpacity>
      </View>
      <Divider style={{
        marginVertical: 26,
        width: widthGlobal - 32,
        left: -18,
        height: 1,
        backgroundColor: '#ACACAC',
        opacity: 0.4
      }} />
      <View style={{ display: "flex", flexDirection: "row" }}>
        <FormGroup>
          <FormGroup.CheckboxUI
            label="For manual processing outside my limits"
            value={values?.isManualProcessing}
            color={
              values?.isManualProcessing ? vars["accent-blue"] : undefined
            }
            onValueChange={() => {
              setFieldValue(
                "isManualProcessing",
                !values?.isManualProcessing
              );
            }}
            disabled={values.amount >= 5000 ? false : true}
          />
        </FormGroup>
        <Text style={{ backgroundColor: vars["shade-grey"] }}>{` `}</Text>
      </View>
    </Fragment>
  )
}

export default PayeeAttachFileSection;
