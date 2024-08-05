import { StyleSheet, Text, View } from "react-native";
import React from "react";
import colors from "../../utils/colors";
import { ProductView } from "../../components/posts/ProductView";

export const ProductDetails = ({ navigation, route }) => {
  const passedData = route.params.passedData;
  return (
    <View style={{ flex: 1, backgroundColor: colors.color_1 }}>
      <View style={{ paddingTop: 20 }}>
        <ProductView
          display_type="details"
          item={{
            ...passedData,
            owner: {
              username: "aekimena",
              name: "sensei",
              gender: "male",
              image_url: null,
            },
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({});
