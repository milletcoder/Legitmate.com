import { put } from "@vercel/blob"

// Uploads a file sent as multipart/form-data with key "file".
// Returns a public URL.
// Requires the Blob integration/token at deploy time. [^2][^4]
export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null
    if (!file) {
      return new Response(JSON.stringify({ error: "No file provided" }), {
        status: 400,
        headers: { "content-type": "application/json" },
      })
    }

    const pathname = `uploads/${Date.now()}-${file.name}`

    const blob = await put(pathname, file, {
      access: "public",
      addRandomSuffix: true,
      cacheControlMaxAge: 60 * 60 * 24 * 30, // 30 days
    })

    return new Response(
      JSON.stringify({
        url: blob.url,
        pathname: blob.pathname,
        size: file.size,
        contentType: file.type,
      }),
      { status: 200, headers: { "content-type": "application/json" } },
    )
  } catch (err: any) {
    console.error("Blob upload failed:", err)
    return new Response(
      JSON.stringify({
        error: "Upload failed",
        details: err?.message || String(err),
      }),
      { status: 500, headers: { "content-type": "application/json" } },
    )
  }
}
