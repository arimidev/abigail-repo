import {
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { WINDOW_WIDTH } from "@gorhom/bottom-sheet";
import { Image } from "expo-image";
import colors from "../../utils/colors";
import _styles from "../../utils/_styles";
import spacing from "../../utils/spacing";
import { useNavigation } from "@react-navigation/native";
import { PostHeader } from "./PostHeader";
import { ProductActionBtns } from "./ProductActionBtns";
import { getDate } from "../../functions";

// const FeedProduct = () => {
//     return()
// }

const DetailsProduct = ({ item }: { item: any }) => {
  return (
    <View style={{ gap: 10 }}>
      <PostHeader item={item} />
      <View style={[, { paddingHorizontal: spacing.padding_horizontal }]}>
        <Text style={[_styles.font_12_medium, { fontSize: 10 }]}>
          {getDate(item.created_at)}
        </Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginTop: 10 }}
      >
        <View
          style={{
            flexDirection: "row",
            gap: 15,
            paddingHorizontal: spacing.padding_horizontal,
          }}
        >
          {item.medias.map((media, index) => (
            <View key={index}>
              <Image source={media} style={{ width: 250, height: 250 }} />
            </View>
          ))}
        </View>
      </ScrollView>
      <View
        style={{ paddingHorizontal: spacing.padding_horizontal, marginTop: 10 }}
      >
        <Text style={[_styles.font_20_bold, { color: colors.color_2 }]}>
          {item.title}
        </Text>
        <Text style={[_styles.font_14_semi_bold, { color: colors.color_2 }]}>
          ₦{item.price.toLocaleString()}
        </Text>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => Linking.openURL(item.website)}
          style={styles.visitBtn}
        >
          <Text style={[_styles.font_14_medium, { color: colors.color_2 }]}>
            Visit site
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.separator} />
      <View style={{ paddingHorizontal: spacing.padding_horizontal }}>
        <Text
          style={[
            _styles.font_14_medium,
            { color: colors.color_2, fontSize: 13 },
          ]}
        >
          {item.description}
        </Text>
      </View>

      <View style={styles.separator} />
      <View style={{ paddingHorizontal: spacing.padding_horizontal }}>
        <ProductActionBtns item={item} />
      </View>
      <View style={styles.separator} />
    </View>
  );
};
const PairProduct = ({ item, index }: { item: any; index: number }) => {
  const navigation = useNavigation<any>();
  return (
    <Pressable
      onPress={() =>
        navigation.navigate("product_details", { passedData: item })
      }
      style={{
        width: (WINDOW_WIDTH - spacing.padding_horizontal - 15 * 2) * 0.5,
        marginRight: index % 2 == 0 ? 10 : 0,
        marginTop: index % 2 == 0 ? 10 : 40,
        gap: 10,
      }}
    >
      <Image
        source={item.medias[0]}
        style={{
          height: WINDOW_WIDTH / 1.9,
          width: "100%",
        }}
      />
      <View style={{ gap: 5 }}>
        <Text
          style={[_styles.font_14_semi_bold, { color: colors.color_2 }]}
          numberOfLines={2}
        >
          {item.title}
        </Text>
        <Text style={[_styles.font_12_medium, { color: colors.color_2 }]}>
          ₦{item.price}
        </Text>
      </View>
    </Pressable>
  );
};

export const ProductView = ({
  item,
  index,
  display_type = "pair",
}: {
  item: any;
  index?: number;
  display_type?: "feed" | "pair" | "details";
}) => {
  return (
    <View>
      {display_type == "pair" && <PairProduct item={item} index={index} />}
      {display_type == "details" && <DetailsProduct item={item} />}
    </View>
  );
};

const styles = StyleSheet.create({
  separator: {
    height: 1.5,
    width: "100%",
    backgroundColor: colors.color_7,
    marginVertical: 5,
  },
  visitBtn: {
    marginTop: 15,
    height: 45,
    width: "100%",
    backgroundColor: colors.color_7,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
