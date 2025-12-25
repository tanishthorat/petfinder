"use client";

import React, { useState } from "react";
import { Button, Avatar, Card, CardBody, Switch, Slider, RadioGroup, Radio, Input } from "@nextui-org/react";
import { ArrowLeft, Settings, Camera, LogOut, Bell, Shield } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const [notifications, setNotifications] = useState(true);
  const [distance, setDistance] = useState(50);
  const [ageRange, setAgeRange] = useState([1, 10]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white p-4 shadow-sm sticky top-0 z-10 flex justify-between items-center">
        <Link href="/">
          <Button isIconOnly variant="light" radius="full">
            <ArrowLeft size={24} />
          </Button>
        </Link>
        <h1 className="text-xl font-bold">My Profile</h1>
        <Button isIconOnly variant="light" radius="full">
          <Settings size={24} />
        </Button>
      </header>

      <main className="p-4 space-y-6">
        {/* Profile Card */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            <Avatar 
              src="https://i.pravatar.cc/150?u=a042581f4e29026704d" 
              className="w-32 h-32 text-large border-4 border-white shadow-lg" 
            />
            <Button 
              isIconOnly 
              size="sm" 
              color="primary" 
              radius="full" 
              className="absolute bottom-0 right-0 border-2 border-white bg-pink-500"
            >
              <Camera size={16} />
            </Button>
          </div>
          <h2 className="text-2xl font-bold mt-4 text-gray-900">Alex Johnson</h2>
          <p className="text-gray-600">New York, NY</p>
        </div>

        {/* Premium Banner */}
        <Card className="bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg border-none">
          <CardBody className="flex flex-row justify-between items-center p-6">
            <div>
              <h3 className="text-lg font-bold">PetFinder Pro+</h3>
              <p className="text-sm opacity-90">Get unlimited swipes & see who likes you!</p>
            </div>
            <Button className="bg-white text-pink-600 font-bold shadow-sm" radius="full" size="sm">
              Upgrade
            </Button>
          </CardBody>
        </Card>

        {/* Discovery Settings */}
        <section>
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3 px-1">Discovery Settings</h3>
          <Card className="shadow-sm">
            <CardBody className="space-y-6 p-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-semibold text-gray-900">Maximum Distance</span>
                  <span className="text-gray-600">{distance} km</span>
                </div>
                <Slider 
                  aria-label="Distance"
                  size="sm"
                  color="foreground"
                  step={1} 
                  maxValue={100} 
                  minValue={1} 
                  value={distance} 
                  onChange={(v) => setDistance(v as number)}
                  className="max-w-md"
                />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-semibold text-gray-900">Age Range</span>
                  <span className="text-gray-600">{Array.isArray(ageRange) ? `${ageRange[0]} - ${ageRange[1]}` : ageRange} yrs</span>
                </div>
                <Slider 
                  aria-label="Age Range"
                  size="sm"
                  color="foreground"
                  step={1} 
                  maxValue={20} 
                  minValue={0} 
                  value={ageRange} 
                  onChange={(v) => setAgeRange(v as number[])}
                  className="max-w-md"
                />
              </div>

              <div>
                <span className="font-semibold block mb-2 text-gray-900">Show Me</span>
                <RadioGroup orientation="horizontal" defaultValue="all" size="sm">
                  <Radio value="dogs">Dogs</Radio>
                  <Radio value="cats">Cats</Radio>
                  <Radio value="all">Everyone</Radio>
                </RadioGroup>
              </div>
            </CardBody>
          </Card>
        </section>

        {/* App Settings */}
        <section>
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3 px-1">App Settings</h3>
          <Card className="shadow-sm">
            <CardBody className="p-0 divide-y">
              <div className="flex justify-between items-center p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-lg text-red-500">
                    <Bell size={20} />
                  </div>
                  <span className="font-medium">Notifications</span>
                </div>
                <Switch isSelected={notifications} onValueChange={setNotifications} color="danger" size="sm" />
              </div>
              
              <div className="flex justify-between items-center p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg text-blue-500">
                    <Shield size={20} />
                  </div>
                  <span className="font-medium">Privacy & Security</span>
                </div>
                <ArrowLeft size={16} className="rotate-180 text-gray-400" />
              </div>
            </CardBody>
          </Card>
        </section>

        <Button 
          variant="flat" 
          color="danger" 
          className="w-full font-bold" 
          startContent={<LogOut size={18} />}
        >
          Log Out
        </Button>

        <div className="text-center text-xs text-gray-400 pb-4">
          Version 1.0.0 • PetFinder Pro
        </div>
      </main>
    </div>
  );
}
