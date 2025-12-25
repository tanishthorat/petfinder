"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Textarea,
  Select,
  SelectItem,
  Switch,
} from "@nextui-org/react";
import { createPet } from "@/app/actions/pets";
import { UploadButton } from "@/utils/uploadthing";

export default function NewPetPage() {
  const [pet, setPet] = useState({
    name: "",
    species: "",
    breed: "",
    age: 0,
    gender: "",
    size: "",
    description: "",
    health_status: "",
    vaccination_status: false,
    is_neutered: false,
    good_with_kids: false,
    good_with_pets: false,
    images: [] as string[],
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setPet({
      ...pet,
      [name]: type === 'checkbox' || type === 'switch' ? checked : value,
    });
  };
  
  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await createPet(pet);
      router.push("/my-pets");
    } catch (error) {
      console.error("Failed to create pet", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
      <Card className="max-w-4xl mx-auto shadow-lg">
        <CardHeader>
          <h1 className="text-2xl font-bold text-gray-800">Post a Pet for Adoption</h1>
        </CardHeader>
        <CardBody className="space-y-4">
          <Input label="Name" name="name" value={pet.name} onChange={handleChange} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select label="Species" name="species" selectedKeys={[pet.species]} onChange={handleChange}>
              <SelectItem key="dog" value="dog">Dog</SelectItem>
              <SelectItem key="cat" value="cat">Cat</SelectItem>
              <SelectItem key="bird" value="bird">Bird</SelectItem>
              <SelectItem key="rabbit" value="rabbit">Rabbit</SelectItem>
              <SelectItem key="other" value="other">Other</SelectItem>
            </Select>
            <Input label="Breed" name="breed" value={pet.breed} onChange={handleChange} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input type="number" label="Age (months)" name="age" value={String(pet.age)} onChange={handleChange} />
            <Select label="Gender" name="gender" selectedKeys={[pet.gender]} onChange={handleChange}>
              <SelectItem key="male" value="male">Male</SelectItem>
              <SelectItem key="female" value="female">Female</SelectItem>
            </Select>
            <Select label="Size" name="size" selectedKeys={[pet.size]} onChange={handleChange}>
              <SelectItem key="small" value="small">Small</SelectItem>
              <SelectItem key="medium" value="medium">Medium</SelectItem>
              <SelectItem key="large" value="large">Large</SelectItem>
              <SelectItem key="extra_large" value="extra_large">Extra Large</SelectItem>
            </Select>
          </div>
          <Textarea label="Description" name="description" value={pet.description} onChange={handleChange} />
          <Input label="Health Status" name="health_status" value={pet.health_status} onChange={handleChange} />
          <div className="flex flex-wrap gap-4">
            <Switch name="vaccination_status" isSelected={pet.vaccination_status} onValueChange={(isSelected) => setPet(prev => ({...prev, vaccination_status: isSelected}))}>
              Vaccinated
            </Switch>
            <Switch name="is_neutered" isSelected={pet.is_neutered} onValueChange={(isSelected) => setPet(prev => ({...prev, is_neutered: isSelected}))}>
              Neutered
            </Switch>
            <Switch name="good_with_kids" isSelected={pet.good_with_kids} onValueChange={(isSelected) => setPet(prev => ({...prev, good_with_kids: isSelected}))}>
              Good with Kids
            </Switch>
            <Switch name="good_with_pets" isSelected={pet.good_with_pets} onValueChange={(isSelected) => setPet(prev => ({...prev, good_with_pets: isSelected}))}>
              Good with Pets
            </Switch>
          </div>
           <div>
            <h3 className="font-semibold mb-2">Pet Images</h3>
            <UploadButton
              endpoint="imageUploader"
              onClientUploadComplete={(res) => {
                if (res) {
                  const imageUrls = res.map(r => r.url);
                  setPet(prev => ({ ...prev, images: [...prev.images, ...imageUrls]}));
                  alert("Upload Completed");
                }
              }}
              onUploadError={(error: Error) => {
                alert(`ERROR! ${error.message}`);
              }}
            />
            <div className="mt-4 flex gap-2">
              {pet.images.map(url => <img key={url} src={url} alt="pet" width="100" />)}
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              color="primary"
              onClick={handleSubmit}
              isLoading={isLoading}
              disabled={isLoading}
            >
              Post Pet
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
