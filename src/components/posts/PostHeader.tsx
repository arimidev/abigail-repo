import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import _styles from "../../utils/_styles";
import spacing from "../../utils/spacing";
import { getImage, getName } from "../../functions";
import colors from "../../utils/colors";
import IonIcons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";

export const PostHeader = ({
  item,
  type = "post",
}: {
  item: UserPostProps;
  type?: "reposted" | "post" | "details";
}) => {
  return (
    <View
      style={[
        _styles.flex_row,
        { paddingHorizontal: spacing.padding_horizontal },
      ]}
    >
      <View style={[_styles.flex_row, { gap: 10, flex: 1 }]}>
        <Image
          source={getImage({
            uri: item.owner.image_url,
            gender: item.owner.gender,
          })}
          style={[
            { height: 50, width: 50, borderRadius: 100 },
            type == "reposted" && { height: 40, width: 40 },
          ]}
        />
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
      </View>
      <Pressable>
        <IonIcons name="ellipsis-vertical" size={17} color={colors.color_2} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({});
