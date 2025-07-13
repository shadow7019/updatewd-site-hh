import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './App';

const API_URL = process.env.REACT_APP_BACKEND_URL + '/api';

// Header Component
export const Header = ({ currentPage, setCurrentPage, setShowLoginModal }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    { name: 'Home', id: 'home' },
    { name: 'About Us', id: 'about' },
    { name: 'Services', id: 'services' },
    { name: 'Products', id: 'products' },
    { name: 'Contact', id: 'contact' },
  ];

  const handleClientPortalClick = () => {
    if (user) {
      window.location.href = '/portal';
    } else {
      setShowLoginModal(true);
    }
  };

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-lg' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-teal-700 rounded-full flex items-center justify-center relative overflow-hidden">
              {/* Globe with containers design inspired by logo */}
              <svg className="w-10 h-10 text-white" viewBox="0 0 40 40" fill="currentColor">
                <circle cx="20" cy="20" r="18" fill="currentColor" opacity="0.8"/>
                <path d="M8 20 Q20 12 32 20 Q20 28 8 20" fill="white" opacity="0.3"/>
                <rect x="15" y="16" width="3" height="2" fill="white"/>
                <rect x="19" y="16" width="3" height="2" fill="white"/>
                <rect x="23" y="16" width="3" height="2" fill="white"/>
                <path d="M28 15 L32 11 M28 15 L32 19 M28 15 L32 15" stroke="white" strokeWidth="2" fill="none"/>
              </svg>
            </div>
            <div>
              <span className={`text-2xl font-bold ${isScrolled ? 'text-gray-800' : 'text-white'}`}>
                OneEXIM
              </span>
              <div className={`text-xs font-medium ${isScrolled ? 'text-teal-700' : 'text-teal-200'}`}>
                EXPORTING MADE SIMPLE
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`font-medium transition-colors duration-200 ${
                  currentPage === item.id
                    ? 'text-teal-600'
                    : isScrolled
                    ? 'text-gray-700 hover:text-teal-600'
                    : 'text-white hover:text-teal-200'
                }`}
              >
                {item.name}
              </button>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => setCurrentPage('quote')}
              className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-200 font-semibold"
            >
              Get Quote
            </button>
            {user ? (
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleClientPortalClick}
                  className={`px-6 py-2 rounded-lg border-2 transition-colors duration-200 ${
                    isScrolled
                      ? 'border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-white'
                      : 'border-white text-white hover:bg-white hover:text-teal-600'
                  }`}
                >
                  My Portal
                </button>
                <button
                  onClick={logout}
                  className={`px-4 py-2 text-sm rounded-lg transition-colors duration-200 ${
                    isScrolled
                      ? 'text-gray-600 hover:bg-gray-100'
                      : 'text-white hover:bg-white hover:text-teal-600'
                  }`}
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={handleClientPortalClick}
                className={`px-6 py-2 rounded-lg border-2 transition-colors duration-200 ${
                  isScrolled
                    ? 'border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-white'
                    : 'border-white text-white hover:bg-white hover:text-teal-600'
                }`}
              >
                Client Portal
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2"
          >
            <svg className={`w-6 h-6 ${isScrolled ? 'text-gray-800' : 'text-white'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 bg-white rounded-lg shadow-lg">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentPage(item.id);
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-teal-50 hover:text-teal-600"
              >
                {item.name}
              </button>
            ))}
            <div className="px-4 py-2 space-y-2">
              <button
                onClick={() => {
                  setCurrentPage('quote');
                  setIsMenuOpen(false);
                }}
                className="w-full px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
              >
                Get Quote
              </button>
              {user ? (
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      handleClientPortalClick();
                      setIsMenuOpen(false);
                    }}
                    className="w-full px-4 py-2 border-2 border-teal-600 text-teal-600 rounded-lg hover:bg-teal-600 hover:text-white"
                  >
                    My Portal
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    handleClientPortalClick();
                    setIsMenuOpen(false);
                  }}
                  className="w-full px-4 py-2 border-2 border-teal-600 text-teal-600 rounded-lg hover:bg-teal-600 hover:text-white"
                >
                  Client Portal
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

// Hero Component
export const Hero = () => {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `linear-gradient(rgba(20, 83, 93, 0.8), rgba(45, 156, 174, 0.7)), url('https://images.unsplash.com/photo-1604778202015-3071e0d7f29b')`
      }}
    >
      <div className="container mx-auto px-6 text-center text-white">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          Welcome to
          <span className="block text-teal-300">OneEXIM</span>
        </h1>
        <p className="text-xl md:text-2xl mb-4 max-w-4xl mx-auto opacity-90 font-semibold text-teal-100">
          EXPORTING MADE SIMPLE
        </p>
        <p className="text-lg md:text-xl mb-8 max-w-4xl mx-auto opacity-80">
          Your trusted partner for seamless export solutions across multiple product categories.
          We handle compliance, logistics, and documentation so you can focus on growing your business globally.
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => window.location.href = '#quote'}
            className="px-8 py-4 bg-teal-600 text-white rounded-lg text-lg font-semibold hover:bg-teal-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            Start Exporting Today
          </button>
          <button
            onClick={() => window.location.href = '#contact'}
            className="px-8 py-4 border-2 border-white text-white rounded-lg text-lg font-semibold hover:bg-white hover:text-teal-600 transform hover:scale-105 transition-all duration-200"
          >
            Contact Our Experts
          </button>
        </div>

        {/* Key USPs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-16">
          <div className="text-center">
            <div className="text-4xl font-bold text-teal-300 mb-2">500+</div>
            <div className="text-lg">Products Exported</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-teal-300 mb-2">25+</div>
            <div className="text-lg">Countries Served</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-teal-300 mb-2">100%</div>
            <div className="text-lg">Compliance Success</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-teal-300 mb-2">24/7</div>
            <div className="text-lg">Expert Support</div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
};

// Services Component
export const Services = () => {
  const services = [
    {
      id: 1,
      title: "Export Documentation & Compliance",
      description: "Complete handling of export documentation, customs clearance, and regulatory compliance for all international markets.",
      image: "https://images.pexels.com/photos/13048487/pexels-photo-13048487.jpeg",
      icon: "📋",
      features: ["IEC Registration", "GST Compliance", "Export Licenses", "Customs Documentation", "Certificate of Origin", "International Standards"]
    },
    {
      id: 2,
      title: "Logistics & Freight Solutions",
      description: "End-to-end logistics management including air freight, sea freight, and multimodal transportation worldwide.",
      image: "https://images.unsplash.com/photo-1580272400988-bafdf02a0b8d",
      icon: "🚛",
      features: ["Air & Sea Freight", "Door-to-door Delivery", "Cargo Insurance", "Real-time Tracking", "Warehousing", "Last-mile Delivery"]
    },
    {
      id: 3,
      title: "Packaging & Quality Control",
      description: "Professional packaging solutions and quality control processes to ensure products reach destinations in perfect condition.",
      image: "https://images.unsplash.com/photo-1522674149721-b0191358dc5c",
      icon: "📦",
      features: ["Export Packaging", "Quality Inspection", "Product Labeling", "Fumigation Services", "Temperature Control", "Damage Protection"]
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Why Choose OneEXIM?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We make exporting simple with comprehensive solutions designed to help businesses
            expand globally with confidence, compliance, and competitive advantage.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service) => (
            <div key={service.id} className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
              <div className="relative h-64 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4 bg-teal-600 text-white p-3 rounded-full text-2xl">
                  {service.icon}
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">{service.title}</h3>
                <p className="text-gray-600 mb-6">{service.description}</p>
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-700">
                      <svg className="w-5 h-5 text-teal-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className="w-full px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transform hover:scale-105 transition-all duration-200 font-semibold">
                  Learn More
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Products Component
export const Products = ({ setSelectedCategory, setCurrentPage, selectedCategory }) => {
  const productCategories = [
    {
      id: 'agriculture',
      title: 'Food & Agriculture',
      description: 'Fresh produce, grains, spices, and processed food products for global markets.',
      image: 'https://images.unsplash.com/photo-1610289472743-de6966e12a3e',
      icon: '🌾',
      products: [
        'Basmati Rice & Premium Grains',
        'Organic Spices & Herbs',
        'Fresh Fruits & Vegetables', 
        'Pulses & Lentils',
        'Tea & Coffee',
        'Processed Foods & Snacks',
        'Organic Products & Superfoods',
        'Nuts & Dry Fruits',
        'Honey & Natural Sweeteners',
        'Frozen Foods & Ready Meals',
        'Dairy Products & Cheese',
        'Cooking Oils & Edible Oils',
        'Cereals & Breakfast Items',
        'Canned Foods & Preserves',
        'Beverages & Juices',
        'Condiments & Sauces'
      ],
      compliance: ['FDA Approved', 'FSSAI Certified', 'Organic Certified', 'HACCP Standards', 'ISO 22000', 'Halal Certified']
    },
    {
      id: 'textiles',
      title: 'Textiles & Apparel',
      description: 'High-quality garments, fabrics, and textile products for fashion and industrial use.',
      image: 'https://images.pexels.com/photos/1624694/pexels-photo-1624694.jpeg',
      icon: '👕',
      products: [
        'Ready-made Garments & Apparel',
        'Cotton & Silk Fabrics',
        'Home Textiles & Furnishing',
        'Technical & Industrial Textiles',
        'Yarn & Threads',
        'Fashion Accessories',
        'Traditional & Ethnic Wear',
        'Sportswear & Activewear',
        'Children\'s Clothing',
        'Denim & Casual Wear',
        'Formal & Business Attire',
        'Leather Goods & Accessories',
        'Bags & Luggage',
        'Footwear & Shoes',
        'Jewelry & Fashion Items',
        'Carpets & Rugs'
      ],
      compliance: ['OEKO-TEX Certified', 'GOTS Certified', 'ISO 9001', 'Social Compliance', 'WRAP Certified', 'BCI Cotton']
    },
    {
      id: 'electronics',
      title: 'Electronics & Components',
      description: 'Consumer electronics, components, and electronic accessories for international markets.',
      image: 'https://images.unsplash.com/photo-1601912552080-0fb89fd08042',
      icon: '📱',
      products: [
        'Consumer Electronics & Gadgets',
        'Electronic Components & Parts',
        'Mobile Accessories & Cases',
        'Computer Hardware & Parts',
        'Cables & Connectors',
        'Power Adapters & Chargers',
        'Audio & Video Equipment',
        'Smart Home Devices',
        'Wearable Technology',
        'Gaming Accessories',
        'Telecommunication Equipment',
        'LED Lights & Fixtures',
        'Solar Products & Equipment',
        'Electrical Appliances',
        'Security & Surveillance Systems',
        'Automotive Electronics'
      ],
      compliance: ['CE Certified', 'FCC Approved', 'RoHS Compliant', 'ISO 14001', 'UL Listed', 'Energy Star']
    },
    {
      id: 'handicrafts',
      title: 'Handicrafts & Home Decor',
      description: 'Traditional crafts, home decoration items, and artisanal products showcasing local culture.',
      image: 'https://images.unsplash.com/photo-1717362760345-7715a0560763',
      icon: '🎨',
      products: [
        'Wooden Handicrafts & Sculptures',
        'Metal Crafts & Artifacts',
        'Ceramics & Pottery',
        'Home Decor & Furnishing',
        'Furniture & Wooden Items',
        'Art Pieces & Paintings',
        'Traditional Crafts & Souvenirs',
        'Marble & Stone Products',
        'Brass & Bronze Items',
        'Handwoven Products',
        'Decorative Items & Showpieces',
        'Garden & Outdoor Decor',
        'Religious & Spiritual Items',
        'Antique Reproductions',
        'Tribal & Folk Art',
        'Gift Items & Collectibles'
      ],
      compliance: ['Fair Trade Certified', 'Handicraft Mark', 'Quality Assured', 'Eco-Friendly', 'Artisan Certified', 'Cultural Heritage']
    },
    {
      id: 'industrial',
      title: 'Industrial Equipment',
      description: 'Machinery, tools, and industrial equipment for various manufacturing and construction needs.',
      image: 'https://images.unsplash.com/photo-1559577721-ae8c3ecc3a45',
      icon: '⚙️',
      products: [
        'Manufacturing Machinery',
        'Construction Equipment',
        'Tools & Hand Equipment',
        'Industrial Spare Parts',
        'Safety Equipment & Gear',
        'Measurement Instruments',
        'Pumps & Valves',
        'Motors & Generators',
        'Industrial Hardware',
        'Welding Equipment',
        'Material Handling Equipment',
        'Packaging Machinery',
        'Textile Machinery',
        'Food Processing Equipment',
        'Agricultural Machinery',
        'Engineering Components'
      ],
      compliance: ['ISO 9001', 'CE Marked', 'Safety Standards', 'Quality Tested', 'ISI Marked', 'Bureau Veritas']
    },
    {
      id: 'chemicals',
      title: 'Chemicals & Materials',
      description: 'Industrial chemicals, raw materials, and specialty chemicals for various industries worldwide.',
      image: 'https://images.unsplash.com/photo-1604778202015-3071e0d7f29b',
      icon: '🧪',
      products: [
        'Industrial Chemicals',
        'Specialty Chemicals',
        'Raw Materials & Compounds',
        'Pharmaceutical Intermediates',
        'Additives & Catalysts',
        'Polymers & Plastics',
        'Solvents & Thinners',
        'Dyes & Pigments',
        'Adhesives & Sealants',
        'Cleaning Chemicals',
        'Construction Chemicals',
        'Water Treatment Chemicals',
        'Lubricants & Oils',
        'Fertilizers & Nutrients',
        'Cosmetic Ingredients',
        'Food Grade Chemicals'
      ],
      compliance: ['REACH Compliant', 'GHS Standards', 'ISO 14001', 'Safety Data Sheets', 'FDA Approved', 'MSDS Certified']
    },
    {
      id: 'automotive',
      title: 'Automotive Parts',
      description: 'Automotive components, spare parts, and accessories for global automotive industry.',
      image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3',
      icon: '🚗',
      products: [
        'Engine Parts & Components',
        'Brake Systems & Parts',
        'Transmission Components',
        'Electrical Auto Parts',
        'Body Parts & Panels',
        'Suspension Components',
        'Filters & Fluids',
        'Lighting & Accessories',
        'Interior & Exterior Parts',
        'Tires & Wheels',
        'Batteries & Alternators',
        'Exhaust Systems',
        'Cooling System Parts',
        'Safety & Security Parts',
        'Performance Parts',
        'Commercial Vehicle Parts'
      ],
      compliance: ['ISO/TS 16949', 'QS 9000', 'CE Marked', 'DOT Approved', 'ECE Certified', 'ARAI Tested']
    },
    {
      id: 'pharmaceuticals',
      title: 'Pharmaceuticals & Healthcare',
      description: 'Pharmaceutical products, medical devices, and healthcare items for international markets.',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56',
      icon: '💊',
      products: [
        'Generic Medicines',
        'APIs & Intermediates',
        'Medical Devices',
        'Surgical Instruments',
        'Diagnostic Equipment',
        'Hospital Supplies',
        'Herbal & Ayurvedic Products',
        'Nutraceuticals & Supplements',
        'First Aid Supplies',
        'Laboratory Equipment',
        'Dental Products',
        'Veterinary Medicines',
        'Medical Consumables',
        'Biotechnology Products',
        'Research Chemicals',
        'Healthcare Accessories'
      ],
      compliance: ['WHO-GMP', 'FDA Approved', 'EU-GMP', 'ISO 13485', 'USP Standards', 'MHRA Certified']
    }
  ];

  if (selectedCategory) {
    const category = productCategories.find(cat => cat.id === selectedCategory);
    if (category) {
      return (
        <section className="py-20 bg-white min-h-screen">
          <div className="container mx-auto px-6">
            <div className="mb-8">
              <button
                onClick={() => setSelectedCategory(null)}
                className="flex items-center text-teal-600 hover:text-teal-700 font-semibold"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to All Categories
              </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="text-6xl mb-4">{category.icon}</div>
                <h1 className="text-4xl font-bold text-gray-800 mb-6">{category.title}</h1>
                <p className="text-xl text-gray-600 mb-8">{category.description}</p>
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-4">Our Products</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {category.products.map((product, index) => (
                      <div key={index} className="flex items-center">
                        <svg className="w-4 h-4 text-teal-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700">{product}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-4">Compliance & Certifications</h3>
                  <div className="flex flex-wrap gap-2">
                    {category.compliance.map((cert, index) => (
                      <span key={index} className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm font-medium">
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => setCurrentPage('quote')}
                  className="px-8 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-semibold text-lg"
                >
                  Request Quote for {category.title}
                </button>
              </div>
              <div className="relative">
                <img
                  src={category.image}
                  alt={category.title}
                  className="rounded-2xl shadow-2xl w-full"
                />
                <div className="absolute -bottom-6 -left-6 bg-teal-600 text-white p-6 rounded-2xl shadow-xl">
                  <div className="text-2xl font-bold">MOQ</div>
                  <div className="text-lg">Flexible</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      );
    }
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Our Export Categories
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our diverse range of export products, each category backed by
            quality assurance and international compliance standards.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {productCategories.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer"
              onClick={() => setSelectedCategory(category.id)}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={category.image}
                  alt={category.title}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4 bg-white p-3 rounded-full text-3xl shadow-lg">
                  {category.icon}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-3">{category.title}</h3>
                <p className="text-gray-600 mb-4">{category.description}</p>
                <div className="flex items-center text-teal-600 font-semibold hover:text-teal-700">
                  <span>Explore Category</span>
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// About Component
export const About = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              About OneEXIM
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Founded in 2025 with the vision of making exports accessible and simple for businesses of all sizes,
              OneEXIM has quickly established itself as a trusted partner for companies looking to expand their reach into
              international markets. We specialize in handling the complexities of export procedures,
              allowing you to focus on what you do best - growing your business.
            </p>
            <div className="space-y-6 mb-8">
              <div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-3">Our Mission</h3>
                <p className="text-gray-600">
                  To simplify the export process for businesses by providing comprehensive,
                  reliable, and cost-effective solutions that ensure seamless international trade.
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-3">Our Vision</h3>
                <p className="text-gray-600">
                  To be the leading export facilitation company, empowering businesses to reach
                  global markets with confidence and ease.
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-3">Why "EXPORTING MADE SIMPLE"?</h3>
                <p className="text-gray-600">
                  We believe that every business deserves the opportunity to go global. Our streamlined
                  processes, expert guidance, and comprehensive support make what was once complex, simple.
                </p>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Complete Export Solutions</h3>
                  <p className="text-gray-600">From documentation to delivery, we handle every aspect of your export journey.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">100% Compliance Guarantee</h3>
                  <p className="text-gray-600">Our expert team ensures all your exports meet international standards and regulations.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Cost-Effective Solutions</h3>
                  <p className="text-gray-600">Competitive pricing with transparent costs and no hidden fees.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1610289472743-de6966e12a3e"
              alt="OneEXIM export operations"
              className="rounded-2xl shadow-2xl w-full"
            />
            <div className="absolute -bottom-6 -right-6 bg-teal-600 text-white p-6 rounded-2xl shadow-xl">
              <div className="text-3xl font-bold">2025</div>
              <div className="text-lg">Established</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Testimonials Component
export const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      company: "Mediterranean Foods LLC",
      country: "USA",
      image: "https://images.unsplash.com/photo-1494790108755-2616b056d24d",
      testimonial: "OneEXIM truly made exporting simple for us. Their team handled all the complex documentation and compliance requirements, allowing us to focus on our core business. Highly recommended!",
      rating: 5,
      category: "Food & Agriculture"
    },
    {
      id: 2,
      name: "Ahmed Al-Rahman",
      company: "Dubai Textile Trading",
      country: "UAE",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
      testimonial: "The OneEXIM team's expertise in textile exports is exceptional. They ensured our products met all international standards and reached our customers on time, every time.",
      rating: 5,
      category: "Textiles & Apparel"
    },
    {
      id: 3,
      name: "Lisa Chen",
      company: "European Electronics Import",
      country: "Germany",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
      testimonial: "Working with OneEXIM has been a game-changer for our electronics import business. Their knowledge of CE certification and European regulations is outstanding.",
      rating: 5,
      category: "Electronics"
    }
  ];

  return (
    <section className="py-20 bg-teal-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            What Our Clients Say
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Trusted by businesses worldwide for making exports simple, reliable, and successful.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-6">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">{testimonial.name}</h3>
                  <p className="text-gray-600">{testimonial.company}</p>
                  <p className="text-sm text-teal-600 font-medium">{testimonial.country}</p>
                </div>
              </div>
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, index) => (
                  <svg key={index} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 mb-4 italic">"{testimonial.testimonial}"</p>
              <div className="border-t pt-4">
                <span className="text-sm text-teal-600 font-medium bg-teal-100 px-3 py-1 rounded-full">
                  {testimonial.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Certifications Component
export const Certifications = () => {
  const certifications = [
    {
      name: "IEC (Import Export Code)",
      description: "Authorized for international trade operations",
      icon: "🏛️",
      status: "Verified"
    },
    {
      name: "GST Registration",
      description: "Goods and Services Tax compliance",
      icon: "📋",
      status: "Active"
    },
    {
      name: "FIEO Membership",
      description: "Federation of Indian Export Organisations",
      icon: "🌐",
      status: "Member"
    },
    {
      name: "APEDA Registration",
      description: "Agricultural Products Export Development Authority",
      icon: "🌾",
      status: "Registered"
    },
    {
      name: "ISO 9001:2015",
      description: "Quality Management System",
      icon: "⭐",
      status: "Certified"
    },
    {
      name: "Export Excellence Award",
      description: "Outstanding export performance",
      icon: "🏆",
      status: "Awarded"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Our Certifications & Credentials
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            OneEXIM's commitment to compliance and quality is backed by official certifications
            and memberships in renowned trade organizations.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {certifications.map((cert, index) => (
            <div key={index} className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-shadow duration-300 text-center">
              <div className="text-6xl mb-4">{cert.icon}</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">{cert.name}</h3>
              <p className="text-gray-600 mb-4">{cert.description}</p>
              <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                cert.status === 'Verified' || cert.status === 'Active' || cert.status === 'Certified' || cert.status === 'Awarded'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-teal-100 text-teal-800'
              }`}>
                {cert.status}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-16 text-center">
          <div className="bg-teal-50 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Legal Compliance Guarantee</h3>
            <p className="text-gray-600 mb-6">
              OneEXIM maintains full compliance with all international trade regulations, customs requirements,
              and quality standards to ensure smooth and legal export operations for all our clients.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-teal-600 mb-2">100%</div>
                <div className="text-gray-700">Compliance Success</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-teal-600 mb-2">Zero</div>
                <div className="text-gray-700">Legal Issues</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-teal-600 mb-2">24/7</div>
                <div className="text-gray-700">Expert Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Contact Component
export const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('');

    try {
      const response = await axios.post('/contact', formData);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '', company: '', message: '' });
      setTimeout(() => setSubmitStatus(''), 5000);
    } catch (error) {
      setSubmitStatus('error');
      console.error('Error submitting contact form:', error);
      setTimeout(() => setSubmitStatus(''), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Contact OneEXIM
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ready to make exporting simple for your business? Get in touch with
            our export specialists and let's discuss how we can help you reach global markets.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Get in Touch</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Office Address</h3>
                    <p className="text-gray-600">
                      OneEXIM Export House<br />
                      123 Export Plaza, International Trade Center<br />
                      Mumbai, Maharashtra 400001, India
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Phone Numbers</h3>
                    <p className="text-gray-600">
                      +91-98765-43210 (Primary)<br />
                      +91-98765-43211 (Export Desk)<br />
                      +1-555-123-4567 (International)
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Email Addresses</h3>
                    <p className="text-gray-600">
                      info@oneexim.in<br />
                      exports@oneexim.in<br />
                      support@oneexim.in
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Working Hours</h3>
                    <p className="text-gray-600">
                      Monday - Friday: 9:00 AM - 6:00 PM IST<br />
                      Saturday: 9:00 AM - 2:00 PM IST<br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Connect with OneEXIM</h3>
                <div className="flex space-x-4">
                  <a href="#" className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center text-white hover:bg-teal-700 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                    </svg>
                  </a>
                  <a href="#" className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center text-white hover:bg-teal-700 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                  <a href="#" className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-white hover:bg-green-600 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Send Us a Message</h2>
            {submitStatus === 'success' && (
              <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                Thank you for contacting OneEXIM! Our export specialists will get back to you within 24 hours.
              </div>
            )}
            {submitStatus === 'error' && (
              <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                Sorry, there was an error sending your message. Please try again or contact us directly.
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Tell us about your export requirements, target markets, product categories, etc."
                  required
                  disabled={isSubmitting}
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-8 py-4 bg-teal-600 text-white rounded-lg text-lg font-semibold hover:bg-teal-700 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

// Quote Request Form Component
export const QuoteForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    product_category: '',
    product_description: '',
    destination_country: '',
    quantity: '',
    moq: '',
    urgency: '',
    special_instructions: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('');

    try {
      const response = await axios.post('/quote', formData);
      setSubmitStatus('success');
      setFormData({
        name: '',
        company: '',
        email: '',
        phone: '',
        product_category: '',
        product_description: '',
        destination_country: '',
        quantity: '',
        moq: '',
        urgency: '',
        special_instructions: ''
      });
      setTimeout(() => setSubmitStatus(''), 5000);
    } catch (error) {
      setSubmitStatus('error');
      console.error('Error submitting quote request:', error);
      setTimeout(() => setSubmitStatus(''), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const productCategories = [
    'Food & Agriculture',
    'Textiles & Apparel',
    'Electronics & Components',
    'Handicrafts & Home Decor',
    'Industrial Equipment',
    'Chemicals & Materials',
    'Other (Please specify in description)'
  ];

  return (
    <section className="py-20 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Request Export Quote
            </h1>
            <p className="text-xl text-gray-600">
              Get a detailed and competitive quote from OneEXIM for your export requirements.
              Fill out the form below and our export specialists will respond within 24 hours.
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {submitStatus === 'success' && (
              <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                Export quote request submitted successfully! Our OneEXIM specialists will get back to you within 24 hours with a detailed quotation.
              </div>
            )}
            {submitStatus === 'error' && (
              <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                Sorry, there was an error submitting your quote request. Please try again or contact us directly.
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company Name *</label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </div>

              {/* Product Information */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Export Requirements</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Category *</label>
                    <select
                      value={formData.product_category}
                      onChange={(e) => setFormData({ ...formData, product_category: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      required
                      disabled={isSubmitting}
                    >
                      <option value="">Select a category</option>
                      {productCategories.map((category, index) => (
                        <option key={index} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Destination Country *</label>
                    <input
                      type="text"
                      value={formData.destination_country}
                      onChange={(e) => setFormData({ ...formData, destination_country: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="e.g., United States, Germany, UAE"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Quantity Required *</label>
                    <input
                      type="text"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="e.g., 1000 kg, 500 pieces, 10 containers"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Order Quantity (MOQ)</label>
                    <input
                      type="text"
                      value={formData.moq}
                      onChange={(e) => setFormData({ ...formData, moq: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="Optional - if you have MOQ requirements"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Description *</label>
                  <textarea
                    value={formData.product_description}
                    onChange={(e) => setFormData({ ...formData, product_description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Detailed description of the products you want to export, including specifications, quality requirements, packaging preferences, etc."
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Additional Information */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Additional Requirements</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Timeline Urgency</label>
                    <select
                      value={formData.urgency}
                      onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      disabled={isSubmitting}
                    >
                      <option value="">Select timeline</option>
                      <option value="Standard (30-45 days)">Standard (30-45 days)</option>
                      <option value="Priority (15-30 days)">Priority (15-30 days)</option>
                      <option value="Express (7-15 days)">Express (7-15 days)</option>
                      <option value="Emergency (Less than 7 days)">Emergency (Less than 7 days)</option>
                    </select>
                  </div>
                  <div className="md:col-span-1">
                    {/* Spacer for grid alignment */}
                  </div>
                </div>
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Special Instructions</label>
                  <textarea
                    value={formData.special_instructions}
                    onChange={(e) => setFormData({ ...formData, special_instructions: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Any specific certifications needed, packaging instructions, delivery preferences, budget constraints, compliance requirements, etc."
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-8 py-4 bg-teal-600 text-white rounded-lg text-lg font-semibold hover:bg-teal-700 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Export Quote Request'}
              </button>
            </form>
            <div className="mt-8 p-6 bg-teal-50 rounded-lg">
              <h4 className="text-lg font-semibold text-gray-800 mb-3">What happens next with OneEXIM?</h4>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-teal-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Our export specialists will review your requirements within 24 hours
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-teal-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  We'll provide a comprehensive quotation with all costs and timelines
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-teal-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Schedule a consultation to discuss your export strategy and next steps
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Login Modal Component
export const LoginModal = ({ onClose, onSwitchToRegister }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      alert('Welcome to your OneEXIM Client Portal!');
      onClose();
      window.location.href = '/portal';
    } else {
      setError(result.error);
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">OneEXIM Client Portal</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              required
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              required
              disabled={isSubmitting}
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Logging in...' : 'Access Portal'}
          </button>
        </form>
        <div className="mt-6 text-center">
          <span className="text-gray-600">New to OneEXIM? </span>
          <button
            onClick={onSwitchToRegister}
            className="text-teal-600 hover:text-teal-700 font-semibold"
          >
            Register here
          </button>
        </div>
      </div>
    </div>
  );
};

// Register Modal Component
export const RegisterModal = ({ onClose, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!');
      setIsSubmitting(false);
      return;
    }

    const result = await register({
      name: formData.name,
      company: formData.company,
      email: formData.email,
      password: formData.password
    });

    if (result.success) {
      alert('Registration successful! Welcome to OneEXIM - where exporting is made simple!');
      onClose();
    } else {
      setError(result.error);
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Join OneEXIM</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              required
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              required
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              required
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              required
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              required
              disabled={isSubmitting}
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        <div className="mt-6 text-center">
          <span className="text-gray-600">Already have an account? </span>
          <button
            onClick={onSwitchToLogin}
            className="text-teal-600 hover:text-teal-700 font-semibold"
          >
            Login here
          </button>
        </div>
      </div>
    </div>
  );
};

// Footer Component
export const Footer = ({ setCurrentPage, setShowLoginModal }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center relative overflow-hidden">
                {/* Globe with containers design inspired by logo */}
                <svg className="w-10 h-10 text-white" viewBox="0 0 40 40" fill="currentColor">
                  <circle cx="20" cy="20" r="18" fill="currentColor" opacity="0.8" />
                  <path d="M8 20 Q20 12 32 20 Q20 28 8 20" fill="white" opacity="0.3" />
                  <rect x="15" y="16" width="3" height="2" fill="white" />
                  <rect x="19" y="16" width="3" height="2" fill="white" />
                  <rect x="23" y="16" width="3" height="2" fill="white" />
                  <path d="M28 15 L32 11 M28 15 L32 19 M28 15 L32 15" stroke="white" strokeWidth="2" fill="none" />
                </svg>
              </div>
              <div>
                <span className="text-2xl font-bold">OneEXIM</span>
                <div className="text-xs text-teal-200">EXPORTING MADE SIMPLE</div>
              </div>
            </div>
            <p className="text-gray-400 mb-6">
              OneEXIM - Your trusted partner for seamless export solutions. We handle the complexities
              of international trade so you can focus on growing your business globally.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                </svg>
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => setCurrentPage('home')}
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentPage('about')}
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  About OneEXIM
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentPage('products')}
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Export Categories
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentPage('quote')}
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Get Export Quote
                </button>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-6">Export Services</h3>
            <ul className="space-y-3 text-gray-400">
              <li>Food & Agriculture</li>
              <li>Textiles & Apparel</li>
              <li>Electronics & Components</li>
              <li>Handicrafts & Home Decor</li>
              <li>Industrial Equipment</li>
              <li>Chemicals & Materials</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-6">Contact OneEXIM</h3>
            <div className="space-y-3 text-gray-400">
              <p>📍 OneEXIM Export House, Mumbai, India</p>
              <p>📞 +91-98765-43210</p>
              <p>✉️ info@oneexim.in</p>
              <p>🕒 Mon-Fri: 9 AM - 6 PM IST</p>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <p className="text-gray-400 text-center md:text-left">
              &copy; {currentYear} OneEXIM. All rights reserved. EXPORTING MADE SIMPLE.
            </p>
            <div className="text-center md:text-right">
              <span className="text-gray-400 text-sm">
                IEC: ONEEC1234F | GST: 27ONEEC1234F1ZV | FIEO Member
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};