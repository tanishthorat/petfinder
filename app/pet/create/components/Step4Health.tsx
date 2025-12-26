"use client";

import { Card, Input, Textarea, Checkbox } from "@nextui-org/react";
import { PetFormData } from "../page";
import { Heart, Syringe, Stethoscope, AlertCircle } from "lucide-react";

interface Props {
  data: PetFormData;
  updateData: (data: Partial<PetFormData>) => void;
}

const healthStatusOptions = [
  { value: "Excellent", label: "Excellent", description: "Perfect health, no issues", color: "from-green-500 to-emerald-500" },
  { value: "Good", label: "Good", description: "Minor issues, well managed", color: "from-blue-500 to-cyan-500" },
  { value: "Fair", label: "Fair", description: "Manageable conditions", color: "from-yellow-500 to-orange-500" },
  { value: "Special Care", label: "Special Care", description: "Requires ongoing care", color: "from-red-500 to-pink-500" },
];

export default function Step4Health({ data, updateData }: Props) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
          Health Information
        </h2>
        <p className="text-gray-600">
          Important details about your pet's health
        </p>
      </div>

      {/* Health Status */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Stethoscope size={20} className="text-purple-600" />
          <label className="text-base font-semibold">Overall Health Status</label>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {healthStatusOptions.map((status) => (
            <Card
              key={status.value}
              isPressable
              onPress={() => updateData({ health_status: status.value })}
              className={`p-4 cursor-pointer transition-all ${
                data.health_status === status.value
                  ? `bg-gradient-to-r ${status.color} text-white scale-105`
                  : "hover:border-purple-300"
              }`}
            >
              <div>
                <p className="font-bold mb-1">{status.label}</p>
                <p className={`text-sm ${data.health_status === status.value ? "text-white/80" : "text-gray-500"}`}>
                  {status.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Medical Checkboxes */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="flex items-center gap-2 mb-4">
          <Syringe size={20} className="text-blue-600" />
          <h3 className="text-lg font-bold">Medical Care</h3>
        </div>
        
        <div className="space-y-4">
          <Checkbox
            size="lg"
            isSelected={data.vaccination_status}
            onValueChange={(checked) => updateData({ vaccination_status: checked })}
            classNames={{
              label: "text-base font-medium",
            }}
          >
            <div>
              <p className="font-semibold">Vaccinations Up to Date</p>
              <p className="text-sm text-gray-600">All required vaccines administered</p>
            </div>
          </Checkbox>

          <Checkbox
            size="lg"
            isSelected={data.is_neutered}
            onValueChange={(checked) => updateData({ is_neutered: checked })}
            classNames={{
              label: "text-base font-medium",
            }}
          >
            <div>
              <p className="font-semibold">Spayed/Neutered</p>
              <p className="text-sm text-gray-600">Has been sterilized</p>
            </div>
          </Checkbox>
        </div>
      </Card>

      {/* Special Needs */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <AlertCircle size={20} className="text-purple-600" />
          <label className="text-base font-semibold">Special Needs (Optional)</label>
        </div>
        <Textarea
          placeholder="e.g., Requires daily medication, mobility issues, dietary restrictions..."
          value={data.special_needs}
          onChange={(e) => updateData({ special_needs: e.target.value })}
          minRows={3}
          description="Mention any special care requirements"
        />
      </div>

      {/* Medical Conditions */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Heart size={20} className="text-purple-600" />
          <label className="text-base font-semibold">Medical Conditions (Optional)</label>
        </div>
        <Textarea
          placeholder="e.g., Arthritis, allergies, chronic conditions..."
          value={data.medical_conditions}
          onChange={(e) => updateData({ medical_conditions: e.target.value })}
          minRows={3}
          description="List any known medical conditions"
        />
      </div>

      {/* Info Card */}
      <Card className="p-4 bg-green-50 border-green-200">
        <div className="flex items-start gap-3">
          <div className="text-2xl">💚</div>
          <div>
            <h4 className="font-semibold text-green-900 mb-1">Transparency Matters</h4>
            <p className="text-sm text-green-800">
              Being honest about health issues helps find the right adopter who can provide proper care.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

