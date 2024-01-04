import { useNavigation } from "@react-navigation/native";
import EuroIcon from "../../assets/icons/Euro";
import { View, StyleSheet, TouchableOpacity, Text, Dimensions } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import CheckBox from "expo-checkbox";
import { useFormik } from "formik";
import MainLayout from "../../layout/Main";
import { screenNames } from "../../utils/helpers";
import ArrowLeftLine from "../../assets/icons/ArrowLeftLine";
import vars from "../../styles/vars";
import { Divider } from "react-native-paper";
import FormGroup from "../../components/FormGroup";
import Button from "../../components/Button";


const PayeeSendFunds = ({navigation, route}: any) => {
  const { params }: any = route || { params: {} };
  const accountName: string = params?.item.name || '';
  const accountIban: string = params?.item.iban || '';
  const accountBalance: number = params?.item.balance || 0;
  const windowHeight = Dimensions.get('window').height;

  const { handleSubmit, handleChange, handleBlur, values, touched, errors, setFieldValue } = useFormik({
    initialValues: {
      amount: '',
      isManualProcessing: false,
    },
    onSubmit: (values: any) => {
      console.log(values);
    },
  });

  return (
      <MainLayout>
        <View style={{height: '100%', backgroundColor: 'white'}}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <TouchableOpacity
                style={styles.headerLeftIcon}
                onPress={() => navigation.navigate(screenNames.payments)}
              >
                <ArrowLeftLine size={14} color='blue'/>
              </TouchableOpacity>
              <View>
                <Text style={{fontSize: 14}}>{accountName}</Text>
                <Text style={{fontSize: 12, color: vars['shade-grey']}}>{accountIban}</Text>
              </View>
            </View>
            <View>
              <Text>Your Balance</Text>
              <Text style={{fontSize: 12, color: vars['shade-grey']}}>€ {accountBalance}</Text>
            </View>
          </View>
          <View style={{paddingVertical: 15, backgroundColor: '#fff'}}>
            <Divider style={{marginBottom: 25}}/>
            <FormGroup
              validationError={
                errors.address2 && touched.address2 && errors.address2
              }
            >
              <FormGroup.Input
                keyboardType="text"
                name="amount"
                onChangeText={handleChange("amount")}
                onBlur={handleBlur("amount")}
                value={values.postcode}
                placeholderTextColor={vars["ios-default-text"]}
                placeholder="Amount to send"
                iconColor="blue"
                icon={<EuroIcon />}
              />
            </FormGroup>
            <FormGroup
              validationError={
                errors.address2 && touched.address2 && errors.address2
              }
            >
              <FormGroup.Input
                keyboardType="text"
                name="reference"
                onChangeText={handleChange("reference")}
                onBlur={handleBlur("reference")}
                value={values.postcode}
                placeholderTextColor={vars["ios-default-text"]}
                placeholder="Reference"
                iconColor="blue"
                icon={<EuroIcon />}
              />
          </FormGroup>
          <Divider style={{marginVertical: 15}}/>
          {/* purpose of your transfer input */}
          <Text style={{fontSize: 12, color: vars['accent-grey'], alignSelf: 'center'}}>Please provide supporting information for all transfers above $5,000</Text>
          <Divider style={{marginVertical: 5}}/>
          <FormGroup
            validationError={
              errors.address2 && touched.address2 && errors.address2
            }
          >
            <FormGroup.Input
              keyboardType="text"
              name="purpose"
              onChangeText={handleChange("purpose")}
              onBlur={handleBlur("purpose")}
              value={values.postcode}
              placeholderTextColor={vars["ios-default-text"]}
              placeholder="Purpose of your transfer"
              iconColor="blue"
              icon={<EuroIcon />}
            />
            </FormGroup>
            <View style={{paddingHorizontal: 16}}>
              <TouchableOpacity style={{display: 'flex', flexDirection: 'row'}}>
                <AntDesign name="pluscircleo" size={42} color={vars['accent-blue']} />
                <Text style={{color: vars['shade-grey'], top: 10, paddingLeft: 15}}>Attach a file</Text>
              </TouchableOpacity>
            </View>
            <Divider style={{marginVertical: 15}}/>
            <View style={{display: 'flex', flexDirection: 'row'}}>
              <FormGroup>
                <FormGroup.CheckboxUI
                  label="For manual processing outside my limits"
                  value={values?.isManualProcessing}
                  color={
                    values?.isManualProcessing
                      ? vars["accent-blue"]
                      : undefined
                  }
                  onValueChange={() => {
                    setFieldValue(
                      "isManualProcessing",
                      !values?.isManualProcessing
                    );
                  }}
                />
              </FormGroup>
              <Text style={{backgroundColor: vars['shade-grey']}}>{` `}</Text>
            </View>
          </View>
          <View style={{ bottom: windowHeight / 8, position: 'absolute', width: '100%'}}>
            <Button
              onPress={handleSubmit}
              color="light-pink"
              style={{width: '80%', alignSelf: 'center'}}
              leftIcon={<AntDesign name="checkcircleo" size={16} color={vars['accent-pink']} />}
            >
              Send
            </Button>
          </View>
        </View>
      </MainLayout>
  );
};
export default PayeeSendFunds;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    paddingTop: 20,
    paddingHorizontal: 10,
  },
  headerLeft: {
    display: "flex",
    flexDirection: "row",
  },
  headerLeftIcon: {
    height: 35,
    width: 35,
    borderRadius: 20,
    margin: 7,
    backgroundColor: "#F5F9FF",
    padding: 10,
  },
});
