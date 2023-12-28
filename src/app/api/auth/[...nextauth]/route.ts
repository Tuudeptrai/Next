import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import GithubProvider from 'next-auth/providers/github';
import CredentialsProvider from "next-auth/providers/credentials";
import { sendRequest } from '@/utils/Api';

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export const authOptions: NextAuthOptions = {
  // https://next-auth.js.org/configuration/providers/oauth
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "normal email",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: "Username", type: "text", placeholder: "admin@gmail.com" },
        password: { label: "Password", type: "password", placeholder: "123456" }
      },
      async authorize(credentials, req) {
        const res = await sendRequest<IBackendRes<Isession>>( {
          url:"http://localhost:8000/api/v1/auth/login",
          method:"POST",
          body: {
                  password:credentials?.password,
                  username: credentials?.username,
                }, 
      })
        // Add logic here to look up the user from the credentials supplied
        const user = res.data?.user;

        if (res&&res.data) {
          // Any object returned will be saved in `user` property of the JWT
          return res.data as any
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          return null

          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        }
      }
    }),
    // GithubProvider({
    //   clientId: process.env.GITHUB_ID as string,
    //   clientSecret: process.env.GITHUB_SECRET as string,
    // }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_ID as string,
      clientSecret: process.env.FACEBOOK_SECRET as string,
    }),
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_ID as string,
    //   clientSecret: process.env.GOOGLE_SECRET as string,
    // }),

  ],
  callbacks: {
    async jwt({ token, user, account, profile, trigger}) {
      console.log('jwt',token, user, account, profile, trigger)
      if(trigger === "signIn"&&account?.provider!=="credentials"){
        const res = await sendRequest<IBackendRes<Isession>>({
          url:"http://localhost:8000/api/v1/auth/social-media",
          method:"POST",
          body: {
                  type:account?.provider.toLocaleUpperCase(),
                  username: user.email,
                },   
        })
        if(res.data){
          token.access_token = res.data.access_token;
          token.refresh_token = res.data.refresh_token;
          token.user = res.data.user;
         }
        token.user.image = profile?.image!;
        token.user.role = 'ADMIN';
        token.user.address = "hoi dan it";
      }
      if(trigger === "signIn" &&account?.provider==="credentials"){
          //@ts-ignore
          token.access_token = user.access_token;
          //@ts-ignore
            token.refresh_token = user.refresh_token;
            //@ts-ignore
            token.user = user.user;
            token.user.image = profile?.image!;
        }
       
    
     
      return token;
    },
    async session({session, token, user}) {
      session.access_token = token.access_token ;
      session.refresh_token = token.refresh_token ;
      session.user = token.user ;
      // session.user.role = token.user.role;
      //@ts-ignore
      session.image = token.user.image;
      return session;
    }
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
