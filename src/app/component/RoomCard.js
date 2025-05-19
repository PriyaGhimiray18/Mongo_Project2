export default function RoomCard({ hostel, image, description, link, accommodation }) {
  return (
    <div className="col-md-4 mb-4">
      <div className="card">
        <img src={image} className="card-img-top" alt="Room Image" />
        <div className="card-body">
          <h5 className="card-title">{hostel}</h5>
          <p className="card-text">{description}</p>
          <p className="text-muted">Accommodation: {accommodation}</p>
          <a href={link} className="btn btn-primary">See more</a>
        </div>
      </div>
    </div>
  );
}
