"use client";

import { Card, Textarea, Input } from "@nextui-org/react";
import { PetFormData } from "../page";
import { MapPin, Palette, Scissors } from "lucide-react";

interface Props {
  data: PetFormData;
  updateData: (data: Partial<PetFormData>) => void;
}

const coatOptions = ["Short", "Medium", "Long", "Curly", "Hairless", "Wire"];

export default function Step3Details({ data, updateData }: Props) {
  const characterCount = data.description?.length || 0;
  const minChars = 20;
  const maxChars = 1000;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
          Tell Their Story
        </h2>
        <p className="text-gray-600">
          Help potential adopters fall in love with your pet
        </p>
      </div>

      {/* Description */}
      <div>
        <Textarea
          label="Description"
          placeholder="Tell us about your pet's personality, habits, favorite activities, and what makes them special..."
          value={data.description}
          onChange={(e) => updateData({ description: e.target.value })}
          minRows={6}
          maxRows={12}
          classNames={{
            label: "text-base font-semibold",
            input: "text-base",
          }}
          description={
            <div className="flex justify-between text-sm mt-1">
              <span className={characterCount < minChars ? "text-red-500" : "text-gray-500"}>
                Minimum {minChars} characters
              </span>
              <span className={characterCount > maxChars ? "text-red-500" : "text-gray-500"}>
                {characterCount} / {maxChars}
              </span>
            </div>
          }
        />

        {/* Writing Prompts */}
        <Card className="mt-4 p-4 bg-purple-50 border-purple-200">
          <h4 className="font-semibold text-purple-900 mb-2">✍️ Writing Prompts</h4>
          <div className="space-y-1 text-sm text-purple-800">
            <p>• What's their personality like? (playful, calm, energetic)</p>
            <p>• What do they love to do?</p>
            <p>• Any special quirks or habits?</p>
            <p>• What kind of home would be perfect for them?</p>
            <p>• Why are they looking for a new home?</p>
          </div>
        </Card>
      </div>

      {/* Color */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Palette size={20} className="text-purple-600" />
          <label className="text-base font-semibold">Color/Markings</label>
        </div>
        <Input
          size="lg"
          placeholder="e.g., Golden, Black & White, Tabby"
          value={data.color}
          onChange={(e) => updateData({ color: e.target.value })}
          description="Describe your pet's color and any distinctive markings"
        />
      </div>

      {/* Coat Type */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Scissors size={20} className="text-purple-600" />
          <label className="text-base font-semibold">Coat Type</label>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {coatOptions.map((coat) => (
            <Card
              key={coat}
              isPressable
              onPress={() => updateData({ coat })}
              className={`p-3 cursor-pointer text-center transition-all ${
                data.coat === coat
                  ? "bg-gradient-to-br from-purple-500 to-pink-500 text-white"
                  : "hover:border-purple-300"
              }`}
            >
              <p className="font-semibold text-sm">{coat}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Location */}
      <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="flex items-center gap-2 mb-4">
          <MapPin size={20} className="text-purple-600" />
          <h3 className="text-lg font-bold">Location</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            size="lg"
            label="City"
            placeholder="e.g., Los Angeles"
            value={data.city}
            onChange={(e) => updateData({ city: e.target.value })}
            classNames={{
              label: "font-semibold",
            }}
          />
          <Input
            size="lg"
            label="State"
            placeholder="e.g., CA"
            value={data.state}
            onChange={(e) => updateData({ state: e.target.value })}
            classNames={{
              label: "font-semibold",
            }}
          />
        </div>
        
        <p className="text-sm text-gray-600 mt-2">
          📍 This helps match with adopters in your area
        </p>
      </Card>
    </div>
  );
}

