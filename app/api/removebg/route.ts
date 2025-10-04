import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { imageBase64 } = await req.json();

    if (!imageBase64) {
      return NextResponse.json({ error: "No imageBase64 provided" }, { status: 400 });
    }

    // Crear formData para remove.bg
    const formData = new FormData();
    formData.append("image_file_b64", imageBase64.replace(/^data:image\/\w+;base64,/, ""));
    formData.append("size", "auto");

    const response = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: {
        "X-Api-Key": process.env.REMOVEBG_API_KEY!,
      },
      body: formData as any,
    });

    if (!response.ok) {
      const errText = await response.text();
      return NextResponse.json({ error: errText }, { status: 400 });
    }

    const buffer = await response.arrayBuffer();
    return new Response(buffer, {
      headers: { "Content-Type": "image/png" },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
