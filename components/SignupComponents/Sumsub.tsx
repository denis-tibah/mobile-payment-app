import { FC } from "react";
import { View } from "react-native";

import Typography from "../../components/Typography";
import { Seperator } from "../../components/Seperator/Seperator";
import vars from "../../styles/vars";
import { styles } from "./styles";

interface ISumsub {
  handlePrevStep: () => void;
}

const Sumsub: FC<ISumsub> = ({ handlePrevStep }) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardTitle}>
        <Typography fontSize={18} fontFamily="Nunito-SemiBold" fontWeight="600">
          Sumsub
        </Typography>
      </View>
      <Seperator backgroundColor={vars["grey"]} marginBottom={24} />
      <View>
        <View style={styles.cardBody}></View>
      </View>
    </View>
  );
};

export default Sumsub;
