import { z } from "zod";
export const ProductFormSchema = z.object({
    name: z.string().min(1, "Name is required").trim(),
    slug: z.string().min(1, "Slug is required").lowercase().trim(),
    description: z.string().min(1, "Description is required"),
    brand: z.string().min(1, "Brand is required").trim(),
    sku: z.string().min(1, "SKU is required").toUpperCase().trim(),
    category: z.string().min(1, "Category is required"), // ObjectId as string
    type: z.enum(['eyeglasses', 'sunglasses', 'reading-glasses', 'contact-lenses', 'accessories']),
    frameShape: z.enum(['round', 'square', 'rectangle', 'oval', 'cat-eye', 'wayfarer', 'aviator', 'clubmaster']).optional(),
    frameMaterial: z.enum(['metal', 'acetate', 'tr90', 'wood', 'titanium', 'mixed']).optional(),
    frameColor: z.string().optional(),
    lensType: z.enum(['single-vision', 'bifocal', 'progressive', 'non-prescription']).optional(),
    lensCoating: z.array(z.string()).default([]),
    gender: z.enum(['men', 'women', 'unisex', 'kids']).default('unisex'),
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
    password: z.string().min(6, "Password must be at least 6 characters").optional(),
    mobile: z.string().optional(),
    gender: z.enum(['male', 'female', 'other']).optional(),
    dateOfBirth: z.union([z.date(), z.string()]).optional(),
    role: z.enum(['user', 'admin', 'moderator']).default('user'),
    isEmailVerified: z.boolean().default(false),
    addresses: z.array(AddressSchema).default([]),
    eyePower: EyePowerSchema.optional(),
    avatar: z.string().optional(),
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
