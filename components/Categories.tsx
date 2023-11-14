"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";

interface Category {
  _id: string;
  name: string;
}

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState("");

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

  const createCategory = async () => {
    if (!newCategoryName.trim()) return;

    try {
      const response = await fetch("http://127.0.0.1:3000/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategoryName }),
      });

      if (!response.ok) {
        console.error("Error creating category:", response.statusText);
        return;
      }

      const newCategory = await response.json();
      setCategories([...categories, newCategory]);
      setNewCategoryName("");
    } catch (error) {
      console.error("Error adding new category:", error);
    }
  };

  const deleteCategory = async (categoryId: string) => {
    try {
      const response = await fetch("http://127.0.0.1:3000/api/categories", {
        // Adjust the endpoint as necessary
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categoryId }),
      });

      if (!response.ok) {
        console.error("Error deleting category:", response.statusText);
        return;
      }

      setCategories(
        categories.filter((category) => category._id !== categoryId)
      );
    } catch (error) {
      console.error("Error in deleteCategory function:", error);
    }
  };

  return (
    <>
      <h1 className="font-bold text-2xl flex justify-center m-4">Categories</h1>

      <div className="my-4 border-2 border-solid rounded-xl flex flex-col gap-2 mx-14 p-4 ">
        <input
          type="text"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          placeholder="Category Name"
          className="bg-black"
        />
        <button onClick={createCategory} className="text-yellow-300">
          Create Category
        </button>
      </div>

      {categories.map((category) => (
        <main className="m-6 cursor-pointer flex flex-col" key={category._id}>
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
          <button
            onClick={() => deleteCategory(category._id)}
            className="text-red-500"
          >
            Delete Category
          </button>
        </main>
      ))}
    </>
  );
};

export default Categories;
