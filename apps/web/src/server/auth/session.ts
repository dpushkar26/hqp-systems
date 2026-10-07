import { getServerSession } from "next-auth/next";
import { authOptions } from "./config";

export async function getSession() {
  return await getServerSession(authOptions);
}
