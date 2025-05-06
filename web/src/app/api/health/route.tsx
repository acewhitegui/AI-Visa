export async function GET() {
  // Return a simple health check response
  return new Response(
    "alive", {
      status: 200
    }
  )
}

