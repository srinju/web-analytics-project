
import { z} from "zod"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaClient } from '@prisma/client';
import bcryptjs from "bcryptjs";
import GoogleProvider from "next-auth/providers/google";


const signinSchema = z.object({
    name : z.string(),
    email : z.string().email("Invalid email address").nonempty("email field is required"),
    password : z.string().min(6,"password should be atleast of 6 charecters").nonempty("password field is required")
});

const prisma = new PrismaClient();

export const authOptions  = {
    providers : [
        CredentialsProvider({
            name : 'Credentials',
            credentials : {
                name : {label : "Full Name" , type : "text" , placeholder : "John" , required : true},
                email : {label : "Email"  , type : "text" , placeholder : "abcd@gmail.com" , requried : true},
                password : {label : "Password" , type : "password" , required : true}
            },
            async authorize(credentials : any) {
                try {
                    //zod validate>
                    const validatedCreds = signinSchema.parse(credentials);
                    const existingUser = await prisma.user.findFirst({
                        where : {
                            email : validatedCreds.email
                        }
                    });
                    if(existingUser){
                        const passwordValidation = await bcryptjs.compare(validatedCreds.password , existingUser.password);
                        if(passwordValidation){
                            return {
                                id : existingUser.id.toString(),
                                name : existingUser.name,
                                email : existingUser.email
                            }
                        }
                    }
                    return null;
                } catch(err) {
                    console.error("error occured" , err);
                    return null;
                }
            }
        }),
        GoogleProvider({
            clientId : process.env.GOOGLE_CLIENT_ID || "",
            clientSecret : process.env.GOOGLE_CLIENT_SECRET || ""
        })
    ],
    secret : process.env.JWT_SECRET || "secret",
    
    callbacks : {
        async session({token , session} : any) {
            session.user.id = token.sub
            return session;
        }
    }
    
    
   /*
    cookies: {
        sessionToken: {
          name: `__Secure-next-auth.session-token`,
          options: {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
          },
        },
    },
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user } : any) {
          // Pass user details to the token on initial sign in
          if (user) {
            token.id = user.id;
            token.name = user.name;
            token.email = user.email;
          }
          return token;
        },
        async session({ session, token } : any ) {
          // Set session.user.id from token.id
          if (session.user) {
            session.user.id = token.id as string;
            session.user.email = token.email as string;
            session.user.name = token.name as string;
          }
          return session;
        }
      }
    */
        
}