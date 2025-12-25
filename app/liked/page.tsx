import { getLikedPets } from "@/app/actions/pets";
import PetCard from "@/components/PetCard";

export default async function LikedPetsPage() {
  const likedPets = await getLikedPets();

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Liked Pets</h1>
        {likedPets.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600">You haven't liked any pets yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {likedPets.map((pet) => (
              <PetCard key={pet.id} pet={pet} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
