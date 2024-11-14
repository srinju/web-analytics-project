"use client"
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
      });
    const router = useRouter();
    const handleSubmit = async(e : any) => {
        e.preventDefault();
        try {
            console.log("form dataa that is being sent ",formData);
            const res = await fetch('/signup',{
                method : 'POST',
                headers : {
                    'Content-Type' : 'application/json'
                },
                body : JSON.stringify(formData)
            });
            if(!res.ok){
                const errorResponse = await res.text();
                throw new Error(errorResponse ||"an unknown error occured");
            }
            router.push('/api/auth/signin');
        }catch(err){
            console.error("an error occured" , err);
        }
    }
    const handleChange = (e : any) => {
        setFormData({
            ...formData,
            [e.target.name] : e.target.value
        });
    }
  return (
    <div className="flex justify-center items-center min-h-screen bg-black">
    <div className=" p-8 rounded-lg shadow-lg w-96 border">
      <h2 className="text-2xl font-bold text-center mb-6 text-white">Sign Up To WebWise </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-white">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-950"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-white">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-950"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-white">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-950"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          Sign Up
        </button>
        
        <p className="text-center mt-4 text-slate-50">
            Already have an account? <Link href="/api/auth/signin" className='text-purple-600 underline'>Login</Link>
          </p>
      </form>
    </div>
  </div>
  )
}

export default Signup