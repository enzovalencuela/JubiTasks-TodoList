// layout.client.js
"use client";
import React from "react";
import { useEffect, useState, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Providers } from "./providers";
import { auth } from "../firebaseConfig";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SplashScreen from "../components/SplashScreen";
import Image from "next/image";
import Logo from "../../public/assets/splash-pato.png";
import Sidebar from "../components/Sidebar";

export default function RootLayoutClient({ children, dosis }) {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isAuthDataLoaded, setIsAuthDataLoaded] = useState(false);
  const [minSplashTimePassed, setMinSplashTimePassed] = useState(false);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [firebaseIdToken, setFirebaseIdToken] = useState(null);
  const [registeredName, setRegisteredName] = useState("");
  const [user, setUser] = useState(null);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const publicPaths = useMemo(() => ["/", "/login", "/register"], []);

  const showSplashScreen =
    mounted && !(isAuthDataLoaded && minSplashTimePassed);

  useEffect(() => {
    setMounted(true);

    const timer = setTimeout(() => {
      setMinSplashTimePassed(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      setIsAuthenticated(!!currentUser);

      if (currentUser) {
        try {
          const idToken = await currentUser.getIdToken();
          setFirebaseIdToken(idToken);
          localStorage.setItem("jwt_token", idToken);
        } catch (error) {
          console.error("Erro ao obter Firebase ID Token:", error);
          auth.signOut();
          setIsAuthDataLoaded(true);
        }
      } else {
        setFirebaseIdToken(null);
        localStorage.removeItem("jwt_token");
        setIsAuthDataLoaded(true);
      }
    });

    return () => unsubscribe();
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;

    if (user && isAuthenticated && firebaseIdToken) {
      const fetchUserData = async () => {
        try {
          const response = await fetch(`${backendUrl}/user-data`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${firebaseIdToken}`,
            },
            body: JSON.stringify({ email: user.email }),
          });

          if (response.ok) {
            const data = await response.json();
            setRegisteredName(data.name);
          } else {
            console.error("Erro ao buscar dados do usuário:", response.status);
            setRegisteredName("");
            if (response.status === 401 || response.status === 403) {
              console.error(
                "Sessão expirada ou não autorizada. Faça login novamente."
              );
              auth.signOut();
              router.push("/");
            }
          }
        } catch (error) {
          console.error("Erro ao comunicar com o backend:", error);
          setRegisteredName("");
        } finally {
          setIsAuthDataLoaded(true);
        }
      };
      fetchUserData();
    } else if (user !== undefined && !isAuthenticated) {
      setIsAuthDataLoaded(true);
    }
  }, [user, isAuthenticated, backendUrl, firebaseIdToken, router, mounted]);

  useEffect(() => {
    if (!mounted || showSplashScreen) return;

    if (isAuthenticated && publicPaths.includes(pathname)) {
      router.push("/dashboard");
    } else if (!isAuthenticated && !publicPaths.includes(pathname)) {
      router.push("/");
    }
  }, [
    isAuthenticated,
    pathname,
    router,
    publicPaths,
    mounted,
    showSplashScreen,
  ]);

  const reloadPage = () => {
    window.location.reload();
  };

  if (!mounted) {
    return (
      <body
        className={`${dosis.className} antialiased bg-[var(--background)] text-[var(--text)] min-h-screen`}
      >
        {children}
      </body>
    );
  }

  return (
    <Providers>
      <body
        className={`${dosis.className} antialiased bg-[var(--background)] text-[var(--text)] min-h-screen`}
      >
        {showSplashScreen && <SplashScreen />}

        <ToastContainer autoClose={3000} position="bottom-left" />

        {!showSplashScreen && (
          <>
            {isAuthenticated && (
              <nav className="w-full flex flex-row items-center justify-between pr-5 px-3.5 ">
                <Image
                  src={Logo}
                  className="lg:hidden h-14 w-auto cursor-pointer"
                  alt="Logo Jubileu"
                  onClick={() => reloadPage()}
                  priority
                />
                <h2 className="lg:hidden text-xl font-bold">
                  Olá, {registeredName || user?.displayName || "parceiro(a)!"}
                </h2>
                <Sidebar />
              </nav>
            )}
            {children}
          </>
        )}
      </body>
    </Providers>
  );
}
