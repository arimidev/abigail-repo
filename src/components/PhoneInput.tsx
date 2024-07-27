import { StyleSheet, Text, View } from "react-native";
import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import PhoneNoInput from "react-native-phone-number-input";
import colors from "../utils/colors";
import _styles from "../utils/_styles";

interface Props {
  onChangeText?: (val: string) => void;
  error?: boolean;
  default_value?: string;
}

export const PhoneInput = forwardRef(
  ({ onChangeText, error, default_value }: Props, ref) => {
    // ref

    const localRef = useRef();
    useImperativeHandle(ref, () => ({
      isValidNumber: (txt: string) => localRef.current?.isValidNumber(txt),
    }));

    // state
    const [value, setValue] = useState("");
    const [formattedValue, setFormattedValue] = useState("");

    return (
      <View>
        <PhoneNoInput
          ref={localRef}
          defaultValue={default_value}
          defaultCode="NG"
          layout="first"
          onChangeText={(text) => {
            setValue(text);
            onChangeText(text);
          }}
          onChangeFormattedText={(text) => {
            setFormattedValue(text);
          }}
          containerStyle={{
            width: "100%",
            borderRadius: 10,
            height: 50,
          }}
          textContainerStyle={{
            backgroundColor: colors.color_3,
            borderRadius: 10,
            paddingVertical: 0,
          }}
          flagButtonStyle={{
            backgroundColor: colors.color_3,
            marginRight: 10,
            borderRadius: 10,
          }}
          codeTextStyle={[_styles.font_14_medium, { color: colors.color_2 }]}
          textInputStyle={[_styles.font_14_medium, { color: colors.color_2 }]}
        />
        {error && (
          <View style={[_styles.flex_row, { gap: 5, marginTop: 10 }]}>
            <Text style={[_styles.font_12_medium, { color: "red", flex: 1 }]}>
              Please enter a valid phone number!
            </Text>
          </View>
        )}
      </View>
    );
  }
);

const styles = StyleSheet.create({});
