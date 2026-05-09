"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useGetCategoriesQuery } from "@/store/categoryApi";
import { Skeleton } from "@/components/ui/skeleton";

export function CategoryGrid() {
  const { data: result, isLoading } = useGetCategoriesQuery({ isActive: true });
  const allCategories = result?.data || [];

  const eyeglassesCat = allCategories.find(
    (cat) =>
      cat.slug === "eyeglasses" || cat.name.toLowerCase() === "eyeglasses",
  );
  const sunglassesCat = allCategories.find(
    (cat) =>
      cat.slug === "sunglasses" || cat.name.toLowerCase() === "sunglasses",
  );

  const sections = [
    {
      title: "Eyeglasses",
      items: [
        {
          name: "Men",
          image: "/man-with-eyeglass.jpg",
          link: eyeglassesCat
            ? `/search?category=${eyeglassesCat.id}&q=men`
            : "/search?q=men+eyeglasses",
        },
        {
          name: "Women",
          image: "/woman-with-eyeglass.jpg",
          link: eyeglassesCat
            ? `/search?category=${eyeglassesCat.id}&q=women`
            : "/search?q=women+eyeglasses",
        },
        {
          name: "Kids",
          image: "/kid-with-eyeglass.jpg",
          link: eyeglassesCat
            ? `/search?category=${eyeglassesCat.id}&q=kids`
            : "/search?q=kids+eyeglasses",
        },
      ],
    },
    {
      title: "Sunglasses",
      items: [
        {
          name: "Men",
          image: "/man-with-sunglass.jpg",
          link: sunglassesCat
            ? `/search?category=${sunglassesCat.id}&q=men`
            : "/search?q=men+sunglasses",
        },
        {
          name: "Women",
          image: "/woman-with-sunglass.jpg",
          link: sunglassesCat
            ? `/search?category=${sunglassesCat.id}&q=women`
            : "/search?q=women+sunglasses",
        },
        {
          name: "Kids",
          image: "/kid-with-sunglass.jpg",
          link: sunglassesCat
            ? `/search?category=${sunglassesCat.id}&q=kids`
            : "/search?q=kids+sunglasses",
        },
      ],
    },
  ];

  if (isLoading) {
    return (
      <section className="container px-6 md:px-12 mx-auto max-w-[1600px] flex flex-col gap-12">
        {sections.map((section, idx) => (
          <div key={idx} className="flex flex-col gap-6">
            <div className="flex flex-col">
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-12 w-64" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Skeleton className="h-[250px] md:h-[350px] rounded-3xl" />
              <Skeleton className="h-[250px] md:h-[350px] rounded-3xl" />
              <Skeleton className="h-[250px] md:h-[350px] rounded-3xl" />
            </div>
          </div>
        ))}
      </section>
    );
  }

  return (
    <section className="container px-6 md:px-12 mx-auto max-w-[1600px] flex flex-col gap-16">
      {sections.map((section, idx) => (
        <div key={idx} className="flex flex-col">
          <div className="flex flex-col mb-8">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/60 mb-2">
              Collection
            </p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase">
              {section.title}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {section.items.map((item, index) => (
              <Link
                key={index}
                href={item.link}
                className="group relative h-[250px] md:h-[350px] rounded-3xl overflow-hidden bg-muted flex items-end p-6 border border-primary/10 hover:shadow-2xl transition-all duration-500"
              >
                <div className="absolute inset-0">
                  <Image
                    src={item.image}
                    alt={`${section.title} for ${item.name}`}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />
                </div>

                <div className="relative z-10 w-full flex justify-between items-center">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-foreground/70">
                      Explore
                    </span>
                    <h3 className="text-2xl md:text-3xl font-black uppercase text-white tracking-tighter mt-1">
                      {item.name}
                    </h3>
                  </div>

                  <div className="h-10 w-10 rounded-full bg-white text-black flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
