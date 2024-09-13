"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

export default function PixelPerfect() {
  const [file, setFile] = useState<File | null>(null);
  const [optimizedImage, setOptimizedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setOptimizedImage(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) return;

    const toastId = toast.loading("Optimizing image...");

    setIsProcessing(true);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("/api/optimize", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Optimization failed");
      }

      const result = await response.json();
      setOptimizedImage(result.optimizedImageUrl);
      toast.success("Image optimized", { id: toastId });
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to optimize image", { id: toastId });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Pixel Perfect Image Optimizer
      </h1>
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-10 h-10 mb-3 text-gray-400" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500">
                  PNG, JPG or WebP (MAX. 5MB)
                </p>
              </div>
              <Input
                id="file-upload"
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept="image/*"
              />
            </label>
          </div>
          {file && (
            <p className="text-sm text-gray-500">Selected file: {file.name}</p>
          )}
          <Button
            type="submit"
            className="w-full"
            disabled={!file || isProcessing}
          >
            {isProcessing ? "Processing..." : "Optimize Image"}
          </Button>
        </form>
        {optimizedImage && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Optimized Image:</h2>
            <div className="w-full rounded-lg overflow-hidden relative h-64">
              <Image
                src={optimizedImage}
                alt="Optimized"
                fill
                className="object-cover w-full"
              />
            </div>
            <a
              href={optimizedImage}
              download="optimized-image.webp"
              className="mt-4 inline-block"
            >
              <Button>Download Optimized Image</Button>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
