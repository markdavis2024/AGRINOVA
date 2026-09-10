"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  Clock,
  User,
  Video,
  Phone,
  MapPin,
  MessageCircle,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  Filter,
  Star,
  Users,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  Loader2,
  BadgeCheck,
  Award,
  BookOpen,
  Sparkles,
  Clock as ClockIcon,
  Bell,
  Menu,
  ChevronDown,
  Layout,
  LogOut,
  LayoutDashboard,
  Settings,
  Sprout,
  Activity,
} from "lucide-react";
import { useSession } from "@/lib/useSession";
import DashboardSidebar from "@/components/DashboardSidebar";
import NotificationBell from "@/components/NotificationBell";

interface Expert {
  id: number;
  name: string;
  title: string;
  specialty: string;
  rating: number;
  reviews: number;
  location: string;
  available: boolean;
  image: string;
  price: number;
  experience: string;
  languages: string[];
  bio: string;
  education: string;
  availability: { day: string; slots: string[] }[];
}

interface Consultation {
  id: string;
  expertId: number;
  expertName: string;
  expertTitle: string;
  date: string;
  time: string;
  type: "video" | "phone" | "in-person";
  status: "pending" | "confirmed" | "completed" | "cancelled";
  notes: string;
  price: number;
}

const mockExperts: Expert[] = [
  {
    id: 1,
    name: "Dr. Paul Atanga",
    title: "Senior Agri-Expert",
    specialty: "Crop Management & Pest Control",
    rating: 4.9,
    reviews: 127,
    location: "Bamenda, Cameroon",
    available: true,
    image: "/AGRINOVA-logo.png",
    price: 15000,
    experience: "12 years",
    languages: ["English", "French", "Pidgin"],
    bio: "Specializing in crop management, pest control, and sustainable farming practices. I've helped over 500 farmers increase their yields.",
    education: "PhD in Agricultural Science - University of Dschang",
    availability: [
      { day: "Monday", slots: ["09:00", "10:00", "11:00", "14:00", "15:00"] },
      { day: "Wednesday", slots: ["09:00", "10:00", "11:00", "14:00", "15:00"] },
      { day: "Friday", slots: ["09:00", "10:00", "11:00"] },
    ]
  },
  {
    id: 2,
    name: "Dr. Marie-Claire Ngo",
    title: "Soil Scientist",
    specialty: "Soil Health & Fertilization",
    rating: 4.8,
    reviews: 98,
    location: "Yaoundé, Cameroon",
    available: true,
    image: "/AGRINOVA-logo.png",
    price: 12000,
    experience: "8 years",
    languages: ["French", "English"],
    bio: "Expert in soil analysis, fertility management, and sustainable fertilization techniques.",
    education: "MSc in Soil Science - University of Yaoundé I",
    availability: [
      { day: "Tuesday", slots: ["10:00", "11:00", "14:00", "15:00", "16:00"] },
      { day: "Thursday", slots: ["10:00", "11:00", "14:00", "15:00"] },
    ]
  },
  {
    id: 3,
    name: "Dr. Jean-Pierre Mbarga",
    title: "Livestock Specialist",
    specialty: "Animal Health & Breeding",
    rating: 4.7,
    reviews: 85,
    location: "Douala, Cameroon",
    available: false,
    image: "/AGRINOVA-logo.png",
    price: 18000,
    experience: "15 years",
    languages: ["English", "French"],
    bio: "Specializing in livestock health, breeding programs, and animal nutrition.",
    education: "DVM - University of Ngaoundéré",
    availability: [
      { day: "Monday", slots: ["09:00", "10:00", "13:00", "14:00"] },
      { day: "Thursday", slots: ["09:00", "10:00", "11:00"] },
    ]
  },
  {
    id: 4,
    name: "Dr. Sylvie Ndam",
    title: "Agro-Economist",
    specialty: "Farm Management & Marketing",
    rating: 4.9,
    reviews: 156,
    location: "Buea, Cameroon",
    available: true,
    image: "/AGRINOVA-logo.png",
    price: 10000,
    experience: "10 years",
    languages: ["English", "French", "German"],
    bio: "Helping farmers optimize their business, access markets, and increase profitability.",
    education: "MSc in Agricultural Economics - University of Buea",
    availability: [
      { day: "Tuesday", slots: ["09:00", "10:00", "11:00", "14:00", "15:00"] },
      { day: "Thursday", slots: ["09:00", "10:00", "11:00", "14:00"] },
      { day: "Friday", slots: ["09:00", "10:00", "11:00"] },
    ]
  },
];

