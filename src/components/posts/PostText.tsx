import { StyleSheet, Text, View } from "react-native";
import React from "react";
import spacing from "../../utils/spacing";
import colors from "../../utils/colors";
import _styles from "../../utils/_styles";

export const PostText = ({
  item,
  type = "post",
}: {
  item: UserPostProps;
  type?: "reposted" | "post" | "details";
}) => {
  return (
    <View style={{ paddingHorizontal: spacing.padding_horizontal }}>
      <Text
        numberOfLines={
          type == "details"
            ? null
            : item.medias.length > 0
            ? 2
            : type == "reposted"
            ? 2
            : 5
        }
        style={[_styles.font_14_medium, { color: colors.color_2 }]}
      >
        {item.post_text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({});
