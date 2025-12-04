"use client";

import React from "react";
import { Accordion, AccordionItem, Checkbox, CheckboxGroup, Slider, Button } from "@nextui-org/react";
import { useRouter, useSearchParams } from "next/navigation";

export default function FilterSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleFilterChange = (key: string, value: string | string[]) => {
    const params = new URLSearchParams(searchParams.toString());
    if (Array.isArray(value)) {
      params.delete(key);
      value.forEach(v => params.append(key, v));
    } else {
      params.set(key, value);
    }
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="w-full md:w-64 flex-shrink-0 p-4 bg-white rounded-lg shadow-sm h-fit">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Filters</h2>
        <Button size="sm" variant="light" onPress={() => router.push('/search')}>Clear</Button>
      </div>
      
      <Accordion selectionMode="multiple" defaultExpandedKeys={["1", "2", "3"]}>
        <AccordionItem key="1" aria-label="Breed" title="Breed">
          <CheckboxGroup>
            <Checkbox value="labrador">Labrador Retriever</Checkbox>
            <Checkbox value="german-shepherd">German Shepherd</Checkbox>
            <Checkbox value="golden-retriever">Golden Retriever</Checkbox>
            {/* Add more breeds dynamically if possible */}
          </CheckboxGroup>
        </AccordionItem>
        
        <AccordionItem key="2" aria-label="Age" title="Age">
          <CheckboxGroup>
            <Checkbox value="baby">Puppy/Kitten</Checkbox>
            <Checkbox value="young">Young</Checkbox>
            <Checkbox value="adult">Adult</Checkbox>
            <Checkbox value="senior">Senior</Checkbox>
          </CheckboxGroup>
        </AccordionItem>

        <AccordionItem key="3" aria-label="Gender" title="Gender">
          <CheckboxGroup>
            <Checkbox value="male">Male</Checkbox>
            <Checkbox value="female">Female</Checkbox>
          </CheckboxGroup>
        </AccordionItem>

        <AccordionItem key="4" aria-label="Size" title="Size">
          <CheckboxGroup>
            <Checkbox value="small">Small</Checkbox>
            <Checkbox value="medium">Medium</Checkbox>
            <Checkbox value="large">Large</Checkbox>
            <Checkbox value="xlarge">Extra Large</Checkbox>
          </CheckboxGroup>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
