import { useState, Children, cloneElement, useEffect } from "react";
import { View, ScrollView } from "react-native";
import Button from "../Button";
import { styles } from "./styles";

export function Panel({ children }: any) {
  return <>{children}</>;
}

export function Tabs({ children, screen }: any) {
  const [active, setActive] = useState(0);
  const setActiveTab = (index: any) => setActive(index);

  useEffect(() => {
    if (screen === undefined) return;
    const limitsIndex = Children.toArray(children).findIndex(
      (child: any) => 
        child.props.text === screen
    );
    if (limitsIndex !== -1) {
      setActiveTab(limitsIndex);
    }
  }, [screen]);

  return (
    <View>
      <View style={styles.tabBar}>
        <ScrollView horizontal style={styles.tab}>
          {Children.map(children, (child, index) => (
            <View key={index} style={styles.tabButtonMargin}>
              <Button
                key={index}
                onPress={() => {
                  setActiveTab(index);
                  child.props.onPress && child.props.onPress();
                }}
                color={active === index ? "blue" : "light-blue"}
                leftIcon={cloneElement(child.props.icon, {
                  color: active === index ? "light-blue" : "blue",
                  size: 16,
                })}
              >
                {child.props.text}
              </Button>
            </View>
          ))}
        </ScrollView>
      </View>
      {children[active]}
    </View>
  );
}

Tabs.Panel = Panel;
