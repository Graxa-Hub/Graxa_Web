import React from "react";
import { Layout } from "./Layout";

export const Content = ({ children }) => {
  return <Layout className="space-y-6">{children}</Layout>;
};
