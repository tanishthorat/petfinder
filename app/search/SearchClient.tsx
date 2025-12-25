"use client";

import React from "react";
import PetCard from "@/components/PetCard";
import FilterSidebar from "@/components/FilterSidebar";
import { Button, Pagination } from "@nextui-org/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface SearchClientProps {
  pets: any[];
  pagination?: {
    count: number;
    total_count: number;
    current_page: number;
    total_pages: number;
  } | null;
}

export default function SearchClient({ pets, pagination }: SearchClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm p-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <Link href="/">
            <Button isIconOnly variant="light">
              <ArrowLeft size={20} />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Search Results</h1>
            {pagination && (
              <p className="text-sm text-gray-600">
                {pagination.count} pets found {pagination.total_count > pagination.count && `of ${pagination.total_count} total`}
              </p>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 flex flex-col md:flex-row gap-6">
        <FilterSidebar />
        
        <div className="flex-1">
          {pets.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {pets.map((pet: any) => (
                  <PetCard key={pet.id} pet={pet} />
                ))}
              </div>
              
              {/* Pagination */}
              {pagination && pagination.total_pages > 1 && (
                <div className="flex justify-center py-8">
                  <Pagination
                    total={pagination.total_pages}
                    page={pagination.current_page}
                    onChange={handlePageChange}
                    showControls
                    color="primary"
                  />
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <h2 className="text-2xl font-bold text-gray-900">No pets found matching your criteria.</h2>
              <p className="text-gray-600 mt-2">Try adjusting your filters or location.</p>
              <Button 
                color="primary" 
                className="mt-4"
                onPress={() => router.push('/search')}
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
