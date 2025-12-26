"use client";

import { useState } from "react";
import { Card, Button, Image, Input } from "@nextui-org/react";
import { Upload, X, Star, MoveVertical, Link as LinkIcon, AlertCircle } from "lucide-react";
import { UploadButton } from "@/utils/uploadthing";
import { toast } from "sonner";
import { PetFormData } from "../page";
import { motion, Reorder } from "framer-motion";

interface Props {
  data: PetFormData;
  updateData: (data: Partial<PetFormData>) => void;
}

export default function Step1Photos({ data, updateData }: Props) {
  const [imageUrl, setImageUrl] = useState("");
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleRemoveImage = (index: number) => {
    const newImages = data.images.filter((_, i) => i !== index);
    const newCoverIndex = data.coverImageIndex === index ? 0 : data.coverImageIndex;
    updateData({ 
      images: newImages,
      coverImageIndex: newCoverIndex 
    });
  };

  const handleSetCover = (index: number) => {
    updateData({ coverImageIndex: index });
  };

  const handleReorder = (newImages: string[]) => {
    updateData({ images: newImages });
  };

  const handleAddUrl = () => {
    if (!imageUrl.trim()) {
      toast.error("Please enter an image URL");
      return;
    }

    // Basic URL validation
    try {
      new URL(imageUrl);
      if (!imageUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
        toast.error("Please enter a valid image URL (jpg, png, gif, webp)");
        return;
      }
      
      updateData({ images: [...data.images, imageUrl] });
      setImageUrl("");
      toast.success("✅ Image added from URL!");
    } catch {
      toast.error("Please enter a valid URL");
    }
  };

  const handleUploadError = (error: Error) => {
    console.error("Upload error:", error);
    setUploadError(error.message);
    
    if (
      error.message.includes("UPLOADTHING_TOKEN") || 
      error.message.includes("Missing token") ||
      error.message.includes("Invalid token") ||
      error.message.includes("base64 encoded JSON")
    ) {
      toast.error("UploadThing not configured. Check your .env.local file.", {
        duration: 5000,
      });
    } else if (error.message.includes("Unauthorized")) {
      toast.error("Please sign in to upload images");
    } else {
      toast.error(`Upload failed: ${error.message}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
          Add Photos
        </h2>
        <p className="text-gray-600">
          Upload photos of your pet. First photo will be the cover image.
        </p>
      </div>

      {/* Upload Area */}
      <Card className="p-8 border-2 border-dashed border-gray-300 hover:border-purple-400 transition-colors">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
            <Upload className="w-10 h-10 text-purple-600" />
          </div>
          
          <div className="text-center">
            <h3 className="font-semibold text-lg mb-1">Upload Pet Photos</h3>
            <p className="text-sm text-gray-500 mb-4">
              Add up to 10 high-quality photos (JPG, PNG)
            </p>
          </div>

          {/* UploadThing Upload Button - Primary Method */}
          <div className="w-full">
            <UploadButton
              endpoint="imageUploader"
              onClientUploadComplete={(res) => {
                if (res) {
                  const newImages = res.map((file) => file.url);
                  updateData({ images: [...data.images, ...newImages] });
                  toast.success(`✅ ${newImages.length} photo${newImages.length > 1 ? 's' : ''} uploaded!`);
                  setUploadError(null);
                }
              }}
              onUploadError={handleUploadError}
              appearance={{
                button: "bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-transform",
                allowedContent: "text-gray-500 text-sm",
              }}
            />
          </div>

          {/* Error Message */}
          {uploadError && (
            uploadError.includes("UPLOADTHING_TOKEN") || 
            uploadError.includes("Invalid token") ||
            uploadError.includes("Missing token") ||
            uploadError.includes("base64 encoded JSON")
          ) && (
            <Card className="mt-4 p-4 bg-amber-50 border-amber-200 w-full">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-amber-600 mt-0.5" size={20} />
                <div className="flex-1">
                  <h4 className="font-semibold text-amber-900 mb-1">UploadThing Not Configured</h4>
                  <p className="text-sm text-amber-800">
                    Please set up UploadThing. Add <code className="text-xs bg-amber-100 px-1 rounded">UPLOADTHING_TOKEN</code> to your <code className="text-xs bg-amber-100 px-1 rounded">.env.local</code> file.
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Divider */}
          <div className="flex items-center gap-4 my-4 w-full">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="text-sm text-gray-500 font-medium">OR</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          {/* URL Input - Fallback Method */}
          <div className="w-full space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <LinkIcon size={18} className="text-purple-600" />
              <label className="text-sm font-semibold text-gray-700">Add Image by URL</label>
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="https://example.com/pet-photo.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleAddUrl();
                  }
                }}
                classNames={{
                  input: "text-sm",
                }}
              />
              <Button
                color="secondary"
                onPress={handleAddUrl}
                className="shrink-0"
              >
                Add
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Photo Grid */}
      {data.images.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">
              {data.images.length} Photo{data.images.length > 1 ? 's' : ''} Added
            </h3>
            <span className="text-sm text-gray-500">
              <MoveVertical size={16} className="inline mr-1" />
              Drag to reorder
            </span>
          </div>

          <Reorder.Group
            axis="y"
            values={data.images}
            onReorder={handleReorder}
            className="space-y-4"
          >
            {data.images.map((url, index) => (
              <Reorder.Item
                key={url}
                value={url}
                className="cursor-move"
              >
                <Card className="p-4 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-4">
                    {/* Drag Handle */}
                    <div className="text-gray-400">
                      <MoveVertical size={20} />
                    </div>

                    {/* Image Preview */}
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={url}
                        alt={`Pet photo ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {index === data.coverImageIndex && (
                        <div className="absolute top-1 left-1 bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1">
                          <Star size={12} fill="currentColor" />
                          Cover
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <p className="font-medium text-sm">Photo {index + 1}</p>
                      <p className="text-xs text-gray-500">
                        {index === 0 ? "First photo (main)" : `Position ${index + 1}`}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      {index !== data.coverImageIndex && (
                        <Button
                          size="sm"
                          variant="flat"
                          color="warning"
                          onPress={() => handleSetCover(index)}
                          startContent={<Star size={14} />}
                        >
                          Set Cover
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="flat"
                        color="danger"
                        isIconOnly
                        onPress={() => handleRemoveImage(index)}
                      >
                        <X size={16} />
                      </Button>
                    </div>
                  </div>
                </Card>
              </Reorder.Item>
            ))}
          </Reorder.Group>

          {/* Tips */}
          <Card className="mt-6 p-4 bg-blue-50 border-blue-200">
            <div className="flex items-start gap-3">
              <div className="text-2xl">💡</div>
              <div className="flex-1">
                <h4 className="font-semibold text-blue-900 mb-1">Photo Tips</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Use natural lighting for best results</li>
                  <li>• Include close-ups and full-body shots</li>
                  <li>• Show your pet's personality</li>
                  <li>• Avoid blurry or dark photos</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Empty State */}
      {data.images.length === 0 && (
        <Card className="p-8 bg-gray-50">
          <div className="text-center text-gray-500">
            <p className="text-lg mb-2">No photos yet</p>
            <p className="text-sm">Upload at least one photo to continue</p>
          </div>
        </Card>
      )}
    </div>
  );
}

