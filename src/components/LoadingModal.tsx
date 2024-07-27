import { ActivityIndicator, Modal, StyleSheet, Text, View } from "react-native";
import React from "react";
import _styles from "../utils/_styles";
import colors from "../utils/colors";

interface Props {
  loading: boolean;
}

export const LoadingModal = ({ loading }: Props) => {
  return (
    <Modal statusBarTranslucent animationType="fade" visible={loading}>
      <View
        style={[
          _styles.all_center,
          _styles.flex_1,
          { backgroundColor: colors.color_1 },
        ]}
      >
        <ActivityIndicator size={50} color={colors.color_4} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({});
