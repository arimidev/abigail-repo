import { Notifier, Easing, NotifierComponents } from "react-native-notifier";
import spacing from "../utils/spacing";
import _styles from "../utils/_styles";
import colors from "../utils/colors";
import { jwtDecode } from "jwt-decode";
import images from "../utils/images";

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Api",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function showToast({
  description,
  duration,
  type,
  hideOnPress,
  onPress,
}: {
  description?: string;
  duration?: number;
  type?: "error" | "success" | "default";
  hideOnPress?: boolean;
  onPress?: any;
}) {
  Notifier.showNotification({
    description,
    duration,
    showAnimationDuration: 500,
    showEasing: Easing.ease,
    onPress,
    hideOnPress,
    Component: NotifierComponents.Notification,
    componentProps: {
      containerStyle: {
        flexDirection: "row",
        alignItems: "center",
        height: 60,
        width: spacing.window_width - spacing.padding_horizontal * 2,
        alignSelf: "center",
        borderWidth: 1.5,
        borderRadius: 10,
        // top: 50,
        zIndex: 50,
        paddingHorizontal: 15,
        gap: 10,
        backgroundColor:
          type == "success"
            ? "#DDFAEB"
            : type == "error"
            ? "#FADDDF"
            : "#E9E4F9",
        borderColor:
          type == "success"
            ? "#1CD271"
            : type == "error"
            ? "#D21C28"
            : colors.color_4,
      },
      descriptionStyle: {
        ..._styles.font_16_medium,
        color: colors.color_2,
      },
    },
  });
}

export function getDate(date: string) {
  if (date) {
    return `${months[new Date(date).getMonth()]} ${new Date(
      date
    ).getDate()}, ${new Date(date).getFullYear()}`;
  }
  return null;
}
// export function getDateTime(date: string) {
//   if (date) {
//     return `${months[new Date(date).getMonth()]} ${new Date(
//       date
//     ).getDate()}, ${new Date(date).getFullYear()} ${new Date(date).ge}`;
//   }
//   return null;
// }

export function getImage({
  uri,
  gender,
}: {
  uri: string;
  gender: "male" | "female";
}) {
  if (uri && typeof uri == "string") {
    return { uri: uri };
  }
  if (gender && gender.toLowerCase() == "male") return images.male_placeholder;
  if (gender && gender.toLowerCase() == "female")
    return images.female_placeholder;
  return images.unknown_placeholder;
}
export function getName(name: string) {
  if (name && typeof name === "string") {
    return name;
  }
  return "<unnamed>";
}

export function getSavedAccount(token: string) {
  if (token) {
    const decodedToken = jwtDecode(token);
    return decodedToken;
  }
  return null;
}

export function hasObjectChanged(latestObj, recentObj) {
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
