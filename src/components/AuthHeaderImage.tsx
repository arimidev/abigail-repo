import { StyleSheet, Text, View } from "react-native";
import React from "react";
import spacing from "../utils/spacing";
import _styles from "../utils/_styles";
import colors from "../utils/colors";

interface Props {
  title: string;
}

export const AuthHeaderImage = ({ title }: Props) => {
  return (
    <>
      <View
        style={{ height: 250, width: "100%", backgroundColor: "#eeeeee" }}
      ></View>
      <View
        style={{ paddingHorizontal: spacing.padding_horizontal, marginTop: 20 }}
      >
        <Text style={[_styles.font_22_bold, { color: colors.color_2 }]}>
          {title}
        </Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({});
