import { Dimensions, StyleSheet } from 'react-native';

export default StyleSheet.create({
  heading: {
    zIndex: 1,
  },
  actionWrapper: {
    width: "100%",
    paddingHorizontal: 50,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});
