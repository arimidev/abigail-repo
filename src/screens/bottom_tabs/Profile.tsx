import { View } from "react-native";
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
  useGet_user_query_Query,
  useGet_user_reposts_mutation_Mutation,
  useGetUserProductsMutation,
} from "../../redux_utils/api_slice";

import { hasObjectChanged, showToast } from "../../functions";
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
import { PostView } from "../../components/posts/postView";
import { PostFlatList } from "../../components/posts/PostFlatList";
import { ProductFlatList } from "../../components/posts/ProductFlatList";

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

  const [post_page, set_post_page] = useState(1);
  const [post_data, set_post_data] = useState<Array<UserPostProps>>([]);
  const [repost_page, set_repost_page] = useState(1);
  const [productPage, setProductsPage] = useState(1);
  const [productData, setProductsData] = useState<Array<ProductProps>>([]);
  const [repost_data, set_repost_data] = useState<Array<UserPostProps>>([]);
  const [suggested_accounts, set_suggested_accts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [is_data_available, set_is_data_available] = useState(true);
  const [is_repost_data_available, set_is_repost_data_available] =
    useState(true);
  const [isProductDataAvailable, setProductDataAvailable] = useState(true);
  // =================================== api hooks

  const [
    get_user_posts_mutation,
    { isLoading: getPostsLoading, isError: getPostsErr },
  ] = useGet_user_posts_mutation_Mutation();

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

  const [
    getUserProducts,
    { isLoading: getProductsLoading, isError: getProductsErr },
  ] = useGetUserProductsMutation();

  // functions =============================================================================== functions

  async function getPosts(page) {
    try {
      const res = await get_user_posts_mutation({
        page: page,
        id: User?._id,
        limit: 5,
      }).unwrap();
      res?.results.map((item) => {
        dispatch(add_post(item));
      });
      set_is_data_available(res.results?.length > 0);
      set_post_page(post_page + 1);
      return res.results;
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
      });
      set_is_repost_data_available(res.results?.length > 0);
      set_repost_page(repost_page + 1);
      return res.results;
    } catch (err) {
      console.log(err);
    }
  }

  async function getProducts(page) {
    try {
      const res = await getUserProducts({
        page: page,
        id: User?._id,
        limit: 5,
      }).unwrap();
      res?.results.map((item) => {
        dispatch(add_post(item));
      });
      setProductDataAvailable(res.results?.length > 0);
      setProductsPage(productPage + 1);
      return res.results;
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

  // validate / update redux state post changes in local array

  const validatedPostData = (arr: Array<UserPostProps | ProductProps>) => {
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

  const validatedProducts: Array<ProductProps> = getUniqueObjectsById(
    validatedPostData(productData)
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

  const refreshFunc = useCallback(() => {
    setRefreshing(true);
    update_refetch();
    // update_refetch_posts();
    setRefreshing(updatedLoading || getPostsLoading || getRepostsLoading);
  }, [updatedLoading, getPostsLoading, getRepostsLoading]);

  function getNextPostPage(data) {
    set_post_data([...post_data, ...data]);
  }

  function getNextRepostPage(data) {
    set_repost_data([...repost_data, ...data]);
  }

  function getNextProducts(data) {
    setProductsData([...productData, ...data]);
  }

  // effects

  useEffect(() => {
    getPosts(post_page).then(getNextPostPage);
    getReposts(repost_page).then(getNextRepostPage);
    getProducts(productPage).then(getNextProducts);
  }, []);

  useEffect(() => {
    if (updatedUser && !updatedErr) {
      if (hasObjectChanged(updatedUser, User)) {
        dispatch(setUser({ ...User, ...updatedUser }));
      }
    }
  }, [updatedUser, updatedLoading, updatedErr]);

  // components

  const UserSection = () => (
    <View style={{ marginBottom: 10 }}>
      <ProfileHeader user={User} on_follow={null} />
      <BioSection user={User} />
      <LengthSection user={User} />
    </View>
  );

  return (
    <MainContainer>
      <View style={{ flex: 1, backgroundColor: colors.color_1 }}>
        <Tabs.Container renderHeader={UserSection}>
          <Tabs.Tab name="Posts" label={"Posts"}>
            <PostFlatList
              loading={getPostsLoading}
              error={getPostsErr}
              data={postsData}
              onEndReached={() => {
                getPosts(post_page).then(getNextPostPage);
              }}
              isDataAvailable={is_data_available}
              renderItem={({ item }) => (
                <PostView item={item} display_type="feed" />
              )}
            />
          </Tabs.Tab>
          <Tabs.Tab name="Reposts" label={"Reposts"}>
            <PostFlatList
              data={repostData}
              loading={getRepostsLoading}
              error={getRepostsErr}
              isDataAvailable={is_repost_data_available}
              onEndReached={() => {
                getReposts(repost_page).then(getNextRepostPage);
              }}
              renderItem={({ item }) => (
                <PostView item={item} display_type="feed" />
              )}
            />
          </Tabs.Tab>
          {/* products tab */}
          <Tabs.Tab name="Shop" label={"Shop"}>
            <ProductFlatList
              data={validatedProducts}
              loading={getProductsLoading}
              error={getProductsErr}
              onEndReached={() => {
                getProducts(productPage).then(getNextProducts);
              }}
              isDataAvailable={isProductDataAvailable}
            />
          </Tabs.Tab>
        </Tabs.Container>
      </View>
    </MainContainer>
  );
};
