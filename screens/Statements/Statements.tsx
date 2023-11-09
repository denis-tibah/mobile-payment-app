import { View, Text, Alert, ScrollView, FlatList } from "react-native";
import { MainLayout } from "../../layout/Main/Main";
import Heading from "../../components/Heading";
import { styles } from "./styles";
import StatementIcon from "../../assets/icons/Statement";
import { useDispatch, useSelector } from "react-redux";


export function Statements({ navigation }: any) {
  const dispatch = useDispatch();


  return (
    <MainLayout navigation={navigation}>
    
      <View style={styles.heading}>
        <Heading
          icon={<StatementIcon size={18} color="pink" />}
          title={"Statement"}
  
        />
      </View>
  

    </MainLayout>
  );
}
