import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("image") as Blob | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const optimizedBuffer = await sharp(buffer)
      .webp({ quality: 75 })
      .toBuffer();

    const optimizedBase64 = `data:image/webp;base64,${optimizedBuffer.toString(
      "base64"
    )}`;

    return NextResponse.json({ optimizedImageUrl: optimizedBase64 });
  } catch (error) {
    console.error("Optimization failed:", error);
    return NextResponse.json(
      { error: "Image optimization failed" },
      { status: 500 }
    );
  }
}
