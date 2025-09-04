import { useParams, useNavigate } from "react-router-dom";

const TourDetails = ({ tours, onInterest }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const tour = tours.find((t) => t.id === parseInt(id));
  if (!tour) return <p>Tour not found</p>;

  // Construct the full image URL and ensure price is a number
  const imageUrl = `http://127.0.0.1:8000${tour.image}`;
  const price = parseFloat(tour.price);

  return (
    <div className="tour-details-page-fullscreen">
      <div className="tour-image-container-fullscreen">
        <img
          src={imageUrl}
          alt={tour.title}
          className="tour-large-image-fullscreen"
        />
      </div>

      <div className="tour-details-content-overlay">
        <button className="back-button" onClick={() => navigate("/")}>
          ← Back
        </button>

        <div className="tour-info-fullscreen">
          <h2>{tour.title}</h2>
          <p className="tour-price-fullscreen">${price.toFixed(2)}</p>
          <p className="tour-description-fullscreen">{tour.description}</p>
          
          <div className="tour-actions-fullscreen">
            <button
              className={`btn ${tour.interest === 'interested' ? 'interested' : ''}`}
              onClick={() => onInterest(tour.id, "interested")}
            >
              {tour.interest === 'interested' ? '✓ Interested' : "I'm Interested"}
            </button>
            <button
              className={`btn ${tour.interest === 'not_interested' ? 'not-interested' : 'secondary'}`}
              onClick={() => onInterest(tour.id, "not_interested")}
            >
              {tour.interest === 'not_interested' ? 'Not Interested' : 'Not Interested'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourDetails;