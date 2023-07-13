import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import Modal from 'react-native-modal';
import Spinner from 'react-native-loading-spinner-overlay';

interface LoaderProps {
  isLoading: boolean;
}

const LoadingScreen: React.FC<LoaderProps> = ({ isLoading }) => {
  return (
    <Modal isVisible={isLoading} animationIn="fadeIn" animationOut="fadeOut" backdropOpacity={0.5}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    </Modal>
  );
};

export default LoadingScreen;