const mockConsultations: Consultation[] = [
  {
    id: "1",
    expertId: 1,
    expertName: "Dr. Paul Atanga",
    expertTitle: "Senior Agri-Expert",
    date: "2024-03-20",
    time: "10:00",
    type: "video",
    status: "confirmed",
    notes: "Discuss maize pest control strategies",
    price: 15000,
  },
  {
    id: "2",
    expertId: 2,
    expertName: "Dr. Marie-Claire Ngo",
    expertTitle: "Soil Scientist",
    date: "2024-03-18",
    time: "14:00",
    type: "in-person",
    status: "completed",
    notes: "Soil testing and fertilizer recommendations",
    price: 12000,
  },
  {
    id: "3",
    expertId: 4,
    expertName: "Dr. Sylvie Ndam",
    expertTitle: "Agro-Economist",
    date: "2024-03-22",
    time: "09:00",
    type: "phone",
    status: "pending",
    notes: "Farm business planning session",
    price: 10000,
  },
];

export default function ConsultationsPage() {
  const router = useRouter();
  const { user, loading } = useSession("FARMER");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [consultationType, setConsultationType] = useState<"video" | "phone" | "in-person">("video");
  const [consultationNotes, setConsultationNotes] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [activeTab, setActiveTab] = useState("experts");
  const [bookingStep, setBookingStep] = useState(1);

  if (loading || !user) {
    return (
      <div className="dash-loading">
        <div className="dash-loading-spinner"></div>
        <span>Loading consultations...</span>
      </div>
    );
  }

  const initial = user.name.charAt(0).toUpperCase();
  const firstName = user.name.split(" ")[0];

  const filteredExperts = mockExperts.filter(expert =>
    expert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expert.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expert.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredConsultations = mockConsultations.filter(consultation => {
    if (filterStatus === "all") return true;
    return consultation.status === filterStatus;
  });

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "text-yellow-600 bg-yellow-50 border-yellow-200",
      confirmed: "text-green-600 bg-green-50 border-green-200",
      completed: "text-blue-600 bg-blue-50 border-blue-200",
      cancelled: "text-red-600 bg-red-50 border-red-200",
    };
    return colors[status] || "text-gray-600 bg-gray-50 border-gray-200";
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, React.ReactNode> = {
      pending: <ClockIcon className="w-4 h-4" />,
      confirmed: <CheckCircle className="w-4 h-4" />,
      completed: <BadgeCheck className="w-4 h-4" />,
      cancelled: <XCircle className="w-4 h-4" />,
    };
    return icons[status] || <AlertCircle className="w-4 h-4" />;
  };

  const getConsultationTypeIcon = (type: string) => {
    const icons: Record<string, React.ReactNode> = {
      video: <Video className="w-4 h-4" />,
      phone: <Phone className="w-4 h-4" />,
      "in-person": <MapPin className="w-4 h-4" />,
    };
    return icons[type] || <Video className="w-4 h-4" />;
  };

  const handleBookConsultation = () => {
    // In production, this would save to database
    alert("Consultation booked successfully! You will receive a confirmation email.");
    setShowBookingModal(false);
    setSelectedExpert(null);
    setBookingStep(1);
  };

  return (
    <div className="dash-page">
      <DashboardSidebar
        user={user}
        onLogout={() => {}}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="dash-main">
        <header className="dash-topbar">
          <button className="dash-menu-btn" onClick={() => setSidebarOpen(true)}>
            <Menu size={20} />
          </button>

          <div className="dash-search">
            <Search size={16} />
            <input type="text" placeholder="Search consultations..." />
          </div>

          <div className="dash-topbar-actions">
            <NotificationBell userId={user.id} />

            <div className="dash-profile">
              <button className="dash-profile-btn" onClick={() => setProfileOpen((v) => !v)}>
                <div className="dash-avatar dash-avatar-small">{initial}</div>
                <span>{firstName}</span>
                <ChevronDown size={14} />
              </button>

              {profileOpen && (
                <div className="dash-profile-menu">
                  <Link href="/" className="dash-profile-menu-item">
                    <Layout size={14} /> Back to landing page
                  </Link>
                  <button className="dash-profile-menu-item" onClick={() => router.push("/login")}>
                    <LogOut size={14} /> Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="dash-content consultations-content">
          {/* Header */}
          <div className="consultations-header">
            <div>
              <h1>📅 Consultations</h1>
              <p>Connect with agricultural experts for personalized advice</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="consultations-tabs">
            <button
              className={`consultations-tab ${activeTab === "experts" ? "consultations-tab-active" : ""}`}
              onClick={() => setActiveTab("experts")}
            >
              <Users className="w-4 h-4" />
              Find Experts
            </button>
            <button
              className={`consultations-tab ${activeTab === "my-consultations" ? "consultations-tab-active" : ""}`}
              onClick={() => setActiveTab("my-consultations")}
            >
              <Calendar className="w-4 h-4" />
              My Consultations
            </button>
          </div>

          {/* Experts Tab */}
          {activeTab === "experts" && (
            <div className="consultations-experts">
              {/* Search & Filter */}
              <div className="consultations-search">
                <div className="consultations-search-input">
                  <Search className="consultations-search-icon" />
                  <input
                    type="text"
                    placeholder="Search by name, specialty, or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <button className="consultations-filter-btn">
                  <Filter className="w-4 h-4" />
                  Filter
                </button>
              </div>

              {/* Experts Grid */}
              <div className="consultations-grid">
                {filteredExperts.map((expert) => (
                  <div key={expert.id} className="consultation-expert-card">
                    <div className="consultation-expert-header">
                      <div className="consultation-expert-avatar">
                        <span>{expert.name.charAt(0)}</span>
                      </div>
                      <div className="consultation-expert-info">
                        <h3>{expert.name}</h3>
                        <p>{expert.title}</p>
                        <div className="consultation-expert-rating">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          <span>{expert.rating}</span>
                          <span className="text-gray-400">({expert.reviews} reviews)</span>
                        </div>
                      </div>
                      <div className={`consultation-expert-status ${expert.available ? 'consultation-expert-available' : 'consultation-expert-unavailable'}`}>
                        {expert.available ? 'Available' : 'Unavailable'}
                      </div>
                    </div>

                    <div className="consultation-expert-body">
                      <div className="consultation-expert-specialty">
                        <span>Specialty: {expert.specialty}</span>
                      </div>
                      <div className="consultation-expert-details">
                        <div className="consultation-expert-detail">
                          <MapPin className="w-4 h-4" />
                          <span>{expert.location}</span>
                        </div>
                        <div className="consultation-expert-detail">
                          <Clock className="w-4 h-4" />
                          <span>{expert.experience}</span>
                        </div>
                        <div className="consultation-expert-detail">
                          <Award className="w-4 h-4" />
                          <span>{expert.price.toLocaleString()} FCFA/session</span>
                        </div>
                      </div>
                      <div className="consultation-expert-languages">
                        {expert.languages.map((lang, i) => (
                          <span key={i} className="consultation-expert-language">
                            {lang}
                          </span>
                        ))}
                      </div>
                      <p className="consultation-expert-bio">{expert.bio}</p>
                    </div>

                    <div className="consultation-expert-footer">
                      <button
                        onClick={() => {
                          setSelectedExpert(expert);
                          setShowBookingModal(true);
                          setBookingStep(1);
                        }}
                        disabled={!expert.available}
                        className="consultation-expert-book-btn"
                      >
                        {expert.available ? 'Book Consultation' : 'Not Available'}
                      </button>
                      <button className="consultation-expert-message-btn">
                        <MessageCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* My Consultations Tab */}
          {activeTab === "my-consultations" && (
            <div className="consultations-my">
              {/* Filter */}
              <div className="consultations-my-filter">
                <button
                  className={`consultations-filter-chip ${filterStatus === "all" ? "consultations-filter-chip-active" : ""}`}
                  onClick={() => setFilterStatus("all")}
                >
                  All
                </button>
                <button
                  className={`consultations-filter-chip ${filterStatus === "pending" ? "consultations-filter-chip-active" : ""}`}
                  onClick={() => setFilterStatus("pending")}
                >
                  Pending
                </button>
                <button
                  className={`consultations-filter-chip ${filterStatus === "confirmed" ? "consultations-filter-chip-active" : ""}`}
                  onClick={() => setFilterStatus("confirmed")}
                >
                  Confirmed
                </button>
                <button
                  className={`consultations-filter-chip ${filterStatus === "completed" ? "consultations-filter-chip-active" : ""}`}
                  onClick={() => setFilterStatus("completed")}
                >
                  Completed
                </button>
                <button
                  className={`consultations-filter-chip ${filterStatus === "cancelled" ? "consultations-filter-chip-active" : ""}`}
                  onClick={() => setFilterStatus("cancelled")}
                >
                  Cancelled
                </button>
              </div>

              {/* Consultations List */}
              <div className="consultations-list">
                {filteredConsultations.length === 0 ? (
                  <div className="consultations-empty">
                    <CalendarDays className="consultations-empty-icon" />
                    <h3>No consultations found</h3>
                    <p>Book your first consultation with an expert today.</p>
                    <button
                      onClick={() => setActiveTab("experts")}
                      className="consultations-empty-btn"
                    >
                      Find Experts
                    </button>
                  </div>
                ) : (
                  filteredConsultations.map((consultation) => (
                    <div key={consultation.id} className="consultation-item">
                      <div className="consultation-item-left">
                        <div className="consultation-item-avatar">
                          <span>{consultation.expertName.charAt(0)}</span>
                        </div>
                        <div className="consultation-item-info">
                          <h4>{consultation.expertName}</h4>
                          <p>{consultation.expertTitle}</p>
                          <div className="consultation-item-meta">
                            <span className="consultation-item-meta-item">
                              <Calendar className="w-3 h-3" />
                              {new Date(consultation.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                            </span>
                            <span className="consultation-item-meta-item">
                              <Clock className="w-3 h-3" />
                              {consultation.time}
                            </span>
                            <span className="consultation-item-meta-item">
                              {getConsultationTypeIcon(consultation.type)}
                              {consultation.type}
                            </span>
                          </div>
                          {consultation.notes && (
                            <p className="consultation-item-notes">{consultation.notes}</p>
                          )}
                        </div>
                      </div>
                      <div className="consultation-item-right">
                        <div className={`consultation-item-status ${getStatusColor(consultation.status)}`}>
                          {getStatusIcon(consultation.status)}
                          <span>{consultation.status.charAt(0).toUpperCase() + consultation.status.slice(1)}</span>
                        </div>
                        <span className="consultation-item-price">{consultation.price.toLocaleString()} FCFA</span>
                        {consultation.status === "confirmed" && (
                          <button className="consultation-item-join-btn">
                            Join Session
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedExpert && (
        <div className="booking-modal-overlay" onClick={() => setShowBookingModal(false)}>
          <div className="booking-modal" onClick={(e) => e.stopPropagation()}>
            <button className="booking-modal-close" onClick={() => setShowBookingModal(false)}>
              <X className="w-5 h-5" />
            </button>

            <div className="booking-modal-header">
              <h2>Book Consultation</h2>
              <p>with {selectedExpert.name}</p>
            </div>

            {/* Step 1: Select Date & Time */}
            {bookingStep === 1 && (
              <div className="booking-step">
                <h3>Select Date & Time</h3>
                <div className="booking-dates">
                  {selectedExpert.availability.map((day, index) => (
                    <div key={index} className="booking-date-group">
                      <h4>{day.day}</h4>
                      <div className="booking-time-slots">
                        {day.slots.map((slot, slotIndex) => (
                          <button
                            key={slotIndex}
                            className={`booking-time-slot ${selectedDate === day.day && selectedTime === slot ? 'booking-time-slot-selected' : ''}`}
                            onClick={() => {
                              setSelectedDate(day.day);
                              setSelectedTime(slot);
                            }}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  className="booking-next-btn"
                  disabled={!selectedDate || !selectedTime}
                  onClick={() => setBookingStep(2)}
                >
                  Next →
                </button>
              </div>
            )}

            {/* Step 2: Select Type & Notes */}
            {bookingStep === 2 && (
              <div className="booking-step">
                <h3>Consultation Details</h3>
                <div className="booking-type-select">
                  <button
                    className={`booking-type-btn ${consultationType === "video" ? "booking-type-btn-selected" : ""}`}
                    onClick={() => setConsultationType("video")}
                  >
                    <Video className="w-5 h-5" />
                    <span>Video Call</span>
                  </button>
                  <button
                    className={`booking-type-btn ${consultationType === "phone" ? "booking-type-btn-selected" : ""}`}
                    onClick={() => setConsultationType("phone")}
                  >
                    <Phone className="w-5 h-5" />
                    <span>Phone Call</span>
                  </button>
                  <button
                    className={`booking-type-btn ${consultationType === "in-person" ? "booking-type-btn-selected" : ""}`}
                    onClick={() => setConsultationType("in-person")}
                  >
                    <MapPin className="w-5 h-5" />
                    <span>In-Person</span>
                  </button>
                </div>
                <div className="booking-notes">
                  <label>Notes for the expert (optional)</label>
                  <textarea
                    value={consultationNotes}
                    onChange={(e) => setConsultationNotes(e.target.value)}
                    placeholder="What would you like to discuss? Any specific issues or questions?"
                    rows={4}
                  />
                </div>
                <div className="booking-summary">
                  <div className="booking-summary-item">
                    <span>Expert:</span>
                    <strong>{selectedExpert.name}</strong>
                  </div>
                  <div className="booking-summary-item">
                    <span>Date & Time:</span>
                    <strong>{selectedDate} at {selectedTime}</strong>
                  </div>
                  <div className="booking-summary-item">
                    <span>Type:</span>
                    <strong>{consultationType}</strong>
                  </div>
                  <div className="booking-summary-item">
                    <span>Price:</span>
                    <strong>{selectedExpert.price.toLocaleString()} FCFA</strong>
                  </div>
                </div>
                <div className="booking-actions">
                  <button
                    className="booking-back-btn"
                    onClick={() => setBookingStep(1)}
                  >
                    ← Back
                  </button>
                  <button
                    className="booking-confirm-btn"
                    onClick={handleBookConsultation}
                  >
                    <CheckCircle className="w-4 h-4" />
                    Confirm Booking
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        /* Loading */
        .dash-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background: #f0fdf4;
          gap: 0.75rem;
          color: #6b7280;
        }

        .dash-loading-spinner {
          width: 1.5rem;
          height: 1.5rem;
          border: 2px solid #d1fae5;
          border-top-color: #059669;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Main Content */
        .consultations-content {
          padding: 1.5rem;
        }

        .consultations-header {
          margin-bottom: 1.5rem;
        }

        .consultations-header h1 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #064e3b;
        }

        .consultations-header p {
          color: #6b7280;
          font-size: 0.875rem;
        }

        /* Tabs */
        .consultations-tabs {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
          border-bottom: 1px solid #e5e7eb;
          padding-bottom: 0.5rem;
        }

        .consultations-tab {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: #6b7280;
          background: transparent;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
        }

        .consultations-tab:hover {
          background: #f9fafb;
          color: #1f2937;
        }

        .consultations-tab-active {
          background: #ecfdf5;
          color: #059669;
        }

        /* Search */
        .consultations-search {
          display: flex;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .consultations-search-input {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 0.75rem;
          padding: 0.5rem 0.75rem;
          transition: border-color 0.2s;
        }

        .consultations-search-input:focus-within {
          border-color: #059669;
          box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.1);
        }

        .consultations-search-icon {
          width: 1.25rem;
          height: 1.25rem;
          color: #9ca3af;
        }

        .consultations-search-input input {
          flex: 1;
          border: none;
          outline: none;
          font-size: 0.875rem;
          background: transparent;
        }

        .consultations-filter-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 0.75rem;
          font-size: 0.875rem;
          color: #6b7280;
          cursor: pointer;
          transition: all 0.2s;
        }

        .consultations-filter-btn:hover {
          background: #f9fafb;
          border-color: #d1d5db;
        }

        /* Experts Grid */
        .consultations-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 1.5rem;
        }

        .consultation-expert-card {
          background: white;
          border-radius: 1rem;
          border: 1px solid #e5e7eb;
          overflow: hidden;
          transition: all 0.2s;
        }

        .consultation-expert-card:hover {
          box-shadow: 0 4px 20px rgba(0,0,0,0.06);
          transform: translateY(-2px);
        }

        .consultation-expert-header {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 1.25rem 1.25rem 0.75rem 1.25rem;
        }

        .consultation-expert-avatar {
          width: 3.5rem;
          height: 3.5rem;
          background: linear-gradient(135deg, #059669, #10b981);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
          font-weight: 600;
          color: white;
          flex-shrink: 0;
        }

        .consultation-expert-info {
          flex: 1;
        }

        .consultation-expert-info h3 {
          font-size: 0.875rem;
          font-weight: 600;
          color: #1f2937;
        }

        .consultation-expert-info p {
          font-size: 0.75rem;
          color: #6b7280;
        }

        .consultation-expert-rating {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.75rem;
          color: #1f2937;
          margin-top: 0.25rem;
        }

        .consultation-expert-status {
          padding: 0.125rem 0.5rem;
          border-radius: 9999px;
          font-size: 0.625rem;
          font-weight: 500;
          flex-shrink: 0;
        }

        .consultation-expert-available {
          background: #d1fae5;
          color: #059669;
        }

        .consultation-expert-unavailable {
          background: #f3f4f6;
          color: #6b7280;
        }

        .consultation-expert-body {
          padding: 0 1.25rem 1rem 1.25rem;
        }

        .consultation-expert-specialty {
          font-size: 0.75rem;
          color: #059669;
          font-weight: 500;
          margin-bottom: 0.5rem;
        }

        .consultation-expert-details {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          margin-bottom: 0.5rem;
        }

        .consultation-expert-detail {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.7rem;
          color: #6b7280;
        }

        .consultation-expert-detail svg {
          color: #9ca3af;
        }

        .consultation-expert-languages {
          display: flex;
          gap: 0.25rem;
          flex-wrap: wrap;
          margin-bottom: 0.5rem;
        }

        .consultation-expert-language {
          padding: 0.125rem 0.5rem;
          background: #f3f4f6;
          border-radius: 9999px;
          font-size: 0.6rem;
          color: #6b7280;
        }

        .consultation-expert-bio {
          font-size: 0.75rem;
          color: #6b7280;
          line-height: 1.5;
          margin: 0;
        }

        .consultation-expert-footer {
          display: flex;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          border-top: 1px solid #f3f4f6;
        }

        .consultation-expert-book-btn {
          flex: 1;
          padding: 0.5rem 1rem;
          background: #059669;
          color: white;
          border: none;
          border-radius: 0.5rem;
          font-size: 0.75rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
        }

        .consultation-expert-book-btn:hover:not(:disabled) {
          background: #047857;
        }

        .consultation-expert-book-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .consultation-expert-message-btn {
          padding: 0.5rem;
          background: #f3f4f6;
          border: none;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: background 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6b7280;
        }

        .consultation-expert-message-btn:hover {
          background: #e5e7eb;
          color: #1f2937;
        }

        /* My Consultations */
        .consultations-my-filter {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
          margin-bottom: 1.5rem;
        }

        .consultations-filter-chip {
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          border: 1px solid #e5e7eb;
          font-size: 0.75rem;
          color: #6b7280;
          background: white;
          cursor: pointer;
          transition: all 0.2s;
        }

        .consultations-filter-chip:hover {
          background: #f9fafb;
          border-color: #d1d5db;
        }

        .consultations-filter-chip-active {
          background: #ecfdf5;
          border-color: #059669;
          color: #059669;
        }

        .consultations-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .consultation-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.25rem;
          background: white;
          border-radius: 0.75rem;
          border: 1px solid #e5e7eb;
          transition: all 0.2s;
        }

        .consultation-item:hover {
          border-color: #d1d5db;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }

        .consultation-item-left {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex: 1;
        }

        .consultation-item-avatar {
          width: 2.5rem;
          height: 2.5rem;
          background: linear-gradient(135deg, #059669, #10b981);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.875rem;
          font-weight: 600;
          color: white;
          flex-shrink: 0;
        }

        .consultation-item-info {
          flex: 1;
        }

        .consultation-item-info h4 {
          font-size: 0.875rem;
          font-weight: 600;
          color: #1f2937;
          margin: 0;
        }

        .consultation-item-info p {
          font-size: 0.75rem;
          color: #6b7280;
          margin: 0;
        }

        .consultation-item-meta {
          display: flex;
          gap: 0.75rem;
          margin-top: 0.25rem;
          flex-wrap: wrap;
        }

        .consultation-item-meta-item {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.65rem;
          color: #6b7280;
        }

        .consultation-item-notes {
          font-size: 0.7rem;
          color: #6b7280;
          margin-top: 0.25rem;
          font-style: italic;
        }

        .consultation-item-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.5rem;
          flex-shrink: 0;
        }

        .consultation-item-status {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.125rem 0.5rem;
          border-radius: 9999px;
          font-size: 0.625rem;
          font-weight: 500;
          border: 1px solid transparent;
        }

        .consultation-item-price {
          font-size: 0.75rem;
          font-weight: 600;
          color: #1f2937;
        }

        .consultation-item-join-btn {
          padding: 0.25rem 0.75rem;
          background: #059669;
          color: white;
          border: none;
          border-radius: 0.375rem;
          font-size: 0.625rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
        }

        .consultation-item-join-btn:hover {
          background: #047857;
        }

        /* Empty State */
        .consultations-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem;
          background: white;
          border-radius: 1rem;
          border: 1px solid #e5e7eb;
          text-align: center;
        }

        .consultations-empty-icon {
          width: 3rem;
          height: 3rem;
          color: #d1d5db;
          margin-bottom: 1rem;
        }

        .consultations-empty h3 {
          font-size: 1rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 0.25rem;
        }

        .consultations-empty p {
          font-size: 0.875rem;
          color: #6b7280;
          margin-bottom: 1rem;
        }

        .consultations-empty-btn {
          padding: 0.5rem 1.5rem;
          background: #059669;
          color: white;
          border: none;
          border-radius: 0.5rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
        }

        .consultations-empty-btn:hover {
          background: #047857;
        }

        /* Booking Modal */
        .booking-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }

        .booking-modal {
          background: white;
          border-radius: 1.5rem;
          max-width: 600px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          padding: 2rem;
          position: relative;
        }

        .booking-modal-close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          padding: 0.25rem;
          background: none;
          border: none;
          cursor: pointer;
          color: #6b7280;
          border-radius: 0.375rem;
          transition: background 0.2s;
        }

        .booking-modal-close:hover {
          background: #f3f4f6;
        }

        .booking-modal-header {
          margin-bottom: 1.5rem;
        }

        .booking-modal-header h2 {
          font-size: 1.25rem;
          font-weight: 700;
          color: #064e3b;
        }

        .booking-modal-header p {
          font-size: 0.875rem;
          color: #6b7280;
        }

        .booking-step h3 {
          font-size: 1rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 1rem;
        }

        .booking-dates {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .booking-date-group h4 {
          font-size: 0.75rem;
          font-weight: 600;
          color: #6b7280;
          margin-bottom: 0.5rem;
        }

        .booking-time-slots {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .booking-time-slot {
          padding: 0.375rem 0.75rem;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          font-size: 0.75rem;
          color: #6b7280;
          background: white;
          cursor: pointer;
          transition: all 0.2s;
        }

        .booking-time-slot:hover {
          border-color: #10b981;
          background: #f0fdf4;
        }

        .booking-time-slot-selected {
          border-color: #059669;
          background: #ecfdf5;
          color: #059669;
        }

        .booking-next-btn {
          padding: 0.5rem 1.5rem;
          background: #059669;
          color: white;
          border: none;
          border-radius: 0.5rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
          float: right;
        }

        .booking-next-btn:hover:not(:disabled) {
          background: #047857;
        }

        .booking-next-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .booking-type-select {
          display: flex;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .booking-type-btn {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
          padding: 0.75rem;
          border: 2px solid #e5e7eb;
          border-radius: 0.75rem;
          background: white;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 0.75rem;
          color: #6b7280;
        }

        .booking-type-btn:hover {
          border-color: #10b981;
        }

        .booking-type-btn-selected {
          border-color: #059669;
          background: #ecfdf5;
          color: #059669;
        }

        .booking-notes {
          margin-bottom: 1rem;
        }

        .booking-notes label {
          display: block;
          font-size: 0.75rem;
          font-weight: 500;
          color: #1f2937;
          margin-bottom: 0.25rem;
        }

        .booking-notes textarea {
          width: 100%;
          padding: 0.5rem 0.75rem;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          font-size: 0.75rem;
          resize: vertical;
          font-family: inherit;
          transition: border-color 0.2s;
        }

        .booking-notes textarea:focus {
          border-color: #059669;
          outline: none;
          box-shadow: 0 0 0 3px rgba(5,150,105,0.1);
        }

        .booking-summary {
          background: #f9fafb;
          border-radius: 0.75rem;
          padding: 1rem;
          margin-bottom: 1rem;
        }

        .booking-summary-item {
          display: flex;
          justify-content: space-between;
          padding: 0.25rem 0;
          font-size: 0.875rem;
        }

        .booking-summary-item span {
          color: #6b7280;
        }

        .booking-summary-item strong {
          color: #1f2937;
        }

        .booking-actions {
          display: flex;
          gap: 0.75rem;
          justify-content: flex-end;
        }

        .booking-back-btn {
          padding: 0.5rem 1.5rem;
          background: transparent;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          color: #6b7280;
          cursor: pointer;
          transition: all 0.2s;
        }

        .booking-back-btn:hover {
          background: #f9fafb;
        }

        .booking-confirm-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1.5rem;
          background: #059669;
          color: white;
          border: none;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
        }

        .booking-confirm-btn:hover {
          background: #047857;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .consultations-content {
            padding: 1rem;
          }

          .consultations-grid {
            grid-template-columns: 1fr;
          }

          .consultation-item {
            flex-direction: column;
            align-items: stretch;
            gap: 0.75rem;
          }

          .consultation-item-right {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
          }

          .booking-type-select {
            flex-direction: column;
          }

          .booking-modal {
            padding: 1.5rem;
          }

          .consultations-tabs {
            overflow-x: auto;
          }

          .consultations-search {
            flex-direction: column;
          }

          .consultation-expert-header {
            flex-wrap: wrap;
          }
        }

        @media (max-width: 480px) {
          .consultations-grid {
            grid-template-columns: 1fr;
          }

          .consultation-item-meta {
            flex-direction: column;
            gap: 0.25rem;
          }

          .booking-actions {
            flex-direction: column;
          }

          .booking-summary-item {
            flex-direction: column;
            gap: 0.25rem;
          }
        }
      `}</style>
    </div>
  );
}