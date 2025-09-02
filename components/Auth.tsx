import React from 'react';
import { SignInButton } from "@clerk/clerk-react";

const GoogleIcon = () => (
    <svg className="w-6 h-6 mr-3" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"></path>
        <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"></path>
        <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.222 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"></path>
        <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.022 36.171 44 30.651 44 24c0-1.341-.138-2.65-.389-3.917z"></path>
    </svg>
);

const Auth: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-transparent text-light p-4">
            <div className="text-center animate-fade-in-up max-w-2xl">
                <h1 className="text-4xl md:text-5xl font-bold text-light tracking-tight">Welcome to Target DSA 2025</h1>
                <p className="text-dark-text mt-4 mx-auto">
                    Sign in to track your progress across devices and keep your data safe in the cloud.
                </p>
            </div>
            <div className="mt-12 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                 <SignInButton mode="modal">
                    <button
                        className="flex items-center justify-center bg-primary/80 hover:bg-secondary/80 backdrop-blur-lg transition-colors duration-200 text-light font-medium py-3 px-6 rounded-xl border border-border shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    >
                        <GoogleIcon />
                        <span>Sign in with Google</span>
                    </button>
                 </SignInButton>
            </div>
        </div>
    );
};

export default Auth;