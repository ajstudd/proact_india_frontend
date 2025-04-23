import type { AppProps } from "next/app";
import { Roboto } from "next/font/google";
import { AppContextProvider } from "../contexts/AppContext";
import { store } from "../store";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider, useAuth } from "../contexts/AuthContext";

import "../../global.css";
import { useRouter } from "next/router";

// Layouts
import HomeLayout from "components/HomeLayout"; // Public Layout
import UnifiedLayout from "components/UnifiedLayout"; // Unified authenticated layout
import AuthLayout from "components/LoggedOutLayout"; // Login/Register Layout

const roboto = Roboto({
  display: "swap",
  weight: ["100", "300", "400", "500", "700", "900"],
  preload: true,
  subsets: ["latin-ext"],
  adjustFontFallback: true,
  fallback: ["sans-serif"],
});

// Pages that don't require authentication
const publicPages = ["/home", "/project/[id], /otp/[email]"];
const noAuthPages = ["/login", "/signup", "/onboarding", "/", "/otp/[email]"];

function AppContent({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const auth = useAuth();

  // ✅ Prevent rendering protected pages before checking auth
  if (auth.isLoading) {
    return <p className="text-center text-gray-500 mt-20">Loading...</p>;
  }

  if (!auth.isAuthenticated &&
    !publicPages.includes(router.pathname) &&
    !noAuthPages.includes(router.pathname)) {
    return <p className="text-center text-gray-500 mt-20">Redirecting...</p>;
  }

  // 🛠️ **Simplified Layout Selection**
  let Layout;
  if (noAuthPages.includes(router.pathname)) {
    Layout = AuthLayout; // Login/Register pages
  } else if (auth.isAuthenticated) {
    Layout = UnifiedLayout; // One layout for all authenticated users
  } else {
    Layout = HomeLayout; // Default public layout
  }

  return (
    <Layout>
      <Component {...pageProps} />
      <ToastContainer position="top-right" autoClose={3000} />
    </Layout>
  );
}

export default function App(props: AppProps) {
  return (
    <main className={roboto.className}>
      <Provider store={store}>
        <AppContextProvider>
          <AuthProvider publicPages={[...publicPages, ...noAuthPages]}>
            <AppContent {...props} />
          </AuthProvider>
        </AppContextProvider>
      </Provider>
    </main>
  );
}
