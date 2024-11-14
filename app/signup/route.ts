import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import {z} from "zod"
import bcrypt from "bcrypt";


const signupSchema = z.object({
    name : z.string(),
    email : z.string().email("Invalid email address").nonempty("email field is required"),
    password : z.string().min(6,"password should be atleast of 6 charecters").nonempty("password field is required")
});
const prisma =  new PrismaClient();

export async function POST(req : Request){
    try { 
        const body = await req.json();
        const validateData = signupSchema.parse(body);
        const existingUser = await prisma.user.findUnique({
            where : {
                email : validateData.email
            }
        });
        if(existingUser){
            return NextResponse.json({
                message : "an user with this email address already exists"
            })
        }
        const hashedPassword = await bcrypt.hash(validateData.password,10);
        const newUser = await prisma.user.create({
            data : {
                email : validateData.email,
                name : validateData.name,
                password : hashedPassword
            }
        });
        if(!newUser){
            throw new Error("errror occured while creating user");
        }
        return NextResponse.json({
            user : newUser,
            message : "user created successfully!!"
        })
    } catch(err){
        console.error("error occured" ,  err);
        return NextResponse.json({
            message : "error occured"
        },{
            status : 500
        });
    }
}