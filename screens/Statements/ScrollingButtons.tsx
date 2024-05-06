import React, { useEffect, useRef, useState } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import { format, subMonths, addMonths, set } from "date-fns";
import vars from "../../styles/vars";

type ScrollingButtonsProps = {
  onScrollOptions: (params: any) => void;
};

const ScrollingButtons: React.FC<ScrollingButtonsProps> = ({
  onScrollOptions,
}) => {
  const buttonCount = 24;
  const scrollViewRef = useRef(null);
  const [selectedButton, setSelectedButton] = useState(1);
  const [scrollOffset, setScrollOffset] = useState(0);
  const currentDate = new Date();

  const handleButtonPress = (buttonNumber: number) => {
    onScrollOptions(generateMonth(buttonNumber).raw);
    setSelectedButton(buttonNumber);
  };

  const generateMonth = (buttonNumber: number) => {
    const currentDateWithOffset = subMonths(currentDate, buttonNumber - 1);
    return {
      monthly: format(currentDateWithOffset, "MMMM yyyy"),
      raw: currentDateWithOffset,
    };
  };

  const handleLayout = (event: any) => {
    buttonHeight = event.nativeEvent.layout.height;
  };

  const handleScroll = (event: any) => {
    setScrollOffset(event.nativeEvent.contentOffset.y);
  };

  const handleScrollEnd = () => {
    const centeredIndex = Math.round(scrollOffset / buttonHeight) + 1;
    // scrollViewRef?.current.scrollTo({
    //   y: buttonHeight * centeredIndex,
    //   animated: true,
    // });
    setSelectedButton(centeredIndex);
  };

  const renderButtons = () => {
    const buttons = [];
    for (let i = 1; i <= buttonCount; i++) {
      if (i !== 1) {
        buttons.push(
          <TouchableOpacity
            key={i}
            style={[
              styles.button,
              selectedButton === i ? styles.selectedButton : null,
            ]}
            onPress={() => handleButtonPress(i)}
            onLayout={handleLayout}
          >
            <Text
              style={
                selectedButton === i
                  ? styles.selectedButtonText
                  : styles.buttonText
              }
            >
              {generateMonth(i).monthly}
            </Text>
          </TouchableOpacity>
        );
      }
    }
    return buttons;
  };

  useEffect(() => {
    handleButtonPress(2);
  }, []);

  return (
    <ScrollView
      ref={scrollViewRef}
      style={{ height: 120 }}
      vertical
      snapToInterval={buttonHeight}
      decelerationRate="fast"
      onScroll={handleScroll}
      // onScrollEndDrag={handleScrollEnd}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>{renderButtons()}</View>
    </ScrollView>
  );
};

let buttonHeight = 0; // Variable to store the button height

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    padding: 10,
  },
  button: {
    backgroundColor: "#fff",
    padding: 10,
    margin: 5,
    height: 40,
    borderRadius: 50,
  },
  selectedButton: {
    backgroundColor: vars["accent-blue"],
    borderRadius: 50,
  },
  buttonText: {
    // fontWeight: 'bold',
    color: vars["accent-blue"],
    textAlign: "center",
  },
  selectedButtonText: {
    // fontWeight: 'bold',
    color: "#fff",
    textAlign: "center",
  },
});

export default ScrollingButtons;
