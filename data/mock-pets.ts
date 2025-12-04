import { Pet } from "@/types";

export const mockPets: Pet[] = [
  {
    id: 1,
    organization_id: "org1",
    url: "https://www.petfinder.com/dog/bella-1",
    type: "Dog",
    species: "Dog",
    breeds: {
      primary: "Golden Retriever",
      secondary: null,
      mixed: false,
      unknown: false,
    },
    colors: {
      primary: "Golden",
      secondary: null,
      tertiary: null,
    },
    age: "Young",
    gender: "Female",
    size: "Large",
    coat: "Long",
    attributes: {
      spayed_neutered: true,
      house_trained: true,
      declawed: null,
      special_needs: false,
      shots_current: true,
    },
    environment: {
      children: true,
      dogs: true,
      cats: null,
    },
    tags: ["Friendly", "Playful"],
    name: "Bella",
    description: "Friendly and energetic, loves playing fetch!",
    photos: [
      {
        small: "https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=600&auto=format&fit=crop",
        medium: "https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=600&auto=format&fit=crop",
        large: "https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=600&auto=format&fit=crop",
        full: "https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=600&auto=format&fit=crop",
      }
    ],
    primary_photo_cropped: {
        small: "https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=600&auto=format&fit=crop",
        medium: "https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=600&auto=format&fit=crop",
        large: "https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=600&auto=format&fit=crop",
        full: "https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=600&auto=format&fit=crop",
    },
    videos: [],
    status: "adoptable",
    published_at: "2023-01-01T00:00:00+0000",
    contact: {
      email: "contact@shelter.com",
      phone: "555-555-5555",
      address: {
        address1: "123 Shelter Ln",
        address2: null,
        city: "New York",
        state: "NY",
        postcode: "10001",
        country: "US",
      },
    },
    _links: {
      self: { href: "/animals/1" },
      type: { href: "/types/dog" },
      organization: { href: "/organizations/org1" },
    },
  },
];
