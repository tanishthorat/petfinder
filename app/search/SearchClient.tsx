"use client";

import React from "react";
import PetCard from "@/components/PetCard";
import FilterSidebar from "@/components/FilterSidebar";
import { Button } from "@nextui-org/react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface SearchClientProps {
  pets: any[];
}

export default function SearchClient({ pets }: SearchClientProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm p-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <Link href="/">
            <Button isIconOnly variant="light">
              <ArrowLeft size={20} />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Search Results</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 flex flex-col md:flex-row gap-6">
        <FilterSidebar />
        
        <div className="flex-1">
          {pets.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {pets.map((pet: any) => (
                <PetCard key={pet.id} pet={pet} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <h2 className="text-2xl font-bold text-gray-400">No pets found matching your criteria.</h2>
              <p className="text-gray-500 mt-2">Try adjusting your filters.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
