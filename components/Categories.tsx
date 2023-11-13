"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";

interface Category {
  _id: string;
  name: string;
}

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://127.0.0.1:3000/api/categories");
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        setCategories(data.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <>
      <h1 className="font-bold text-2xl flex justify-center">Categories</h1>
      {categories.map((category) => (
        <main className="m-6 cursor-pointer" key={category._id}>
          <Link
            href={{
              pathname: "/workouts",
              query: { categoryId: category._id },
            }}
          >
            <section className="flex flex-col justify-center m-4">
              <div className="flex flex-col justify-center items-center border-2 border-solid border-white p-4 rounded-xl m-4">
                <h2 className="font-bold text-xl">{category.name}</h2>
              </div>
            </section>
          </Link>
        </main>
      ))}
    </>
  );
};

export default Categories;
