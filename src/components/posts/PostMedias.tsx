import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { ImageResizer } from "../ImageResizer";
import spacing from "../../utils/spacing";
import _styles from "../../utils/_styles";
import { Image } from "expo-image";

export const PostMedias = ({
  item,
  type = "post",
}: {
  item: UserPostProps;
  type?: "reposted" | "post" | "details";
}) => {
  return (
    <View style={{ paddingHorizontal: spacing.padding_horizontal }}>
      {item.medias.length == 1 && (
        <View style={styles.post_img_1}>
          <ImageResizer
            source={{ uri: item.medias[0] }}
            maxWidth={spacing.window_width - 40}
            maxHeight={type == "reposted" ? 200 : 400}
          />
        </View>
      )}
      {item.medias.length == 2 && (
        <View style={[_styles.flex_row, { gap: 5 }]}>
          <Image source={item.medias[0]} style={styles.post_img_x2} />
          <Image source={item.medias[0]} style={styles.post_img_x2} />
        </View>
      )}
      {item.medias.length == 3 && (
        <View
          style={[
            _styles.flex_row,
            { height: spacing.window_width / 2, gap: 5 },
          ]}
        >
          <Image
            source={item.medias[0]}
            style={{ height: "100%", flex: 1, borderRadius: 0 }}
          />
          <View style={{ flex: 1, gap: 5 }}>
            <Image
              source={item.medias[1]}
              style={{ flex: 1, width: "100%", borderRadius: 0 }}
            />
            <Image
              source={item.medias[2]}
              style={{ flex: 1, width: "100%", borderRadius: 0 }}
            />
          </View>
        </View>
      )}
      {item.medias.length == 4 && (
        <View
          style={[
            _styles.flex_row,
            { gap: 5, height: spacing.window_width / 1.8 },
          ]}
        >
          <View style={{ flex: 1, gap: 5 }}>
            <Image
              source={item.medias[0]}
              style={{ flex: 1, width: "100%", borderRadius: 0 }}
            />
            <Image
              source={item.medias[1]}
              style={{ flex: 1, width: "100%", borderRadius: 0 }}
            />
          </View>
          <View style={{ flex: 1, gap: 5 }}>
            <Image
              source={item.medias[2]}
              style={{ flex: 1, width: "100%", borderRadius: 0 }}
            />
            <Image
              source={item.medias[3]}
              style={{ flex: 1, width: "100%", borderRadius: 0 }}
            />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  post_img_1: {
    // height: spacing.window_width / 2,
    width: "100%",
    // borderRadius: 10,
    overflow: "hidden",
  },
  post_img_x2: {
    height: spacing.window_width / 2,
    flex: 1,
    // borderRadius: 10,
  },
});
