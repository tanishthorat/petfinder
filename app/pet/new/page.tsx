"use client";

import React from "react";
import { Input, Textarea, Button, Select, SelectItem } from "@nextui-org/react";
import { createPet } from "@/app/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function PostPetPage() {
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    const result = await createPet(formData);
    if (result.success) {
      toast.success("Pet posted successfully!");
      router.push("/swipe");
    } else {
      toast.error(result.error || "Failed to post pet");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-xl">
        <h1 className="text-3xl font-bold mb-6 text-center">Post a Pet for Adoption</h1>
        <p className="text-gray-500 text-center mb-8">Help your furry friend find a new loving home.</p>

        <form action={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Input name="name" label="Pet Name" placeholder="e.g. Bella" required variant="bordered" />
            <Input name="breed" label="Breed" placeholder="e.g. Golden Retriever" required variant="bordered" />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Input name="age" label="Age" placeholder="e.g. 2 years" required variant="bordered" />
            <Select name="gender" label="Gender" placeholder="Select gender" variant="bordered">
              <SelectItem key="Male">Male</SelectItem>
              <SelectItem key="Female">Female</SelectItem>
            </Select>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Input name="city" label="City" placeholder="e.g. New York" required variant="bordered" />
            <Input name="state" label="State" placeholder="e.g. NY" required variant="bordered" />
          </div>

          <Input name="imageUrl" label="Photo URL" placeholder="https://..." required variant="bordered" description="Paste a direct link to an image for now." />

          <Textarea name="description" label="Description" placeholder="Tell us about the pet's personality..." minRows={4} variant="bordered" />

          <Button type="submit" color="primary" size="lg" className="w-full font-bold shadow-lg shadow-primary/20">
            Post Pet
          </Button>
        </form>
      </div>
    </div>
  );
}
