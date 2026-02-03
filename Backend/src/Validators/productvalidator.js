import { z } from "zod";

export const addProductSchema = z
  .object({
    name: z.string().min(1, "Product name is required").trim(),
    brand: z.string().min(1, "Brand is required").trim(),

    barcode: z.string().optional().nullable(),
    category: z.string().optional().nullable(),
    qrCode: z.string().optional().nullable(),

    sellingPrice: z.number().positive("Selling price must be > 0"),
    costPrice: z.number().positive("Cost price must be > 0"),
    mrp: z.number().positive("MRP must be > 0"),

    unit: z.string().min(1, "Unit is required"),

    stockQuantity: z.number().int().nonnegative("Stock cannot be negative"),
    minimumStock: z.number().int().nonnegative().optional().default(0)
  })
  .refine(
    (data) => data.costPrice <= data.sellingPrice,
    {
      message: "Cost price cannot be greater than selling price",
      path: ["costPrice"]
    }
  )
  .refine(
    (data) => data.sellingPrice <= data.mrp,
    {
      message: "Selling price cannot be greater than MRP",
      path: ["sellingPrice"]
    }
  );
