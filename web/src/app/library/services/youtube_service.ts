"use server"

export async function youtubeToMp4(youtubeUrl: string) {
  const ANY_CONVERTERS_API_BASE = process.env.ANY_CONVERTERS_API_BASE;

  if (!ANY_CONVERTERS_API_BASE) {
    throw new Error('API base URL is not configured. Set ANY_CONVERTERS_API_BASE environment variable.');
  }

  const url = `${ANY_CONVERTERS_API_BASE}/youtube/mp4`;
  console.log("Try to transfer youtube to mp4 server: ", url)
  const response = await fetch(url, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({url: youtubeUrl}),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Error converting video');
  }

  console.log("SUCCESS to get transfer result from server: ", url, ", resp data: ", data)
  return data;

}