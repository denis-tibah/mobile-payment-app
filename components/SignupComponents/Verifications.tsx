import { FC } from "react";
import { View, Text } from "react-native";

import Typography from "../../components/Typography";
import { Seperator } from "../../components/Seperator/Seperator";
import vars from "../../styles/vars";
import { styles } from "./styles";

interface IVerifications {
  handlePrevStep: () => void;
  handleNextStep: () => void;
}

const Verifications: FC<IVerifications> = ({
  handlePrevStep,
  handleNextStep,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardTitle}>
        <Typography fontSize={18} fontFamily="Nunito-SemiBold" fontWeight="600">
          Verifications
        </Typography>
      </View>
      <Seperator backgroundColor={vars["grey"]} marginBottom={24} />
    </View>
  );
};

export default Verifications;
