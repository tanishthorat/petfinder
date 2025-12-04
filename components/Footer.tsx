"use client";

import React from "react";
import { Link } from "@nextui-org/react";
import { Facebook, Twitter, Instagram, Github, Heart } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-gray-50 pt-16 pb-8 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="text-secondary fill-secondary" size={24} />
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                PetPro
              </span>
            </div>
            <p className="text-gray-500 mb-6">
              Connecting pets with loving homes. Find your new best friend today.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="text-gray-400 hover:text-primary transition-colors"><Facebook size={20} /></Link>
              <Link href="#" className="text-gray-400 hover:text-primary transition-colors"><Twitter size={20} /></Link>
              <Link href="#" className="text-gray-400 hover:text-primary transition-colors"><Instagram size={20} /></Link>
              <Link href="#" className="text-gray-400 hover:text-primary transition-colors"><Github size={20} /></Link>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">Discover</h4>
            <ul className="space-y-3">
              <li><Link href="/search?type=dog" className="text-gray-600 hover:text-primary">Dogs</Link></li>
              <li><Link href="/search?type=cat" className="text-gray-600 hover:text-primary">Cats</Link></li>
              <li><Link href="/search?type=rabbit" className="text-gray-600 hover:text-primary">Rabbits</Link></li>
              <li><Link href="/search?type=bird" className="text-gray-600 hover:text-primary">Birds</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">Resources</h4>
            <ul className="space-y-3">
              <li><Link href="/articles" className="text-gray-600 hover:text-primary">Pet Care Articles</Link></li>
              <li><Link href="/shelters" className="text-gray-600 hover:text-primary">Shelters & Rescues</Link></li>
              <li><Link href="/success-stories" className="text-gray-600 hover:text-primary">Success Stories</Link></li>
              <li><Link href="/faq" className="text-gray-600 hover:text-primary">FAQs</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">Contact</h4>
            <ul className="space-y-3">
              <li className="text-gray-600">1-800-PET-PROS</li>
              <li className="text-gray-600">support@petpro.com</li>
              <li className="text-gray-600">123 Puppy Lane, Dogville, CA 90210</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} PetPro. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <Link href="/privacy" className="text-gray-500 hover:text-primary">Privacy Policy</Link>
            <Link href="/terms" className="text-gray-500 hover:text-primary">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
