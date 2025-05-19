"use client"
import {useActionState, useState} from 'react'
import {signup} from "@/app/library/services/auth_service";
import {FormState} from "@/app/library/definitions/form";
import {Button} from "@/app/components/ui/shadcn/button";

async function signupReducer(prevState: FormState, formData: FormData): Promise<FormState> {
  return await signup(prevState, formData);
}

export function SignUpForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(signupReducer, undefined)
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-10 rounded-lg shadow-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold ">Sign Up</h2>
        <form className="mt-8 space-y-6" action={action}>
          <div className="rounded-md">
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-bold mb-2">Email</label>
              <input
                type="text"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your Email"
                className="rounded-md relative block w-full px-3 py-2 border"
              />
            </div>
            {state?.errors?.email && Array.isArray(state.errors.email) && (
              <p className="text-red-500">{state.errors.email.join(', ')}</p>
            )}
            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-bold mb-2">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="rounded-md relative block w-full px-3 py-2 border"
              />
            </div>
            {state?.errors?.username && Array.isArray(state.errors.username) && (
              <p className="text-red-500">{state.errors.username.join(', ')}</p>
            )}
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-bold mb-2">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="rounded-md relative block w-full px-3 py-2 border"
              />
            </div>
            {state?.errors?.password && Array.isArray(state.errors.password) && (
              <div className="text-red-500">
                <p>Password must:</p>
                <ul>
                  {state.errors.password.map((error) => (
                    <li key={error}>- {error}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="mb-4">
              <label htmlFor="confirm_password" className="block text-sm font-bold mb-2">Confirm
                Password</label>
              <input
                type="password"
                id="confirm_password"
                name="confirm_password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="rounded-md relative block w-full px-3 py-2 border"
              />
            </div>
            {state?.errors?.confirm_password && Array.isArray(state.errors.confirm_password) && (
              <p className="text-red-500">{state.errors.confirm_password.join(', ')}</p>
            )}
          </div>
          <div>
            <Button
              type="submit"
              variant="default"
              disabled={pending}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md"
            >
              Sign Up
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
