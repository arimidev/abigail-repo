import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { select_user, setUser } from "../../redux_utils/features/user";
import { MainContainer } from "../../components/MainContainer";
import colors from "../../utils/colors";
import { ProfileHeader } from "../../components/ProfileHeader";
import { CustomInput } from "../../components/CustomInput";
import spacing from "../../utils/spacing";
import { BottonSheetOptions } from "../../components/BottonSheetOptions";
import { PressableLeftIcon } from "../../components/PressableLeftIcon";
import { getDate, showToast } from "../../functions";
import { CustomButton } from "../../components/CustomButton";
import DateTimePicker from "@react-native-community/datetimepicker";
import regex from "../../utils/regex";
import {
  useCheck_usernameMutation,
  useUpdate_profileMutation,
} from "../../redux_utils/api_slice";
import { useDebounce } from "use-debounce";
import { PhoneInput } from "../../components/PhoneInput";
import PhoneNoInput from "react-native-phone-number-input";

export const PersonalDetails = ({ navigation }) => {
  // redux
  const User: UserProps = useSelector(select_user);
  const dispatch = useDispatch();

  // states

  const [name, set_name] = useState(User?.name);
  const [email, set_email] = useState(User?.email);
  const [bio, set_bio] = useState(User?.bio);
  const [dob, set_dob] = useState(User?.dob);
  const [gender, set_gender] = useState(User?.gender);
  const [website, set_website] = useState(User?.website);
  const [username, set_username] = useState(User?.username);
  const [phone_number, set_phone] = useState(User?.phone_number);
  const [show, setShow] = useState(false);
  const [username_err, setusername_err] = useState(false);
  const [email_err, set_email_err] = useState(false);
  const [phone_err, set_phone_err] = useState(false);
  const [name_err, set_name_err] = useState(false);
  const [username_taken, set_username_taken] = useState(false);
  const [debounce_value] = useDebounce(username, 2000);

  // api hooks

  const [check_username, { isLoading: username_loading }] =
    useCheck_usernameMutation();
  const [update_proile, { isLoading: updating }] = useUpdate_profileMutation();

  // regex

  const { username_regex, name_regex, email_regex } = regex;

  // stuff

  const disabled =
    name == User?.name &&
    email == User?.email &&
    bio == User?.bio &&
    dob == User?.dob &&
    gender == User?.gender &&
    website == User?.website &&
    username == User?.username &&
    phone_number == User?.phone_number;

  // refs

  const genderRef = useRef();
  const phoneRef = useRef<PhoneNoInput>();

  // functions

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    set_dob(currentDate);
    console.log(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
  };

  const showDatepicker = () => {
    showMode("date");
  };

  async function updateProfile() {
    set_name_err(!name_regex.test(name));
    setusername_err(!username_regex.test(debounce_value) && !username_taken);
    set_email_err(!email_regex.test(email));

    if (!name_regex.test(name)) {
      return;
    }
    if (!username_regex.test(debounce_value)) {
      return;
    }
    if (!email_regex.test(email)) {
      return;
    }

    if (
      phone_number !== "" &&
      phone_number !== null &&
      phone_number !== undefined
    ) {
      const checkValid = phoneRef.current?.isValidNumber(phone_number);
      set_phone_err(!checkValid);
      if (!checkValid) {
        return;
      }
    }

    try {
      const updateRes = await update_proile({
        id: User?._id,
        body: {
          name,
          username,
          email,
          website,
          gender: gender.toLowerCase(),
          dob,
          bio,
          phone_number,
        },
      }).unwrap();
      console.log(updateRes);
      dispatch(setUser({ ...User, updateRes }));
      showToast({
        description: "Profile updated successfuly",
        type: "success",
        duration: 3000,
      });
      navigation.goBack();
    } catch (err) {
      console.log(err);
      showToast({
        description: "Profile updated error",
        type: "error",
        duration: 3000,
      });
    }
  }

  // effects

  useEffect(() => {
    if (debounce_value.length > 0 && debounce_value !== User?.username) {
      setusername_err(!username_regex.test(debounce_value));
      if (!username_regex.test(debounce_value)) {
        return;
      }
      (async () => {
        try {
          const usernameRes = await check_username({
            username: debounce_value,
          }).unwrap();
          console.log(usernameRes);
          set_username_taken(false);
        } catch (err) {
          console.log(err);
          set_username_taken(true);
        }
      })();
    }
  }, [debounce_value]);
  return (
    <MainContainer>
      <View style={{ flex: 1, backgroundColor: colors.color_1 }}>
        <ScrollView contentContainerStyle={{ paddingBottom: 50 }}>
          <ProfileHeader user={User} />
          <View
            style={{
              marginTop: 40,
              paddingHorizontal: spacing.padding_horizontal,
              gap: 30,
            }}
          >
            <CustomInput
              place_holder="Name"
              default_text={name}
              on_change_text={set_name}
              error={name_err}
              error_message="Invalid name input."
            />
            <CustomInput
              place_holder="Username"
              on_change_text={set_username}
              error={username_err || username_taken}
              error_message={
                username_taken
                  ? "Username isn't available"
                  : "Username can only contain letters, numbers, and underscores."
              }
              default_text={username}
            />
            <CustomInput
              place_holder="Email"
              default_text={email}
              on_change_text={set_email}
              error={email_err}
              error_message="Please enter a valid email address."
            />
            <CustomInput
              place_holder="Bio"
              default_text={bio}
              on_change_text={set_bio}
            />
            <CustomInput
              place_holder="Website"
              default_text={website}
              on_change_text={set_website}
            />
            <Pressable onPress={() => genderRef.current?.expand()}>
              <CustomInput
                place_holder="Gender"
                default_text={gender}
                on_change_text={null}
                disabled={true}
              />
            </Pressable>
            <Pressable onPress={showDatepicker}>
              <CustomInput
                place_holder="Date of birth."
                default_text={getDate(dob)}
                on_change_text={null}
                disabled={true}
              />
            </Pressable>
            <PhoneInput
              ref={phoneRef}
              onChangeText={set_phone}
              error={phone_err}
              default_value={phone_number}
            />
            <View>
              <CustomButton
                text="Update Details"
                text_color="#fff"
                background_color={colors.color_4}
                on_press={updateProfile}
                disabled={disabled || updating}
                loading={updating}
              />
            </View>
          </View>
        </ScrollView>
        <BottonSheetOptions ref={genderRef} height={["30%"]}>
          <View>
            <PressableLeftIcon
              title="Male"
              left_component={<Text>//</Text>}
              on_press={() => {
                set_gender("Male");
                genderRef.current?.close();
              }}
            />

            <PressableLeftIcon
              title="Female"
              left_component={<Text>//</Text>}
              on_press={() => {
                set_gender("Female");
                genderRef.current?.close();
              }}
            />
            <PressableLeftIcon
              title="Rather not say"
              left_component={<Text>//</Text>}
              on_press={() => {
                set_gender(null);
                genderRef.current?.close();
              }}
            />
          </View>
        </BottonSheetOptions>
        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={dob ?? new Date()}
            mode={"date"}
            is24Hour={true}
            onChange={onChange}
          />
        )}
      </View>
    </MainContainer>
  );
};

const styles = StyleSheet.create({});
