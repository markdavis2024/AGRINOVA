"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  ChevronDown,
  Layout,
  LogOut,
  Menu,
  Search,
  X,
  Store,
  Package,
  Star,
  MapPin,
  User,
  Filter,
  Grid,
  List,
  Heart,
  ShoppingCart,
  Eye,
  Clock,
  Truck,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useAnySession } from "@/lib/useSession";
import NotificationBell from "@/components/NotificationBell";

interface Product {
  id: number;
  name: string;
  category: string;
  farmer: string;
  farmerLocation: string;
  price: number;
  unit: string;
  quantity: number;
  rating: number;
  reviews: number;
  image: string;
  description: string;
  available: boolean;
  delivery: string;
}

const mockProducts: Product[] = [
  {
    id: 1,
    name: "Fresh Maize",
    category: "Grains",
    farmer: "Jean Baptiste",
    farmerLocation: "Bamenda, Cameroon",
    price: 500,
    unit: "kg",
    quantity: 500,
    rating: 4.8,
    reviews: 34,
    image: "/AGRINOVA-logo.png",
    description: "High-quality fresh maize harvested this season. Suitable for human consumption and animal feed.",
    available: true,
    delivery: "Available for delivery"
  },
  {
    id: 2,
    name: "Organic Tomatoes",
    category: "Vegetables",
    farmer: "Marie Claire",
    farmerLocation: "Yaoundé, Cameroon",
    price: 800,
    unit: "kg",
    quantity: 200,
    rating: 4.9,
    reviews: 56,
    image: "/AGRINOVA-logo.png",
    description: "Organic tomatoes grown without pesticides. Perfect for fresh consumption and processing.",
    available: true,
    delivery: "Available for delivery"
  },
  {
    id: 3,
    name: "Cassava Tubers",
    category: "Roots",
    farmer: "Paul Atanga",
    farmerLocation: "Douala, Cameroon",
    price: 300,
    unit: "kg",
    quantity: 1000,
    rating: 4.5,
    reviews: 28,
    image: "/AGRINOVA-logo.png",
    description: "Fresh cassava tubers ready for processing or direct consumption. High starch content.",
    available: true,
    delivery: "Pickup only"
  },
  {
    id: 4,
    name: "Cocoa Beans",
    category: "Cash Crops",
    farmer: "Amina Ndongo",
    farmerLocation: "Buea, Cameroon",
    price: 2500,
    unit: "kg",
    quantity: 100,
    rating: 4.7,
    reviews: 42,
    image: "/AGRINOVA-logo.png",
    description: "Premium quality cocoa beans from the Southwest region. Fermented and dried to perfection.",
    available: false,
    delivery: "Available for delivery"
  },
  {
    id: 5,
    name: "Fresh Plantains",
    category: "Fruits",
    farmer: "Joseph Mbarga",
    farmerLocation: "Limbe, Cameroon",
    price: 400,
    unit: "bunch",
    quantity: 150,
    rating: 4.6,
    reviews: 31,
    image: "/AGRINOVA-logo.png",
    description: "Fresh plantains harvested at optimal ripeness. Great for cooking and frying.",
    available: true,
    delivery: "Available for delivery"
  },
  {
    id: 6,
    name: "Groundnuts",
    category: "Legumes",
    farmer: "Sylvie Ndam",
    farmerLocation: "Garoua, Cameroon",
    price: 600,
    unit: "kg",
    quantity: 300,
    rating: 4.4,
    reviews: 19,
    image: "/AGRINOVA-logo.png",
    description: "High-quality groundnuts with excellent oil content. Suitable for consumption and processing.",
    available: true,
    delivery: "Available for delivery"
  },
];

const categories = [
  "All",
  "Grains",
  "Vegetables",
  "Fruits",
  "Roots",
  "Cash Crops",
  "Legumes",
  "Livestock",
];

