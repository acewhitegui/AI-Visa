"use server"
import {signIn} from '@/auth';
import {AuthError} from 'next-auth';
import {FormState, SignupFormSchema} from "@/app/library/definitions/form";
import {redirect} from "next/navigation";
import {getApiBaseUrl} from "@/app/library/common/api-helpers";
import {RedirectType} from "next/dist/client/components/redirect-error";

export async function signup(state: FormState, formData: FormData) {
  // Validate form fields
  const validatedFields = SignupFormSchema.safeParse({
    username: formData.get('username'),
    email: formData.get('email'),
    password: formData.get('password'),
    confirm_password: formData.get('confirm_password'),
  });

  if (formData.get('password') !== formData.get('confirm_password')) {
    console.error("Passwords don't match");
    return {errors: 'Passwords do not match'};
  }

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    console.error("ERROR to validate signup, error: ", validatedFields.error.errors);
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const {username, email, password} = validatedFields.data;
  const resp = await registerUser(username, email, password);
  if (resp.success) {
    return redirect("/submitted?email=" + email);
  }
  return resp;
}

async function registerUser(username: string, email: string, password: string) {
  const apiBaseUrl = getApiBaseUrl();
  const url = `${apiBaseUrl}/register`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body: new URLSearchParams({
        email,
        username,
        password
      }).toString(),
    });

    if (!response.ok) {
      const respText = await response.text();
      console.error("ERROR to register user, resp info: ", respText)
      return {
        errors: respText || 'Failed to register user',
      };
    }
    const data = await response.json();
    console.log("Successfully registered user:", username, "at endpoint:", url, "resp data: ", data.data);
    return {success: true};
  } catch (err) {
    // @ts-expect-error error any
    console.error("ERROR to register user:", err.message);
    return {
      errors: 'An error occurred during registration',
    };
  }
}

export async function verifyToken(token: string) {
  const apiBaseUrl = getApiBaseUrl();
  const url = `${apiBaseUrl}/verify-email?token=${token}`;

  const response = await fetch(url, {
    method: 'GET'
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'token verify failed');
  }

  return data;
}

export async function login(username: string, password: string) {
  const apiBaseUrl = getApiBaseUrl();
  const url = `${apiBaseUrl}/login`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body: new URLSearchParams({
      username,
      password
    }).toString(),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error(data.reason || 'Authentication failed');
    return {};
  }

  console.log("Successfully authenticated user:", username, "at endpoint:", url);
  return data;
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', {
      ...Object.fromEntries(formData),
      redirect: false
    }); // find logic to -> auth.js
    const callbackUrl: string = formData.get('callbackUrl')?.toString() || '/';
    return redirect(callbackUrl, RedirectType.replace);
  } catch (error) {
    if (error instanceof AuthError) {
      console.error("Auth error: ", error);
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}
