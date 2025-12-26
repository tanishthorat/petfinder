"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button, Alert } from "@nextui-org/react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { createPet } from "@/app/actions/pets";
import { toast } from "sonner";

// Import step components
import Step1Photos from "./components/Step1Photos";
import Step2BasicInfo from "./components/Step2BasicInfo";
import Step3Details from "./components/Step3Details";
import Step4Health from "./components/Step4Health";
import Step5Personality from "./components/Step5Personality";
import Step6Preview from "./components/Step6Preview";

export type PetFormData = {
  // Step 1: Photos
  images: string[];
  coverImageIndex: number;

  // Step 2: Basic Info
  name: string;
  species: string;
  breed: string;
  age: number;
  gender: string;
  size: string;

  // Step 3: Details
  description: string;
  color: string;
  coat: string;
  location: string;
  city: string;
  state: string;

  // Step 4: Health
  health_status: string;
  vaccination_status: boolean;
  is_neutered: boolean;
  special_needs: string;
  medical_conditions: string;

  // Step 5: Personality
  good_with_kids: boolean;
  good_with_pets: boolean;
  good_with_cats: boolean;
  good_with_dogs: boolean;
  energy_level: string;
  temperament: string[];
  training_level: string;
};

const steps = [
  { id: 1, title: "Photos", description: "Add beautiful photos" },
  { id: 2, title: "Basic Info", description: "Name, species, breed" },
  { id: 3, title: "Details", description: "Description & location" },
  { id: 4, title: "Health", description: "Medical information" },
  { id: 5, title: "Personality", description: "Traits & behavior" },
  { id: 6, title: "Preview", description: "Review & publish" },
];

