import { View, Text, Alert, ScrollView, FlatList } from "react-native";
import { MainLayout } from "../../layout/Main/Main";
import Heading from "../../components/Heading";
import FormGroup from "../../components/FormGroup";
import Button from "../../components/Button";
import { styles } from "./styles";
import { screenNames } from "../../utils/helpers";
import BeneficiaryIcon from "../../assets/icons/Beneficiary";
import AddIcon from "../../assets/icons/Add";
import Typography from "../../components/Typography";
import SearchIcon from "../../assets/icons/Search";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteBeneficiary,
  getAllBeneficiary,
} from "../../redux/beneficiary/beneficiarySlice";
import { useEffect } from "react";
import { PayeesList } from "./PayeesList";
import Spinner from "react-native-loading-spinner-overlay/lib";

export function Payees({ navigation }: any) {
  const payees = useSelector((state: any) => state?.beneficiary?.data);
  const loading = useSelector((state: any) => state?.beneficiary?.loading);
  const dispatch = useDispatch();
  const fetchPayees = async () => {
    try {
      await dispatch<any>(getAllBeneficiary());
    } catch (error) {
      console.log({ error });
    }
  };

  const handleDeletePayee = async (itemId: any) => {
    try {
      await dispatch<any>(deleteBeneficiary(itemId))
      .unwrap()
      .then((res: any) => {
          Alert.alert("Deleting payee", res.message);
          fetchPayees();
        }
      );
    } catch (error) {
      console.log({ error });
    }
  };

  const handleDelete = (item: any) => {
    Alert.alert(
      "Delete Confirmation",
      `Are you sure you want to delete this beneficiary: ${item.name}?`,
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => {
            handleDeletePayee(item.uuid);
          },
          style: "destructive",
        },
      ],
      { cancelable: false }
    );
  };

  useEffect(() => {
    if (!payees?.length) fetchPayees();
  }, [payees?.length]);

  return (
    <MainLayout navigation={navigation}>
      <Spinner
        visible={loading}
      />
      <View style={styles.heading}>
        <Heading
          icon={<BeneficiaryIcon size={18} color="pink" />}
          title={"Make Payments"}
          rightAction={
            <Button
              onPress={() => navigation.navigate(screenNames.addPayee)}
              color="light-pink"
              rightIcon={<AddIcon size={16} color="pink" />}
            >
              Add Payee
            </Button>
          }
        />
      </View>
      <View style={styles.input}>
        <FormGroup.Input icon={<SearchIcon />} placeholder="placeholder" />
      </View>
      {/* <ScrollView>
        <View style={styles.listHead}>
          <Typography fontFamily="Nunito-SemiBold">Name</Typography>
          <Typography fontFamily="Nunito-SemiBold" color="accent-blue">
            Last Used
          </Typography>
          <Text></Text>
        </View>
        <PayeesList payees={payees} handleDelete={handleDelete} />
      </ScrollView> */}
      <FlatList
        data={payees}
        keyExtractor={(item) => item.uuid}
        ListHeaderComponent={
          <View style={styles.listHead}>
            <Typography fontFamily="Nunito-SemiBold" fontSize={16}>Name</Typography>
            <Typography fontFamily="Nunito-SemiBold" color="accent-blue" fontSize={16}>
              Created Date
            </Typography>
            <Text></Text>
          </View>
        }
        renderItem={({ item, index }) => (
          <PayeesList payees={[item]} handleDelete={handleDelete} />
        )}
      />
    </MainLayout>
  );
}
