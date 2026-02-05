import React, { useState, useEffect } from "react";
import ProductForm from "../Components/ProductForm";
import {
  Search,
  Package,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Trash2,
  Plus,
  Filter,
  MoreVertical,
  CheckCircle,
  XCircle,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { fetchProduct } from "../Redux/Slices/StoreSlice";

const Products = () => {
  const dispatch = useDispatch();

  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  const {
    StoreItems,
    currentPage,
    limit,
    totalItems,
    hasNextPage,
    hasPrevPage,
  } = useSelector((s) => s.shop);

  
  useEffect(() => {
    dispatch(fetchProduct({ page: currentPage, limit: 2 }));
  }, [dispatch, currentPage]);

 
  useEffect(() => {
    dispatch(fetchProduct({ page: 1, limit: 2 }));
  }, [searchTerm, filterCategory]);

  const products = StoreItems || [];


  const categories = ["all", ...new Set(products.map((p) => p.category))];

  
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      filterCategory === "all" || product.category === filterCategory;

    return matchesSearch && matchesCategory;
  });

  const handleProductAdded = async (productData) => {
    try {
      const newProduct = { ...productData };

      Object.keys(newProduct).forEach((key) => {
        if (
          typeof newProduct[key] === "string" &&
          !isNaN(newProduct[key]) &&
          newProduct[key] !== ""
        ) {
          newProduct[key] = Number(newProduct[key]);
        }
      });

      await axios.post(
        "http://localhost:5001/api/addproduct",
        newProduct,
        { withCredentials: true }
      );

      toast.success("Product added successfully");
      setShowForm(false);
      dispatch(fetchProduct({ page: 1, limit: 2 }));
    } catch (error) {
      toast.error("Failed to add product");
    }
  };

  const handleEdit = (id) => {
    alert("Edit product: " + id);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this product?")) {
      // API delete call later
      toast.success("Product deleted");
    }
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount || 0);

  const getCategoryColor = (category) => {
    const colors = {
      food: "bg-yellow-50 text-yellow-700 border-yellow-200",
      electronics: "bg-blue-50 text-blue-700 border-blue-200",
      clothing: "bg-purple-50 text-purple-700 border-purple-200",
      beauty: "bg-pink-50 text-pink-700 border-pink-200",
      home: "bg-green-50 text-green-700 border-green-200",
      sports: "bg-orange-50 text-orange-700 border-orange-200",
      default: "bg-gray-50 text-gray-700 border-gray-200",
    };
    
    return colors[category.toLowerCase()] || colors.default;
  };

  const getStockStatus = (qty, min) => {
    if (qty === 0)
      return { 
        text: "Out of Stock", 
        color: "bg-red-50 text-red-700 border-red-200",
        icon: <XCircle className="w-3 h-3" />
      };
    if (qty <= min)
      return { 
        text: "Low Stock", 
        color: "bg-orange-50 text-orange-700 border-orange-200",
        icon: <XCircle className="w-3 h-3" />
      };
    return { 
      text: "In Stock", 
      color: "bg-green-50 text-green-700 border-green-200",
      icon: <CheckCircle className="w-3 h-3" />
    };
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Products</h1>
            <p className="text-gray-600 text-sm">Manage your inventory and products</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            <Plus size={18} />
            Add Product
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-xl p-4 mb-6 border border-gray-200 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-3.5 text-gray-400" size={18} />
            <input
              className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="Search by name, brand, or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-3">
            <div className="relative">
              <Filter className="absolute left-3.5 top-3.5 text-gray-400" size={18} />
              <select
                className="pl-11 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.filter(cat => cat !== "all").map((cat) => (
                  <option key={cat} value={cat} className="capitalize">
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            
            <button className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
              <MoreVertical size={18} />
            </button>
          </div>
        </div>
      </div>

      <ProductForm
        showForm={showForm}
        setShowForm={setShowForm}
        onProductAdded={handleProductAdded}
      />

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        {filteredProducts.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-50 flex items-center justify-center">
              <Package className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search or filter</p>
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
            >
              Add Your First Product
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-blue-50/50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Product</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">SKU</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Pricing</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Stock</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Category</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredProducts.map((p) => {
                    const stock = getStockStatus(p.stockQuantity, p.minimumStock);
                    const categoryColor = getCategoryColor(p.category);

                    return (
                      <tr key={p.sku} className="hover:bg-blue-50/30 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-start space-x-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                              <Package className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">{p.name}</div>
                              <div className="text-sm text-gray-600 mt-0.5">{p.brand}</div>
                            </div>
                          </div>
                        </td>
                        
                        <td className="py-4 px-6">
                          <div className="font-mono text-sm font-medium text-gray-900">{p.sku}</div>
                          <div className="text-xs text-gray-500 mt-1">Unit: {p.unit}</div>
                        </td>
                        
                        <td className="py-4 px-6">
                          <div className="space-y-1">
                            <div className="font-semibold text-gray-900">{formatCurrency(p.sellingPrice)}</div>
                            <div className="text-sm text-gray-500">
                              Cost: {formatCurrency(p.costPrice)}
                            </div>
                            <div className="text-xs text-gray-500">
                              MRP: {formatCurrency(p.mrp)}
                            </div>
                          </div>
                        </td>
                        
                        <td className="py-4 px-6">
                          <div className="space-y-3">
                           
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {p.stockQuantity} {p.unit}
                              </div>
                              {p.minimumStock > 0 && (
                                <div className="text-xs text-gray-500">
                                  Min: {p.minimumStock} {p.unit}
                                </div>
                              )}
                            </div>
                            
                           
                            <div className="flex items-center gap-2">
                              {stock.icon}
                              <span className={`text-xs px-2.5 py-1 rounded-full border ${stock.color}`}>
                                {stock.text}
                              </span>
                            </div>
                          </div>
                        </td>
                        
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1.5 rounded-full text-sm font-medium capitalize border ${categoryColor}`}>
                            {p.category}
                          </span>
                        </td>
                        
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEdit(p._id)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(p._id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4 bg-blue-50/30">
              <div className="text-sm text-gray-600">
                Showing <span className="font-semibold">{(currentPage - 1) * limit + 1}</span> to{" "}
                <span className="font-semibold">
                  {Math.min(currentPage * limit, filteredProducts.length + (currentPage - 1) * limit)}
                </span>{" "}
                of <span className="font-semibold">{totalItems}</span> products
              </div>

              <div className="flex items-center gap-2">
                <button
                  disabled={!hasPrevPage}
                  onClick={() =>
                    dispatch(fetchProduct({ page: currentPage - 1, limit: 2 }))
                  }
                  className={`p-2.5 rounded-lg border transition ${
                    hasPrevPage
                      ? "border-gray-300 hover:bg-white hover:border-blue-500 hover:text-blue-600"
                      : "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <ChevronLeft size={18} />
                </button>

                <div className="flex items-center gap-1">
                  <span className="px-3 py-1.5 bg-blue-600 text-white rounded-lg font-medium">
                    {currentPage}
                  </span>
                  {hasNextPage && (
                    <span className="px-3 py-1.5 text-gray-600">of {Math.ceil(totalItems / limit)}</span>
                  )}
                </div>

                <button
                  disabled={!hasNextPage}
                  onClick={() =>
                    dispatch(fetchProduct({ page: currentPage + 1, limit: 2 }))
                  }
                  className={`p-2.5 rounded-lg border transition ${
                    hasNextPage
                      ? "border-gray-300 hover:bg-white hover:border-blue-500 hover:text-blue-600"
                      : "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Products;