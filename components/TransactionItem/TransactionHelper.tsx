import { View } from "react-native";

import Typography from "../Typography";
import EuroIcon from "../../assets/icons/Euro";
import DollarIcon from "../../assets/icons/Dollar";
import GbpIcon from "../../assets/icons/Gbp";
import { formatAmountTableValue, strippedHTMLTag } from "../../utils/helpers";
import IconGBP from "../../assets/icons/IconGBP/IconGBP";

const displayTitle = ({ title }: { title: string }) => {
  return (
    <Typography
      color="#086AFB"
      fontFamily="Nunito-SemiBold"
      fontSize={11}
      fontWeight={"600"}
    >
      {title}
    </Typography>
  );
};

const currencyIcon = (param: any, { color }: { color: string }) => {
  switch (param) {
    case "EUR":
      return <EuroIcon size={18} color={color} />;
    case "USD":
      return <DollarIcon size={18} color={color} />;
    case "GBP":
      return <GbpIcon size={18} color={color} />;
    default:
      return <EuroIcon size={18} color={color} />;
  }
};

const displayValue = ({
  content,
  hasCurrency,
  currencyType,
}: {
  content: string | null;
  hasCurrency: boolean;
  currencyType: string | undefined;
}) => {
  return (
    <View
      style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
    >
      {hasCurrency ? (
        <Typography marginRight={4} marginTop={4}>
          {currencyType === "EUR" ? (
            <EuroIcon size={13} />
          ) : currencyType === "USD" ? (
            <DollarIcon size={13} />
          ) : currencyType === "GBP" ? (
            <IconGBP size={13} />
          ) : null}
        </Typography>
      ) : null}

      <Typography
        color="#000"
        fontFamily="Mukta-Regular"
        fontSize={13}
        fontWeight={"600"}
      >
        {/* for amount value */}
        {hasCurrency ? formatAmountTableValue(content, currencyType) : null}
        {/* for ordinary value */}
        {!hasCurrency ? strippedHTMLTag(content) : null}
      </Typography>
    </View>
  );
};

export { displayTitle, displayValue, currencyIcon };
