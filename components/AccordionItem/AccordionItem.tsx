import React, { useState } from "react";
import type { PropsWithChildren } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Typography from "../Typography";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { styles } from "./styles";

type AccordionItemPros = PropsWithChildren<{
  title: string;
  IconLeft?: React.ElementType | null;
  IconRight?: React.ElementType | null;
  iconColor: string;
  iconSize?: number;
}>;

export function AccordionItem({
  children,
  title,
  IconLeft,
  IconRight,
  iconColor,
}: AccordionItemPros): JSX.Element {
  const [expanded, setExpanded] = useState(false);

  function toggleItem() {
    setExpanded(!expanded);
  }

  const body = <View style={styles.accordBody}>{children}</View>;

  return (
    <View style={styles.accordContainer}>
      <TouchableOpacity style={styles.accordHeader} onPress={toggleItem}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
          }}
        >
          {IconLeft ? <IconLeft /> : null}
          <Typography
            color="#000"
            fontWeight={600}
            fontFamily="Nunito-Bold"
            fontSize={16}
          >
            {title}
          </Typography>
          {IconRight ? <IconRight /> : null}
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <MaterialIcons
            name={expanded ? "keyboard-arrow-down" : "keyboard-arrow-up"}
            size={28}
            color={iconColor}
          />
        </View>
      </TouchableOpacity>
      {expanded && body}
    </View>
  );
}
