import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { forwardRef, useImperativeHandle, useRef } from "react";
import _styles from "../utils/_styles";
import spacing from "../utils/spacing";
import colors from "../utils/colors";
import FontIcons from "@expo/vector-icons/FontAwesome6";
import IonIcons from "@expo/vector-icons/Ionicons";
import Animated, {
  interpolate,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

interface Props {
  currentPage: any;
  scrollX: any;
  on_tab_press: (val: number) => void;
}

export const UserProfileTabs = forwardRef(
  ({ currentPage, scrollX, on_tab_press }: Props, ref) => {
    const tab_width =
      (spacing.window_width - spacing.padding_horizontal * 2) / 3;

    // refs
    // const localRef = useRef<any>(null);
    // useImperativeHandle(ref, () => ({
    //   scrollTo: (item) => localRef.current?.scrollTo(item),
    // }));

    // animated related

    const indicatorStyle = useAnimatedStyle(() => {
      return {
        transform: [
          {
            translateX: withSpring(
              interpolate(
                scrollX.value,
                [0, spacing.window_width, spacing.window_width * 3],
                [0, tab_width, tab_width * 3]
              )
            ),
          },
        ],
      };
    });

    return (
      <View
        style={[
          _styles.flex_row,
          _styles.all_center,

          {
            height: 50,
            paddingHorizontal: spacing.padding_horizontal,
            backgroundColor: colors.color_1,
          },
        ]}
      >
        <Pressable
          style={[_styles.flex_1, _styles.all_center]}
          onPress={() => {
            on_tab_press(0);
          }}
        >
          <IonIcons name="grid-outline" size={20} color={colors.color_2} />
        </Pressable>
        {/* <Pressable
          style={[_styles.flex_1, _styles.all_center]}
          onPress={() => on_tab_press(1)}
        >
          <IonIcons name="videocam-outline" size={20} color={colors.color_2} />
        </Pressable> */}
        <Pressable
          style={[_styles.flex_1, _styles.all_center]}
          onPress={() => on_tab_press(2)}
        >
          <IonIcons name="repeat-outline" size={24} color={colors.color_2} />
        </Pressable>
        <Pressable
          style={[_styles.flex_1, _styles.all_center]}
          onPress={() => on_tab_press(3)}
        >
          <IonIcons
            name="bag-handle-outline"
            size={20}
            color={colors.color_2}
          />
        </Pressable>
        <Animated.View
          style={[
            {
              position: "absolute",
              bottom: 0,
              backgroundColor: colors.color_2,
              width: tab_width,
              height: 2,
              left: spacing.padding_horizontal,
            },
            indicatorStyle,
          ]}
        />
      </View>
    );
  }
);

const styles = StyleSheet.create({
  icon: {
    height: 20,
    width: 20,
  },
});
