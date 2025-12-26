"use client";

import { useState } from "react";
import { Card, Button, Image, Chip, Avatar, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Tabs, Tab } from "@nextui-org/react";
import { Heart, MessageCircle, Eye, Edit, Trash2, Calendar, MapPin, Users, CheckCircle, Clock, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createMatchFromLike } from "@/app/actions/matches";

interface PetWithLikes {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: number;
  gender: string;
  size: string;
  description: string;
  images: string[];
  status: string;
  health_status?: string;
  vaccination_status?: boolean;
  is_neutered?: boolean;
  good_with_kids?: boolean;
  good_with_pets?: boolean;
  color?: string;
  location_address?: string;
  energy_level?: string;
  temperament?: string[];
  special_needs?: string;
  created_at: string;
  likeCount: number;
  likes: Array<{
    id: string;
    user_id: string;
    swiped_at: string;
    user?: {
      id: string;
      full_name?: string;
      email?: string;
      profile_image_url?: string;
    };
  }>;
  matches: Array<{
    id: string;
    adopter_id: string;
    status: string;
    matched_at: string;
    adopter?: {
      id: string;
      full_name?: string;
      email?: string;
      profile_image_url?: string;
    };
  }>;
  potentialContacts: Array<{
    id: string;
    full_name?: string;
    email?: string;
    profile_image_url?: string;
  }>;
}

interface Props {
  initialPets: PetWithLikes[];
}

