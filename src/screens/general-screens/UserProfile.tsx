import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { UserProfileComp } from "../../components/UserProfileComp";

export const UserProfile = ({ route, navigation }) => {
  const pageUser: UserProps = route?.params?.passedData;
  return <UserProfileComp pageUser={pageUser} />;
};

const styles = StyleSheet.create({});
