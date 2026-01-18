export type UserProfile = {
  uid: string;
  name: string;
  email: string;
  photo?: string | null;
  provider?: string;
  role: "user" | "admin";
};
