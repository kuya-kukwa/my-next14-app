import React from 'react';
import SignInForm from '@/components/ui/SignInForm';
import Layout from '@/components/layouts/Layout';

export default function SignIn() {
  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="max-w-md w-full">
          <SignInForm />
        </div>
      </div>
    </Layout>
  );
}