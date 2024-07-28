import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import React from "react";
import colors from "../../utils/colors";
import spacing from "../../utils/spacing";
import _styles from "../../utils/_styles";
import IonIcons from "@expo/vector-icons/Ionicons";

const CommentInput = () => {
  return (
    <View style={{ backgroundColor: colors.color_1 }}>
      <View style={{ height: 1, width: "100%", backgroundColor: "#D7D7D7" }} />
      <View
        style={[
          _styles.flex_row,
          { paddingHorizontal: spacing.padding_horizontal, gap: 10 },
        ]}
      >
        <Pressable>
          <IonIcons name="camera-outline" size={22} color={colors.color_2} />
        </Pressable>
        <View style={[_styles.flex_row, styles.commentBox]}>
          <TextInput
            style={[
              _styles.font_14_medium,
              { height: "100%", flex: 1, color: colors.color_2 },
            ]}
            placeholder="Add a comment..."
          />
          <Pressable style={{ transform: [{ rotateZ: "-35deg" }] }}>
            <IonIcons size={22} color={colors.color_2} name="send-outline" />
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default CommentInput;

const styles = StyleSheet.create({
  commentBox: {
    marginVertical: 10,
    height: 47,
    width: "100%",
    borderRadius: 50,
    backgroundColor: "#F3F3F3",
    flex: 1,
    gap: 10,
    paddingHorizontal: 10,
  },
});
