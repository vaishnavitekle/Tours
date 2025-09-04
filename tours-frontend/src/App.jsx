import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import AddTourForm from "./components/AddTourForm";
import TourCard from "./components/TourCard";
import TourDetails from "./components/TourDetails";
import CityAutocomplete from "./components/CityAutocomplete"; // Import CityAutocomplete component

export default function App() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [toursPerPage] = useState(6); // Number of tours per page
  const [selectedTitle, setSelectedTitle] = useState(''); // Add state variable for selected title
  const [filteredTours, setFilteredTours] = useState([]); // Add state variable for filtered tours

  // Get current tours
  const indexOfLastTour = currentPage * toursPerPage;
  const indexOfFirstTour = indexOfLastTour - toursPerPage;
  const currentTours = (selectedTitle ? filteredTours : tours).slice(indexOfFirstTour, indexOfLastTour); // Update currentTours calculation
  const totalPages = Math.ceil((selectedTitle ? filteredTours.length : tours.length) / toursPerPage); // Update totalPages calculation

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/tours")
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then((data) => setTours(data))
      .catch((err) => {
        setError("Failed to fetch tours. Please check the server connection.");
        console.error(err);
      });
  }, []);

  useEffect(() => {
    if (selectedTitle) {
      const filtered = tours.filter(tour => 
        tour.title?.toLowerCase().includes(selectedTitle.toLowerCase())
      );
      setFilteredTours(filtered);
    } else {
      setFilteredTours(tours);
    }
    setCurrentPage(1); // Reset to first page when filter changes
  }, [selectedTitle, tours]);

  // Go to next page
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Go to previous page
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleAdd = async (payload) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/tours", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error('Failed to add tour');
      const newTour = await response.json();
      setTours(prev => [newTour, ...prev]);
    } catch (err) {
      setError("Failed to add tour. Please try again.");
      console.error(err);
    }
  };

  const handleInterest = async (id, interest) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/tours/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interest }),
      });
      if (!response.ok) throw new Error('Failed to update interest');
      const updatedTour = await response.json();
      setTours(prev =>
        prev.map(t => (t.id === updatedTour.id ? updatedTour : t))
      );
    } catch (err) {
      setError("Failed to update interest. Please try again.");
      console.error(err);
    }
  };

  // Add Tour Page
  const AddTourPage = () => {
    const navigate = useNavigate();
    return (
      <div className="container">
        <header className="header">
          <h1>Add New Tour</h1>
          <button className="btn secondary" onClick={() => navigate("/")}>
            ← Back
          </button>
        </header>
        <AddTourForm onSubmit={(payload) => {
          handleAdd(payload);
          navigate("/"); // Navigate back after submission
        }} />
      </div>
    );
  };

  // Tours List Page
  const ToursList = () => {
    const navigate = useNavigate();

    return (
      <div className="container">
        <header className="header">
          <h1>Tours</h1>
          <div className="city-filter">
            <CityAutocomplete
              value={selectedTitle}
              onChange={(e) => setSelectedTitle(e.target.value)}
              tours={tours}
              placeholder="Search tours by city..."
            />
            {selectedTitle && (
              <button 
                onClick={() => setSelectedTitle('')} 
                className="clear-filter"
              >
                Clear
              </button>
            )}
          </div>
          <button className="btn primary" onClick={() => navigate("/add")}>
            Add Card
          </button>
        </header>

        {loading && <p>Loading…</p>}
        {error && <p className="error">{error}</p>}

        <div className="grid">
          {currentTours.map((tour) => (
            <div key={tour.id} onClick={() => navigate(`/tour/${tour.id}`)}>
              <TourCard
                tour={tour}
                onInterested={(e) => {
                  e.stopPropagation();
                  handleInterest(tour.id, "interested");
                }}
                onNotInterested={(e) => {
                  e.stopPropagation();
                  handleInterest(tour.id, "not_interested");
                }}
              />
            </div>
          ))}
        </div>

        {/* Pagination */}
        {tours.length > toursPerPage && (
          <div className="pagination">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className="pagination-btn"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
              <button
                key={number}
                onClick={() => paginate(number)}
                className={`pagination-btn ${currentPage === number ? "active" : ""}`}
              >
                {number}
              </button>
            ))}
            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className="pagination-btn"
            >
              Next
            </button>
          </div>
        )}
        {!loading && !error && currentTours.length === 0 && (
          <div className="no-results">
            {selectedTitle 
              ? `No tours found matching "${selectedTitle}". Try a different search.`
              : 'No tours available. Add a new tour to get started!'}
          </div>
        )}
      </div>
    );
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<ToursList />} />
        <Route
          path="/tour/:id"
          element={<TourDetails tours={tours} onInterest={handleInterest} />}
        />
        <Route path="/add" element={<AddTourPage />} />
      </Routes>
    </Router>
  );
}