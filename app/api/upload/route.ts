import { NextRequest } from "next/server"
import { put } from "@vercel/blob"

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get("file")
    if (!(file instanceof File)) {
      return new Response(JSON.stringify({ error: "No file provided" }), {
        status: 400,
        headers: { "content-type": "application/json" },
      })
    }

    const ext = file.name.split(".").pop() || "bin"
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const blob = await put(filename, file, {
      access: "public",
      addRandomSuffix: false,
      token: process.env.BLOB_READ_WRITE_TOKEN,
      contentType: file.type || "application/octet-stream",
      cacheControlMaxAge: 31536000,
    })

    return new Response(JSON.stringify({ url: blob.url, pathname: blob.pathname }), {
      status: 200,
      headers: { "content-type": "application/json" },
    })
  } catch (err: any) {
    console.error("Upload error:", err)
    return new Response(JSON.stringify({ error: "Upload failed", details: err?.message || String(err) }), {
      status: 500,
      headers: { "content-type": "application/json" },
    })
  }
}
