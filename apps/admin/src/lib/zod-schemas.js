import { z } from "zod";
export const ProductFormSchema = z.object({
    name: z.string().min(1, "Name is required").trim(),
    slug: z.string().min(1, "Slug is required").lowercase().trim(),
    description: z.string().min(1, "Description is required"),
    brand: z.string().min(1, "Brand is required").trim(),
    sku: z.string().min(1, "SKU is required").toUpperCase().trim(),
    category: z.string().min(1, "Category is required"), // ObjectId as string
    type: z.enum([
      'eyeglasses', 'sunglasses', 'computer-glasses', 'blue-light-glasses', 
      'reading-glasses', 'sports-glasses', 'contact-lenses', 'accessories'
    ]),
    
    // New Categorisation Arrays
    gender: z.array(z.string()).default(['unisex']),
    styles: z.array(z.string()).default([]),
    usage: z.array(z.string()).default([]),
    faceShapes: z.array(z.string()).default([]),
    materials: z.array(z.string()).default([]),
    colors: z.array(z.string()).default([]),
    lensFeatures: z.array(z.string()).default([]),
    
    // New Categorisation Single Enums
    frameType: z.enum(['full-rim', 'half-rim', 'rimless']).optional().nullable(),
    fit: z.enum(['small', 'medium', 'large', 'narrow', 'wide']).optional().nullable(),

    // Legacy or mappings
    frameShape: z.string().optional(),
    frameMaterial: z.string().optional(),
    frameColor: z.string().optional(),
    lensType: z.string().optional(),
    lensCoating: z.array(z.string()).default([]),

    size: z.object({
        lensWidth: z.coerce.number().optional(),
        bridge: z.coerce.number().optional(),
        templeLength: z.coerce.number().optional(),
        frameWidth: z.coerce.number().optional(),
    }).optional(),
    weight: z.coerce.number().optional(),
    images: z.array(z.string()).default([]),
    price: z.coerce.number().min(0, "Price must be at least 0"),
    discount: z.coerce.number().min(0).max(100).default(0),
    stock: z.coerce.number().min(0, "Stock must be at least 0").default(0),
    tags: z.array(z.string()).default([]),
    isActive: z.boolean().default(true),
});
export const AddressSchema = z.object({
    label: z.string().default('Home'),
    fullName: z.string().min(1, "Full name is required"),
    line1: z.string().min(1, "Address line 1 is required"),
    line2: z.string().optional(),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    pincode: z.string().min(1, "Pincode is required"),
    country: z.string().default('India'),
    mobile: z.string().min(1, "Mobile number is required"),
    isDefault: z.boolean().default(false),
});
export const EyePowerSchema = z.object({
    left: z.object({
        sphere: z.coerce.number().optional(),
        cylinder: z.coerce.number().optional(),
        axis: z.coerce.number().optional(),
        addition: z.coerce.number().optional(),
        pd: z.coerce.number().optional(),
    }),
    right: z.object({
        sphere: z.coerce.number().optional(),
        cylinder: z.coerce.number().optional(),
        axis: z.coerce.number().optional(),
        addition: z.coerce.number().optional(),
        pd: z.coerce.number().optional(),
    }),
});
export const UserFormSchema = z.object({
    name: z.string().min(1, "Name is required").trim(),
    email: z.string().email("Invalid email").min(1, "Email is required").lowercase().trim(),
    password: z.string().min(6, "Password must be at least 6 characters").optional().or(z.literal('')),
    mobile: z.string().optional(),
    gender: z.enum(['male', 'female', 'other']).optional(),
    dateOfBirth: z.union([z.date(), z.string()]).optional(),
    role: z.enum(['user', 'admin', 'moderator']).default('user'),
    isEmailVerified: z.boolean().default(true),
    addresses: z.array(AddressSchema).default([]),
    eyePower: EyePowerSchema.optional(),
    avatar: z.any().optional(),
});
export const CategoryFormSchema = z.object({
    name: z.string().min(1, "Name is required").trim(),
    slug: z.string().min(1, "Slug is required").lowercase().trim(),
    image: z.any().optional(),
    parent: z.string().nullable().default(null),
    isActive: z.boolean().default(true),
});
export const BannerFormSchema = z.object({
    title: z.string().min(1, "Title is required").trim(),
    description: z.string().min(1, "Description is required"),
    label: z.string().optional(),
    buttonLink: z.string().optional(),
    image: z.any().optional(), // Can be string URL or File
    status: z.enum(['Active', 'Inactive', 'Scheduled']).default('Active'),
    placement: z.string().default('Hero Slider'),
    expiry: z.string().optional(),
});
