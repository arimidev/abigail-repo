import {
  FlatList,
  ScrollView,
  SectionList,
  StyleSheet,
  Text,
  View,
  ListRenderItem,
  ActivityIndicator,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { MainContainer } from "./MainContainer";
import colors from "../utils/colors";
import { ProfileHeader } from "./ProfileHeader";
import { useDispatch, useSelector } from "react-redux";
import { select_user, setUser } from "../redux_utils/features/user";
import { BioSection } from "./BioSection";
import { LengthSection } from "./LengthSection";
import { SuggestedAccounts } from "./SuggestedAccounts";
import {
  useFollow_userMutation,
  useGet_suggested_accountsMutation,
  useGet_user_posts_mutation_Mutation,
  useGet_user_postsQuery,
  useGet_user_query_Query,
} from "../redux_utils/api_slice";

import { UserProfileTabs } from "./UserProfileTabs";
import { PostsDataComp } from "./ProfileTabPageScrolls";
import spacing from "../utils/spacing";
import { useSharedValue } from "react-native-reanimated";
import { showToast } from "../functions";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { UserPostComp, UserPostsTabView } from "./UserPostsTabView";
import { Tabs } from "react-native-collapsible-tab-view";
import _styles from "../utils/_styles";
import {
  add_post,
  select_seen_posts,
} from "../redux_utils/features/seen_posts";
import {
  add_user,
  select_seen_users,
  update_user,
} from "../redux_utils/features/seen_users";

interface Props {
  pageUser: UserProps;
}

export const UserProfileComp = ({ pageUser }: Props) => {
  // redux
  const User: UserProps = useSelector(select_user); // app user ====================================  app user
  const dispatch = useDispatch();
  const seen_posts: Array<UserPostProps> = useSelector(select_seen_posts);
  const seen_users: Array<UserProps> = useSelector(select_seen_users);

  // states

  const [post_page, set_post_page] = useState(0);
  const [post_data, set_post_data] = useState<Array<UserPostProps>>([]);
  const [user_page_data, set_user_page_data] = useState<UserProps>(pageUser); // user profile of this pare ===================
  const [suggested_accounts, set_suggested_accts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [is_data_available, set_is_data_available] = useState(true);

  // validate user for changes ========================================================

  const validatedPageUser = () => {
    const reduxItem = seen_users.find(
      (seen_user_item) => seen_user_item._id === user_page_data._id
    );
    return reduxItem;
  };

  // refs
  const scrollViewRef = useRef();

  // animated

  const scrollX = useSharedValue(0);
  const currentPage = useSharedValue(0);

  // api hooks

  const [
    get_user_posts_mutation,
    { isLoading: getPostsLoading, isError: getPostsErr },
  ] = useGet_user_posts_mutation_Mutation();
  const {
    data: updatedPosts,
    isLoading: postsUpdating,
    isError: postsUpdateErr,
    refetch: update_refetch_posts,
  } = useGet_user_postsQuery({
    id: pageUser._id,
    page: 1,
    limit: 2,
  });

  const {
    data: updatedUser,
    isLoading: updatedLoading,
    isError: updatedErr,
    refetch: update_refetch,
  } = useGet_user_query_Query(pageUser?._id);

  const [
    get_suggested_accounts,
    { isLoading: accountsLoading, isError: accountsErr },
  ] = useGet_suggested_accountsMutation();

  const [follow_user] = useFollow_userMutation();

  // functions =============================================================================== functions

  function hasObjectChanged(latestObj, recentObj) {
    const latestEntries = Object.entries(latestObj);
    const recentEntries = Object.entries(recentObj);

    if (latestEntries.length !== recentEntries.length) {
      return true;
    }

    for (const [key, value] of latestEntries) {
      if (recentObj[key] !== value) {
        return true;
      }
    }

    return false;
  }

  async function getPosts(page) {
    try {
      const res = await get_user_posts_mutation({
        page: page,
        id: pageUser?._id,
        limit: 2,
      }).unwrap();
      res?.results.map((item) => {
        dispatch(add_post(item));
        dispatch(add_user(item.owner));
      });
      set_post_data([...post_data, ...res.results]);
      set_is_data_available(res.results?.length > 0);
    } catch (err) {
      console.log(err);
    }
  }

  function getUniqueObjectsById(arr) {
    const uniqueObjects = arr.reduce((acc, obj) => {
      const existingObj = acc[obj._id];
      if (
        !existingObj ||
        new Date(obj.updated_at) > new Date(existingObj.updated_at)
      ) {
        acc[obj._id] = obj;
      }
      return acc;
    }, {});

    return Object.values(uniqueObjects);
  }

  // validate / update redux state post changes in local array ========================================================

  const validatedPostData = () => {
    const validated_items = post_data.map((post_item) => {
      const reduxItem = seen_posts.find(
        (seen_post_item) => seen_post_item._id === post_item._id
      );
      return reduxItem ? { ...post_item, ...reduxItem } : post_item;
    });
    return validated_items;
  };

  const postsData: Array<UserPostProps> = getUniqueObjectsById(
    validatedPostData()
  );

  // validate / update redux state users changes in local array ========================================================

  const validateUserData = () => {
    const validated_items = suggested_accounts.map((acct_item) => {
      const reduxItem = seen_users.find(
        (seen_user_item) => seen_user_item._id === acct_item._id
      );
      return reduxItem ? { ...acct_item, ...reduxItem } : acct_item;
    });
    return validated_items;
  };

  async function getSuggeted() {
    try {
      const res = await get_suggested_accounts({
        userId: pageUser._id,
      }).unwrap();
      res?.results.map((item) => {
        dispatch(add_user(item));
      });
      set_suggested_accts(res.results);
    } catch (err) {
      console.log(err);
    }
  }
  const onScroll = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    scrollX.value = offsetX;
    const pageIndex = Math.round(offsetX / spacing.window_width);
    currentPage.value = pageIndex;
  };

  const handleTabPress = (pageIndex: number) => {
    scrollViewRef?.current?.scrollToOffset({
      offset: pageIndex * spacing.window_width,
      animated: true,
    });
  };

  const refreshFunc = useCallback(() => {
    setRefreshing(true);
    update_refetch();
    update_refetch_posts();
    setRefreshing(updatedLoading || postsUpdating);
  }, [updatedLoading, postsUpdating]);

  // effects ======================================================================= effects

  useEffect(() => {
    getPosts(post_page + 1).then(() => set_post_page(1));
  }, []);

  useEffect(() => {
    getSuggeted();
  }, []);

  useEffect(() => {
    if (updatedPosts && !postsUpdateErr) {
      set_post_data([...updatedPosts.results, ...post_data]);
      updatedPosts?.results.map((item) => {
        dispatch(add_post(item));
        // dispatch(add_user(item.owner));
      });
    }
  }, [postsUpdateErr, updatedPosts, postsUpdating]);

  // useEffect(() => {
  //   if (updatedUser && !updatedErr) {
  //     if (hasObjectChanged(updatedUser, validatedPageUser())) {
  //       set_user_page_data({ ...validatedPageUser(), ...updatedUser });
  //       dispatch(update_user(updatedUser));
  //     }
  //   }
  // }, [updatedUser, updatedLoading, updatedErr]);

  // components ======================================================================== components

  const UserSection = () => (
    <View style={{ marginBottom: 20 }}>
      <ProfileHeader user={validatedPageUser()} on_follow={null} />
      <BioSection user={validatedPageUser()} />
      <LengthSection user={validatedPageUser()} />
      <SuggestedAccounts
        data={validateUserData()}
        user={validatedPageUser()}
        error={accountsErr}
        loading={accountsLoading}
        on_follow={null}
      />
    </View>
  );

  const sections = [
    { title: "bio_data", data: [{ _id: "null" }] },

    {
      title: "Posts_section",
      data: [{ _id: "tabs_data" }],
    },
  ];

  const renderItem = ({ item }) => {
    if (item?._id == "null") {
      return <UserSection />;
    }
    return (
      <View style={{}}>
        <FlatList
          ref={scrollViewRef}
          onScroll={onScroll}
          data={[
            { id: "1", type: "post" },
            { id: "3", type: "repost" },
            { id: "4", type: "products" },
          ]}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          renderItem={(item) => (
            <PostsDataComp
              post_type={item.item.type}
              user={null}
              error={getPostsErr}
              loading={getPostsLoading}
              on_press_refrech={null}
              data={postsData}
            />
          )}
        />
      </View>
    );
  };
  const renderSectionHeader = ({ section: { title } }) => {
    if (title === "bio_data") {
      return null;
    }
    return (
      <UserProfileTabs
        currentPage={currentPage}
        scrollX={scrollX}
        on_tab_press={handleTabPress}
      />
    );
  };

  return (
    <MainContainer>
      <View style={{ flex: 1, backgroundColor: colors.color_1 }}>
        {/* <SectionList
          onRefresh={refreshFunc}
          refreshing={refreshing}
          sections={sections}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          keyExtractor={(item) => item._id}
          stickySectionHeadersEnabled={true}
        /> */}

        <Tabs.Container renderHeader={UserSection}>
          <Tabs.Tab name="Posts" label={"Posts"}>
            <Tabs.FlatList
              data={postsData}
              contentContainerStyle={{ marginTop: 20, paddingBottom: 50 }}
              renderItem={({ item }) => <UserPostComp item={item} />}
              keyExtractor={(item) => item._id}
              ListFooterComponent={
                getPostsLoading ? (
                  <View style={[_styles.all_center]}>
                    <ActivityIndicator size={40} color={"#EAEAEA"} />
                  </View>
                ) : (
                  <View />
                )
              }
              onEndReached={() => {
                if (is_data_available == true) {
                  getPosts(post_page + 1).then(() =>
                    set_post_page(post_page + 1)
                  );
                }
              }}
            />
          </Tabs.Tab>
          <Tabs.Tab name="Reposts" label={"Reposts"}>
            <Tabs.ScrollView>
              <View style={[styles.box, styles.boxA]} />
              <View style={[styles.box, styles.boxB]} />
            </Tabs.ScrollView>
          </Tabs.Tab>
          <Tabs.Tab name="Shop" label={"Shop"}>
            <Tabs.ScrollView>
              <View style={[styles.box, styles.boxA]} />
              <View style={[styles.box, styles.boxB]} />
            </Tabs.ScrollView>
          </Tabs.Tab>
        </Tabs.Container>
      </View>
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  box: {
    height: 250,
    width: "100%",
  },
  boxA: {
    backgroundColor: "white",
  },
  boxB: {
    backgroundColor: "#D8D8D8",
  },
});

// ==========================================================================================
