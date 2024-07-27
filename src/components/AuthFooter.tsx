import { StyleSheet, Text, View } from "react-native";
import React from "react";
import _styles from "../utils/_styles";
import spacing from "../utils/spacing";
import colors from "../utils/colors";

interface Props {
  button_text: string;
  normal_text: string;
  on_button_press?: any;
}

export const AuthFooter = ({
  button_text,
  normal_text,
  on_button_press,
}: Props) => {
  return (
    <View
      style={[
        _styles.all_center,
        {
          height: spacing.window_height * 0.1,
          paddingHorizontal: spacing.padding_horizontal,
        },
      ]}
    >
      <Text
        style={[
          _styles.font_14_medium,
          { color: colors.color_5, textAlign: "center" },
        ]}
      >
        {normal_text}{" "}
        <Text
          style={[_styles.font_14_bold, { color: colors.color_4 }]}
          onPress={on_button_press}
        >
          {button_text}
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({});
