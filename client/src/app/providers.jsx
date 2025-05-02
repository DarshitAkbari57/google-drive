"use client";

import PrivateRoute from "@/components/auth/PrivateRoute";
import { AuthProvider } from "@/context/AuthContext";
import store from "@/redux/store";
import { Provider as ReduxProvider } from "react-redux";

export default function Providers({ children }) {
  return (
    <ReduxProvider store={store}>
      <AuthProvider>
        <PrivateRoute>{children}</PrivateRoute>
      </AuthProvider>
    </ReduxProvider>
  );
}
