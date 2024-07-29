type UserProps = {
  _id: string;
  name: string;
  email: string;
  dob: string;
  username: string;
  gender: "male" | "female";
  bio: string;
  website: string;
  image_url: string;
  created_at: string;
  updated_at: string;
  followers: number;
  following: number;
  posts: number;
  likes: number;
  is_followed_by_user: boolean;
  is_following_user: boolean;
};

type Decoded = {
  username: string;
  password: string;
  image_url: string;
  _id: string;
};

type UserPostProps = {
  _id: string;
  owner: UserProps;
  type: "post" | "repost" | "comment";
  medias: Array<string>;
  tags: Array<string>;
  post_text: string;
  created_at: string;
  updated_at: string;
  is_liked_by_user: boolean;
  is_saved_by_user: boolean;
  is_reposted_by_user: boolean;
  is_commented_by_user: boolean;
  post?: UserPostProps;
  likes: number;
  comments: number;
  reposts: number;
  saves: number;
};

type CommentProps = {
  owner: UserProps;
  _id: String;
  medias: Array<string>;
  post_text: string;
  created_at: string;
  is_liked_by_user: boolean;
  is_saved_by_user: boolean;
  is_commented_by_user: boolean;
  likes: number;
  comments: number;
  saves: number;
};
