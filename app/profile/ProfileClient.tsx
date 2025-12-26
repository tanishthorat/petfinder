"use client";

import { useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Textarea,
  Avatar,
  Tabs,
  Tab,
  CheckboxGroup,
  Checkbox,
  Slider
} from "@nextui-org/react";
import { User, PawPrint, Dog, Cat, Bird, Rabbit } from "lucide-react";
import { updateUserProfile, setUserPreferences } from "@/app/actions/user";

export default function ProfileClient({ profile: initialProfile }: { profile: any }) {
  const [profile, setProfile] = useState(initialProfile);
  const [preferences, setPreferences] = useState(initialProfile.user_preferences?.[0] || {});
  const [isSaving, setIsSaving] = useState(false);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handlePreferencesChange = (key: string, value: unknown) => {
    setPreferences({ ...preferences, [key]: value });
  };
  
  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateUserProfile(profile);
      await setUserPreferences(preferences);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Failed to update profile", error);
      alert("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
      <Card className="max-w-4xl mx-auto shadow-lg">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar src={profile.profile_image_url} className="w-20 h-20" />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{profile.full_name}</h1>
              <p className="text-gray-600 capitalize">{profile.role}</p>
            </div>
          </div>
        </CardHeader>
        <CardBody>
          <Tabs aria-label="Profile Sections">
            <Tab key="profile" title={
              <div className="flex items-center space-x-2">
                <User />
                <span>Profile</span>
              </div>
            }>
              <div className="space-y-4 mt-4">
                <Input
                  label="Full Name"
                  name="full_name"
                  value={profile.full_name}
                  onChange={handleProfileChange}
                />
                <Input
                  label="Email"
                  value={profile.email}
                  isReadOnly
                />
                <Input
                  label="Phone"
                  name="phone"
                  value={profile.phone || ""}
                  onChange={handleProfileChange}
                />
                <Textarea
                  label="Bio"
                  name="bio"
                  value={profile.bio || ""}
                  onChange={handleProfileChange}
                />
              </div>
            </Tab>
            {profile.role === 'adopter' && (
              <Tab key="preferences" title={
                <div className="flex items-center space-x-2">
                  <PawPrint />
                  <span>Preferences</span>
                </div>
              }>
                <div className="space-y-6 mt-4">
                  <div>
                    <h3 className="font-semibold mb-2">Species</h3>
                    <CheckboxGroup
                      orientation="horizontal"
                      value={preferences.species || []}
                      onValueChange={(value) => handlePreferencesChange('species', value)}
                    >
                      <Checkbox value="dog"><Dog className="mr-1" /> Dog</Checkbox>
                      <Checkbox value="cat"><Cat className="mr-1" /> Cat</Checkbox>
                      <Checkbox value="bird"><Bird className="mr-1" /> Bird</Checkbox>
                      <Checkbox value="rabbit"><Rabbit className="mr-1" /> Rabbit</Checkbox>
                    </CheckboxGroup>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Age Range (Years)</h3>
                    <div className="flex items-center space-x-4">
                      <Input
                        type="number"
                        label="Min Age"
                        value={String(preferences.age_min || 1)}
                        onChange={(e) => handlePreferencesChange('age_min', Number(e.target.value))}
                      />
                      <Input
                        type="number"
                        label="Max Age"
                        value={String(preferences.age_max || 10)}
                        onChange={(e) => handlePreferencesChange('age_max', Number(e.target.value))}
                      />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Size</h3>
                    <CheckboxGroup
                      orientation="horizontal"
                      value={preferences.size || []}
                      onValueChange={(value: string[]) => handlePreferencesChange('size', value)}
                    >
                      <Checkbox value="small">Small</Checkbox>
                      <Checkbox value="medium">Medium</Checkbox>
                      <Checkbox value="large">Large</Checkbox>
                      <Checkbox value="extra_large">Extra Large</Checkbox>
                    </CheckboxGroup>
                  </div>
                   <div>
                     <Slider
                      label="Distance (km)"
                      step={10}
                      maxValue={200}
                      minValue={10}
                      value={preferences.distance_km || 50}
                      onChange={(value) => handlePreferencesChange('distance_km', value as number)}
                      className="max-w-md"
                    />
                  </div>
                </div>
              </Tab>
            )}
          </Tabs>
          
          <div className="mt-6 flex justify-end">
            <Button
              color="primary"
              onClick={handleSave}
              isLoading={isSaving}
              disabled={isSaving}
            >
              Save Changes
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
