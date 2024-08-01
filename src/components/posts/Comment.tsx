import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import spacing from "../../utils/spacing";
import _styles from "../../utils/_styles";
import colors from "../../utils/colors";
import { getImage, getName } from "../../functions";
import { CommentActionBtns } from "./CommentActions";
import { Image } from "expo-image";
import { useNavigation } from "@react-navigation/native";

interface Props {
  item: CommentProps;
}

export const CommentComp = ({ item }: Props) => {
  const navigation = useNavigation<any>();
  return (
    <Pressable
      onPress={() => navigation.push("comment_page", { passedData: item })}
      style={({ pressed }) => [
        {
          paddingHorizontal: spacing.padding_horizontal,
          backgroundColor: pressed ? "rgba(0,0,0,0.04)" : "transparent",
        },
      ]}
      unstable_pressDelay={2000}
    >
      <View
        style={[
          _styles.flex_row,
          { gap: 10, alignItems: "flex-start", paddingVertical: 10 },
        ]}
      >
        {/* profile pic */}
        <Image
          source={getImage({
            uri: item.owner.image_url,
            gender: item.owner.gender,
          })}
          style={{
            height: 40,
            width: 40,
            borderRadius: 50,
          }}
        />

        <View style={{ flex: 1, gap: 5 }}>
          {/* names */}
          <View>
            <Text
              style={[
                _styles.font_14_semi_bold,
                { color: colors.color_2, lineHeight: 17 },
              ]}
            >
              {getName(item?.owner?.name)}
            </Text>
            <Text style={[_styles.font_12_medium, { color: colors.color_5 }]}>
              @{item?.owner?.username}
            </Text>
          </View>
          {/* comment text/media */}
          <View>
            <Text
              numberOfLines={5}
              style={[_styles.font_14_medium, { color: colors.color_2 }]}
            >
              {item.post_text}
            </Text>
          </View>
          {/* post actions */}
          <CommentActionBtns item={item} />
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({});
