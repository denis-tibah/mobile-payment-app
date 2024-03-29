import { useState, FC, Fragment } from "react";
import { View, ScrollView, useWindowDimensions } from "react-native";
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';

import Typography from "../Typography";
import { heightGlobal } from "../../utils/helpers";
import AccountLimits from "./SubComponents/AccountLimits";
import CardLimit from "./SubComponents/CardLimits";

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
    { key: 'account', title: 'Account' },
    { key: 'card', title: 'Card' },
  ]);

  return (
    <Fragment>
      <TabView
        style={{
          flex: 1,
          backgroundColor: '#fff',
          height: heightGlobal * .73,
          // overflow: 'scroll',
        }}
        renderTabBar={(props) => (
          <View style={{ backgroundColor: "#fff" }}>
            <TabBar
              {...props}
              indicatorStyle={{ backgroundColor: "#e7038e" }}
              style={{ backgroundColor: "#fff" }}
              renderLabel={({ route, focused, color }) => (
                <Typography
                  fontSize={16}
                  fontWeight={600}
                  color={focused ? "#e7038e" : "#4D4D4D"}
                >
                  {route.title}
                </Typography>
              )}
            />
          </View>
        )}
        navigationState={{ index: limitIndex, routes }}
        renderScene={renderScene}
        onIndexChange={setLimitIndex}
        initialLayout={{ width: layout.width, height: layout.height }}
      />
    </Fragment>
  )
};

export default LimitsTab;
