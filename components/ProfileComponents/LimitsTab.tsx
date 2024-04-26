import { useState, FC, Fragment } from "react";
import { View, ScrollView, useWindowDimensions } from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";

import Button from "../../components/Button";
import EuroIcon from "../../assets/icons/Euro";
import Typography from "../Typography";
import { heightGlobal } from "../../utils/helpers";
import AccountLimits from "./SubComponents/AccountLimits";
import CardLimit from "./SubComponents/CardLimits";
import CardIcon from "../../assets/icons/Card";

interface ISecurityTab {
  cleanUpTabSelection: () => void;
}

const renderScene = SceneMap({
  account: AccountLimits,
  card: CardLimit,
});

const LimitsTab: FC<ISecurityTab> = ({ cleanUpTabSelection }) => {
  const layout = useWindowDimensions();
  const [limitIndex, setLimitIndex] = useState(0);
  const [routes] = useState([
    { key: "account", title: "Account" },
    { key: "card", title: "Card" },
  ]);

  return (
    <ScrollView>
      <TabView
        navigationState={{ index: limitIndex, routes }}
        renderScene={renderScene}
        onIndexChange={setLimitIndex}
        initialLayout={{
          width: layout.width,
          height: layout.height,
        }}
        style={{
          backgroundColor: "#fff",
          height: heightGlobal * 0.73,
          overflow: "scroll",
        }}
        renderTabBar={(props) => (
          <View
            style={{
              backgroundColor: "#fffff",
              paddingRight: 8,
              paddingLeft: 14,
            }}
          >
            <TabBar
              {...props}
              tabStyle={{
                paddingVertical: 16,
                paddingHorizontal: 0,
              }}
              pressColor="transparent"
              indicatorStyle={{ backgroundColor: "transparent" }}
              style={{
                backgroundColor: "#fffff",
                width: "100%",
              }}
              renderLabel={({ route, focused }) => (
                <Button
                  leftIcon={
                    route.title.toLowerCase() === "account" ? (
                      <EuroIcon color={focused ? "white" : "blue"} size={14} />
                    ) : (
                      <CardIcon color={focused ? "white" : "blue"} size={14} />
                    )
                  }
                  style={{
                    width: "100%",
                  }}
                  color={focused ? "blue" : "light-blue"}
                  basePaddingRight={36}
                  basePaddingLeft={36}
                  onPress={() => {}}
                >
                  <Typography
                    fontWeight="600"
                    fontSize={14}
                    fontFamily="Nunito-SemiBold"
                  >
                    {route.title}
                  </Typography>
                </Button>
              )}
            />
          </View>
        )}
      />
    </ScrollView>
  );
};

export default LimitsTab;
