import { StyleSheet, Text, View } from "react-native";
import React from "react";
import _styles from "../utils/_styles";
import spacing from "../utils/spacing";
import colors from "../utils/colors";

interface Props {
  user: UserProps;
}

export const LengthSection = ({ user }: Props) => {
  const data = [
    { name: "Posts", length: user?.posts },
    { name: "Followers", length: user?.followers },
    { name: "Following", length: user?.following },
    { name: "Likes", length: user?.likes },
  ];
  return (
    <View
      style={[
        _styles.flex_row_btw,
        {
          marginTop: 20,
          gap: 10,
          paddingHorizontal: spacing.padding_horizontal + 10,
        },
      ]}
    >
      {data.map((item, index) => (
        <View style={[_styles.all_center]} key={index}>
          <Text
            style={[
              _styles.font_16_semi_bold,
              { color: colors.color_2, lineHeight: 20 },
            ]}
          >
            {item.length}
          </Text>
          <Text
            style={[
              _styles.font_14_medium,
              { color: colors.color_6, lineHeight: 20, fontSize: 13 },
            ]}
          >
            {item.name}
          </Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({});
