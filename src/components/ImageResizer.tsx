import React, { useState, useEffect } from "react";
import { View, ActivityIndicator, StyleSheet, Image } from "react-native";

export const ImageResizer = ({ source, maxWidth, maxHeight }) => {
  const [dimensions, setDimensions] = useState(null);

  useEffect(() => {
    Image.getSize(
      source.uri,
      (width, height) => {
        // width: 200, height: 300
        // maxwidth: 35.., maxheight: 400
        const aspectRatio = width / height;
        let newHeight = height;
        if (maxHeight && newHeight < maxHeight) {
          newHeight = maxWidth / aspectRatio;
        } else if (maxHeight && newHeight > maxHeight) {
          newHeight = maxHeight;
        }

        setDimensions({ width: maxWidth, height: newHeight });
      },
      (error) => {
        console.error("Error getting image size:", error);
      }
    );
  }, [source.uri, maxWidth, maxHeight]);

  if (!dimensions) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <Image
      source={source}
      style={{
        width: dimensions.width,
        height: dimensions.height,
      }}
    />
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
