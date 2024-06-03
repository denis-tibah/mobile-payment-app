import { useEffect } from "react";
import { TouchableOpacity } from "react-native";
import { View, Image } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import * as ImagePicker from "expo-image-picker";

import { styles } from "./styles";
import { uploadProfileImage } from "../../redux/profile/profileSlice";
import { useGetProfileQuery } from "../../redux/profile/profileSliceV2";
import { getProfile } from "../../redux/profile/profileSlice";
import DefaultAvatar from "../../assets/images/default-avatar.jpg";
import Button from "../Button";
import { RootState } from "../../store";

export function Avatar({
  src,
  icon,
  iconActionHander,
  isBase64Image = false,
  size = "small",
  borderColor = "#ddebff",
  fileUpload = false,
}: any) {
  const userTokens = useSelector((state: RootState) => state?.auth?.data);
  const dispatch = useDispatch();

  const {
    isLoading: isLoadingGetProfile,
    data: profileData,
    refetch,
  } = useGetProfileQuery(
    {
      accessToken: userTokens?.access_token,
      tokenZiyl: userTokens?.token_ziyl,
    },
    {
      skip: !userTokens && !userTokens?.access_token && !userTokens?.token_ziyl,
    }
  );

  const handleUploadFile = async () => {
    const options: ImagePicker.ImagePickerOptions = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      base64: true,
      selectionLimit: 1,
    };
    const photo = await ImagePicker.launchImageLibraryAsync(options);

    if (photo.assets?.length) {
      dispatch<any>(
        uploadProfileImage({
          email: profileData?.email,
          file: photo.assets[0].base64,
        })
      ).then((payload: any) => {
        if (payload) {
          refetch();
        }
      });
    }
  };

  let avatarSource;

  if (src) {
    if (isBase64Image) {
      avatarSource = { uri: `data:image/jpeg;base64,${src}` };
    } else {
      avatarSource = { uri: src };
    }
  } else if (profileData?.userProfile?.profileimage) {
    avatarSource = {
      uri: `data:image/jpeg;base64,${profileData?.userProfile?.profileimage}`,
    };
  } else {
    avatarSource = DefaultAvatar;
  }

  return (
    <View style={[styles[size], icon ? styles.hasIcon : null]}>
      <Image style={[styles.image, { borderColor }]} source={avatarSource} />
      {icon && (
        // @ts-expect-error
        <View onClick={iconActionHander} className={styles.iconButton}>
          {fileUpload ? (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={handleUploadFile}
            >
              {icon}
            </TouchableOpacity>
          ) : (
            <Button type="button">{icon}</Button>
          )}
        </View>
      )}
    </View>
  );
}
