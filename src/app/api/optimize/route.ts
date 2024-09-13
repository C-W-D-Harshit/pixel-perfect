import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

const MAX_FILE_SIZE_MB = 4.5; // Maximum file size in megabytes
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024; // Convert MB to bytes

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("image") as Blob | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    if (buffer.length > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: `File size exceeds the limit of ${MAX_FILE_SIZE_MB} MB` },
        { status: 400 }
      );
    }

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
