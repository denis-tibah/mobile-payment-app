import { FC } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";

import { styles } from "./styles";

interface IScrollableStepper {
  navList: string[];
  selectedNavIndex: Number;
  handleSelecNavIndex: (navIndex: number) => void;
}

const ScrollableStepper: FC<IScrollableStepper> = ({
  navList,
  selectedNavIndex,
  handleSelecNavIndex,
}) => {
  return (
    <View style={styles.header}>
      <Image
        style={{ height: 30, width: 125 }}
        source={require("../../assets/images/ZazooLogo.png")}
      />
      <ScrollView horizontal>
        <View style={styles.scrollableContainer}>
          {navList.map((item, index) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  handleSelecNavIndex(index);
                }}
              >
                <View style={styles.scrollableItems}>
                  <View
                    style={[
                      styles.circleIndex,
                      selectedNavIndex === index
                        ? styles.circleIndexBgSelected
                        : styles.circleIndexBg,
                    ]}
                  >
                    <Text style={styles.textScrollable}>{index + 1}</Text>
                  </View>
                  <Text
                    style={[
                      selectedNavIndex === index
                        ? styles.textScrollableSelected
                        : styles.textScrollable,
                    ]}
                  >
                    {item}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

export default ScrollableStepper;
