import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Tabs } from "react-native-collapsible-tab-view";
import _styles from "../../utils/_styles";

export const PostFlatList = ({
  loading,
  data,
  error,
  onEndReached,
  isDataAvailable = true,
  renderItem,
}: {
  loading: boolean;
  data: Array<UserPostProps>;
  error: boolean;
  onEndReached: () => void;
  isDataAvailable: boolean;
  renderItem: any;
}) => {
  return (
    <Tabs.FlatList
      data={data}
      contentContainerStyle={{ marginTop: 20, paddingBottom: 50 }}
      renderItem={renderItem}
      keyExtractor={(item) => item._id}
      ListFooterComponent={
        loading ? (
          <View style={[_styles.all_center]}>
            <ActivityIndicator size={40} color={"#EAEAEA"} />
          </View>
        ) : (
          <View />
        )
      }
      onEndReached={() => {
        if (isDataAvailable == true && !loading) {
          onEndReached();
        }
      }}
    />
  );
};

const styles = StyleSheet.create({});
