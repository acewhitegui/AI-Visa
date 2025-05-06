"use client"
import {useActionState, useEffect, useState} from "react";
import {useRouter} from "@/i18n/routing";
import {useSearchParams} from 'next/navigation';
import {ExclamationCircleIcon,} from '@heroicons/react/24/outline';
import {ArrowRightIcon} from '@heroicons/react/20/solid';
import {Button} from "@headlessui/react";
import {authenticate} from "@/app/library/services/auth_service";
import {useSession} from "next-auth/react";

export function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const [errorMessage, formAction] = useActionState(authenticate, undefined);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const {data: session} = useSession();

  useEffect(() => {
    // 检查用户是否已经登录
    const checkLoginStatus = async () => {
      try {
        // 这里需要根据你的认证机制来判断用户是否已登录
        // 例如检查localStorage中的token或者通过API请求验证会话状态
        const isLoggedIn = session?.user
        if (isLoggedIn) {
          // 如果已登录，重定向到callbackUrl或首页
          router.push(callbackUrl);
        }
      } catch (error) {
        console.error('Error checking login status:', error);
      }
    };

    checkLoginStatus();
  }, [router, callbackUrl, session?.user]);

  const navigateToRegister = () => {
    router.push("/register");
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-gray-800 p-10 rounded-lg shadow-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">Sign In</h2>
        <form className="mt-8 space-y-6" action={formAction}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="mb-4">
              <label htmlFor="username" className="block text-gray-300 text-sm font-bold mb-2">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-600 placeholder-gray-400 bg-gray-700 text-white focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-300 text-sm font-bold mb-2">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-600 placeholder-gray-400 bg-gray-700 text-white focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm"
              />
            </div>
          </div>
          <input type="hidden" name="callbackUrl" value={callbackUrl}/>
          <Button
            className="mt-4 w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-bold py-2 px-4 transition-all duration-300 rounded-md shadow-lg transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-opacity-50"
            type="submit">
              <span className="flex items-center justify-center">
                Log in <ArrowRightIcon className="ml-auto h-5 w-5 text-white animate-pulse"/>
              </span>
          </Button>
          <div
            className="flex h-8 items-end space-x-1"
            aria-live="polite"
            aria-atomic="true"
          >
            {errorMessage && (
              <>
                <ExclamationCircleIcon className="h-5 w-5 text-red-500"/>
                <p className="text-sm text-red-500">{errorMessage}</p>
              </>
            )}
          </div>
          <div className="text-center mt-4">
            <p className="text-gray-300">
              Don&#39;t have an account?{" "}
              <button
                type="button"
                onClick={navigateToRegister}
                className="text-violet-400 hover:text-violet-300 font-medium focus:outline-none"
              >
                Register here
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}