"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, CardBody, CardHeader, CheckboxGroup, Checkbox, Input, Slider } from "@nextui-org/react";
import { Dog, Cat, Bird, Rabbit } from "lucide-react";
import { setUserPreferences } from "@/app/actions/user";

export default function PreferencesPage() {
  const [preferences, setPreferences] = useState({
    species: [] as string[],
    age_min: 1,
    age_max: 10,
    size: [] as string[],
    distance_km: 50,
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await setUserPreferences(preferences);
      router.push('/swipe');
    } catch (error) {
      console.error("Failed to set preferences", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-lg w-full shadow-lg">
        <CardHeader className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Your Pet Preferences</h1>
          <p className="text-gray-600">Help us find the perfect match for you.</p>
        </CardHeader>
        <CardBody className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">Species</h3>
            <CheckboxGroup
              orientation="horizontal"
              value={preferences.species}
              onValueChange={(value) => setPreferences({ ...preferences, species: value })}
            >
              <Checkbox value="dog"><Dog className="mr-1" /> Dog</Checkbox>
              <Checkbox value="cat"><Cat className="mr-1" /> Cat</Checkbox>
              <Checkbox value="bird"><Bird className="mr-1" /> Bird</Checkbox>
              <Checkbox value="rabbit"><Rabbit className="mr-1" /> Rabbit</Checkbox>
            </CheckboxGroup>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Age Range (Years)</h3>
            <div className="flex items-center space-x-4">
              <Input
                type="number"
                label="Min Age"
                value={String(preferences.age_min)}
                onChange={(e) => setPreferences({ ...preferences, age_min: Number(e.target.value) })}
              />
              <Input
                type="number"
                label="Max Age"
                value={String(preferences.age_max)}
                onChange={(e) => setPreferences({ ...preferences, age_max: Number(e.target.value) })}
              />
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Size</h3>
            <CheckboxGroup
              orientation="horizontal"
              value={preferences.size}
              onValueChange={(value) => setPreferences({ ...preferences, size: value })}
            >
              <Checkbox value="small">Small</Checkbox>
              <Checkbox value="medium">Medium</Checkbox>
              <Checkbox value="large">Large</Checkbox>
              <Checkbox value="extra_large">Extra Large</Checkbox>
            </CheckboxGroup>
          </div>

          <div>
             <Slider
              label="Distance (km)"
              step={10}
              maxValue={200}
              minValue={10}
              value={preferences.distance_km}
              onChange={(value) => setPreferences({ ...preferences, distance_km: value as number })}
              className="max-w-md"
            />
          </div>

          <Button
            color="primary"
            onClick={handleSubmit}
            isLoading={isLoading}
            disabled={isLoading}
            fullWidth
          >
            Save Preferences & Start Swiping
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}
