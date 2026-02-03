import React, { useState, useEffect } from 'react';
import ProductForm from '../Components/ProductForm';
import { 
  Search, 
  Package,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Trash2
} from 'lucide-react';
import api from '../api/axios';
import { toast } from 'react-toastify';
import axios from 'axios';

const Products = () => {
  const [showForm, setShowForm] = useState(false);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  
  const initialProducts = [
    {
      _id: '1',
      shopId: 'shop123',
      name: 'Laptop',
      brand: 'Dell',
      sku: 'SKU-123456',
      qrCode: 'QR-123456',
      category: 'Electronics',
      sellingPrice: 79999,
      costPrice: 65000,
      mrp: 84999,
      unit: 'piece',
      stockQuantity: 15,
      minimumStock: 5,
      isActive: true,
      createdAt: '2024-01-15T10:30:00Z'
    },
    {
      _id: '2',
      shopId: 'shop123',
      name: 'Wireless Mouse',
      brand: 'Logitech',
      sku: 'SKU-789012',
      qrCode: 'QR-789012',
      category: 'Accessories',
      sellingPrice: 1299,
      costPrice: 800,
      mrp: 1499,
      unit: 'piece',
      stockQuantity: 45,
      minimumStock: 10,
      isActive: true,
      createdAt: '2024-01-20T14:45:00Z'
    },
    {
      _id: '3',
      shopId: 'shop123',
      name: 'Mechanical Keyboard',
      brand: 'Corsair',
      sku: 'SKU-345678',
      qrCode: 'QR-345678',
      category: 'Electronics',
      sellingPrice: 5499,
      costPrice: 4000,
      mrp: 5999,
      unit: 'piece',
      stockQuantity: 3,
      minimumStock: 5,
      isActive: true,
      createdAt: '2024-01-25T09:15:00Z'
    },
    {
      _id: '4',
      shopId: 'shop123',
      name: 'Gaming Chair',
      brand: 'Razer',
      sku: 'SKU-901234',
      qrCode: 'QR-901234',
      category: 'Furniture',
      sellingPrice: 24999,
      costPrice: 18000,
      mrp: 29999,
      unit: 'piece',
      stockQuantity: 8,
      minimumStock: 3,
      isActive: true,
      createdAt: '2024-01-28T14:20:00Z'
    }
  ];

  useEffect(() => {
    setProducts(initialProducts);
  }, []);

  // Get unique categories for filter
  const categories = ['all', ...new Set(initialProducts.map(p => p.category))];

  // Filter products (no sorting)
  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleProductAdded = async(productData) => {
    try {
      const newProduct = {...productData};

    
    Object.keys(newProduct).forEach(key => {
      if (typeof newProduct[key] === 'string' && !isNaN(newProduct[key]) && newProduct[key] !== '') {
        newProduct[key] = parseFloat(newProduct[key]);
      }
    });


    console.log('New product added:', newProduct);
   const res = await  axios.post("http://localhost:5001/api/addproduct",newProduct,{withCredentials:true})
   console.log("sucesss:",res);
   
    
    setProducts(prev => [newProduct, ...prev]);
    setCurrentPage(1);
    } catch (error) {
      toast.error(error);
    }
  };

  // Handle edit product
  const handleEdit = (productId) => {
    const productToEdit = products.find(p => p._id === productId);
    if (productToEdit) {
      alert(`Edit product: ${productToEdit.name}`);
      // You can open an edit form/modal here
    }
  };

  // Handle delete product
  const handleDelete = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(prev => prev.filter(p => p._id !== productId));
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    if (!amount) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStockStatus = (quantity, minStock) => {
    if (quantity === 0) return { text: 'Out of Stock', color: 'bg-red-100 text-red-800' };
    if (quantity <= minStock) return { text: 'Low Stock', color: 'bg-orange-100 text-orange-800' };
    return { text: 'In Stock', color: 'bg-green-100 text-green-800' };
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Products</h1>
          <p className="text-gray-600 mt-1">Manage your products and inventory</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            Add Product
          </button>
          <button className="px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200">
            Upload CSV
          </button>
          <button className="px-4 py-2.5 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-200">
            CSV Format
          </button>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg p-4 border border-gray-200 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white min-w-45"
          >
            <option value="all">All Categories</option>
            {categories.filter(cat => cat !== 'all').map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Product Form Modal */}
      <ProductForm 
        showForm={showForm}
        setShowForm={setShowForm}
        onProductAdded={handleProductAdded}
      />

      {/* Products Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {paginatedProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Package size={48} className="mx-auto" />
            </div>
            <p className="text-gray-500 text-lg">No products found</p>
            <p className="text-gray-400 mt-2">Try adjusting your search or filter</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      SKU/QR
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedProducts.map((product) => {
                    const stockStatus = getStockStatus(product.stockQuantity, product.minimumStock);
                    
                    return (
                      <tr 
                        key={product._id} 
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-semibold text-gray-900">{product.name}</div>
                            <div className="text-sm text-gray-600">{product.brand}</div>
                            {product.category && (
                              <div className="text-xs text-gray-500 mt-1">{product.category}</div>
                            )}
                            <div className="text-xs mt-1">
                              <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded">
                                {product.unit}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="text-sm font-medium text-gray-900">{product.sku}</div>
                            <div className="text-xs text-gray-500">QR: {product.qrCode}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-semibold text-gray-900">
                              {formatCurrency(product.sellingPrice)}
                            </div>
                            <div className="text-xs text-gray-500">
                              Cost: {formatCurrency(product.costPrice)}
                            </div>
                            <div className="text-xs text-gray-500">
                              MRP: {formatCurrency(product.mrp)}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-semibold text-gray-900">
                              {product.stockQuantity}
                            </div>
                            {product.minimumStock > 0 && (
                              <div className="text-xs text-gray-500">
                                Min: {product.minimumStock}
                              </div>
                            )}
                            <div className="mt-1">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${stockStatus.color}`}>
                                {stockStatus.text}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            product.isActive 
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {product.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEdit(product._id)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(product._id)}
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
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-sm text-gray-700">
                    Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(currentPage * itemsPerPage, filteredProducts.length)}
                    </span> of{' '}
                    <span className="font-medium">{filteredProducts.length}</span> products
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="p-2 rounded border border-gray-300 disabled:opacity-50 hover:bg-gray-50"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-8 h-8 rounded text-sm ${
                          currentPage === page
                            ? 'bg-blue-600 text-white'
                            : 'border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded border border-gray-300 disabled:opacity-50 hover:bg-gray-50"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      
    </div>
  );
};

export default Products;