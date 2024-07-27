// import { FlatList, SectionList, StyleSheet, View } from "react-native";
// import React, { useCallback, useEffect, useRef, useState } from "react";
// import { MainContainer } from "../../components/MainContainer";
// import colors from "../../utils/colors";
// import { ProfileHeader } from "../../components/ProfileHeader";
// import { useDispatch, useSelector } from "react-redux";
// import { select_user, setUser } from "../../redux_utils/features/user";
// import { BioSection } from "../../components/BioSection";
// import { LengthSection } from "../../components/LengthSection";
// import { SuggestedAccounts } from "../../components/SuggestedAccounts";
// import {
//   useFollow_userMutation,
//   useGet_suggested_accountsMutation,
//   useGet_user_posts_mutation_Mutation,
//   useGet_user_postsQuery,
//   useGet_user_query_Query,
// } from "../../redux_utils/api_slice";

// import { UserProfileTabs } from "../../components/UserProfileTabs";
// import { PostsDataComp } from "../../components/ProfileTabPageScrolls";
// import spacing from "../../utils/spacing";
// import { useSharedValue } from "react-native-reanimated";
// import { showToast } from "../../functions";

// export const Profile = () => {
//   // stuff that shouldn't be here =========================================================== stuff that shouldn't be here

//   // reduc
//   const User: UserProps = useSelector(select_user);
//   const dispatch = useDispatch();

//   // api hooks

//   const {
//     data: updatedUser,
//     isLoading: updatedLoading,
//     isError: updatedErr,
//     refetch: update_refetch,
//   } = useGet_user_query_Query(User?._id);

//   // functions

//   function hasObjectChanged(latestObj, recentObj) {
//     const latestEntries = Object.entries(latestObj);
//     const recentEntries = Object.entries(recentObj);

//     if (latestEntries.length !== recentEntries.length) {
//       return true;
//     }

//     for (const [key, value] of latestEntries) {
//       if (recentObj[key] !== value) {
//         return true;
//       }
//     }

//     return false;
//   }

//   // useffects

//   useEffect(() => {
//     if (updatedUser && !updatedErr) {
//       if (hasObjectChanged(updatedUser, User)) {
//         dispatch(setUser({ ...User, ...updatedUser }));
//       }
//     }
//   }, [updatedUser, updatedLoading, updatedErr]);

//   // end =================================================================================================

//   // user post actions ===================================================================================== user post actions

//   // states

//   const [post_page, set_post_page] = useState(0);
//   const [post_data, set_post_data] = useState<Array<UserPostProps>>([]);

//   // api hooks

//   const [
//     get_user_posts_mutation,
//     { isLoading: getPostsLoading, isError: getPostsErr },
//   ] = useGet_user_posts_mutation_Mutation();
//   const {
//     data: updatedPosts,
//     isLoading: postsUpdating,
//     isError: postsUpdateErr,
//     refetch: update_refetch_posts,
//   } = useGet_user_postsQuery({
//     id: User._id,
//     page: 1,
//   });

//   // functions

//   async function getPosts(page) {
//     try {
//       const res = await get_user_posts_mutation({
//         page: page,
//         id: User?._id,
//       }).unwrap();
//       set_post_data(res.results);
//     } catch (err) {
//       console.log(err);
//     }
//   }

//   function getUniqueObjectsById(arr) {
//     const uniqueObjects = arr.reduce((acc, obj) => {
//       const existingObj = acc[obj._id];
//       if (
//         !existingObj ||
//         new Date(obj.updated_at) > new Date(existingObj.updated_at)
//       ) {
//         acc[obj._id] = obj;
//       }
//       return acc;
//     }, {});

//     return Object.values(uniqueObjects);
//   }

//   const postsData: Array<UserPostProps> = getUniqueObjectsById(post_data);

//   // effects

//   useEffect(() => {
//     getPosts(post_page + 1).then(() => set_post_page(1));
//   }, []);

//   useEffect(() => {
//     if (updatedPosts && !postsUpdateErr) {
//       set_post_data([...updatedPosts.results, ...post_data]);
//     }
//   }, [postsUpdateErr, updatedPosts, postsUpdating]);

