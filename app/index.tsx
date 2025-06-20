import { storage } from "@/storage";
import { Redirect } from "expo-router";
import "../global.css";

export default function Index() {
  const user = JSON.parse(storage.getString("user") || "{}");
  return <Redirect href="/auth/signin" />;
}
