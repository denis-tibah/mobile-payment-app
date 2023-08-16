import { useNavigation, useRoute } from "@react-navigation/native";
import { useState } from "react";
import { Text, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import Button from "../../components/Button";
import { styles } from "./styles";
import { screenNames } from "../../utils/helpers";

const ResetPassword = ({navigation}: any) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const { params } = useRoute();
  // const { token, email } = params;
  // const navigation = useNavigation();
  // const { resetPassword } = useAuth();
  
  const handleResetPassword = async () => {
      setLoading(true);
      setError('');
      setSuccess(false);
  
      if (!password) {
      setPasswordError('Password is required');
      setLoading(false);
      return;
      }
  
      if (!confirmPassword) {
      setConfirmPasswordError('Confirm password is required');
      setLoading(false);
      return;
      }
  
      if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      setLoading(false);
      return;
      }
  
      try {
        // await resetPassword(token, email, password);
        setSuccess(true);
      } catch (_error: any) {
        console.log(_error);
      }
  
      setLoading(false);
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={(value) => {
        setPassword(value);
        setPasswordError('');
        }}
        secureTextEntry
      />
      {passwordError ? <Text style={styles.error}>{passwordError}</Text> : null}
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={(value) => {
        setConfirmPassword(value);
        setConfirmPasswordError('');
        }}
        secureTextEntry
      />
      {confirmPasswordError ? (
        <Text style={styles.error}>{confirmPasswordError}</Text>
      ) : null}
      <Button
        title="Reset Password"
        onPress={handleResetPassword}
        loading={loading}
      />
      {success ? (
        <Text style={styles.success}>
        Your password has been reset successfully
        </Text>
      ) : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button
        title="Back to Sign In"
        onPress={() => navigation.navigate(screenNames.resetPassword)}
        type="clear"
      />
    </View>
  );
}

export default ResetPassword;