//   // end =================================================================================================

//   // states
//   const [accounts, setAccounts] = useState([]);
//   const [page, set_page] = useState(1);
//   const [refreshing, setRefreshing] = useState(false);

//   // refs
//   const scrollViewRef = useRef();

//   // api hooks
//   const [
//     get_suggested_accounts,
//     { isLoading: accountsLoading, isError: accountsErr },
//   ] = useGet_suggested_accountsMutation();

//   const [follow_user] = useFollow_userMutation();

//   // animated

//   const scrollX = useSharedValue(0);
//   const currentPage = useSharedValue(0);

//   // functions

//   async function getSuggeted() {
//     try {
//       const res = await get_suggested_accounts({}).unwrap();
//       setAccounts(res.results);
//     } catch (err) {
//       console.log(err);
//     }
//   }

//   function followLocally(user_data: UserProps) {
//     if (user_data.is_followed_by_user == true) {
//       dispatch(
//         setUser({
//           ...User,
//           following: User.following - 1,
//         })
//       );
//       const updatedAccounts = accounts.map((acct) =>
//         acct._id === user_data._id
//           ? { ...acct, is_followed_by_user: false }
//           : acct
//       );
//       setAccounts(updatedAccounts);
//     } else {
//       dispatch(
//         setUser({
//           ...User,
//           following: User.following + 1,
//         })
//       );
//       const updatedAccounts = accounts.map((acct) =>
//         acct._id === user_data._id
//           ? { ...acct, is_followed_by_user: true }
//           : acct
//       );
//       setAccounts(updatedAccounts);
//     }
//   }

//   async function followUserFunc(user_data: UserProps) {
//     followLocally(user_data);
//     try {
//       const res = await follow_user(user_data?._id).unwrap();
//       if (res.action === "follow") {
//         showToast({
//           description: `You followed @${user_data?.username}`,
//           type: "default",
//           duration: 3000,
//         });
//       }
//     } catch (err) {
//       console.log(err);
//       showToast({
//         description: "Coundn't follow user!",
//         type: "error",
//         duration: 3000,
//       });
//       followLocally(user_data);
//     }
//   }

//   const onScroll = (event) => {
//     const offsetX = event.nativeEvent.contentOffset.x;
//     scrollX.value = offsetX;
//     const pageIndex = Math.round(offsetX / spacing.window_width);
//     currentPage.value = pageIndex;
//   };

//   const handleTabPress = (pageIndex: number) => {
//     scrollViewRef?.current?.scrollToOffset({
//       offset: pageIndex * spacing.window_width,
//       animated: true,
//     });
//   };

//   const refreshFunc = useCallback(() => {
//     setRefreshing(true);
//     update_refetch();
//     update_refetch_posts();
//     setRefreshing(updatedLoading || postsUpdating);
//   }, [updatedLoading, postsUpdating]);

//   // effects

//   useEffect(() => {
//     getSuggeted();
//   }, []);

//   // ------------------------------------------------------------------------------

//   const UserSection = () => (
//     <View style={{ marginBottom: 20 }}>
//       <ProfileHeader user={User} />
//       <BioSection user={User} />
//       <LengthSection user={User} />
//       <SuggestedAccounts
//         data={accounts}
//         user={User}
//         error={accountsErr}
//         loading={accountsLoading}
//         on_follow={followUserFunc}
//       />
//     </View>
//   );

//   // const getUser

//   const sections = [
//     { title: "bio_data", data: [{ _id: "null" }] },

//     {
//       title: "Posts_section",
//       data: [{ _id: "tabs_data" }],
//     },
//   ];

