import { createContext } from "react";

/* export const Context = createContext({
  token: "",
  apiUrl: "",
}); */

export const Context = createContext({
  apiUrl: '',
  uploadVideo: false
});


export const AuthContext = createContext({
  token: null,
  userId: null,
})