import React, { useState } from "react";
import { View, Text, Switch } from "react-native";
import { styles } from "../styles";
import vars from "../../../styles/vars";
import { managePaymentMethods } from "../../../utils/constants";
import { Divider } from "react-native-paper";

type ManagePaymentMethodProps = {
  handleOnlinePayment: () => void;
  listOfCheckedOptions: string[];
  setListOfCheckedOptions: React.Dispatch<React.SetStateAction<string[]>>;
}

const ManagePaymentMethod: React.FC<ManagePaymentMethodProps> = ({
  handleOnlinePayment,
  listOfCheckedOptions,
  setListOfCheckedOptions,
  }) => {
  const handleActionPerItem = (item: string) => {
    switch (item) {
      case 'online_payment':
        handleOnlinePayment();
        break;
      default:
        break;
    }
  }

  return (
    <View style={styles.container}>
      {managePaymentMethods.map((item, index) => {
        const isThisIndexDefaultChecked = listOfCheckedOptions.includes(item.value);
        return (
        <>
          <View style={styles.row} key={index}>
            <View style={{display: 'flex', flexDirection:'row'}}>
              <Text style={{paddingHorizontal: 5, fontSize: 16}}>
              {item.icon}
              </Text>
              <Text style={{fontSize: 16}}>
                {item.label}
              </Text>
            </View>
            <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={isThisIndexDefaultChecked ? vars['accent-blue'] : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => {
                if (isThisIndexDefaultChecked) {
                  setListOfCheckedOptions(listOfCheckedOptions.filter((check) => check !== item.value));
                } else {
                  setListOfCheckedOptions([...listOfCheckedOptions, item.value]);
                }
                handleActionPerItem(item.value);
              }}
              style={{top: -9}}
              value={!!(isThisIndexDefaultChecked)}
            />
          </View>
          <Divider 
            style={{
              height: 1,
              backgroundColor: vars['shade-grey'],
              opacity: .2,
              width: '100%',
            }}
          />
          </>
          )
        }
      )}
    </View>
  )
}
export default ManagePaymentMethod;
