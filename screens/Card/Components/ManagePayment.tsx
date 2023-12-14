import React, { useState } from "react";
import { View, Text, Switch } from "react-native";
import { styles } from "../styles";
import vars from "../../../styles/vars";
import { managePaymentMethods } from "../../../utils/constants";

const ManagePaymentMethod: React.FC = () => {
  const [ listOfChecks, setListOfChecks ] = useState<string[]>([]);
  return (
    <View style={styles.container}>
      {managePaymentMethods.map((item, index) => {
        const checkIfThisIsChecked = listOfChecks.find((check) => check === item.label);
        return (
          <View style={styles.row} key={index}>
            <Text>
              {item.icon}
              {item.label}
            </Text>
            <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={checkIfThisIsChecked ? vars['accent-blue'] : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => {
                if (checkIfThisIsChecked) {
                  setListOfChecks(listOfChecks.filter((check) => check !== item.label));
                } else {
                  setListOfChecks([...listOfChecks, item.label]);
                }
              }}
              value={checkIfThisIsChecked ? true : false}
            />
          </View>
          )
        }
      )}
    </View>
  )
}
export default ManagePaymentMethod;
