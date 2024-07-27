import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import React from "react";
import _styles from "../utils/_styles";

interface Props {
  text: string;
  text_color?: string;
  background_color: string;
  on_press: any;
  left_comp?: JSX.Element;
  right_comp?: JSX.Element;
  loading?: boolean;
  disabled?: boolean;
  button_style?: ViewStyle;
}

export const CustomButton = ({
  text,
  text_color,
  background_color,
  on_press,
  left_comp,
  right_comp,
  loading,
  disabled,
  button_style,
}: Props) => {
  return (
    <Pressable
      style={[
        _styles.flex_row_center,
        {
          gap: 15,
          borderRadius: 10,
          backgroundColor: background_color,
          height: 50,
          paddingHorizontal: 15,
          opacity: disabled ? 0.7 : 1,
        },
        button_style,
      ]}
      disabled={disabled}
      onPress={on_press}
    >
      {loading ? (
        <ActivityIndicator size={30} color={"#fff"} />
      ) : (
        <>
          {left_comp && left_comp}
          <Text style={[_styles.font_14_medium, { color: text_color }]}>
            {text}
          </Text>
          {right_comp && right_comp}
        </>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({});
