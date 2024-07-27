import {
  KeyboardTypeOptions,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React from "react";
import _styles from "../utils/_styles";
import colors from "../utils/colors";

interface Props {
  place_holder: string;
  on_change_text: (val: string) => void;
  keyboard_type?: KeyboardTypeOptions;
  left_comp?: JSX.Element;
  right_comp?: JSX.Element;
  error?: boolean;
  error_message?: string;
  default_text?: string;
  disabled?: boolean;
}

export const CustomInput = ({
  place_holder,
  on_change_text,
  keyboard_type,
  left_comp,
  right_comp,
  error,
  default_text,
  error_message,
  disabled,
}: Props) => {
  return (
    <View>
      <View
        style={[
          _styles.flex_row,
          {
            gap: 15,
            // height: 50,
            width: "100%",
            borderRadius: 10,
            backgroundColor: colors.color_3,
            minHeight: 50,
            maxHeight: 200,
          },
        ]}
      >
        {left_comp && left_comp}
        <TextInput
          style={[
            _styles.font_14_medium,
            _styles.flex_1,
            { color: colors.color_2, height: "100%", paddingHorizontal: 15 },
          ]}
          onChangeText={on_change_text}
          keyboardType={keyboard_type}
          placeholder={place_holder}
          defaultValue={default_text}
          multiline
          editable={!disabled}
        />
        {right_comp && right_comp}
      </View>
      {error && (
        <Text style={[_styles.font_12_medium, { color: "red", marginTop: 3 }]}>
          {error_message}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({});
