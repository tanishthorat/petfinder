"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Textarea, Select, SelectItem, Checkbox } from '@nextui-org/react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createPet } from '@/app/actions/pets';
import { toast } from 'sonner';
import { UploadButton } from '@/utils/uploadthing';

const petSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  species: z.string().min(1, 'Species is required'),
  breed: z.string().min(2, 'Breed must be at least 2 characters'),
  age: z.number().int().min(0, 'Age must be a positive number'),
  gender: z.string().min(1, 'Gender is required'),
  size: z.string().min(1, 'Size is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  health_status: z.string().min(3, 'Health status is required'),
  vaccination_status: z.boolean(),
  is_neutered: z.boolean(),
  good_with_kids: z.boolean(),
  good_with_pets: z.boolean(),
  images: z.array(z.string()).min(1, 'At least one image is required'),
});

type PetFormData = z.infer<typeof petSchema>;

const speciesOptions = ['dog', 'cat', 'bird', 'rabbit', 'other'];
const genderOptions = ['male', 'female'];
const sizeOptions = ['small', 'medium', 'large', 'extra_large'];

export default function PostPetPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<PetFormData>({
    resolver: zodResolver(petSchema),
    defaultValues: {
      images: [],
      vaccination_status: false,
      is_neutered: false,
      good_with_kids: false,
      good_with_pets: false,
    },
  });
  
  const images = watch('images');

  const onSubmit = async (data: PetFormData) => {
    setIsSubmitting(true);
    try {
      await createPet(data);
      toast.success('Pet posted successfully!');
      router.push('/swipe'); // Redirect to the swipe page or a "my pets" page
    } catch (error) {
      toast.error('Failed to post pet. Please try again.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">Post a Pet for Adoption</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Pet Photos</label>
          <div className="p-4 border-2 border-dashed rounded-lg text-center">
            <UploadButton
              endpoint="imageUploader"
              onClientUploadComplete={(res) => {
                if (res) {
                  const newImages = res.map((file) => file.url);
                  setValue('images', [...images, ...newImages]);
                  toast.success("Upload Completed");
                }
              }}
              onUploadError={(error: Error) => {
                toast.error(`Upload Failed: ${error.message}`);
              }}
            />
          </div>
          {images.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-4">
              {images.map((url, index) => (
                <img key={index} src={url} alt={`Pet image ${index + 1}`} className="rounded-lg object-cover h-32 w-full" />
              ))}
            </div>
          )}
          {errors.images && <p className="text-red-500 text-sm mt-1">{errors.images.message}</p>}
        </div>

        {/* Pet Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input {...field} label="Name" isInvalid={!!errors.name} errorMessage={errors.name?.message} />
            )}
          />
          <Controller
            name="breed"
            control={control}
            render={({ field }) => (
              <Input {...field} label="Breed" isInvalid={!!errors.breed} errorMessage={errors.breed?.message} />
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Controller
            name="species"
            control={control}
            render={({ field }) => (
              <Select {...field} label="Species" isInvalid={!!errors.species} errorMessage={errors.species?.message}>
                {speciesOptions.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </Select>
            )}
          />
          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <Select {...field} label="Gender" isInvalid={!!errors.gender} errorMessage={errors.gender?.message}>
                {genderOptions.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
              </Select>
            )}
          />
          <Controller
            name="size"
            control={control}
            render={({ field }) => (
              <Select {...field} label="Size" isInvalid={!!errors.size} errorMessage={errors.size?.message}>
                {sizeOptions.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </Select>
            )}
          />
        </div>
        
        <Controller
          name="age"
          control={control}
          render={({ field }) => (
            <Input 
              {...field}
              value={field.value?.toString() || ""}
              onChange={e => {
                const value = e.target.value;
                field.onChange(value === "" ? 0 : parseInt(value, 10) || 0);
              }}
              type="number"
              label="Age (in months)" 
              isInvalid={!!errors.age} 
              errorMessage={errors.age?.message} 
            />
          )}
        />

        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <Textarea {...field} label="Description" isInvalid={!!errors.description} errorMessage={errors.description?.message} />
          )}
        />
        
        <Controller
          name="health_status"
          control={control}
          render={({ field }) => (
            <Input {...field} label="Health Status" isInvalid={!!errors.health_status} errorMessage={errors.health_status?.message} />
          )}
        />

        {/* Checkboxes */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Controller 
            name="vaccination_status" 
            control={control} 
            render={({ field }) => (
              <Checkbox 
                isSelected={field.value} 
                onValueChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name}
              >
                Vaccinated
              </Checkbox>
            )} 
          />
          <Controller 
            name="is_neutered" 
            control={control} 
            render={({ field }) => (
              <Checkbox 
                isSelected={field.value} 
                onValueChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name}
              >
                Neutered
              </Checkbox>
            )} 
          />
          <Controller 
            name="good_with_kids" 
            control={control} 
            render={({ field }) => (
              <Checkbox 
                isSelected={field.value} 
                onValueChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name}
              >
                Good with Kids
              </Checkbox>
            )} 
          />
          <Controller 
            name="good_with_pets" 
            control={control} 
            render={({ field }) => (
              <Checkbox 
                isSelected={field.value} 
                onValueChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name}
              >
                Good with Pets
              </Checkbox>
            )} 
          />
        </div>
        
        <Button type="submit" color="primary" size="lg" className="w-full" isLoading={isSubmitting}>
          Post Pet
        </Button>
      </form>
    </div>
  );
}
