import React, { Children } from "react";

export const Forms = ({ children }) => {
  return <form className="mt-6 space-y-6">{children}</form>;
};
