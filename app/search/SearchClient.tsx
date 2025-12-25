"use client";

import React, { useState } from "react";
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Button, Input, Select, SelectItem, CheckboxGroup, Checkbox, Tabs, Tab } from "@nextui-org/react";
import PetCard from "@/components/PetCard";
import MapView from "@/components/MapView";
import { List, Map } from "lucide-react";

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
  const [filters, setFilters] = useState({
    species: "",
    breed: "",
    size: [] as string[],
  });
  
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    Object.entries(filters).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        params.delete(key);
        value.forEach(v => params.append(key, v));
      } else if (value) {
        params.set(key, String(value));
      } else {
        params.delete(key);
      }
    });
    router.push(`${pathname}?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Filters Sidebar */}
      <aside className="w-full md:w-80 lg:w-96 bg-white p-6 border-r">
        <h2 className="text-2xl font-bold mb-6">Filters</h2>
        <div className="space-y-6">
          <Input label="Breed" value={String(filters.breed)} onChange={e => handleFilterChange('breed', e.target.value)} />
          <Select label="Species" selectedKeys={filters.species ? [String(filters.species)] : []} onChange={e => handleFilterChange('species', e.target.value)}>
            <SelectItem key="dog" value="dog">Dog</SelectItem>
            <SelectItem key="cat" value="cat">Cat</SelectItem>
            <SelectItem key="bird" value="bird">Bird</SelectItem>
            <SelectItem key="rabbit" value="rabbit">Rabbit</SelectItem>
            <SelectItem key="other" value="other">Other</SelectItem>
          </Select>
          <CheckboxGroup label="Size" value={filters.size} onValueChange={value => handleFilterChange('size', value)}>
            <Checkbox value="small">Small</Checkbox>
            <Checkbox value="medium">Medium</Checkbox>
            <Checkbox value="large">Large</Checkbox>
            <Checkbox value="extra_large">Extra Large</Checkbox>
          </CheckboxGroup>
          <Button color="primary" fullWidth onClick={applyFilters}>Apply Filters</Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-900">Search Results</h1>
          {pagination && (
            <p className="text-sm text-gray-600">
              {pagination.count} pets found {pagination.total_count > pagination.count && `of ${pagination.total_count} total`}
            </p>
          )}
        </div>

        <Tabs>
          <Tab key="list" title={<div className="flex items-center space-x-2"><List /><span>List View</span></div>}>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6">
              {pets.map(pet => <PetCard key={pet.id} pet={pet} />)}
            </div>
          </Tab>
          <Tab key="map" title={<div className="flex items-center space-x-2"><Map /><span>Map View</span></div>}>
            <div className="mt-6 h-[70vh] rounded-lg overflow-hidden">
              <MapView pets={pets} />
            </div>
          </Tab>
        </Tabs>

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
      </main>
    </div>
  );
}
