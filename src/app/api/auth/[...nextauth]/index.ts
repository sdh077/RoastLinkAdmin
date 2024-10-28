import NextAuth from "next-auth"
import type { NextAuthOptions, User } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { createClient } from "@/lib/supabase/server";



export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: 'Credentials',
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: { label: "Email", type: "text", placeholder: "Email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials) return null
        const supabase = await createClient()
        const { data, error } = await supabase.auth.signInWithPassword(credentials)
        const user: User = {
          id: data.user?.id ?? '0',
          name: data.user?.user_metadata.name,
          email: data.user?.email
        }
        // If no error and we have user data, return it
        if (!error) {
          await supabase.auth.setSession({
            access_token: data.session?.access_token ?? '',
            refresh_token: data.session?.refresh_token ?? ''
          })
          return user
        }
        // Return null if user data could not be retrieved
        return null
      }
    })
  ],
  pages: {
    signIn: '/'
    // signIn: '/auth/signin'
  },
  callbacks: {
    async session({ session, token }) {
      // 세션에 사용자 정보 추가
      if (session.user) {
        session.user.id = token.sub as string
      }
      return session;
    },
    async jwt({ token, user }) {
      // 로그인 시 토큰에 사용자 정보 추가
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
  },
}

export default NextAuth(authOptions)