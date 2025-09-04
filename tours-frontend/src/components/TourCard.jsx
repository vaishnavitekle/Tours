export default function TourCard({ tour, onInterested, onNotInterested }) {
  return (
    <div className="card">
      <div className="image-wrap">
        {/* <img src={tour.image} alt={tour.title} /> */}
        <img 
          src={tour.image ? `http://127.0.0.1:8000${tour.image}` : 'icon1.webp'} 
          alt={tour.title} 
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/placeholder-image.jpg';
          }}
        />
        {tour.interest && (
          <span className={"badge " + (tour.interest === "interested" ? "ok" : "nope")}>
            {tour.interest === "interested" ? "Interested" : "Not Interested"}
          </span>
        )}
      </div>
      <div className="content">
        <div className="row">
          <h3>{tour.title}</h3>
          <div className="price">${tour.price ? Number(tour.price).toFixed(2) : '0.00'}</div>
          {/* Removed price since it's not in our mock data */}
        </div>
        <p className="info">{tour.description}</p>
      </div>
      <div className="actions">
        <button className="btn" onClick={onInterested}>
          Interested
        </button>
        <button className="btn outline" onClick={onNotInterested}>
          Not Interested
        </button>
      </div>
    </div>
  );
}
