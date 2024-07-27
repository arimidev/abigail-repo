import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { MainContainer } from "../../components/MainContainer";
import colors from "../../utils/colors";
import spacing from "../../utils/spacing";
import _styles from "../../utils/_styles";
import { Image } from "expo-image";
import { CustomButton } from "../../components/CustomButton";
import * as ImagePicker from "expo-image-picker";
import IonIcons from "@expo/vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { select_temporary_token } from "../../redux_utils/features/temporary_token";
import { showToast } from "../../functions";
import { setToken } from "../../redux_utils/features/token";

export const ProfileImage = ({ navigation }) => {
  // states
  const [image, set_image] = useState(null);
  const [loading, setLoading] = useState(false);

  // redux
  const token = useSelector(select_temporary_token);
  const dispatch = useDispatch();

  // functions
  function skipToMain() {
    // dispatch(setToken(token));
    navigation.replace("login");
  }

  async function uploadImage() {
    setLoading(true);
    const formData = new FormData();
    formData.append("image", {
      uri: image,
      name: "photo.jpg",
      type: "image/jpeg",
    });
    try {
      const response = await fetch(
        "http://192.168.43.120:5000/api/upload-avatar",
        {
          method: "POST",
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        showToast({
          description: "Error uploading image",
          type: "error",
          duration: 3000,
        });
        setLoading(false);
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("image_url: ", data.image_url); // URL of the uploaded image
      showToast({
        description: "Image uploaded successfully",
        type: "success",
        duration: 3000,
      });
      setLoading(false);
      //   dispatch(setToken(token));
      navigation.replace("login");
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }

  async function selectImage() {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      set_image(result.assets[0].uri);
    }
  }
  return (
    <MainContainer>
      <View style={{ flex: 1, backgroundColor: colors.color_1 }}>
        <Pressable
          disabled={loading}
          onPress={skipToMain}
          style={styles.skip_cont}
        >
          <Text style={[_styles.font_16_bold, { color: colors.color_4 }]}>
            Skip
          </Text>
        </Pressable>
        <View style={[_styles.all_center, { marginTop: 50 }]}>
          <View
            style={[
              { height: 200, width: 200, overflow: "hidden" },
              image !== null && styles.uploaded_image,
              _styles.all_center,
            ]}
          >
            <Image
              source={
                image == null
                  ? require("../../../assets/images/placeholder_avatar.svg")
                  : image
              }
              style={{ height: "100%", width: "100%", borderRadius: 100 }}
            />
            {image !== null && (
              <Pressable
                onPress={() => set_image(null)}
                style={[
                  {
                    position: "absolute",
                    zIndex: 3,
                  },
                ]}
              >
                <IonIcons
                  name="trash-bin-outline"
                  color={"rgba(255,255,255,0.5)"}
                  size={25}
                />
              </Pressable>
            )}
          </View>

          <Text style={[_styles.font_14_medium, styles.info]}>
            {image == null
              ? "Upload a profile image to reach people that may know you"
              : "Amazing! you're good to go."}
          </Text>
        </View>
        <View style={styles.button_cont}>
          <CustomButton
            text={
              image == null ? "Select Profile Image" : "Upload Profile Image"
            }
            background_color={colors.color_4}
            text_color="#fff"
            on_press={image == null ? selectImage : uploadImage}
            disabled={loading}
            loading={loading}
          />
        </View>
      </View>
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  uploaded_image: {
    borderRadius: 100,
  },
  skip_cont: {
    alignSelf: "flex-end",
    marginTop: spacing.padding_top,
    paddingHorizontal: spacing.padding_horizontal,
  },
  info: {
    color: colors.color_2,
    textAlign: "center",
    marginTop: 20,
    paddingHorizontal: spacing.padding_horizontal,
  },
  button_cont: {
    position: "absolute",
    bottom: 20,
    width: "100%",
    paddingHorizontal: spacing.padding_horizontal,
  },
});
