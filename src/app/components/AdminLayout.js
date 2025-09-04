'use client';
import React, { useEffect, useState } from 'react';
import { NavBar } from './NavBar';
import useAppStore from '../store/useStore';
import { useRouter } from "next/navigation";


export const AdminLayout = ({ children }) => {
  const router = useRouter();
  const isLogined = useAppStore((state) => state.isLogined);


    useEffect(() => {
      if (!isLogined) {
       
        router.push("/manageaccountadmin/adminlogin");  
      }
      
    }, [isLogined, router]);

  return (
    <>
      <div>
        <NavBar />
        {children}
      </div>

    </>
  )
}
