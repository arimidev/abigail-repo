import { StyleSheet, Text, View } from "react-native";
import React from "react";
import spacing from "../utils/spacing";
import _styles from "../utils/_styles";
import { Image } from "expo-image";
import images from "../utils/images";
import colors from "../utils/colors";
import { getDate } from "../functions";

interface Props {
  user: UserProps;
}

export const BioSection = ({ user }: Props) => {
  return (
    <View
      style={{
        paddingHorizontal: spacing.padding_horizontal,
        marginTop: 15,
        gap: 3,
      }}
    >
      {user.bio && (
        <View style={[_styles.flex_row, { gap: 5, alignItems: "flex-start" }]}>
          {/* <Image source={images.description_icon} style={styles.icon_cont} /> */}
          <Text
            style={[
              _styles.font_12_semi_bold,
              { color: colors.color_2, flex: 1 },
            ]}
          >
            {user.bio}
          </Text>
        </View>
      )}
      {user.website && (
        <View style={[_styles.flex_row, { gap: 5 }]}>
          {/* <Image source={images.website_icon} style={styles.icon_cont} /> */}
          <Text style={[_styles.font_12_medium, { color: colors.color_4 }]}>
            {user.website}
          </Text>
        </View>
      )}
      <View style={[_styles.flex_row, { gap: 5 }]}>
        {/* <Image source={images.clock_icon} style={[styles.icon_cont, ,]} /> */}
        <Text style={[_styles.font_12_medium, { color: colors.color_2 }]}>
          Joined on {getDate(user?.created_at)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  icon_cont: {
    height: 15,
    width: 15,
  },
});
