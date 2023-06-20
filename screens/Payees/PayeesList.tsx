import React, { useState } from "react";
import { SwipeListView } from "react-native-swipe-list-view";
import { styles } from "./styles";
import { PayeeItem } from "../../components/Payees/PayeeItem";
import { Text, TouchableOpacity, View } from "react-native";

export const PayeesList = ({ payees, handleDelete }:any) => {
  return (
    <SwipeListView
      data={payees}
      renderItem={({ item, index }:any) => (
        <PayeeItem key={item.uuid} data={item} />
      )}
      disableRightSwipe={true}
      renderHiddenItem={({ item }:any, rowMap) => (
        <View key={item.uuid} style={styles.rowBack}>
          <TouchableOpacity onPress={() => handleDelete(item)}>
            <Text style={styles.deleteText}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
      rightOpenValue={-75}
      previewRowKey={"0"}
      previewOpenValue={-40}
      previewOpenDelay={3000}
    />
  );
};
