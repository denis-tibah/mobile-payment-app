import { FC, useState, useRef, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";

import { styles } from "./styles";

interface IScrollableStepper {
  navList: string[];
  selectedNavIndex: number;
  handleSelecNavIndex: (navIndex: number) => void;
}

const ScrollableStepper: FC<IScrollableStepper> = ({
  navList,
  selectedNavIndex,
  handleSelecNavIndex,
}) => {
  const refScrollView = useRef<any>(0);
  const [coordinate, setCoordinate] = useState<any>([]);

  useEffect(() => {
    refScrollView.current.scrollTo({
      x: coordinate[selectedNavIndex] - 80,
    });
  }, [selectedNavIndex]);

  return (
    <View style={styles.header}>
      <Image
        style={{ height: 30, width: 125 }}
        source={require("../../assets/images/ZazooLogo.png")}
      />
      <ScrollView
        horizontal={true}
        persistentScrollbar={true}
        ref={refScrollView}
      >
        <View style={styles.scrollableContainer}>
          {navList.map((item, index) => {
            if (index === 6 || index == 7) return null;

            return (
              <TouchableOpacity
                key={item}
                onLayout={(event) => {
                  const layout = event.nativeEvent.layout;
                  coordinate[index] = layout.x;
                  // console.log(layout.x);
                }}
                onPress={() => {
                  /* refScrollView.current.scrollTo({
                    x: coordinate[selectedNavIndex] - 50,
                  }); */
                  // handleSelecNavIndex(index);
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
