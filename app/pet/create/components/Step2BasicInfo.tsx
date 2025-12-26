"use client";

import { Card, Input, Select, SelectItem } from "@nextui-org/react";
import { PetFormData } from "../page";
import { Dog, Cat, Bird, Rabbit } from "lucide-react";

interface Props {
  data: PetFormData;
  updateData: (data: Partial<PetFormData>) => void;
}

const speciesOptions = [
  { value: "dog", label: "Dog", icon: "🐕" },
  { value: "cat", label: "Cat", icon: "🐈" },
  { value: "bird", label: "Bird", icon: "🐦" },
  { value: "rabbit", label: "Rabbit", icon: "🐰" },
  { value: "other", label: "Other", icon: "🐾" },
];

const genderOptions = [
  { value: "male", label: "Male", icon: "♂️" },
  { value: "female", label: "Female", icon: "♀️" },
];

const sizeOptions = [
  { value: "small", label: "Small (0-25 lbs)", description: "Cats, small dogs" },
  { value: "medium", label: "Medium (26-60 lbs)", description: "Medium dogs" },
  { value: "large", label: "Large (61-100 lbs)", description: "Large dogs" },
  { value: "extra_large", label: "Extra Large (100+ lbs)", description: "Giant breeds" },
];

export default function Step2BasicInfo({ data, updateData }: Props) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
          Basic Information
        </h2>
        <p className="text-gray-600">
          Tell us about your pet's basic details
        </p>
      </div>

      {/* Preview Image */}
      {data.images[data.coverImageIndex] && (
        <Card className="overflow-hidden">
          <div className="relative h-48 w-full">
            <img
              src={data.images[data.coverImageIndex]}
              alt="Pet preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 text-white">
              <p className="text-2xl font-bold">{data.name || "Your Pet"}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Name Input */}
      <div>
        <Input
          size="lg"
          label="Pet's Name"
          placeholder="e.g., Bella, Max, Luna"
          value={data.name}
          onChange={(e) => updateData({ name: e.target.value })}
          classNames={{
            input: "text-lg",
            label: "text-base font-semibold",
          }}
          description="Choose a name that your pet responds to"
        />
      </div>

      {/* Species Selection */}
      <div>
        <label className="block text-base font-semibold mb-3">Species</label>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {speciesOptions.map((species) => (
            <Card
              key={species.value}
              isPressable
              onPress={() => updateData({ species: species.value })}
              className={`p-4 cursor-pointer transition-all ${
                data.species === species.value
                  ? "bg-gradient-to-br from-purple-500 to-pink-500 text-white scale-105"
                  : "hover:border-purple-300 hover:scale-105"
              }`}
            >
              <div className="text-center">
                <div className="text-4xl mb-2">{species.icon}</div>
                <p className="font-semibold text-sm">{species.label}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Breed Input */}
      <div>
        <Input
          size="lg"
          label="Breed"
          placeholder="e.g., Golden Retriever, Persian, Cockatiel"
          value={data.breed}
          onChange={(e) => updateData({ breed: e.target.value })}
          classNames={{
            label: "text-base font-semibold",
          }}
          description="Enter the specific breed or mix"
        />
      </div>

      {/* Age and Gender Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Age */}
        <div>
          <Input
            size="lg"
            type="number"
            label="Age (months)"
            placeholder="24"
            value={data.age?.toString() || ""}
            onChange={(e) => updateData({ age: parseInt(e.target.value) || 0 })}
            classNames={{
              label: "text-base font-semibold",
            }}
            description={`${Math.floor((data.age || 0) / 12)} years ${(data.age || 0) % 12} months`}
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block text-base font-semibold mb-3">Gender</label>
          <div className="grid grid-cols-2 gap-3">
            {genderOptions.map((gender) => (
              <Card
                key={gender.value}
                isPressable
                onPress={() => updateData({ gender: gender.value })}
                className={`p-4 cursor-pointer transition-all ${
                  data.gender === gender.value
                    ? "bg-gradient-to-br from-purple-500 to-pink-500 text-white"
                    : "hover:border-purple-300"
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-1">{gender.icon}</div>
                  <p className="font-semibold text-sm">{gender.label}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Size Selection */}
      <div>
        <label className="block text-base font-semibold mb-3">Size</label>
        <div className="space-y-3">
          {sizeOptions.map((size) => (
            <Card
              key={size.value}
              isPressable
              onPress={() => updateData({ size: size.value })}
              className={`p-4 cursor-pointer transition-all ${
                data.size === size.value
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white border-2 border-purple-600"
                  : "hover:border-purple-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold">{size.label}</p>
                  <p className={`text-sm ${data.size === size.value ? "text-white/80" : "text-gray-500"}`}>
                    {size.description}
                  </p>
                </div>
                {data.size === size.value && (
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-purple-500 rounded-full" />
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Validation Message */}
      {data.images.length === 0 && (
        <Card className="p-4 bg-amber-50 border-amber-200">
          <p className="text-amber-800 text-center">
            ⚠️ Please upload at least one photo to continue
          </p>
        </Card>
      )}
    </div>
  );
}

