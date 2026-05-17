"use client";

import { Card, Checkbox, Chip } from "@nextui-org/react";
import { PetFormData } from "../page";
import { Sparkles, Zap, Users, Home } from "lucide-react";

interface Props {
  data: PetFormData;
  updateData: (data: Partial<PetFormData>) => void;
}

const energyLevels = [
  { value: "low", label: "Low Energy", emoji: "😴", description: "Calm and relaxed" },
  { value: "medium", label: "Moderate Energy", emoji: "🚶", description: "Balanced activity" },
  { value: "high", label: "High Energy", emoji: "⚡", description: "Very active and playful" },
];

const trainingLevels = [
  { value: "not_trained", label: "Not Trained", description: "Needs training" },
  { value: "basic", label: "Basic Training", description: "Knows basic commands" },
  { value: "advanced", label: "Well Trained", description: "Fully trained" },
];

const temperamentOptions = [
  "Friendly", "Playful", "Calm", "Energetic", "Affectionate", "Independent",
  "Loyal", "Curious", "Gentle", "Protective", "Social", "Shy",
  "Confident", "Smart", "Obedient", "Vocal"
];

export default function Step5Personality({ data, updateData }: Props) {
  const handleTemperamentToggle = (trait: string) => {
    const current = data.temperament || [];
    const updated = current.includes(trait)
      ? current.filter((t) => t !== trait)
      : [...current, trait];
    updateData({ temperament: updated });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
          Personality & Behavior
        </h2>
        <p className="text-gray-600">
          Help adopters understand your pet's character
        </p>
      </div>

      {/* Energy Level */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Zap size={20} className="text-purple-600" />
          <label className="text-base font-semibold">Energy Level</label>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {energyLevels.map((level) => (
            <Card
              key={level.value}
              isPressable
              onPress={() => updateData({ energy_level: level.value })}
              className={`p-4 cursor-pointer transition-all ${
                data.energy_level === level.value
                  ? "bg-gradient-to-br from-purple-500 to-pink-500 text-white scale-105"
                  : "hover:border-purple-300"
              }`}
            >
              <div className="text-center">
                <div className="text-3xl mb-2">{level.emoji}</div>
                <p className="font-bold mb-1">{level.label}</p>
                <p className={`text-xs ${data.energy_level === level.value ? "text-white/80" : "text-gray-500"}`}>
                  {level.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Good With */}
      <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="flex items-center gap-2 mb-4">
          <Users size={20} className="text-green-600" />
          <h3 className="text-lg font-bold">Good With</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Checkbox
            size="lg"
            isSelected={data.good_with_kids}
            onValueChange={(checked) => updateData({ good_with_kids: checked })}
          >
            <div>
              <p className="font-semibold">👶 Children</p>
              <p className="text-sm text-gray-600">Friendly with kids</p>
            </div>
          </Checkbox>

          <Checkbox
            size="lg"
            isSelected={data.good_with_dogs}
            onValueChange={(checked) => updateData({ good_with_dogs: checked })}
          >
            <div>
              <p className="font-semibold">🐕 Dogs</p>
              <p className="text-sm text-gray-600">Gets along with dogs</p>
            </div>
          </Checkbox>

          <Checkbox
            size="lg"
            isSelected={data.good_with_cats}
            onValueChange={(checked) => updateData({ good_with_cats: checked })}
          >
            <div>
              <p className="font-semibold">🐈 Cats</p>
              <p className="text-sm text-gray-600">Friendly with cats</p>
            </div>
          </Checkbox>

          <Checkbox
            size="lg"
            isSelected={data.good_with_pets}
            onValueChange={(checked) => updateData({ good_with_pets: checked })}
          >
            <div>
              <p className="font-semibold">🐾 Other Pets</p>
              <p className="text-sm text-gray-600">Gets along with pets</p>
            </div>
          </Checkbox>
        </div>
      </Card>

      {/* Training Level */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Home size={20} className="text-purple-600" />
          <label className="text-base font-semibold">Training Level</label>
        </div>
        <div className="space-y-3">
          {trainingLevels.map((level) => (
            <Card
              key={level.value}
              isPressable
              onPress={() => updateData({ training_level: level.value })}
              className={`p-4 cursor-pointer transition-all ${
                data.training_level === level.value
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white border-2 border-purple-600"
                  : "hover:border-purple-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold">{level.label}</p>
                  <p className={`text-sm ${data.training_level === level.value ? "text-white/80" : "text-gray-500"}`}>
                    {level.description}
                  </p>
                </div>
                {data.training_level === level.value && (
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-purple-500 rounded-full" />
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Temperament Tags */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={20} className="text-purple-600" />
          <label className="text-base font-semibold">Temperament Traits</label>
        </div>
        <p className="text-sm text-gray-600 mb-3">
          Select all traits that describe your pet (select at least 3)
        </p>
        <div className="flex flex-wrap gap-2">
          {temperamentOptions.map((trait) => (
            <Chip
              key={trait}
              variant={data.temperament?.includes(trait) ? "solid" : "bordered"}
              color={data.temperament?.includes(trait) ? "secondary" : "default"}
              className={`cursor-pointer transition-all ${
                data.temperament?.includes(trait)
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                  : "hover:border-purple-400"
              }`}
              onClick={() => handleTemperamentToggle(trait)}
              size="lg"
            >
              {trait}
            </Chip>
          ))}
        </div>
        {data.temperament && data.temperament.length > 0 && (
          <p className="text-sm text-gray-500 mt-2">
            {data.temperament.length} trait{data.temperament.length > 1 ? 's' : ''} selected
          </p>
        )}
      </div>

      {/* Tips */}
      <Card className="p-4 bg-amber-50 border-amber-200">
        <div className="flex items-start gap-3">
          <div className="text-2xl">💡</div>
          <div>
            <h4 className="font-semibold text-amber-900 mb-1">Personality Tips</h4>
            <p className="text-sm text-amber-800">
              Be honest about your pet's personality. This helps match them with the right family who will love them for who they are!
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

