import React, { useEffect, useState } from 'react';
import { Alert, View } from 'react-native';
import Spinner from "react-native-loading-spinner-overlay/lib";
import Pdf from 'react-native-pdf';
import Button from "../../components/Button";
import TickWithoutCircle from '../../assets/icons/TickWithoutCircle';
import MainLayout from '../../layout/Main';
import Check from '../../assets/icons/Check';
import RNFS from "react-native-fs";
import styles from './styles';

export const PDFViewScreen = ({ route, navigation }: any) => {
  const { pdf_url, filename } = route.params;
  const [source, setSource] = useState({});
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setSource({
      uri: pdf_url,
      cache: true,
    });
  }, [pdf_url]);

  const handleSave = async () => {
    setIsLoading(true)
    await RNFS.copyFile(pdf_url, RNFS.DownloadDirectoryPath + `/${filename}`);
    Alert.alert("PDF generated successfully", `File saved as ${filename}`);
    setIsLoading(false)
  }

  return (
    <MainLayout>
        <Spinner visible={isLoading} />
        <View style={styles.container}>
          <Pdf trustAllCerts={false} source={source} style={styles.pdf} />
          <View style={styles.actionWrapper}>
            <Button
              leftIcon={<Check color="red" />}
              color="light-blue"
              onPress={() => navigation.goBack()}
            >
              Cancel
            </Button>
            <Button
              leftIcon={<TickWithoutCircle color="green" />}
              color="light-blue"
              onPress={handleSave}
            >
              Save
            </Button>
          </View>
        </View>
    </MainLayout>
  );
};
