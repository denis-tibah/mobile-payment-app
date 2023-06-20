import { Text } from "react-native";
import { styles } from "./styles";
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from "react-native-popup-menu";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { signout } from "../../redux/auth/authSlice";
import { screenNames } from "../../utils/helpers";

export function SubMenu({ navigation }: any) {
  const auth = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const lastMenuOptionStyle = { ...styles.menuOption, borderBottomWidth: 0 };

  return (
    <Menu>
      <MenuTrigger style={styles.dropshadow}>
        <Text style={styles.dot}></Text>
        <Text style={styles.dot}></Text>
        <Text style={styles.dot}></Text>
      </MenuTrigger>
      <MenuOptions optionsContainerStyle={styles.optionsContainer}>
        {auth?.isAuthenticated ? (
          <>
            <MenuOption
              style={styles.menuOption}
              onSelect={() => navigation.navigate(screenNames.myaccount)}
              text="Home"
            />
            <MenuOption
              style={lastMenuOptionStyle}
              onSelect={() => dispatch(signout())}
              text="Sign Out"
            />
          </>
        ) : (
          <>
            <MenuOption
              style={styles.menuOption}
              onSelect={() => navigation.navigate(screenNames.login)}
              text="Sign In"
            />
            <MenuOption
              style={styles.menuOption}
              onSelect={() => navigation.navigate(screenNames.signup)}
              text="Sign Up"
            />
            <MenuOption style={lastMenuOptionStyle} text="Terms & conditions" />
          </>
        )}
      </MenuOptions>
    </Menu>
  );
}
