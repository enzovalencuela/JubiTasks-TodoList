import { NextResponse } from "next/server";
//import { auth } from "./firebaseConfig";

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/dashboard")) {
    try {
      const sessionCookie = request.cookies.get("session")?.value;
      if (!sessionCookie) {
        throw new Error("No session cookie");
      }
      const token = request.cookies.get("authToken")?.value;
      if (!token) {
        return NextResponse.redirect(new URL("/", request.url));
      }
      return NextResponse.next();
    } catch (error) {
      console.error("Erro ao verificar autenticação no middleware:", error);
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard"],
};
