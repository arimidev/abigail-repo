import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import colors from "../utils/colors";
import _styles from "../utils/_styles";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { select_user } from "../redux_utils/features/user";

interface Props {
  children: JSX.Element;
  size: number;
  user: UserProps;
}

export const StoryRing = ({ children, size, user }: Props) => {
  // redux
  const User: UserProps = useSelector(select_user);
  const navigation = useNavigation<any>();

  return (
    <Pressable
      onPress={() => {}}
      style={[
        _styles.all_center,
        styles.story_ring,
        { height: size, width: size },
      ]}
    >
      {children}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  story_ring: {
    borderRadius: 100,
    borderWidth: 3,
    borderColor: colors.color_4,
  },
});
