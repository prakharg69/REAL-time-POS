import React from 'react';
import { 
  FiActivity, FiTrendingUp, FiGlobe, FiRefreshCw, 
  FiBarChart2, FiUsers, FiPackage, FiShield,
  FiCheckCircle, FiStar, FiArrowRight,
  FiTwitter, FiLinkedin, FiGithub, FiMenu,
  FiBox, FiSmartphone, FiCloud
} from 'react-icons/fi';
import { HiOutlineChartBar, HiOutlineChip } from 'react-icons/hi';
import { MdOutlineAnalytics, MdOutlineInventory2 } from 'react-icons/md';

const ModernInventoryLightBlue = () => {
  const features = [
    {
      title: "Real-Time Analytics",
      description: "Live dashboards with instant inventory insights and predictive analytics for smarter decisions.",
      icon: <FiActivity className="w-7 h-7" />,
      bgColor: "bg-gradient-to-br from-gray-900 to-gray-800",
      textColor: "text-white",
      descriptionColor: "text-gray-300",
      borderColor: "border-gray-800",
      size: "md:col-span-2 md:row-span-2",
      highlight: true,
      badge: "Most Popular"
    },
    {
      title: "AI Demand Forecasting",
      description: "Machine learning predicts inventory needs with 95% accuracy.",
      icon: <HiOutlineChip className="w-7 h-7" />,
      bgColor: "bg-gradient-to-br from-gray-800 to-gray-700",
      textColor: "text-white",
      descriptionColor: "text-gray-300",
      borderColor: "border-gray-700",
      size: "md:col-span-1",
      highlight: false
    },
    {
      title: "Multi-Warehouse Sync",
      description: "Connect unlimited locations with automatic inventory reconciliation.",
      icon: <FiGlobe className="w-7 h-7" />,
      bgColor: "bg-gradient-to-br from-gray-800 to-gray-700",
      textColor: "text-white",
      descriptionColor: "text-gray-300",
      borderColor: "border-gray-700",
      size: "md:col-span-1",
      highlight: false
    },
    {
      title: "Automated Replenishment",
      description: "Smart triggers for automatic reordering when stock reaches critical levels.",
      icon: <FiRefreshCw className="w-7 h-7" />,
      bgColor: "bg-gradient-to-br from-gray-900 to-gray-800",
      textColor: "text-white",
      descriptionColor: "text-gray-300",
      borderColor: "border-gray-800",
      size: "md:col-span-2",
      highlight: true
    },
    {
      title: "Advanced Reporting",
      description: "Customizable dashboards with drill-down capabilities for deep insights.",
      icon: <FiBarChart2 className="w-7 h-7" />,
      bgColor: "bg-gradient-to-br from-gray-800 to-gray-700",
      textColor: "text-white",
      descriptionColor: "text-gray-300",
      borderColor: "border-gray-700",
      size: "md:col-span-1",
      highlight: false
    },
    {
      title: "Supplier Integration",
      description: "Direct API connections with suppliers for streamlined procurement.",
      icon: <FiUsers className="w-7 h-7" />,
      bgColor: "bg-gradient-to-br from-gray-800 to-gray-700",
      textColor: "text-white",
      descriptionColor: "text-gray-300",
      borderColor: "border-gray-700",
      size: "md:col-span-1",
      highlight: false
    },
    {
      title: "Mobile Management",
      description: "Manage inventory on-the-go with our iOS and Android apps.",
      icon: <FiSmartphone className="w-7 h-7" />,
      bgColor: "bg-gradient-to-br from-gray-900 to-gray-800",
      textColor: "text-white",
      descriptionColor: "text-gray-300",
      borderColor: "border-gray-800",
      size: "md:col-span-2",
      highlight: true,
      badge: "New"
    }
  ];

  const reviews = [
    {
      name: "Alex Morgan",
      role: "COO, RetailTech Inc.",
      text: "Reduced inventory holding costs by 40% while maintaining 99.8% fulfillment rate.",
      rating: 5,
      initials: "AM",
      companyLogo: "RT"
    },
    {
      name: "Sarah Chen",
      role: "Operations Director",
      text: "The real-time analytics transformed our supply chain visibility overnight.",
      rating: 5,
      initials: "SC",
      companyLogo: "GC"
    },
    {
      name: "Marcus Rivera",
      role: "Founder, E-Commerce Pro",
      text: "AI forecasting cut our stockouts by 85% in the first quarter.",
      rating: 5,
      initials: "MR",
      companyLogo: "EP"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white text-gray-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-400 rounded-xl flex items-center justify-center shadow-lg">
                <FiBox className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                <span className="text-blue-600">Stock</span>Sync
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Features</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Solutions</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Pricing</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Resources</a>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="hidden md:block text-blue-600 hover:text-blue-700 transition-colors font-medium">
                Sign In
              </button>
              <button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-2.5 rounded-xl font-medium transition-all hover:scale-105 shadow-md">
                Get Started
              </button>
              <button className="md:hidden">
                <FiMenu className="w-6 h-6 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-medium mb-8">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
            Real-time Inventory Management Platform
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
            Smart Inventory
            <span className="block mt-4 text-blue-600">
              Management Simplified
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
            AI-powered platform that delivers real-time insights, automates replenishment, 
            and optimizes your entire supply chain in one intuitive dashboard.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
            <button className="group bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold px-8 py-4 rounded-xl transition-all hover:scale-105 shadow-lg flex items-center justify-center">
              Start Free Trial
              <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="bg-white border-2 border-blue-200 hover:border-blue-300 text-blue-600 font-semibold px-8 py-4 rounded-xl transition-all shadow-sm">
              Watch Demo
            </button>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { value: "99.9%", label: "Accuracy Rate", color: "text-blue-600" },
              { value: "24/7", label: "Real-time Sync", color: "text-blue-500" },
              { value: "40%", label: "Cost Reduction", color: "text-blue-600" },
              { value: "5k+", label: "Businesses Trust", color: "text-blue-500" }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className={`text-3xl font-bold ${stat.color} mb-2`}>{stat.value}</div>
                <div className="text-gray-500 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bento Grid Features - Dark Boxes */}
      <section className="px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Enterprise-Grade Features
            </h2>
            <p className="text-gray-600 text-xl max-w-3xl mx-auto">
              Everything you need to optimize inventory, reduce costs, and scale operations
            </p>
          </div>

          {/* Asymmetric Bento Grid with Dark Boxes */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`${feature.size} ${feature.bgColor} border ${feature.borderColor} rounded-2xl p-8 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl group cursor-pointer`}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className={`p-3 rounded-xl bg-gray-700/50 ${feature.highlight ? 'shadow-lg' : 'shadow'}`}>
                    <div className={feature.highlight ? 'text-blue-300' : 'text-blue-400'}>
                      {feature.icon}
                    </div>
                  </div>
                  {feature.badge && (
                    <span className="px-3 py-1 rounded-full bg-blue-500 text-white text-xs font-medium">
                      {feature.badge}
                    </span>
                  )}
                </div>
                
                <h3 className={`text-xl font-bold mb-3 ${feature.textColor}`}>
                  {feature.title}
                </h3>
                <p className={`text-sm ${feature.descriptionColor} leading-relaxed mb-6`}>
                  {feature.description}
                </p>
                
                {feature.highlight && (
                  <div className="flex items-center text-blue-300 text-sm font-medium group-hover:text-blue-200 transition-colors">
                    <span>Learn more</span>
                    <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Feature Highlights Row */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-xl border border-blue-100 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <FiCloud className="w-5 h-5 text-blue-600" />
                </div>
                <h4 className="font-bold text-gray-900">Cloud Infrastructure</h4>
              </div>
              <p className="text-gray-600 text-sm">Secure, scalable cloud platform with 99.9% uptime guarantee</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-blue-100 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <FiShield className="w-5 h-5 text-blue-600" />
                </div>
                <h4 className="font-bold text-gray-900">Enterprise Security</h4>
              </div>
              <p className="text-gray-600 text-sm">SOC 2 compliant with end-to-end encryption and audit trails</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-blue-100 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <FiRefreshCw className="w-5 h-5 text-blue-600" />
                </div>
                <h4 className="font-bold text-gray-900">Seamless Integration</h4>
              </div>
              <p className="text-gray-600 text-sm">Connect with 100+ platforms including Shopify, QuickBooks, and more</p>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Trusted by Industry Leaders
            </h2>
            <p className="text-gray-600 text-xl max-w-3xl mx-auto">
              Join thousands of businesses optimizing their inventory management
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((review, index) => (
              <div 
                key={index} 
                className="bg-gradient-to-br from-white to-blue-50 border border-blue-100 rounded-2xl p-8 hover:shadow-lg transition-all"
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4">
                    {review.initials}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{review.name}</h4>
                    <p className="text-blue-600 text-sm">{review.role}</p>
                  </div>
                </div>
                
                <div className="flex mb-6">
                  {[...Array(5)].map((_, i) => (
                    <FiStar key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <p className="text-gray-700 italic mb-6">"{review.text}"</p>
                
                <div className="flex items-center pt-6 border-t border-blue-100">
                  <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center mr-3">
                    <span className="text-blue-700 font-bold text-xs">{review.companyLogo}</span>
                  </div>
                  <div className="flex items-center">
                    <FiCheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span className="text-sm text-gray-500">Verified Customer</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-3xl p-12 shadow-lg">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-md">
            <FiPackage className="w-8 h-8 text-white" />
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            Ready to Transform Your Inventory?
          </h2>
          
          <p className="text-gray-700 text-xl mb-12 max-w-2xl mx-auto">
            Start your 14-day free trial. No credit card required. Full platform access.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button className="group bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold px-8 py-4 rounded-xl transition-all hover:scale-105 shadow-lg flex items-center justify-center">
              Start Free Trial
              <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="bg-white border-2 border-blue-300 hover:border-blue-400 text-blue-600 font-semibold px-8 py-4 rounded-xl transition-all shadow-sm">
              Schedule a Demo
            </button>
          </div>
          
          <p className="text-gray-500 text-sm">
            No setup fees • Cancel anytime • 24/7 support included
          </p>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="border-t border-blue-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-6 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <FiBox className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900">
                <span className="text-blue-600">Stock</span>Sync
              </span>
              <span className="text-gray-400 text-sm">• Real-time Inventory Management</span>
            </div>
            
            <div className="flex items-center space-x-6 mb-6 md:mb-0">
              <a href="#" className="text-gray-500 hover:text-blue-600 text-sm transition-colors">Privacy</a>
              <a href="#" className="text-gray-500 hover:text-blue-600 text-sm transition-colors">Terms</a>
              <a href="#" className="text-gray-500 hover:text-blue-600 text-sm transition-colors">Contact</a>
            </div>
            
            <div className="flex items-center space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
                <FiTwitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
                <FiLinkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
                <FiGithub className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-blue-100 text-center">
            <p className="text-gray-400 text-sm">
              © 2024 StockSync. All rights reserved. Inventory management reimagined.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ModernInventoryLightBlue;