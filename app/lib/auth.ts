
import { z} from "zod"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaClient } from '@prisma/client';
import bcrypt from "bcrypt";
import GoogleProvider from "next-auth/providers/google";


const signinSchema = z.object({
    name : z.string(),
    email : z.string().email("Invalid email address").nonempty("email field is required"),
    password : z.string().min(6,"password should be atleast of 6 charecters").nonempty("password field is required")
});
const prisma = new PrismaClient();
export const authOptions = {
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
                        const passwordValidation = await bcrypt.compare(validatedCreds.password , existingUser.password);
                        if(!passwordValidation){
                            return {
                                id : existingUser.id.toString(),
                                name : existingUser.name,
                                email : existingUser.email
                            }
                        }
                        return null;
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
}