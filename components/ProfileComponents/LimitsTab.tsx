import { useState, FC, Fragment } from "react";
import { View, ScrollView, useWindowDimensions } from "react-native";
import {
  responsiveHeight as rh,
  responsiveWidth as rw,
} from "react-native-responsive-dimensions";

import Button from "../Button";
import EuroIcon from "../../assets/icons/Euro";
import Typography from "../Typography";
import AccountLimits from "./SubComponents/AccountLimits";
import CardLimit from "./SubComponents/CardLimits";
import CardIcon from "../../assets/icons/Card";
import WholeContainer from "../../layout/WholeContainer";

interface ISecurityTab {
  cleanUpTabSelection: () => void;
}

const LimitsTab: FC<ISecurityTab> = ({ cleanUpTabSelection }) => {
  const layout = useWindowDimensions();
  const [limitIndex, setLimitIndex] = useState(0);
  const [routes] = useState([
    { key: "account", title: "Account" },
    { key: "card", title: "Card" },
  ]);
  const [focusedTab, setFocusedTab] = useState<string>("account");

  const displayButtons = (type: string, title: string) => {
    return (
      <Button
        leftIcon={
          type === "account" ? (
            <EuroIcon
              color={focusedTab === type ? "white" : "blue"}
              size={14}
            />
          ) : (
            <CardIcon
              color={focusedTab === type ? "white" : "blue"}
              size={14}
            />
          )
        }
        style={{
          width: rw(42),
        }}
        color={focusedTab === type ? "blue" : "light-blue"}
        basePaddingRight={36}
        basePaddingLeft={36}
        onPress={() => {
          setFocusedTab((prevState) =>
            prevState === "account" ? "card" : "account"
          );
        }}
      >
        <Typography fontWeight="600" fontSize={14} fontFamily="Nunito-SemiBold">
          {title}
        </Typography>
      </Button>
    );
  };

  return (
    <Fragment>
      <View
        style={{
          backgroundColor: "#fff",
          overflow: "hidden",
        }}
      >
        <WholeContainer>
          <View
            style={{
              backgroundColor: "#fffff",
              display: "flex",
              flexBasis: 1,
              flexDirection: "row",
              justifyContent: "space-around",
              marginTop: 16,
              marginBottom: 20,
              width: "100%",
            }}
          >
            {displayButtons("account", "Account")}
            {displayButtons("card", "Card")}
          </View>
          <View style={{ marginHorizontal: 8 }}>
            <ScrollView>
              {focusedTab === "account" ? (
                <View style={{ height: rh(70) }}>
                  <AccountLimits />
                </View>
              ) : null}
              {focusedTab === "card" ? (
                <View /* style={{ height: rh(100) }} */>
                  <CardLimit />
                </View>
              ) : null}
            </ScrollView>
          </View>
        </WholeContainer>
      </View>
    </Fragment>
  );
};

export default LimitsTab;
