"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, CardBody, CardHeader, Radio, RadioGroup } from "@nextui-org/react";
import { User, Dog, PawPrint } from "lucide-react";
import { updateUserRole } from "@/app/actions/user";

export default function OnboardingPage() {
  const [role, setRole] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!role) return;
    setIsLoading(true);
    try {
      await updateUserRole(role);
      if (role === 'adopter') {
        router.push('/onboarding/preferences');
      } else {
        router.push('/swipe');
      }
    } catch (error) {
      console.error("Failed to update role", error);
      // Show an error message to the user
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full shadow-lg">
        <CardHeader className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Welcome to PetPro!</h1>
          <p className="text-gray-600">First, tell us what you're here to do.</p>
        </CardHeader>
        <CardBody>
          <RadioGroup
            label="Select your role"
            value={role}
            onValueChange={setRole}
            className="mb-6"
          >
            <Radio value="adopter" className="mb-2">
              <div className="flex items-center">
                <User className="mr-2" />
                <span>I want to adopt a pet</span>
              </div>
            </Radio>
            <Radio value="owner">
              <div className="flex items-center">
                <PawPrint className="mr-2" />
                <span>I want to post a pet for adoption</span>
              </div>
            </Radio>
          </RadioGroup>

          <Button
            color="primary"
            onClick={handleSubmit}
            isLoading={isLoading}
            disabled={!role || isLoading}
            fullWidth
          >
            Continue
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}
