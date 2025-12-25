"use client";

import React, { useState } from "react";
import { Accordion, AccordionItem, Checkbox, CheckboxGroup, Button, Input, Select, SelectItem } from "@nextui-org/react";
import { useRouter, useSearchParams } from "next/navigation";
import { MapPin } from "lucide-react";

export default function FilterSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // State for filters
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || '');
  const [selectedAges, setSelectedAges] = useState<string[]>(searchParams.getAll('age'));
  const [selectedGender, setSelectedGender] = useState<string[]>(searchParams.get('gender') ? [searchParams.get('gender')!] : []);
  const [selectedSizes, setSelectedSizes] = useState<string[]>(searchParams.getAll('size'));
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [distance, setDistance] = useState(searchParams.get('distance') || '50');

  const applyFilters = () => {
    const params = new URLSearchParams();
    
    if (selectedType) params.set('type', selectedType);
    selectedAges.forEach(age => params.append('age', age));
    if (selectedGender.length > 0) params.set('gender', selectedGender[0]);
    selectedSizes.forEach(size => params.append('size', size));
    if (location) params.set('location', location);
    if (distance) params.set('distance', distance);
    
    router.push(`/search?${params.toString()}`);
  };

  const clearFilters = () => {
    setSelectedType('');
    setSelectedAges([]);
    setSelectedGender([]);
    setSelectedSizes([]);
    setLocation('');
    setDistance('50');
    router.push('/search');
  };

  return (
    <div className="w-full md:w-64 flex-shrink-0 p-4 bg-white rounded-lg shadow-sm h-fit sticky top-20">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Filters</h2>
        <Button size="sm" variant="light" onPress={clearFilters}>Clear</Button>
      </div>

      {/* Location Search */}
      <div className="mb-4 space-y-2">
        <Input
          label="Location"
          placeholder="ZIP code or city"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          startContent={<MapPin size={18} className="text-gray-400" />}
          size="sm"
        />
        <Select
          label="Distance"
          placeholder="Select distance"
          selectedKeys={[distance]}
          onChange={(e) => setDistance(e.target.value)}
          size="sm"
        >
          <SelectItem key="10" value="10">10 miles</SelectItem>
          <SelectItem key="25" value="25">25 miles</SelectItem>
          <SelectItem key="50" value="50">50 miles</SelectItem>
          <SelectItem key="100" value="100">100 miles</SelectItem>
          <SelectItem key="250" value="250">250 miles</SelectItem>
          <SelectItem key="500" value="500">500 miles</SelectItem>
        </Select>
      </div>
      
      <Accordion selectionMode="multiple" defaultExpandedKeys={["1", "2", "3", "4"]}>
        <AccordionItem key="1" aria-label="Pet Type" title="Pet Type">
          <Select
            label="Select type"
            placeholder="All types"
            selectedKeys={selectedType ? [selectedType] : []}
            onChange={(e) => setSelectedType(e.target.value)}
            size="sm"
          >
            <SelectItem key="" value="">All Types</SelectItem>
            <SelectItem key="dog" value="dog">Dogs</SelectItem>
            <SelectItem key="cat" value="cat">Cats</SelectItem>
            <SelectItem key="rabbit" value="rabbit">Rabbits</SelectItem>
            <SelectItem key="bird" value="bird">Birds</SelectItem>
            <SelectItem key="horse" value="horse">Horses</SelectItem>
            <SelectItem key="barnyard" value="barnyard">Barnyard</SelectItem>
          </Select>
        </AccordionItem>
        
        <AccordionItem key="2" aria-label="Age" title="Age">
          <CheckboxGroup
            value={selectedAges}
            onValueChange={setSelectedAges}
          >
            <Checkbox value="baby">Baby</Checkbox>
            <Checkbox value="young">Young</Checkbox>
            <Checkbox value="adult">Adult</Checkbox>
            <Checkbox value="senior">Senior</Checkbox>
          </CheckboxGroup>
        </AccordionItem>

        <AccordionItem key="3" aria-label="Gender" title="Gender">
          <CheckboxGroup
            value={selectedGender}
            onValueChange={setSelectedGender}
          >
            <Checkbox value="male">Male</Checkbox>
            <Checkbox value="female">Female</Checkbox>
          </CheckboxGroup>
        </AccordionItem>

        <AccordionItem key="4" aria-label="Size" title="Size">
          <CheckboxGroup
            value={selectedSizes}
            onValueChange={setSelectedSizes}
          >
            <Checkbox value="small">Small</Checkbox>
            <Checkbox value="medium">Medium</Checkbox>
            <Checkbox value="large">Large</Checkbox>
            <Checkbox value="xlarge">Extra Large</Checkbox>
          </CheckboxGroup>
        </AccordionItem>

        <AccordionItem key="5" aria-label="Good With" title="Good With">
          <div className="space-y-2">
            <Checkbox 
              isSelected={searchParams.get('good_with_children') === 'true'}
              onChange={(e) => {
                const params = new URLSearchParams(searchParams.toString());
                if (e.target.checked) {
                  params.set('good_with_children', 'true');
                } else {
                  params.delete('good_with_children');
                }
                router.push(`/search?${params.toString()}`);
              }}
            >
              Children
            </Checkbox>
            <Checkbox 
              isSelected={searchParams.get('good_with_dogs') === 'true'}
              onChange={(e) => {
                const params = new URLSearchParams(searchParams.toString());
                if (e.target.checked) {
                  params.set('good_with_dogs', 'true');
                } else {
                  params.delete('good_with_dogs');
                }
                router.push(`/search?${params.toString()}`);
              }}
            >
              Dogs
            </Checkbox>
            <Checkbox 
              isSelected={searchParams.get('good_with_cats') === 'true'}
              onChange={(e) => {
                const params = new URLSearchParams(searchParams.toString());
                if (e.target.checked) {
                  params.set('good_with_cats', 'true');
                } else {
                  params.delete('good_with_cats');
                }
                router.push(`/search?${params.toString()}`);
              }}
            >
              Cats
            </Checkbox>
          </div>
        </AccordionItem>
      </Accordion>

      <Button 
        color="primary" 
        className="w-full mt-4"
        onPress={applyFilters}
      >
        Apply Filters
      </Button>
    </div>
  );
}
