"use client";

import { Card, Image, Chip, Divider, Button, Alert } from "@nextui-org/react";
import { PetFormData } from "../page";
import { MapPin, Heart, Stethoscope, Sparkles, Check, Edit, AlertCircle } from "lucide-react";

interface Props {
  data: PetFormData;
  onSubmit: () => void;
}

const energyLevels = [
  { value: "low", label: "Low Energy", emoji: "😴" },
  { value: "medium", label: "Moderate Energy", emoji: "🚶" },
  { value: "high", label: "High Energy", emoji: "⚡" },
];

export default function Step6Preview({ data, onSubmit }: Props) {
  // Validation checks
  const validationErrors: string[] = [];
  
  if (data.images.length === 0) {
    validationErrors.push("At least one photo is required");
  }
  if (!data.name) {
    validationErrors.push("Pet name is required");
  }
  if (!data.species) {
    validationErrors.push("Species is required");
  }
  if (!data.breed) {
    validationErrors.push("Breed is required");
  }
  if (!data.description || data.description.length < 20) {
    validationErrors.push("Description must be at least 20 characters");
  }
  if (!data.city || !data.state) {
    validationErrors.push("Location (city and state) is required");
  }
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
          Preview Your Listing
        </h2>
        <p className="text-gray-600">
          This is how your pet will appear to potential adopters
        </p>
      </div>

      {/* Preview Card - Instagram Style */}
      <Card className="overflow-hidden">
        {/* Image Gallery */}
        <div className="relative">
          <div className="aspect-square w-full overflow-hidden bg-black">
            <Image
              src={data.images[data.coverImageIndex]}
              alt={data.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Image Counter */}
          <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
            1 / {data.images.length}
          </div>
        </div>

        {/* Pet Info */}
        <div className="p-6 space-y-6">
          {/* Header Section */}
          <div>
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-3xl font-bold text-gray-900">{data.name}</h3>
                <p className="text-lg text-gray-600 font-medium">
                  {data.breed} • {Math.floor(data.age / 12)} years {data.age % 12} months
                </p>
              </div>
              <Chip color="success" variant="flat" size="lg" className="font-semibold">
                Available
              </Chip>
            </div>

            {/* Location */}
            <div className="flex items-center gap-2 text-gray-600 mt-3">
              <MapPin size={18} className="text-purple-500" />
              <span className="font-medium">{data.city}, {data.state}</span>
            </div>
          </div>

          {/* Quick Info Tags */}
          <div className="flex flex-wrap gap-2">
            <Chip variant="flat" size="lg" className="bg-purple-100 text-purple-700">
              {data.species.charAt(0).toUpperCase() + data.species.slice(1)}
            </Chip>
            <Chip variant="flat" size="lg" className="bg-pink-100 text-pink-700">
              {data.gender.charAt(0).toUpperCase() + data.gender.slice(1)}
            </Chip>
            <Chip variant="flat" size="lg" className="bg-blue-100 text-blue-700">
              {data.size.replace('_', ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
            </Chip>
            {data.color && (
              <Chip variant="flat" size="lg" className="bg-amber-100 text-amber-700">
                {data.color}
              </Chip>
            )}
            {data.vaccination_status && (
              <Chip variant="flat" size="lg" className="bg-green-100 text-green-700">
                ✓ Vaccinated
              </Chip>
            )}
            {data.is_neutered && (
              <Chip variant="flat" size="lg" className="bg-cyan-100 text-cyan-700">
                ✓ Spayed/Neutered
              </Chip>
            )}
          </div>

          <Divider />

          {/* Description */}
          <div>
            <h4 className="text-xl font-bold mb-3">About {data.name}</h4>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {data.description}
            </p>
          </div>

          <Divider />

          {/* Health Information */}
          <Card className="p-4 bg-blue-50 border-blue-200">
            <div className="flex items-center gap-2 mb-3">
              <Stethoscope size={20} className="text-blue-600" />
              <h4 className="font-bold text-blue-900">Health Status</h4>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-blue-800">Overall Health:</span>
                <span className="font-semibold text-blue-900">{data.health_status}</span>
              </div>
              {data.special_needs && (
                <div>
                  <span className="text-blue-800">Special Needs:</span>
                  <p className="text-blue-900 mt-1">{data.special_needs}</p>
                </div>
              )}
              {data.medical_conditions && (
                <div>
                  <span className="text-blue-800">Medical Conditions:</span>
                  <p className="text-blue-900 mt-1">{data.medical_conditions}</p>
                </div>
              )}
            </div>
          </Card>

          {/* Personality */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={20} className="text-purple-600" />
              <h4 className="font-bold">Personality</h4>
            </div>
            
            {/* Energy Level */}
            <div className="mb-3">
              <Chip 
                variant="flat" 
                size="lg"
                className="bg-purple-100 text-purple-700 font-semibold"
              >
                {energyLevels.find(e => e.value === data.energy_level)?.label} {energyLevels.find(e => e.value === data.energy_level)?.emoji}
              </Chip>
            </div>

            {/* Temperament Traits */}
            {data.temperament && data.temperament.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {data.temperament.map((trait) => (
                  <Chip key={trait} variant="flat" size="md">
                    {trait}
                  </Chip>
                ))}
              </div>
            )}
          </div>

          {/* Good With Section */}
          <Card className="p-4 bg-green-50 border-green-200">
            <h4 className="font-bold text-green-900 mb-3">Compatible With</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <div className={`w-5 h-5 rounded-full ${data.good_with_kids ? 'bg-green-500' : 'bg-gray-300'} flex items-center justify-center`}>
                  {data.good_with_kids && <Check size={14} className="text-white" />}
                </div>
                <span className="text-green-900">Children</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-5 h-5 rounded-full ${data.good_with_dogs ? 'bg-green-500' : 'bg-gray-300'} flex items-center justify-center`}>
                  {data.good_with_dogs && <Check size={14} className="text-white" />}
                </div>
                <span className="text-green-900">Dogs</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-5 h-5 rounded-full ${data.good_with_cats ? 'bg-green-500' : 'bg-gray-300'} flex items-center justify-center`}>
                  {data.good_with_cats && <Check size={14} className="text-white" />}
                </div>
                <span className="text-green-900">Cats</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-5 h-5 rounded-full ${data.good_with_pets ? 'bg-green-500' : 'bg-gray-300'} flex items-center justify-center`}>
                  {data.good_with_pets && <Check size={14} className="text-white" />}
                </div>
                <span className="text-green-900">Other Pets</span>
              </div>
            </div>
          </Card>

          {/* Photo Gallery Preview */}
          {data.images.length > 1 && (
            <div>
              <h4 className="font-bold mb-3">All Photos ({data.images.length})</h4>
              <div className="grid grid-cols-4 gap-2">
                {data.images.map((img, idx) => (
                  <div key={idx} className="aspect-square rounded-lg overflow-hidden relative">
                    <Image
                      src={img}
                      alt={`${data.name} ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {idx === data.coverImageIndex && (
                      <div className="absolute top-1 right-1 bg-yellow-400 rounded-full p-1">
                        <Heart size={12} fill="currentColor" className="text-yellow-900" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Validation Warnings */}
      {validationErrors.length > 0 && (
        <Alert
          icon={<AlertCircle size={20} />}
          title="Please Complete Required Fields"
          color="warning"
          variant="flat"
          className="mb-4"
        >
          <ul className="list-disc list-inside space-y-1 mt-2">
            {validationErrors.map((error, index) => (
              <li key={index} className="text-sm">{error}</li>
            ))}
          </ul>
          <p className="text-sm mt-2 font-medium">
            Use the "Previous" button to go back and complete these fields.
          </p>
        </Alert>
      )}

      {/* Ready to Publish */}
      {validationErrors.length === 0 ? (
        <Card className="p-6 bg-gradient-to-br from-purple-100 to-pink-100 border-2 border-purple-300">
          <div className="text-center">
            <div className="text-5xl mb-3">🎉</div>
            <h3 className="text-2xl font-bold text-purple-900 mb-2">
              Ready to Publish!
            </h3>
            <p className="text-purple-800">
              Your pet listing looks amazing! Click below to make it live.
            </p>
          </div>
        </Card>
      ) : (
        <Card className="p-6 bg-amber-50 border-2 border-amber-300">
          <div className="text-center">
            <div className="text-5xl mb-3">⚠️</div>
            <h3 className="text-2xl font-bold text-amber-900 mb-2">
              Complete Required Fields
            </h3>
            <p className="text-amber-800">
              Please go back and fill in all required information before publishing.
            </p>
          </div>
        </Card>
      )}

      {/* Edit Reminder */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <Edit size={20} className="text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">Need to make changes?</h4>
            <p className="text-sm text-blue-800">
              Use the "Previous" button to go back and edit any section
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

