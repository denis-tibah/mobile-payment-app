import { FC, useEffect } from "react";
import { useSelector } from "react-redux";
import SumsubWebSdk from "@sumsub/websdk-react";
import { View } from "react-native";
import Typography from "../../components/Typography";
import { Seperator } from "../../components/Seperator/Seperator";
import vars from "../../styles/vars";
import { styles } from "./styles";

interface ISumsubProcess {
  handlePrevStep: () => void;
}

const SumsubProcess: FC<ISumsubProcess> = ({ handlePrevStep }) => {
    const registration = useSelector((state: any) => state.registration);

    let accessToken = registration?.data?.sumsubToken;

    const expirationHandler = (e) => {};
    const messageHandler = (e) => {};
    const errorHandler = (e) => {};

      return (
        <View style={styles.card}>
        <View style={styles.cardTitle}>
            <Typography fontSize={18} fontFamily="Nunito-SemiBold" fontWeight="600">
            Sumsub
            </Typography>
        </View>
        <Seperator backgroundColor={vars["grey"]} marginBottom={24} />
        <View>
            <View style={styles.cardBody}>
                <SumsubWebSdk
                        accessToken={accessToken}
                        expirationHandler={expirationHandler}
                        onMessage={messageHandler}
                        onError={errorHandler}
                />

            </View>
        </View>
        </View>
  );
};

        
export default SumsubProcess;