export interface Pet {
  id: number;
  organization_id: string;
  url: string;
  type: string;
  species: string;
  breeds: {
    primary: string;
    secondary: string | null;
    mixed: boolean;
    unknown: boolean;
  };
  colors: {
    primary: string | null;
    secondary: string | null;
    tertiary: string | null;
  };
  age: string; // "Baby", "Young", "Adult", "Senior"
  gender: string;
  size: string; // "Small", "Medium", "Large", "X-Large"
  coat: string | null;
  attributes: {
    spayed_neutered: boolean;
    house_trained: boolean;
    declawed: boolean | null;
    special_needs: boolean;
    shots_current: boolean;
  };
  environment: {
    children: boolean | null;
    dogs: boolean | null;
    cats: boolean | null;
  };
  tags: string[];
  name: string;
  description: string | null;
  photos: {
    small: string;
    medium: string;
    large: string;
    full: string;
  }[];
  primary_photo_cropped: {
    small: string;
    medium: string;
    large: string;
    full: string;
  } | null;
  videos: any[];
  status: string;
  published_at: string;
  contact: {
    email: string | null;
    phone: string | null;
    address: {
      address1: string | null;
      address2: string | null;
      city: string;
      state: string;
      postcode: string;
      country: string;
    };
  };
  _links: {
    self: { href: string };
    type: { href: string };
    organization: { href: string };
  };
}
