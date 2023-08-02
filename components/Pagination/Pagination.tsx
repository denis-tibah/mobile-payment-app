import { FC, Fragment } from "react";
import { View, TouchableOpacity, Text } from "react-native";

import ArrowLeftIcon from "../../assets/icons/ArrowLeft";
import ArrowRightIcon from "../../assets/icons/ArrowRight";
import { styles } from "./styles";

interface ILoginDetails {
  handlePreviousPage: () => void;
  handleNextPage: () => void;
  page: number;
  lastPage: number;
}

const LoginDetails: FC<ILoginDetails> = ({
  handlePreviousPage,
  handleNextPage,
  page,
  lastPage,
}) => {
  return (
    <Fragment>
      {lastPage > 0 ? (
        <View style={styles.paginateContainer}>
          <TouchableOpacity
            onPress={() => handlePreviousPage()}
            style={styles.paginateArrowContainer}
          >
            <ArrowLeftIcon size={14} />
            <Text style={styles.paginateTextNextPrev}>prev</Text>
          </TouchableOpacity>
          <Text>
            page {page} of {lastPage}
          </Text>
          <TouchableOpacity
            onPress={() => handleNextPage()}
            style={styles.paginateArrowContainer}
          >
            <Text style={styles.paginateTextNextPrev}>next</Text>
            <ArrowRightIcon size={14} />
          </TouchableOpacity>
        </View>
      ) : null}
    </Fragment>
  );
};

export default LoginDetails;