export default function CreatePetPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<PetFormData>({
    images: [],
    coverImageIndex: 0,
    name: "",
    species: "",
    breed: "",
    age: 0,
    gender: "",
    size: "",
    description: "",
    color: "",
    coat: "",
    location: "",
    city: "",
    state: "",
    health_status: "Healthy",
    vaccination_status: false,
    is_neutered: false,
    special_needs: "",
    medical_conditions: "",
    good_with_kids: false,
    good_with_pets: false,
    good_with_cats: false,
    good_with_dogs: false,
    energy_level: "medium",
    temperament: [],
    training_level: "not_trained",
  });

  const updateFormData = (data: Partial<PetFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (formData.images.length === 0) {
      toast.error("Please add at least one photo");
      setCurrentStep(1);
      return;
    }

    if (!formData.name || !formData.species || !formData.breed) {
      toast.error("Please complete all required fields");
      setCurrentStep(2);
      return;
    }

    if (!formData.description || formData.description.length < 20) {
      toast.error("Description must be at least 20 characters");
      setCurrentStep(3);
      return;
    }

    setIsSubmitting(true);
    try {
      await createPet({
        name: formData.name,
        species: formData.species,
        breed: formData.breed,
        age: formData.age,
        gender: formData.gender,
        size: formData.size,
        description: formData.description,
        health_status: formData.health_status,
        vaccination_status: formData.vaccination_status,
        is_neutered: formData.is_neutered,
        good_with_kids: formData.good_with_kids,
        good_with_pets: formData.good_with_pets,
        images: formData.images,
        color: formData.color,
        city: formData.city,
        state: formData.state,
        special_needs: formData.special_needs,
        medical_conditions: formData.medical_conditions,
        good_with_cats: formData.good_with_cats,
        good_with_dogs: formData.good_with_dogs,
        energy_level: formData.energy_level,
        temperament: formData.temperament,
        training_level: formData.training_level,
      });
      
      toast.success("🎉 Pet listed successfully!");
      router.push("/profile");
    } catch (error: any) {
      console.error("Error creating pet:", error);
      
      // Better error messages
      if (error.message?.includes("Unauthorized")) {
        toast.error("Please sign in to list a pet");
        router.push("/sign-in");
      } else if (error.message?.includes("validation")) {
        toast.error("Please check all fields are filled correctly");
      } else if (error.message?.includes("network") || error.message?.includes("fetch")) {
        toast.error("Network error. Please check your connection and try again.");
      } else {
        toast.error(error.message || "Failed to list pet. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1Photos data={formData} updateData={updateFormData} />;
      case 2:
        return <Step2BasicInfo data={formData} updateData={updateFormData} />;
      case 3:
        return <Step3Details data={formData} updateData={updateFormData} />;
      case 4:
        return <Step4Health data={formData} updateData={updateFormData} />;
      case 5:
        return <Step5Personality data={formData} updateData={updateFormData} />;
      case 6:
        return <Step6Preview data={formData} onSubmit={handleSubmit} />;
      default:
        return null;
    }
  };

  const canGoNext = () => {
    switch (currentStep) {
      case 1:
        return formData.images.length > 0;
      case 2:
        return formData.name && formData.species && formData.breed && formData.age > 0;
      case 3:
        return formData.description.length >= 20 && formData.city && formData.state;
      case 4:
        return formData.health_status;
      case 5:
        return true;
      case 6:
        return false;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <Button
              isIconOnly
              variant="light"
              onPress={() => currentStep === 1 ? router.back() : handlePrevious()}
            >
              <ArrowLeft size={20} />
            </Button>
            <h1 className="text-xl font-bold">List Your Pet</h1>
            <div className="w-10" />
          </div>

          {/* Progress Bar */}
          <div className="relative">
            <div className="flex justify-between items-center">
              {steps.map((step, index) => (
                <div key={step.id} className="flex flex-col items-center flex-1 relative">
                  {/* Connection Line */}
                  {index < steps.length - 1 && (
                    <div className="absolute top-4 left-1/2 w-full h-0.5 bg-gray-200 -z-10">
                      <motion.div
                        initial={{ width: "0%" }}
                        animate={{
                          width: currentStep > step.id ? "100%" : "0%",
                        }}
                        transition={{ duration: 0.3 }}
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                      />
                    </div>
                  )}

                  {/* Step Circle */}
                  <motion.div
                    animate={{
                      scale: currentStep === step.id ? 1.1 : 1,
                      backgroundColor:
                        currentStep > step.id
                          ? "#8b5cf6"
                          : currentStep === step.id
                          ? "#ec4899"
                          : "#e5e7eb",
                    }}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-lg relative z-10"
                  >
                    {currentStep > step.id ? (
                      <Check size={16} />
                    ) : (
                      step.id
                    )}
                  </motion.div>

                  {/* Step Label - Hidden on mobile */}
                  <span className="hidden md:block text-xs mt-2 text-center text-gray-600 font-medium">
                    {step.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        {currentStep < 6 && (
          <div className="mt-8 flex gap-4">
            {currentStep > 1 && (
              <Button
                size="lg"
                variant="bordered"
                onPress={handlePrevious}
                startContent={<ArrowLeft size={20} />}
                className="flex-1"
              >
                Previous
              </Button>
            )}
            <Button
              size="lg"
              color="primary"
              onPress={handleNext}
              endContent={<ArrowRight size={20} />}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500"
              isDisabled={!canGoNext()}
            >
              {currentStep === steps.length - 1 ? "Review" : "Next"}
            </Button>
          </div>
        )}

        {currentStep === 6 && (
          <div className="mt-8 space-y-4">
            {/* Validation Check */}
            {formData.images.length === 0 || !formData.name || !formData.species || !formData.breed || !formData.description || formData.description.length < 20 ? (
              <Alert
                color="warning"
                variant="flat"
                title="Please Complete All Required Fields"
                description="Go back to previous steps to complete missing information"
              />
            ) : null}
            
            <Button
              size="lg"
              color="success"
              onPress={handleSubmit}
              isLoading={isSubmitting}
              isDisabled={
                formData.images.length === 0 ||
                !formData.name ||
                !formData.species ||
                !formData.breed ||
                !formData.description ||
                formData.description.length < 20
              }
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold"
              startContent={!isSubmitting && <Check size={20} />}
            >
              {isSubmitting ? "Publishing..." : "Publish Pet Listing"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