export default function MarketplacePage() {
  const router = useRouter();
  const { user, loading } = useAnySession();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [wishlist, setWishlist] = useState<number[]>([]);

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.farmer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleWishlist = (productId: number) => {
    setWishlist(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  if (loading || !user) {
    return (
      <div className="marketplace-loading">
        <div className="marketplace-loading-spinner"></div>
        <span>Loading marketplace...</span>
      </div>
    );
  }

  const initial = user.name.charAt(0).toUpperCase();
  const firstName = user.name.split(" ")[0];
  const isBuyer = user.role === "BUYER";

  return (
    <div className="marketplace-page">
      {/* Topbar */}
      <header className="marketplace-topbar">
        <button
          className="marketplace-menu-btn"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>

        <div className="marketplace-brand">
          <span className="marketplace-brand-icon">🌱</span>
          <span className="marketplace-brand-text">AGRINOVA</span>
          <span className="marketplace-brand-badge">Marketplace</span>
        </div>

        <div className="marketplace-search">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search products, farmers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="marketplace-topbar-actions">
          <NotificationBell userId={user.id} />

          <div className="marketplace-profile">
            <button
              className="marketplace-profile-btn"
              onClick={() => setProfileOpen((v) => !v)}
            >
              <div className="marketplace-avatar marketplace-avatar-small">{initial}</div>
              <span>{firstName}</span>
              <ChevronDown size={14} />
            </button>

            {profileOpen && (
              <div className="marketplace-profile-menu">
                <Link href="/" className="marketplace-profile-menu-item">
                  <Layout size={14} />
                  Back to landing page
                </Link>
                <Link href="/buyer" className="marketplace-profile-menu-item">
                  <Layout size={14} />
                  Dashboard
                </Link>
                <button
                  className="marketplace-profile-menu-item"
                  onClick={() => router.push("/login")}
                >
                  <LogOut size={14} />
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="marketplace-content">
        {/* Categories */}
        <div className="marketplace-categories">
          {categories.map((category) => (
            <button
              key={category}
              className={`marketplace-category-btn ${
                selectedCategory === category ? "marketplace-category-active" : ""
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Toolbar */}
        <div className="marketplace-toolbar">
          <span className="marketplace-result-count">
            {filteredProducts.length} products found
          </span>
          <div className="marketplace-toolbar-actions">
            <button
              className={`marketplace-view-btn ${viewMode === "grid" ? "marketplace-view-active" : ""}`}
              onClick={() => setViewMode("grid")}
            >
              <Grid size={18} />
            </button>
            <button
              className={`marketplace-view-btn ${viewMode === "list" ? "marketplace-view-active" : ""}`}
              onClick={() => setViewMode("list")}
            >
              <List size={18} />
            </button>
            <button className="marketplace-filter-btn">
              <Filter size={18} />
              Filter
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div className={`marketplace-products ${viewMode === "list" ? "marketplace-products-list" : "marketplace-products-grid"}`}>
          {filteredProducts.length === 0 ? (
            <div className="marketplace-empty">
              <Store size={48} />
              <h3>No products found</h3>
              <p>Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            filteredProducts.map((product) => (
              <div
                key={product.id}
                className={`marketplace-product-card ${viewMode === "list" ? "marketplace-product-card-list" : ""}`}
              >
                <div className="marketplace-product-image">
                  <div className="marketplace-product-img-placeholder">
                    <Store size={32} />
                  </div>
                  {!product.available && (
                    <span className="marketplace-product-unavailable">Unavailable</span>
                  )}
                </div>

                <div className="marketplace-product-info">
                  <div className="marketplace-product-header">
                    <div>
                      <h3 className="marketplace-product-name">{product.name}</h3>
                      <span className="marketplace-product-category">{product.category}</span>
                    </div>
                    <button
                      className={`marketplace-product-wishlist ${
                        wishlist.includes(product.id) ? "marketplace-product-wishlist-active" : ""
                      }`}
                      onClick={() => toggleWishlist(product.id)}
                    >
                      <Heart size={18} />
                    </button>
                  </div>

                  <div className="marketplace-product-farmer">
                    <User size={14} />
                    <span>{product.farmer}</span>
                    <MapPin size={14} />
                    <span>{product.farmerLocation}</span>
                  </div>

                  <div className="marketplace-product-rating">
                    <Star size={14} className="marketplace-product-star" />
                    <span>{product.rating}</span>
                    <span className="marketplace-product-reviews">({product.reviews} reviews)</span>
                  </div>

                  <p className="marketplace-product-description">{product.description}</p>

                  <div className="marketplace-product-footer">
                    <div>
                      <span className="marketplace-product-price">
                        {product.price.toLocaleString()} FCFA
                      </span>
                      <span className="marketplace-product-unit">/ {product.unit}</span>
                      <span className="marketplace-product-quantity">
                        {product.quantity} {product.unit} available
                      </span>
                    </div>
                    {product.available ? (
                      <div className="marketplace-product-actions">
                        <button className="marketplace-product-cart-btn">
                          <ShoppingCart size={16} />
                          Add to Cart
                        </button>
                        <button className="marketplace-product-view-btn">
                          <Eye size={16} />
                        </button>
                      </div>
                    ) : (
                      <span className="marketplace-product-sold-out">Sold Out</span>
                    )}
                  </div>

                  {product.delivery && (
                    <div className="marketplace-product-delivery">
                      <Truck size={14} />
                      <span>{product.delivery}</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <style jsx>{`
        /* Page */
        .marketplace-page {
          min-height: 100vh;
          background: #f5f0e8;
        }

        /* Loading */
        .marketplace-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background: #f5f0e8;
          gap: 0.75rem;
          color: #6b7280;
        }

        .marketplace-loading-spinner {
          width: 1.5rem;
          height: 1.5rem;
          border: 2px solid #e8e0d5;
          border-top-color: #7cb342;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Topbar */
        .marketplace-topbar {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.75rem 1.5rem;
          background: #faf8f5;
          border-bottom: 1px solid #e8e0d5;
          position: sticky;
          top: 0;
          z-index: 10;
          flex-wrap: wrap;
        }

        .marketplace-menu-btn {
          padding: 0.5rem;
          background: none;
          border: none;
          border-radius: 0.5rem;
          cursor: pointer;
          color: #6b7280;
          transition: background 0.2s;
          display: none;
        }

        .marketplace-menu-btn:hover {
          background: #f5f0e8;
        }

        @media (max-width: 768px) {
          .marketplace-menu-btn {
            display: block;
          }
        }

        .marketplace-brand {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-shrink: 0;
        }

        .marketplace-brand-icon {
          font-size: 1.5rem;
        }

        .marketplace-brand-text {
          font-size: 1.125rem;
          font-weight: 700;
          color: #2d5a27;
        }

        .marketplace-brand-badge {
          font-size: 0.625rem;
          color: #7cb342;
          background: #e8f5e9;
          padding: 0.125rem 0.5rem;
          border-radius: 9999px;
          font-weight: 500;
          text-transform: uppercase;
        }

        .marketplace-search {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: white;
          border: 1px solid #e8e0d5;
          border-radius: 0.75rem;
          padding: 0.5rem 0.75rem;
          min-width: 200px;
          transition: border-color 0.2s;
        }

        .marketplace-search:focus-within {
          border-color: #7cb342;
          box-shadow: 0 0 0 3px rgba(124, 179, 66, 0.1);
        }

        .marketplace-search input {
          flex: 1;
          border: none;
          outline: none;
          font-size: 0.875rem;
          background: transparent;
          color: #2d5a27;
          min-width: 0;
        }

        .marketplace-search input::placeholder {
          color: #9ca3af;
        }

        .marketplace-search svg {
          color: #9ca3af;
          flex-shrink: 0;
        }

        .marketplace-topbar-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-shrink: 0;
        }

        .marketplace-profile {
          position: relative;
        }

        .marketplace-profile-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.375rem 0.5rem;
          background: none;
          border: none;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: background 0.2s;
          font-size: 0.875rem;
          color: #2d5a27;
          font-weight: 500;
          font-family: inherit;
        }

        .marketplace-profile-btn:hover {
          background: #f5f0e8;
        }

        .marketplace-avatar {
          width: 2rem;
          height: 2rem;
          background: linear-gradient(135deg, #7cb342, #558b2f);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 600;
          color: white;
          flex-shrink: 0;
        }

        .marketplace-avatar-small {
          width: 2rem;
          height: 2rem;
          font-size: 0.7rem;
        }

        .marketplace-profile-menu {
          position: absolute;
          top: 100%;
          right: 0;
          background: white;
          border: 1px solid #e8e0d5;
          border-radius: 0.75rem;
          box-shadow: 0 10px 40px rgba(0,0,0,0.1);
          min-width: 200px;
          margin-top: 0.5rem;
          overflow: hidden;
          z-index: 10;
        }

        .marketplace-profile-menu-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.625rem 1rem;
          color: #6b7280;
          text-decoration: none;
          font-size: 0.875rem;
          transition: background 0.2s;
          width: 100%;
          border: none;
          background: none;
          cursor: pointer;
          font-family: inherit;
        }

        .marketplace-profile-menu-item:hover {
          background: #f5f0e8;
          color: #2d5a27;
        }

        /* Content */
        .marketplace-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 1.5rem;
        }

        /* Categories */
        .marketplace-categories {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
          margin-bottom: 1.5rem;
        }

        .marketplace-category-btn {
          padding: 0.375rem 1rem;
          border: 1px solid #e8e0d5;
          border-radius: 9999px;
          font-size: 0.75rem;
          color: #6b7280;
          background: #faf8f5;
          cursor: pointer;
          transition: all 0.2s;
          font-family: inherit;
        }

        .marketplace-category-btn:hover {
          border-color: #7cb342;
          color: #2d5a27;
        }

        .marketplace-category-active {
          background: #7cb342;
          color: white;
          border-color: #7cb342;
        }

        .marketplace-category-active:hover {
          background: #558b2f;
          color: white;
        }

        /* Toolbar */
        .marketplace-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .marketplace-result-count {
          font-size: 0.875rem;
          color: #6b7280;
        }

        .marketplace-toolbar-actions {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .marketplace-view-btn {
          padding: 0.375rem;
          border: 1px solid #e8e0d5;
          border-radius: 0.5rem;
          background: #faf8f5;
          cursor: pointer;
          color: #6b7280;
          transition: all 0.2s;
        }

        .marketplace-view-btn:hover {
          border-color: #7cb342;
          color: #2d5a27;
        }

        .marketplace-view-active {
          background: #7cb342;
          color: white;
          border-color: #7cb342;
        }

        .marketplace-filter-btn {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          padding: 0.375rem 0.75rem;
          border: 1px solid #e8e0d5;
          border-radius: 0.5rem;
          background: #faf8f5;
          cursor: pointer;
          color: #6b7280;
          font-size: 0.75rem;
          font-family: inherit;
          transition: all 0.2s;
        }

        .marketplace-filter-btn:hover {
          border-color: #7cb342;
          color: #2d5a27;
        }

        /* Products Grid */
        .marketplace-products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .marketplace-products-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .marketplace-product-card {
          background: #faf8f5;
          border: 1px solid #e8e0d5;
          border-radius: 1rem;
          overflow: hidden;
          transition: all 0.2s;
        }

        .marketplace-product-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          border-color: #7cb342;
        }

        .marketplace-product-card-list {
          display: flex;
        }

        .marketplace-product-card-list .marketplace-product-image {
          width: 200px;
          min-height: 200px;
          flex-shrink: 0;
        }

        @media (max-width: 640px) {
          .marketplace-product-card-list {
            flex-direction: column;
          }
          .marketplace-product-card-list .marketplace-product-image {
            width: 100%;
            min-height: 150px;
          }
        }

        .marketplace-product-image {
          position: relative;
          background: #f5f0e8;
          min-height: 180px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .marketplace-product-img-placeholder {
          color: #9ca3af;
        }

        .marketplace-product-unavailable {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          background: #ef5350;
          color: white;
          font-size: 0.625rem;
          font-weight: 600;
          padding: 0.125rem 0.5rem;
          border-radius: 9999px;
        }

        .marketplace-product-info {
          padding: 1rem;
          flex: 1;
        }

        .marketplace-product-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.5rem;
        }

        .marketplace-product-name {
          font-size: 1rem;
          font-weight: 600;
          color: #2d5a27;
          margin: 0;
        }

        .marketplace-product-category {
          font-size: 0.625rem;
          color: #7cb342;
          background: #e8f5e9;
          padding: 0.125rem 0.5rem;
          border-radius: 9999px;
        }

        .marketplace-product-wishlist {
          background: none;
          border: none;
          cursor: pointer;
          color: #9ca3af;
          padding: 0.25rem;
          transition: color 0.2s;
        }

        .marketplace-product-wishlist:hover {
          color: #ef5350;
        }

        .marketplace-product-wishlist-active {
          color: #ef5350;
        }

        .marketplace-product-farmer {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          font-size: 0.75rem;
          color: #6b7280;
          margin-bottom: 0.25rem;
        }

        .marketplace-product-farmer svg {
          color: #9ca3af;
        }

        .marketplace-product-rating {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.75rem;
          color: #2d5a27;
          margin-bottom: 0.5rem;
        }

        .marketplace-product-star {
          color: #f9a825;
          fill: #f9a825;
        }

        .marketplace-product-reviews {
          color: #9ca3af;
        }

        .marketplace-product-description {
          font-size: 0.75rem;
          color: #6b7280;
          margin-bottom: 0.75rem;
          line-height: 1.5;
        }

        .marketplace-product-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .marketplace-product-price {
          font-size: 1.125rem;
          font-weight: 700;
          color: #2d5a27;
        }

        .marketplace-product-unit {
          font-size: 0.75rem;
          color: #6b7280;
        }

        .marketplace-product-quantity {
          font-size: 0.7rem;
          color: #9ca3af;
          display: block;
        }

        .marketplace-product-actions {
          display: flex;
          gap: 0.5rem;
        }

        .marketplace-product-cart-btn {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          padding: 0.375rem 0.75rem;
          background: #7cb342;
          color: white;
          border: none;
          border-radius: 0.5rem;
          font-size: 0.7rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
          font-family: inherit;
        }

        .marketplace-product-cart-btn:hover {
          background: #558b2f;
        }

        .marketplace-product-view-btn {
          padding: 0.375rem 0.5rem;
          background: #f5f0e8;
          border: 1px solid #e8e0d5;
          border-radius: 0.5rem;
          cursor: pointer;
          color: #6b7280;
          transition: all 0.2s;
        }

        .marketplace-product-view-btn:hover {
          border-color: #7cb342;
          color: #2d5a27;
        }

        .marketplace-product-sold-out {
          font-size: 0.75rem;
          font-weight: 600;
          color: #ef5350;
        }

        .marketplace-product-delivery {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          font-size: 0.65rem;
          color: #6b7280;
          margin-top: 0.5rem;
          padding-top: 0.5rem;
          border-top: 1px solid #f5f0e8;
        }

        .marketplace-product-delivery svg {
          color: #7cb342;
        }

        /* Empty */
        .marketplace-empty {
          grid-column: 1 / -1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem;
          background: #faf8f5;
          border: 1px solid #e8e0d5;
          border-radius: 1rem;
          color: #9ca3af;
          text-align: center;
        }

        .marketplace-empty h3 {
          font-size: 1.125rem;
          color: #2d5a27;
          margin: 1rem 0 0.25rem 0;
        }

        .marketplace-empty p {
          font-size: 0.875rem;
          margin: 0;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .marketplace-topbar {
            padding: 0.5rem 1rem;
          }

          .marketplace-search {
            min-width: 150px;
          }

          .marketplace-content {
            padding: 1rem;
          }

          .marketplace-products-grid {
            grid-template-columns: 1fr;
          }

          .marketplace-brand-text {
            display: none;
          }
        }

        @media (max-width: 480px) {
          .marketplace-topbar {
            gap: 0.5rem;
          }

          .marketplace-product-footer {
            flex-direction: column;
            align-items: flex-start;
          }

          .marketplace-product-actions {
            width: 100%;
          }

          .marketplace-product-cart-btn {
            flex: 1;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}