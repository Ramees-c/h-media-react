import { createContext, useContext } from "react";

const ApiContext = createContext();

export function ApiProvider({ children }) {
  const baseURL = "http://hmedia-api.channelhmedia.in";

  return (
    <ApiContext.Provider value={{ baseURL }}>
      {children}
    </ApiContext.Provider>
  );
}

export function useApi() {
  return useContext(ApiContext);
}
