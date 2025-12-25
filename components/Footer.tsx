"use client";

import React from "react";
import { Link } from "@nextui-org/react";
import { Facebook, Twitter, Instagram, Github, Heart } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="text-secondary fill-secondary" size={24} />
              <span className="text-2xl font-bold text-white">PetPro</span>
            </div>
            <p className="text-gray-300 mb-6">
              Connecting pets with loving homes. Find your new best friend today.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="text-gray-300 hover:text-white transition-colors"><Facebook size={20} /></Link>
              <Link href="#" className="text-gray-300 hover:text-white transition-colors"><Twitter size={20} /></Link>
              <Link href="#" className="text-gray-300 hover:text-white transition-colors"><Instagram size={20} /></Link>
              <Link href="#" className="text-gray-300 hover:text-white transition-colors"><Github size={20} /></Link>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6 text-white">Discover</h4>
            <ul className="space-y-3">
              <li><Link href="/search?type=dog" className="text-gray-300 hover:text-white">Dogs</Link></li>
              <li><Link href="/search?type=cat" className="text-gray-300 hover:text-white">Cats</Link></li>
              <li><Link href="/search?type=rabbit" className="text-gray-300 hover:text-white">Rabbits</Link></li>
              <li><Link href="/search?type=bird" className="text-gray-300 hover:text-white">Birds</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6 text-white">Resources</h4>
            <ul className="space-y-3">
              <li><Link href="/articles" className="text-gray-300 hover:text-white">Pet Care Articles</Link></li>
              <li><Link href="/shelters" className="text-gray-300 hover:text-white">Shelters & Rescues</Link></li>
              <li><Link href="/success-stories" className="text-gray-300 hover:text-white">Success Stories</Link></li>
              <li><Link href="/faq" className="text-gray-300 hover:text-white">FAQs</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6 text-white">Contact</h4>
            <ul className="space-y-3">
              <li className="text-gray-300">1-800-PET-PROS</li>
              <li className="text-gray-300">support@petpro.com</li>
              <li className="text-gray-300">123 Puppy Lane, Dogville, CA 90210</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-300 text-sm">
            © {new Date().getFullYear()} PetPro. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <Link href="/privacy" className="text-gray-300 hover:text-white">Privacy Policy</Link>
            <Link href="/terms" className="text-gray-300 hover:text-white">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
