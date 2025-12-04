"use client";

import React from "react";
import { Button, Input, Card, CardBody, CardFooter, Image } from "@nextui-org/react";
import Link from "next/link";
import { Search, Heart, MapPin, ArrowRight, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { mockPets } from "@/data/mock-pets";

export default function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-violet-50 via-white to-pink-50">
        <div className="absolute inset-0 z-0 opacity-30">
          <div className="absolute top-20 left-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-float" />
          <div className="absolute bottom-20 right-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-float delay-1000" />
        </div>

        <div className="container mx-auto px-6 z-10 grid md:grid-cols-2 gap-12 items-center">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-left"
          >
            <motion.div variants={itemVariants} className="inline-block px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-primary font-semibold mb-6 shadow-sm border border-purple-100">
              🚀 #1 Pet Adoption Platform
            </motion.div>
            <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-bold mb-6 text-indigo-600 leading-tight">
              Find your new <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                best friend
              </span>
            </motion.h1>
            <motion.p variants={itemVariants} className="text-xl text-gray-600 mb-8 max-w-lg">
              Browse pets from our network of over 11,500 shelters and rescues. 
              Connect with loving animals waiting for a home.
            </motion.p>
            
            <motion.div variants={itemVariants} className="bg-white p-2 rounded-2xl flex flex-col md:flex-row gap-2">
              
              <Button 
                as={Link}
                href="/swipe"
                color="primary" 
                size="lg" 
                className="font-semibold shadow-lg shadow-primary/30"
              >
                Start Swiping
              </Button>
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative hidden md:block"
          >
            <Image
              src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?q=80&w=900&auto=format&fit=crop"
              alt="Happy Dog"
              className="rounded-[3rem] shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500"
            />
            <div className="absolute z-10 -bottom-10 -left-10 bg-white p-6 rounded-2xl shadow-xl animate-bounce">
              <div className="flex items-center gap-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <CheckCircle className="text-green-600" />
                </div>
                <div>
                  <p className="font-bold text-gray-800">200+ Pets</p>
                  <p className="text-sm text-gray-500">Adopted this week</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Browse by Category</h2>
            <p className="text-gray-500">Find the perfect companion for your lifestyle</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "Dogs", icon: "🐕", color: "bg-orange-50 text-orange-600" },
              { name: "Cats", icon: "🐈", color: "bg-blue-50 text-blue-600" },
              { name: "Rabbits", icon: "🐇", color: "bg-green-50 text-green-600" },
              { name: "Birds", icon: "🦜", color: "bg-yellow-50 text-yellow-600" }
            ].map((category) => (
              <Link key={category.name} href={`/search?type=${category.name.toLowerCase()}`}>
                <motion.div 
                  whileHover={{ y: -10 }}
                  className="bg-white border border-gray-100 p-8 rounded-3xl text-center hover:shadow-xl transition-all cursor-pointer group"
                >
                  <div className={`w-20 h-20 mx-auto ${category.color} rounded-full flex items-center justify-center text-4xl mb-6 group-hover:scale-110 transition-transform`}>
                    {category.icon}
                  </div>
                  <h3 className="font-bold text-xl text-gray-800">{category.name}</h3>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Pets */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="container mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Pets</h2>
              <p className="text-gray-500">Meet some of our newest friends looking for a home</p>
            </div>
            <Link href="/swipe">
              <Button variant="light" color="primary" endContent={<ArrowRight size={16} />}>
                View All
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {mockPets.slice(0, 3).map((pet) => (
              <Card key={pet.id} className="border-none shadow-lg hover:shadow-2xl transition-shadow">
                <CardBody className="p-0 overflow-hidden">
                  <Image
                    src={pet.photos[0]?.medium || "https://via.placeholder.com/400x300"}
                    alt={pet.name}
                    className="w-full h-64 object-cover hover:scale-105 transition-transform duration-500"
                    radius="none"
                  />
                  <div className="absolute top-4 right-4 z-10">
                    <Button isIconOnly radius="full" className="bg-white/80 backdrop-blur-sm text-red-500 shadow-sm">
                      <Heart size={20} />
                    </Button>
                  </div>
                </CardBody>
                <CardFooter className="flex flex-col items-start p-6 bg-white">
                  <div className="flex justify-between w-full mb-2">
                    <h3 className="text-xl font-bold">{pet.name}</h3>
                    <span className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-xs font-semibold">
                      {pet.age}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm mb-4 flex items-center gap-1">
                    <MapPin size={14} /> {pet.contact.address.city}, {pet.contact.address.state}
                  </p>
                  <div className="flex gap-2 w-full">
                    <span className="px-3 py-1 bg-gray-100 rounded-lg text-xs text-gray-600">{pet.gender}</span>
                    <span className="px-3 py-1 bg-gray-100 rounded-lg text-xs text-gray-600">{pet.breeds.primary}</span>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 z-0" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 z-0" />
        
        <div className="container mx-auto relative z-10 text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to meet your match?</h2>
          <p className="text-xl opacity-90 mb-10 max-w-2xl mx-auto">
            Join thousands of happy pet parents who found their perfect companion through PetPro.
          </p>
          <div className="flex justify-center gap-4">
            <Button 
              as={Link}
              href="/swipe"
              size="lg" 
              className="bg-white text-violet-600 font-bold px-8 py-6 shadow-xl hover:scale-105 transition-transform"
            >
              Start Swiping
            </Button>
            <Button 
              as={Link}
              href="/sign-up"
              variant="bordered" 
              size="lg" 
              className="text-white border-white font-bold px-8 py-6 hover:bg-white/10"
            >
              Create Account
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
