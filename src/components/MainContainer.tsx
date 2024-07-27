import { StyleSheet, Text, View } from "react-native";
import React from "react";
import _styles from "../utils/_styles";
import { StatusBar } from "expo-status-bar";
import colors from "../utils/colors";

interface Props {
  statusbar_background?: string;
  translucent?: boolean;
  children?: JSX.Element;
  bar_style?: "light" | "dark";
}

export const MainContainer = ({
  children,
  statusbar_background,
  translucent,
  bar_style,
}: Props) => {
  return (
    <View style={[_styles.flex_1]}>
      <StatusBar
        style={bar_style || "dark"}
        backgroundColor={statusbar_background || colors.color_1}
        translucent={translucent || false}
      />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({});
