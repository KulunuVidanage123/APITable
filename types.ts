// src/types.ts

export type Product = {
  id: string; // Changed from number to string to match MongoDB _id
  title: string;
  brand: string;
  price: number;
  category: string;
  stock: number;
  rating: number;
  description?: string;
  imageUrl: string;
};

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  role: string;
  imageUrl: string; 
};