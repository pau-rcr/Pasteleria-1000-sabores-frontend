import React, { createContext, useReducer, useEffect, ReactNode } from "react";
import { User, RegisterPayload } from "@/models/user";
import { AuthState } from "@/models/auth";
import { LOCAL_STORAGE_KEYS } from "@/config/constants";
import * as authService from "@/services/authService";

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

type AuthAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_USER"; payload: { user: User; token: string } }
  | { type: "LOGOUT" };

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_USER":
      return {
        user: action.payload.user,
        token: action.payload.token,
        isLoading: false,
        isAuthenticated: true,
      };
    case "LOGOUT":
      return {
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false,
      };
    default:
      return state;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    token: null,
    isLoading: true,
    isAuthenticated: false,
  });

  useEffect(() => {
    // Load session from localStorage on mount
    const loadSession = async () => {
      try {
        const token = localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
        const userStr = localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_USER);

        if (token && userStr) {
          const user = JSON.parse(userStr) as User;
          dispatch({ type: "SET_USER", payload: { user, token } });
          
          // Optionally verify with backend
          try {
            const freshUser = await authService.getCurrentUser();
            dispatch({ type: "SET_USER", payload: { user: freshUser, token } });
            localStorage.setItem(LOCAL_STORAGE_KEYS.AUTH_USER, JSON.stringify(freshUser));
          } catch {
            // If verification fails, keep the cached user
          }
        }
      } catch (error) {
        console.error("Failed to load session:", error);
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    loadSession();
  }, []);

  const login = async (email: string, password: string) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const response = await authService.login({ email, password });
      
      localStorage.setItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN, response.token);
      localStorage.setItem(LOCAL_STORAGE_KEYS.AUTH_USER, JSON.stringify(response.user));
      
      dispatch({ type: "SET_USER", payload: { user: response.user, token: response.token } });
    } catch (error) {
      dispatch({ type: "SET_LOADING", payload: false });
      throw error;
    }
  };

  const register = async (payload: RegisterPayload) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      // Backend returns User directly (no JWT token yet)
      const user = await authService.register(payload);
      
      // For now, store user without token (since backend doesn't provide JWT yet)
      // TODO: Update when backend implements JWT authentication
      localStorage.setItem(LOCAL_STORAGE_KEYS.AUTH_USER, JSON.stringify(user));
      
      dispatch({ type: "SET_USER", payload: { user, token: "" } });
    } catch (error) {
      dispatch({ type: "SET_LOADING", payload: false });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_USER);
    dispatch({ type: "LOGOUT" });
  };

  const refreshSession = async () => {
    try {
      const user = await authService.getCurrentUser();
      const token = localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
      if (token) {
        localStorage.setItem(LOCAL_STORAGE_KEYS.AUTH_USER, JSON.stringify(user));
        dispatch({ type: "SET_USER", payload: { user, token } });
      }
    } catch (error) {
      console.error("Failed to refresh session:", error);
      logout();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
