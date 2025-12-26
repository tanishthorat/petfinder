"use client";

import React from "react";
import Image from "next/image";
import { Button, Card, CardBody, CardFooter, Image as NextUIImage } from "@nextui-org/react";
import Link from "next/link";
import { MapPin, ArrowRight, Star } from "lucide-react";
import { motion } from "framer-motion";
import { mockPets } from "@/data/mock-pets";

export default function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1] as const // Custom cubic-bezier easing
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gray-50 pt-20 lg:pt-0">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-40 left-10 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
          <div className="absolute bottom-32 right-10 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
        </div>

        <div className="max-w-screen-xl mx-auto z-10 grid lg:grid-cols-2 gap-40 items-center">
          {/* Left Content */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-left py-12 lg:h-screen lg:flex lg:flex-col lg:justify-center"
          >
            {/* Badge */}
            <motion.div variants={itemVariants} className="inline-block max-w-fit mb-8">
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-purple-100 text-purple-700 font-bold text-xs tracking-widest uppercase border border-purple-200 shadow-sm">
                ✨ #1 Pet Adoption Platform
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1 
              variants={itemVariants}
              className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-gray-900 leading-[1.1] mb-6 tracking-tight"
            >
              Happy Pets, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-purple-400">
                Happy You.
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p 
              variants={itemVariants}
              className="text-lg text-gray-500 mb-10 leading-relaxed max-w-lg"
            >
              Connect with thousands of pets waiting for a home. We provide smart tools, trusted services, and a community that truly cares about animal welfare.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 mb-12"
            >
              <Button 
                as={Link}
                href="/swipe"
                className="bg-purple-600 text-white font-bold text-lg px-8 py-4 rounded-2xl shadow-xl shadow-purple-200 hover:bg-purple-700 hover:-translate-y-1 transition-all h-auto"
              >
                Get Started Now
                <ArrowRight size={20} />
              </Button>
              
              <Button 
                as={Link}
                href="/search"
                className="bg-white text-gray-700 font-bold text-lg px-8 py-4 rounded-2xl border border-gray-200 hover:border-purple-200 hover:bg-purple-50 transition-all h-auto group"
              >
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors text-purple-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
                How it Works
              </Button>
            </motion.div>

            {/* Social Proof */}
            <motion.div 
              variants={itemVariants}
              className="flex items-center gap-4"
            >
              <div className="flex -space-x-3">
                <Image src="https://i.pravatar.cc/100?img=33" className="w-10 h-10 rounded-full border-2 border-white" alt="user" width={40} height={40} />
                <Image src="https://i.pravatar.cc/100?img=47" className="w-10 h-10 rounded-full border-2 border-white" alt="user" width={40} height={40} />
                <Image src="https://i.pravatar.cc/100?img=12" className="w-10 h-10 rounded-full border-2 border-white" alt="user" width={40} height={40} />
                <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">+2k</div>
              </div>
              <div className="h-8 w-px bg-gray-300 mx-2" />
              <div>
                <div className="flex text-yellow-400 text-sm">
                  ★★★★★
                </div>
                <p className="text-xs text-gray-500 font-medium">Trusted by owners</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Image Section */}
          <div className="hidden lg:block lg:absolute lg:right-0 lg:top-0 lg:bottom-0 lg:w-1/2 lg:h-full pointer-events-none">
            <div className="relative h-full">
              {/* Purple Gradient Background */}
              <div className="absolute top-0 right-0 w-[90%] h-full bg-purple-600 rounded-bl-[100px] z-0 overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(white 2px, transparent 2px)', backgroundSize: '30px 30px'}} />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50" />
                <div className="absolute top-20 right-20 w-40 h-40 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-50" />
              </div>

              {/* Pet Image */}
              <div className="absolute bottom-0 -left-16 z-10 h-[90vh] w-auto flex items-end pointer-events-auto">
                <Image 
                  src="https://images.unsplash.com/photo-1601979031925-424e53b6caaa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Happy Golden Retriever"
                  width={400}
                  height={600}
                  className="h-full w-auto object-contain drop-shadow-2xl"
                  priority
                />
              </div>

              {/* Floating Card 1 - Status */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="absolute top-1/2 -left-0 z-20 pointer-events-auto animate-bounce"
                style={{animationDuration: '3s'}}
              >
                <div className="bg-white/90 backdrop-blur-md p-4 pr-6 rounded-2xl shadow-xl border border-white/50">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-2xl">
                      🥎
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 text-sm">Status</p>
                      <p className="text-xs text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded-full mt-0.5">
                        Ready to Adopt
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Floating Card 2 - Testimonial */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="absolute bottom-32 right-20 z-20 pointer-events-auto"
              >
                <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/50">
                  <div className="flex items-center gap-3">
                    <Image src="https://i.pravatar.cc/100?img=12" className="w-10 h-10 rounded-full" alt="user" width={40} height={40} />
                    <div>
                      <p className="font-bold text-gray-800 text-xs">Adam W.</p>
                      <p className="text-[10px] text-gray-500">&quot;Best decision ever!&quot;</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Pets Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
              Meet Our Featured Pets
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover amazing pets waiting for their forever homes
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {mockPets.slice(0, 3).map((pet, idx) => (
              <motion.div
                key={pet.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="group cursor-pointer"
              >
                <Link href={`/pet/${pet.id}`}>
                  <Card className="border-none shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 h-full">
                    <CardBody className="p-0 overflow-hidden relative h-64">
                      <NextUIImage
                        src={pet.primary_photo_cropped?.medium || pet.photos[0]?.medium || "https://via.placeholder.com/400x300"}
                        alt={pet.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        radius="none"
                      />
                      <Button 
                        isIconOnly 
                        className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur-sm text-red-500 hover:bg-white shadow-lg"
                        radius="full"
                      >
                        ♡
                      </Button>
                    </CardBody>
                    <CardFooter className="flex flex-col items-start p-6 bg-white">
                      <div className="flex justify-between w-full mb-3">
                        <h3 className="text-xl font-bold text-gray-900">{pet.name}</h3>
                        <span className="px-4 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                          {pet.age}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm font-medium mb-3">{pet.breeds.primary}</p>
                      <div className="flex items-center gap-2 text-gray-500 text-xs">
                        <MapPin size={14} />
                        <span>{pet.contact.address.city}, {pet.contact.address.state}</span>
                      </div>
                    </CardFooter>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Button
              as={Link}
              href="/search"
              className="bg-white text-gray-900 border-2 border-gray-200 font-bold px-8 py-6 rounded-2xl hover:border-purple-400 hover:bg-purple-50 transition-all hover:scale-105 h-auto"
              size="lg"
            >
              Explore All Pets
              <ArrowRight size={20} />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 relative overflow-hidden bg-gradient-to-r from-purple-600 to-purple-700">
        <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(white 2px, transparent 2px)', backgroundSize: '30px 30px'}} />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto relative z-10 text-center text-white"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
            Ready to Change a Pe&apos;s Life?
          </h2>
          <p className="text-xl opacity-90 mb-10 leading-relaxed">
            Join thousands of happy pet parents who found their perfect companion through PetPro. Start your journey today!
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              as={Link}
              href="/swipe"
              className="bg-white text-purple-600 font-bold text-lg px-8 py-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:scale-105 h-auto"
            >
              Start Swiping
            </Button>
            <Button 
              as={Link}
              href="/search"
              className="bg-purple-500 text-white font-bold text-lg px-8 py-6 rounded-2xl border-2 border-white hover:bg-purple-600 transition-all hover:scale-105 h-auto"
            >
              Browse Pets
            </Button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
