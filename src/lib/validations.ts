import { z } from "zod";

export const signUpSchema = z.object({
  fullName: z.string().min(3),
  email: z.string().email(),
  universityId: z.coerce.number(),
  universityCard: z.string().nonempty("University Card is required"),
  password: z.string().min(8)
})

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

export const bookSchema = z.object({
  title: z.string().trim().min(2).max(100),
  description: z.string().trim().min(10).max(1000),
  author: z.string().trim().min(2).max(100),
  genre: z.string().trim().min(2).max(50),
  rating: z.number().min(1).max(5),
  totalCopies: z.coerce.number().int().positive().lte(10000),
  coverUrl: z.string().nonempty(),
  coverColor: z.string().trim().regex(/^#[0-9A-F]{6}$/i),
  videoUrl: z.string().nonempty(),
  summary: z.string().trim().min(10)
})

export const categorySchema = z.object({
  title: z.string().trim().min(2).max(100),
  use_yn: z.boolean(),
  eng_title: z.string().trim().min(2).max(100),
  display: z.string()
})
export const categoryOptionSchema = z.object({
  title: z.string().trim().min(2).max(100),
  use_yn: z.boolean(),
  category_id: z.number(),
  type: z.string().trim().min(2).max(100),
  content: z.string().trim().min(0),
})

export const productSchema = z.object({
  name: z.string().trim(),
  eng_name: z.string().trim(),
  description: z.string().trim(),
  link: z.string().trim(),
  image: z.string().trim(),
  price: z.number(),
  price_sale: z.number(),
  is_delete: z.boolean(),
  category_id: z.string(),
})

export const productOptionSchema = z.object({
  product_id: z.number(),
  category_option_id: z.number(),
  price: z.number(),
  price_sale: z.number(),
  content: z.string(),
  is_delete: z.boolean(),
  is_view: z.boolean(),
})

export const customerSchema = z.object({
  email: z.string(),
  password: z.string(),
  address: z.string(),
  name: z.string(),
})

export const departSchema = z.object({
  depart: z.string(),
  name: z.string(),
  tel: z.string(),
  fare_type: z.string(),
  box_type: z.string(),
  fare: z.coerce.number(),
  fare_add: z.coerce.number(),
})