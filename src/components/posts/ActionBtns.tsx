import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import colors from "../../utils/colors";
import IonIcons from "@expo/vector-icons/Ionicons";
import _styles from "../../utils/_styles";

export const LikeBtn = ({ item, onPress }: { item: any; onPress: any }) => {
  return (
    <>
      <Pressable onPress={onPress}>
        <IonIcons
          name={item.is_liked_by_user == true ? "heart" : "heart-outline"}
          size={18}
          color={item.is_liked_by_user == true ? "#FF6E6E" : colors.color_5}
        />
      </Pressable>
      <Text style={[_styles.font_12_semi_bold, { color: colors.color_2 }]}>
        {item.likes}
      </Text>
    </>
  );
};

export const CommentBtn = ({ item }: { item: any }) => {
  return (
    <>
      <Pressable>
        <IonIcons name="chatbox-outline" size={18} color={colors.color_5} />
      </Pressable>
      <Text style={[_styles.font_12_semi_bold, { color: colors.color_2 }]}>
        {item.comments}
      </Text>
    </>
  );
};

export const RepostBtn = ({ item, onPress }: { item: any; onPress: any }) => {
  return (
    <>
      <Pressable>
        <IonIcons
          name="repeat"
          size={22}
          color={item.is_reposted_by_user ? "#87B66A" : colors.color_5}
        />
      </Pressable>
      <Text style={[_styles.font_12_semi_bold, { color: colors.color_2 }]}>
        {item.reposts}
      </Text>
    </>
  );
};

export const SaveBtn = ({ item, onPress }: { item: any; onPress: any }) => {
  return (
    <>
      <Pressable onPress={onPress}>
        <IonIcons
          name={item.is_saved_by_user ? "bookmark" : "bookmark-outline"}
          size={18}
          color={item.is_saved_by_user ? "#171717" : colors.color_5}
        />
      </Pressable>
    </>
  );
};

const styles = StyleSheet.create({});
