
import React from 'react';
import { AdminLayout } from '@/app/components/AdminLayout';
import { Login } from '@/app/components/Login';
 

export default function AdminLogin(){
  return (
    <AdminLayout>
    <div><Login></Login></div>
    </AdminLayout>
  )
}
