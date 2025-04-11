import { Roles } from "@/api/UserApi";

export const getUrlPath = (userRole: Roles) => {
  return userRole == Roles.MANAGER ? "/manager" : "/client";
};
