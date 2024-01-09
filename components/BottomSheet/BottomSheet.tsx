import React, { Fragment, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  PanResponder,
  Animated,
} from "react-native";

import * as Animatable from "react-native-animatable";
import { Divider } from "react-native-paper";
import vars from "../../styles/vars";

type Props = {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  hasNoHeaderPadding?: boolean;
  headerTitle?: string;
  leftHeaderIcon?: React.ReactNode;
  rightHeaderIcon?: React.ReactNode;
  isBottomSheetHeaderShown?: boolean;
  headerResponse?: {
    isShown: boolean;
    isSuccessful: boolean;
    message: string;
  };
};
export const BottomSheet: React.FC<Props> = ({
  isVisible,
  onClose,
  children,
  hasNoHeaderPadding,
  headerTitle,
  leftHeaderIcon,
  rightHeaderIcon,
  isBottomSheetHeaderShown,
  headerResponse,
}) => {
  const bottomSheetRef = useRef(null);

  const [panResponder] = useState(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dy > 5,
      onPanResponderMove: Animated.event(
        [null, { dy: new Animated.Value(0) }],
        {
          useNativeDriver: false,
        }
      ),
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 50) {
          Animated.timing(bottomSheetTranslateY, {
            toValue: 400,
            duration: 300,
            useNativeDriver: false,
          }).start(onClose);
        } else {
          Animated.spring(bottomSheetTranslateY, {
            toValue: 0,
            bounciness: 8,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  );

  const bottomSheetTranslateY = useRef(new Animated.Value(0)).current;

  const handleAnimationEnd = () => {
    if (!isVisible) {
      bottomSheetRef.current?.slideOutUp(300);
    }
  };

  const handleClose = () => {
    if (bottomSheetRef.current) {
      bottomSheetRef.current.slideOutDown(300).then(() => {
        onClose();
      });
    } else {
      onClose();
    }
  };

  return (
      <Animatable.View
        ref={bottomSheetRef}
        style={[styles.bottomSheet, {
          display: isVisible ? 'flex' : 'none',
          ...(headerResponse?.isShown && {
            borderColor: headerResponse?.isSuccessful ? vars["accent-green"] : vars["heavy-red"],
            borderTopWidth: 60
          }),
        }]}
        animation={isVisible ? 'slideInUp' : 'slideOutDown'}
        duration={300}
        onAnimationEnd={handleAnimationEnd}
        {...panResponder.panHandlers}
      >
        <TouchableOpacity onPress={handleClose} style={{
          width: '100%',
          alignSelf: 'center',
          }}>
            <Text style={{color: 'white', alignSelf: 'center', top: -55, fontSize: 18}}>{
              headerResponse?.isShown ?
              headerResponse?.message : ' '
            }</Text>
          </TouchableOpacity>

        { !!isBottomSheetHeaderShown &&
          <Fragment>
            <View style={styles.headerContainer}>
              <View style={{display: 'flex', flexDirection: 'row'}}>
                  {!! leftHeaderIcon && <View style={{paddingRight: 7}}>{!!leftHeaderIcon && leftHeaderIcon}</View>}
                  <Text style={{fontSize: 16, top: -3}}>{headerTitle}</Text>
                </View>
                <View>
                {!!rightHeaderIcon && rightHeaderIcon}
              </View>
            </View>
            <Divider style={{marginVertical: 15}} />
          </Fragment>
        }
        <View style={styles.contentContainer}>
          {children}
        </View>
      </Animatable.View>
  );
};

const styles = StyleSheet.create({
  bottomSheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    /* padding: 16, */
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  headerContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  hasNoHeaderPadding: {
    padding: 0,
  },
  contentContainer: {
    display: "flex",
  },
  closeButton: {
    marginTop: 16,
  },
});
