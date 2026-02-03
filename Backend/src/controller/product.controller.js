import { ZodError } from "zod";
import ProductModel from "../modules/Product.model.js";
import Shop from "../modules/Shop.model.js";
import { getNextCounterValue } from "../utils/getNextCounterValue.js";
import { generateQRCode } from "../utils/QrCodeGenrator.js";
import { SKUgenrator } from "../utils/SKUgenrator.js";
import { addProductSchema } from "../Validators/productvalidator.js";

export const AddProduct = async (req, res) => {
  try {
    console.log("addproduct me agyaaa");
    console.log(req.body);
    
    const { name, brand } = req.body;
    
    const addProduct = addProductSchema.parse(req.body);
    
    const shop = await Shop.findOne({ ownerId: req.userId });
    if (!shop) {
  return res.status(404).json({ message: "Shop not found" });
}
    const counterId = `product_${shop._id}`;
    const nextSeq = await getNextCounterValue(counterId);
    const SKU = SKUgenrator({
      name,
      brand,
      nextSeq,
    });
    console.log("SKU:",SKU);
    
    addProduct.sku = SKU;
    const qrcode = await  generateQRCode(SKU);
console.log("qrcode:",qrcode);

    addProduct.qrCode = qrcode;
    console.log(addProduct);
    

    const adddProduct = await ProductModel.create({
  ...addProduct,
  shopId: shop._id,
});
    res.status(200).json({data:adddProduct});
  } catch (error) {
     if (error instanceof ZodError) {
    const issues = error.issues || [];

    return res.status(400).json({
      success: false,
      errors: issues.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      })),
    });
  }
  console.log(error);
  
    res.status(500).json({ message: "server error",error});
  }
};

export const getProduct = async()=>{
  
}
