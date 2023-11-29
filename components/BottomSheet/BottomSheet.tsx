import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import * as Animatable from 'react-native-animatable';
type Props = {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
};
export const BottomSheet: React.FC<Props> = ({ isVisible, onClose, children }) => {

  const bottomSheetRef = useRef(null);
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
        style={[styles.bottomSheet, { display: isVisible ? 'flex' : 'none' }]}
        animation={isVisible ? 'slideInUp' : 'slideOutDown'}
        duration={300}
        onAnimationEnd={handleAnimationEnd}
      >
        <View style={styles.contentContainer}>
          {children}
          <TouchableOpacity onPress={handleClose}
            style={styles.closeButton}
          >
            <Text>Close</Text>
          </TouchableOpacity>
        </View>
      </Animatable.View>
  );
};

const styles = StyleSheet.create({
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  contentContainer: {
    display: 'flex',
  },
  closeButton: {
    marginTop: 16,
  },
});