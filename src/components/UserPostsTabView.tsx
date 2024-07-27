import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import spacing from "../utils/spacing";
import {
  useGet_user_posts_mutation_Mutation,
  useGet_user_postsQuery,
} from "../redux_utils/api_slice";
import _styles from "../utils/_styles";
import { Image } from "expo-image";
import { getImage, getName } from "../functions";
import { StoryRing } from "./StoryRing";
import colors from "../utils/colors";
import IonIcons from "@expo/vector-icons/Ionicons";
import { ImageResizer } from "./ImageResizer";
import { useDispatch } from "react-redux";
import { update_post } from "../redux_utils/features/seen_posts";
import useLikePostFunction from "../hooks/useLikePostFunction";
import useSavePostFunction from "../hooks/useSavePostFunction";

const PostHeader = ({
  item,
  is_reposted_post,
}: {
  item: UserPostProps;
  is_reposted_post?: boolean;
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
            uri: item?.owner?.image_url,
            gender: item?.owner?.gender,
          })}
          style={[
            { height: 50, width: 50, borderRadius: 100 },
            is_reposted_post && { height: 40, width: 40 },
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

const UserPostTextComp = ({
  item,
  is_reposted_post,
}: {
  item: UserPostProps;
  is_reposted_post?: boolean;
}) => {
  return (
    <View style={{ paddingHorizontal: spacing.padding_horizontal }}>
      <Text
        numberOfLines={item.medias.length > 0 ? 2 : is_reposted_post ? 2 : 5}
        style={[_styles.font_14_medium, { color: colors.color_2 }]}
      >
        {item.post_text}
      </Text>
    </View>
  );
};

const UserPostMedias = ({
  item,
  is_reposted_post,
}: {
  item: UserPostProps;
  is_reposted_post?: boolean;
}) => {
  return (
    <View style={{ paddingHorizontal: spacing.padding_horizontal }}>
      {item.medias.length == 1 && (
        <View style={styles.post_img_1}>
          {/* <Image
            source={item.medias[0]}
            style={{ height: "100%", width: "100%" }}
          /> */}
          <ImageResizer
            source={{ uri: item.medias[0] }}
            maxWidth={spacing.window_width - 40}
            maxHeight={is_reposted_post ? 200 : 400}
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

const UserPostActions = ({ item }: { item: UserPostProps }) => {
  const dispatch = useDispatch();
  const { likePost } = useLikePostFunction();
  const { savePost } = useSavePostFunction();

  // functions

  async function likePostHere() {
    const result = await likePost({ post: item });
  }
  async function savePostHere() {
    const result = await savePost({ post: item });
  }

  return (
    <View
      style={[
        _styles.flex_row,
        { paddingHorizontal: spacing.padding_horizontal },
      ]}
    >
      <View style={[_styles.flex_row, { gap: 15, flex: 1 }]}>
        <Pressable
          onPress={() => {
            likePostHere();
          }}
        >
          <IonIcons
            name={item.is_liked_by_user == true ? "heart" : "heart-outline"}
            size={18}
            color={item.is_liked_by_user == true ? "#FF6E6E" : colors.color_5}
          />
        </Pressable>
        <Text style={[_styles.font_12_semi_bold, { color: colors.color_2 }]}>
          {item.likes}
        </Text>
        <Pressable>
          <IonIcons name="chatbox-outline" size={18} color={colors.color_5} />
        </Pressable>
        <Text style={[_styles.font_12_semi_bold, { color: colors.color_2 }]}>
          {item.comments}
        </Text>
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
      </View>
      <View style={[_styles.flex_row, { gap: 15 }]}>
        <Pressable onPress={savePostHere}>
          <IonIcons
            name={item.is_saved_by_user ? "bookmark" : "bookmark-outline"}
            size={18}
            color={item.is_saved_by_user ? "#171717" : colors.color_5}
          />
        </Pressable>
      </View>
    </View>
  );
};

const UserRepostComp = ({ item }: { item: UserPostProps }) => {
  return (
    <View style={{ gap: 10 }}>
      <PostHeader item={item} />
      {item.post_text && <UserPostTextComp item={item} />}
      {item.medias?.length > 0 && <UserPostMedias item={item} />}
      <View
        style={[
          _styles.flex_row,
          { gap: 10, paddingLeft: spacing.padding_horizontal },
        ]}
      >
        <View
          style={{
            height: "90%",
            width: 2,
            backgroundColor: "#D7D7D7",
            left: 10,
          }}
        />
        <View style={{ gap: 10, flex: 1 }}>
          <PostHeader item={item.post} is_reposted_post />
          {item.post.post_text && (
            <UserPostTextComp item={item.post} is_reposted_post />
          )}
          {item.post.medias?.length > 0 && (
            <UserPostMedias item={item.post} is_reposted_post />
          )}
        </View>
      </View>
      <UserPostActions item={item} />
    </View>
  );
};

export const UserPostComp = ({ item }: { item: UserPostProps }) => {
  return (
    <Pressable
      style={({ pressed }) => [
        {
          gap: 10,
          backgroundColor: pressed ? "rgba(0,0,0,0.04)" : "transparent",
          paddingVertical: 10,
        },
      ]}
      unstable_pressDelay={2000}
    >
      {item.type == "repost" && item.post && <UserRepostComp item={item} />}
      {item.type == "post" && (
        <>
          <PostHeader item={item} />
          {item.post_text && <UserPostTextComp item={item} />}
          {item.medias?.length > 0 && <UserPostMedias item={item} />}
          <UserPostActions item={item} />
        </>
      )}
    </Pressable>
  );
};

// export const UserPostsTabView = ({
//   user,
//   data,
//   loading,
//   error,
//   on_press_refetch,
// }: {
//   user: UserProps;
//   data: Array<UserPostProps>;
//   loading: boolean;
//   error: boolean;
//   on_press_refetch: any;
// }) => {
//   // // states

//   // const [page, set_page] = useState(0);
//   // const [data, setData] = useState<Array<UserPostProps>>([]);

//   // // api hooks

//   // const [get_user_posts_mutation, { isLoading, isError }] =
//   //   useGet_user_posts_mutation_Mutation();
//   // const {
//   //   data: updatedPosts,
//   //   isLoading: updating,
//   //   isError: updateErr,
//   //   refetch: update_refetch,
//   // } = useGet_user_postsQuery({
//   //   id: item?._id,
//   //   page: 1,
//   // });

//   // // functions

//   // async function getPosts(page) {
//   //   try {
//   //     const res = await get_user_posts_mutation({
//   //       page,
//   //       id: item?._id,
//   //     }).unwrap();
//   //     setData(res.results);
//   //   } catch (err) {
//   //     console.log(err);
//   //   }
//   // }

//   // function getUniqueObjectsById(arr) {
//   //   const uniqueObjects = arr.reduce((acc, obj) => {
//   //     const existingObj = acc[obj._id];
//   //     if (
//   //       !existingObj ||
//   //       new Date(obj.updated_at) > new Date(existingObj.updated_at)
//   //     ) {
//   //       acc[obj._id] = obj;
//   //     }
//   //     return acc;
//   //   }, {});

//   //   return Object.values(uniqueObjects);
//   // }

//   // const postsData: Array<UserPostProps> = getUniqueObjectsById(data);

//   // // effects

//   // useEffect(() => {
//   //   getPosts(page + 1).then(() => set_page(1));
//   // }, []);

//   // useEffect(() => {
//   //   if (updatedPosts && !updateErr) {
//   //     setData([...updatedPosts.results, ...data]);
//   //   }
//   // }, [updateErr, updatedPosts, updating]);
//   return (
//     <View
//       style={{
//         width: spacing.window_width,
//         // height: spacing.window_height,
//       }}
//     >
//       <FlatList
//         data={data}
//         keyExtractor={(item) => item._id}
//         contentContainerStyle={{ marginTop: 20 }}
//         renderItem={({ item }) => <UserPostComp item={item} />}
//       />
//     </View>
//   );
// };

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