//   const renderItem = ({ item }) => {
//     if (item?._id == "null") {
//       return <UserSection />;
//     }
//     return (
//       <View>
//         <FlatList
//           ref={scrollViewRef}
//           onScroll={onScroll}
//           data={[
//             { id: "1", type: "post" },
//             { id: "3", type: "repost" },
//             { id: "4", type: "products" },
//           ]}
//           keyExtractor={(item) => item.id}
//           horizontal
//           pagingEnabled
//           showsHorizontalScrollIndicator={false}
//           renderItem={(item) => (
//             <PostsDataComp
//               post_type={item.item.type}
//               user={User}
//               error={getPostsErr}
//               loading={getPostsLoading}
//               on_press_refrech={null}
//               data={postsData}
//             />
//           )}
//         />
//       </View>
//     );
//   };
//   const renderSectionHeader = ({ section: { title } }) => {
//     if (title === "bio_data") {
//       return null;
//     }
//     return (
//       <UserProfileTabs
//         currentPage={currentPage}
//         scrollX={scrollX}
//         on_tab_press={handleTabPress}
//       />
//     );
//   };

//   return (
//     <MainContainer>
//       <View style={{ flex: 1, backgroundColor: colors.color_1 }}>
//         <SectionList
//           onRefresh={refreshFunc}
//           refreshing={refreshing}
//           sections={sections}
//           renderItem={renderItem}
//           renderSectionHeader={renderSectionHeader}
//           keyExtractor={(item) => item._id}
//           stickySectionHeadersEnabled={true}
//         />
//       </View>
//     </MainContainer>
//   );
// };

// const styles = StyleSheet.create({});

// =================================================================================================

// import { StyleSheet, Text, View } from "react-native";
// import React from "react";
// import { UserProfileComp } from "../../components/UserProfileComp";
// import { useSelector } from "react-redux";
// import { select_user } from "../../redux_utils/features/user";

// export const Profile = () => {
//   const User: UserProps = useSelector(select_user);
//   return <UserProfileComp User={User} />;
// };

// const styles = StyleSheet.create({});

// =========================================================================================================

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
import { MainContainer } from "../../components/MainContainer";
import colors from "../../utils/colors";
import { ProfileHeader } from "../../components/ProfileHeader";
import { useDispatch, useSelector } from "react-redux";
import { select_user, setUser } from "../../redux_utils/features/user";
import { BioSection } from "../../components/BioSection";
import { LengthSection } from "../../components/LengthSection";
import {
  useGet_user_posts_mutation_Mutation,
  useGet_user_postsQuery,
  useGet_user_query_Query,
  useGet_user_reposts_mutation_Mutation,
  useGet_user_repostsQuery,
} from "../../redux_utils/api_slice";

import { UserProfileTabs } from "../../components/UserProfileTabs";
import { PostsDataComp } from "../../components/ProfileTabPageScrolls";
import spacing from "../../utils/spacing";
import { useSharedValue } from "react-native-reanimated";
import { showToast } from "../../functions";
import { UserPostComp } from "../../components/UserPostsTabView";
import { Tabs } from "react-native-collapsible-tab-view";
import _styles from "../../utils/_styles";
import {
  add_post,
  select_seen_posts,
} from "../../redux_utils/features/seen_posts";
import {
  add_user,
  select_seen_users,
  update_user,
} from "../../redux_utils/features/seen_users";

interface Props {
  User: UserProps;
}

