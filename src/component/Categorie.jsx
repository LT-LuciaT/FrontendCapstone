import { Link } from "react-router-dom";

const Categorie = () => {
  const categories = [
    {
      id: 1,
      title: "Fashion",
      imageUrl:
        "https://images.unsplash.com/photo-1601762603339-fd61e28b698a?w=500&auto=format&fit=crop&q=80&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      route: "/categories/fashion",
    },
    {
      id: 2,
      title: "Photography",
      imageUrl:
        "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGhvdG9ncmFwaHl8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
      route: "/categories/photography",
    },
    {
      id: 3,
      title: "Art",
      imageUrl:
        "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXJ0fGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
      route: "/categories/art",
    },
    {
      id: 4,
      title: "Artist",
      imageUrl:
        "https://images.unsplash.com/photo-1549213783-8284d0336c4f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXJ0aXN0fGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
      route: "/categories/artist",
    },
    {
      id: 5,
      title: "Magazine",
      imageUrl:
        "https://images.unsplash.com/photo-1535954741680-a2e24eb05418?w=500&auto=format&fit=crop&q=80&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      route: "/categories/magazine",
    },
    {
      id: 6,
      title: "News",
      imageUrl:
        "https://images.unsplash.com/photo-1572949645841-094f3a9c4c94?w=500&auto=format&fit=crop&q=80&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      route: "/categories/news",
    },
    {
      id: 7,
      title: "Digital Art",
      imageUrl:
        "https://images.unsplash.com/photo-1641391503184-a2131018701b?w=500&auto=format&fit=crop&q=80&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      route: "/categories/digital-art",
    },
    {
      id: 8,
      title: "Street Art",
      imageUrl:
        "https://images.unsplash.com/photo-1617400120050-a1e45fa16c02?q=80&w=500&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      route: "/categories/street-art",
    },
  ];

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Explore</h1>
      <div className="row">
        {categories.map((category) => (
          <div key={category.id} className="col-md-3 mb-4">
            <Link to={category.route} className="text-decoration-none">
              <div className="card h-100 border-0 shadow-sm">
                <img
                  src={category.imageUrl}
                  alt={category.title}
                  className="card-img-top img-fluid"
                  style={{ height: "200px", objectFit: "cover" }}
                  loading="lazy"
                />
                <div className="card-body text-center">
                  <h5 className="card-title">{category.title}</h5>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categorie;
