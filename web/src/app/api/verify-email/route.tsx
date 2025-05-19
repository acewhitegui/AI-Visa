import {verifyToken} from "@/app/library/services/auth_service";
import {redirect} from "next/navigation";

export async function GET(
  request: Request
) {
  // 获取 URL 对象
  const {searchParams} = new URL(request.url);

  // 从查询参数中获取 token
  const token = searchParams.get('token');


  if (!token) {
    return new Response('Token is required', {status: 400});
  }

  await verifyToken(token)
  return redirect("/auth/login")
}