export const Profile = () => {
  // redux
  const User: UserProps = useSelector(select_user); // app user ====================================  app user
  const dispatch = useDispatch();
  const seen_posts: Array<UserPostProps> = useSelector(select_seen_posts);
  const seen_users: Array<UserProps> = useSelector(select_seen_users);

  // states

  const [post_page, set_post_page] = useState(0);
  const [post_data, set_post_data] = useState<Array<UserPostProps>>([]);
  const [repost_page, set_repost_page] = useState(0);
  const [repost_data, set_repost_data] = useState<Array<UserPostProps>>([]);
  const [suggested_accounts, set_suggested_accts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [is_data_available, set_is_data_available] = useState(true);
  const [is_repost_data_available, set_is_repost_data_available] =
    useState(true);

  // refs
  const scrollViewRef = useRef();

  // animated

  const scrollX = useSharedValue(0);
  const currentPage = useSharedValue(0);

  // =================================== api hooks

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
    id: User._id,
    page: 1,
    limit: 5,
  });

  const {
    data: updatedUser,
    isLoading: updatedLoading,
    isError: updatedErr,
    refetch: update_refetch,
  } = useGet_user_query_Query(User?._id);

  const [
    get_user_reposts_mutation,
    { isLoading: getRepostsLoading, isError: getRepostsErr },
  ] = useGet_user_reposts_mutation_Mutation();
  const {
    data: updatedReposts,
    isLoading: repostsUpdating,
    isError: repostsUpdateErr,
    refetch: update_refetch_reposts,
  } = useGet_user_repostsQuery({
    id: User._id,
    page: 1,
    limit: 5,
  });

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
        id: User?._id,
        limit: 5,
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
  async function getReposts(page) {
    try {
      const res = await get_user_reposts_mutation({
        page: page,
        id: User?._id,
        limit: 5,
      }).unwrap();
      res?.results.map((item) => {
        dispatch(add_post(item));
        dispatch(add_user(item.owner));
      });
      set_repost_data([...repost_data, ...res.results]);
      set_is_repost_data_available(res.results?.length > 0);
    } catch (err) {
      console.log(err);
    }
  }

  function getUniqueObjectsById(arr) {
    const uniqueObjects = arr.reduce((acc, obj) => {
      const existingObj = acc[obj._id];
      if (
        !existingObj ||
        new Date(obj.created_at) > new Date(existingObj.created_at)
      ) {
        acc[obj._id] = obj;
      }
      return acc;
    }, {});

    return Object.values(uniqueObjects);
  }

  // validate / update redux state post changes in local array ========================================================

  const validatedPostData = (arr: Array<UserPostProps>) => {
    const validated_items = arr.map((post_item) => {
      const reduxItem = seen_posts.find(
        (seen_post_item) => seen_post_item._id === post_item._id
      );
      return reduxItem ? { ...post_item, ...reduxItem } : post_item;
    });
    return validated_items;
  };

  const postsData: Array<UserPostProps> = getUniqueObjectsById(
    validatedPostData(post_data)
  );

  const repostData: Array<UserPostProps> = getUniqueObjectsById(
    validatedPostData(repost_data)
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
    getReposts(repost_page + 1).then(() => set_repost_page(1));
  }, []);

  useEffect(() => {
    if (updatedPosts && !postsUpdateErr) {
      set_post_data([...post_data, ...updatedPosts.results]);
      updatedPosts?.results.map((item) => {
        dispatch(add_post(item));
        dispatch(add_user(item.owner));
      });
    }
  }, [postsUpdateErr, updatedPosts, postsUpdating]);

  useEffect(() => {
    if (updatedReposts && !repostsUpdateErr) {
      set_repost_data([...updatedReposts.results, ...repost_data]);
      updatedReposts?.results.map((item) => {
        dispatch(add_post(item));
        dispatch(add_user(item.owner));
      });
    }
  }, [repostsUpdateErr, updatedReposts, repostsUpdating]);

  useEffect(() => {
    if (updatedUser && !updatedErr) {
      if (hasObjectChanged(updatedUser, User)) {
        dispatch(setUser({ ...User, ...updatedUser }));
      }
    }
  }, [updatedUser, updatedLoading, updatedErr]);

  // components ======================================================================== components

  const UserSection = () => (
    <View style={{ marginBottom: 10 }}>
      <ProfileHeader user={User} on_follow={null} />
      <BioSection user={User} />
      <LengthSection user={User} />
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
            <Tabs.FlatList
              data={repostData}
              contentContainerStyle={{ marginTop: 20, paddingBottom: 50 }}
              renderItem={({ item }) => <UserPostComp item={item} />}
              keyExtractor={(item) => item._id}
              ListFooterComponent={
                getRepostsLoading ? (
                  <View style={[_styles.all_center]}>
                    <ActivityIndicator size={40} color={"#EAEAEA"} />
                  </View>
                ) : (
                  <View />
                )
              }
              onEndReached={() => {
                if (is_repost_data_available == true) {
                  getReposts(repost_page + 1).then(() =>
                    set_repost_page(repost_page + 1)
                  );
                }
              }}
            />
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
