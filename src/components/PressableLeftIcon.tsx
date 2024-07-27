import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import _styles from "../utils/_styles";
import colors from "../utils/colors";
import spacing from "../utils/spacing";

interface Props {
  left_component: JSX.Element;
  on_press: any;
  title: string;
}

export const PressableLeftIcon = ({
  left_component,
  on_press,
  title,
}: Props) => {
  // states
  const [pressed, setPressed] = useState(null);
  return (
    <Pressable
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(null)}
      unstable_pressDelay={1000}
      onPress={on_press}
      style={[
        _styles.flex_row,
        { backgroundColor: pressed ? "rgba(0,0,0,0.08)" : "transparent" },
        styles.pressable,
      ]}
    >
      {left_component}
      <Text style={[_styles.font_14_medium, { color: colors.color_2 }]}>
        {title}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pressable: {
    height: 55,
    gap: 15,
    paddingHorizontal: spacing.padding_horizontal,
  },
});