export default function MyPetsClient({ initialPets }: Props) {
  const router = useRouter();
  const [pets, setPets] = useState(initialPets);
  const [selectedPet, setSelectedPet] = useState<PetWithLikes | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "available":
        return "success";
      case "pending":
        return "warning";
      case "adopted":
        return "primary";
      case "removed":
        return "danger";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "available":
        return <CheckCircle size={16} />;
      case "pending":
        return <Clock size={16} />;
      case "adopted":
        return <CheckCircle size={16} />;
      case "removed":
        return <XCircle size={16} />;
      default:
        return null;
    }
  };

  const handleViewDetails = (pet: PetWithLikes) => {
    setSelectedPet(pet);
    onOpen();
  };

  const handleMessageUser = async (userId: string, petId: string) => {
    try {
      // Create or get match
      const match = await createMatchFromLike(petId, userId);
      // Navigate to chat
      router.push(`/matches/${match.id}`);
      toast.success("Match created! Opening chat...");
    } catch (error: any) {
      console.error("Error creating match:", error);
      toast.error(error.message || "Failed to start conversation");
    }
  };

  const handleViewMatch = (matchId: string) => {
    router.push(`/matches/${matchId}`);
  };

  if (pets.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-12 h-12 text-purple-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">No Pets Listed Yet</h2>
            <p className="text-gray-600 mb-8">Start by listing your first pet!</p>
            <Button
              color="primary"
              size="lg"
              onPress={() => router.push("/pet/create")}
              className="bg-gradient-to-r from-purple-500 to-pink-500"
            >
              List Your First Pet
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                My Listed Pets
              </h1>
              <p className="text-gray-600 mt-2">
                Manage your pet listings and connect with interested adopters
              </p>
            </div>
            <Button
              color="primary"
              onPress={() => router.push("/pet/create")}
              className="bg-gradient-to-r from-purple-500 to-pink-500"
            >
              List New Pet
            </Button>
          </div>
        </div>

        {/* Pets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pets.map((pet) => (
            <Card key={pet.id} className="overflow-hidden hover:shadow-xl transition-shadow">
              {/* Image */}
              <div className="relative aspect-square w-full overflow-hidden bg-gray-200">
                <Image
                  src={pet.images && pet.images.length > 0 ? pet.images[0] : "https://via.placeholder.com/400x400"}
                  alt={pet.name}
                  className="w-full h-full object-cover"
                />
                {pet.images && pet.images.length > 1 && (
                  <div className="absolute top-2 right-2 bg-black/60 text-white px-2 py-1 rounded-full text-xs">
                    +{pet.images.length - 1} more
                  </div>
                )}
                <div className="absolute top-2 left-2">
                  <Chip
                    color={getStatusColor(pet.status)}
                    variant="flat"
                    startContent={getStatusIcon(pet.status)}
                  >
                    {pet.status}
                  </Chip>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{pet.name}</h3>
                    <p className="text-sm text-gray-600">
                      {pet.breed} • {pet.species}
                    </p>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-1 text-sm">
                    <Heart className="w-4 h-4 text-red-500" />
                    <span className="font-semibold">{pet.likeCount}</span>
                    <span className="text-gray-500">likes</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <MessageCircle className="w-4 h-4 text-blue-500" />
                    <span className="font-semibold">{pet.matches.length}</span>
                    <span className="text-gray-500">matches</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-4">
                  <Button
                    size="sm"
                    variant="flat"
                    color="primary"
                    onPress={() => handleViewDetails(pet)}
                    className="flex-1"
                    startContent={<Eye size={16} />}
                  >
                    View Details
                  </Button>
                  {pet.likeCount > 0 && (
                    <Button
                      size="sm"
                      variant="flat"
                      color="secondary"
                      onPress={() => handleViewDetails(pet)}
                      startContent={<Users size={16} />}
                    >
                      {pet.likeCount}
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Pet Details Modal */}
        <Modal
          isOpen={isOpen}
          onClose={onClose}
          size="3xl"
          scrollBehavior="inside"
        >
          <ModalContent>
            {selectedPet && (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">{selectedPet.name}</h2>
                    <Chip
                      color={getStatusColor(selectedPet.status)}
                      variant="flat"
                      startContent={getStatusIcon(selectedPet.status)}
                    >
                      {selectedPet.status}
                    </Chip>
                  </div>
                </ModalHeader>
                <ModalBody>
                  <Tabs aria-label="Pet details">
                    <Tab key="details" title="Details">
                      <PetDetailsTab pet={selectedPet} />
                    </Tab>
                    <Tab key="likes" title={`Likes (${selectedPet.likeCount})`}>
                      <LikesTab pet={selectedPet} onMessage={handleMessageUser} />
                    </Tab>
                    <Tab key="matches" title={`Matches (${selectedPet.matches.length})`}>
                      <MatchesTab pet={selectedPet} onViewMatch={handleViewMatch} />
                    </Tab>
                  </Tabs>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                  <Button
                    color="primary"
                    onPress={() => {
                      router.push(`/pet/${selectedPet.id}`);
                      onClose();
                    }}
                  >
                    View Public Page
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
}

// Pet Details Tab Component
function PetDetailsTab({ pet }: { pet: PetWithLikes }) {
  return (
    <div className="space-y-6">
      {/* Images */}
      {pet.images && pet.images.length > 0 && (
        <div>
          <h3 className="font-semibold mb-2">Photos</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {pet.images.map((img, idx) => (
              <div key={idx} className="aspect-square rounded-lg overflow-hidden">
                <Image
                  src={img}
                  alt={`${pet.name} photo ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Basic Info */}
      <div>
        <h3 className="font-semibold mb-2">Basic Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Species</p>
            <p className="font-medium capitalize">{pet.species}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Breed</p>
            <p className="font-medium">{pet.breed}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Age</p>
            <p className="font-medium">{pet.age} months</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Gender</p>
            <p className="font-medium capitalize">{pet.gender}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Size</p>
            <p className="font-medium capitalize">{pet.size}</p>
          </div>
          {pet.color && (
            <div>
              <p className="text-sm text-gray-500">Color</p>
              <p className="font-medium">{pet.color}</p>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      {pet.description && (
        <div>
          <h3 className="font-semibold mb-2">Description</h3>
          <p className="text-gray-700">{pet.description}</p>
        </div>
      )}

      {/* Health & Care */}
      <div>
        <h3 className="font-semibold mb-2">Health & Care</h3>
        <div className="space-y-2">
          {pet.health_status && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Health Status:</span>
              <Chip size="sm" variant="flat">{pet.health_status}</Chip>
            </div>
          )}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Vaccinated:</span>
            <Chip size="sm" color={pet.vaccination_status ? "success" : "default"}>
              {pet.vaccination_status ? "Yes" : "No"}
            </Chip>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Neutered/Spayed:</span>
            <Chip size="sm" color={pet.is_neutered ? "success" : "default"}>
              {pet.is_neutered ? "Yes" : "No"}
            </Chip>
          </div>
        </div>
      </div>

      {/* Personality */}
      {(pet.good_with_kids !== undefined || pet.good_with_pets !== undefined || pet.energy_level) && (
        <div>
          <h3 className="font-semibold mb-2">Personality</h3>
          <div className="flex flex-wrap gap-2">
            {pet.good_with_kids && (
              <Chip size="sm" color="success">Good with Kids</Chip>
            )}
            {pet.good_with_pets && (
              <Chip size="sm" color="success">Good with Pets</Chip>
            )}
            {pet.energy_level && (
              <Chip size="sm" variant="flat">Energy: {pet.energy_level}</Chip>
            )}
            {pet.temperament && pet.temperament.length > 0 && (
              pet.temperament.map((trait, idx) => (
                <Chip key={idx} size="sm" variant="flat">{trait}</Chip>
              ))
            )}
          </div>
        </div>
      )}

      {/* Location */}
      {pet.location_address && (
        <div>
          <h3 className="font-semibold mb-2">Location</h3>
          <p className="text-gray-700 flex items-center gap-2">
            <MapPin size={16} />
            {pet.location_address}
          </p>
        </div>
      )}

      {/* Special Needs */}
      {pet.special_needs && (
        <div>
          <h3 className="font-semibold mb-2">Special Needs</h3>
          <p className="text-gray-700">{pet.special_needs}</p>
        </div>
      )}
    </div>
  );
}

// Likes Tab Component
function LikesTab({ pet, onMessage }: { pet: PetWithLikes; onMessage: (userId: string, petId: string) => void }) {
  if (pet.likeCount === 0) {
    return (
      <div className="text-center py-12">
        <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">No likes yet</p>
        <p className="text-sm text-gray-400 mt-2">Share your pet listing to get more visibility!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600 mb-4">
        {pet.likeCount} user{pet.likeCount !== 1 ? 's' : ''} liked {pet.name}
      </p>
      {pet.likes.map((like) => (
        <Card key={like.id} className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar
                src={like.user?.profile_image_url || undefined}
                name={like.user?.full_name || like.user?.email || "User"}
                size="md"
              />
              <div>
                <p className="font-semibold">
                  {like.user?.full_name || like.user?.email || "Unknown User"}
                </p>
                <p className="text-xs text-gray-500">
                  Liked {new Date(like.swiped_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <Button
              size="sm"
              color="primary"
              onPress={() => onMessage(like.user_id, pet.id)}
              startContent={<MessageCircle size={16} />}
            >
              Message
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}

// Matches Tab Component
function MatchesTab({ pet, onViewMatch }: { pet: PetWithLikes; onViewMatch: (matchId: string) => void }) {
  if (pet.matches.length === 0) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">No matches yet</p>
        <p className="text-sm text-gray-400 mt-2">Matches appear when you connect with interested adopters</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600 mb-4">
        {pet.matches.length} active match{pet.matches.length !== 1 ? 'es' : ''}
      </p>
      {pet.matches.map((match) => (
        <Card key={match.id} className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar
                src={match.adopter?.profile_image_url || undefined}
                name={match.adopter?.full_name || match.adopter?.email || "User"}
                size="md"
              />
              <div>
                <p className="font-semibold">
                  {match.adopter?.full_name || match.adopter?.email || "Unknown User"}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Chip size="sm" variant="flat" color="success">
                    {match.status}
                  </Chip>
                  <p className="text-xs text-gray-500">
                    Matched {new Date(match.matched_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
            <Button
              size="sm"
              color="primary"
              onPress={() => onViewMatch(match.id)}
              startContent={<MessageCircle size={16} />}
            >
              Open Chat
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}

