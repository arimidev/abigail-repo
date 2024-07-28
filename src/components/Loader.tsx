import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import React from "react";
import _styles from "../utils/_styles";
import colors from "../utils/colors";

export const Loader = () => {
  return (
    <View style={[_styles.flex_1, _styles.all_center]}>
      <ActivityIndicator size={60} color={colors.color_2} />
    </View>
  );
};

const styles = StyleSheet.create({});
