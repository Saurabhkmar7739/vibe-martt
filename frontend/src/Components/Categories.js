import "../styles/Categories.css";

export default function Categories() {
  const categories = [
    {
      id: 1,
      name: "Electronics",
      image:
        "https://th.bing.com/th/id/OIP.usFunfk8fu_3rZJou7StHAHaEA?w=276&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
      color: "#667eea",
    },
    {
      id: 2,
      name: "Fashion",
      image:
        "https://th.bing.com/th/id/OIP.ORH_mwC_R1rP2xGViNy_lwHaE8?w=281&h=187&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
      color: "#f093fb",
    },
    {
      id: 4,
      name: "Beauty",
      image:
        "https://th.bing.com/th/id/OIP.Ytj5YDrKhyMu5SyDxpZe3AHaEK?w=281&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
      color: "#f5576c",
    },
  ];

  return (
    <section className="categories-section">
      <h2 className="section-title">Shop by Category</h2>
      <div className="categories-grid">
        {categories.map((category) => (
          <div
            key={category.id}
            className="category-card"
            style={{ "--color": category.color }}
          >
            <div className="category-image">
              <img src={category.image} alt={category.name} />
            </div>
            <h3>{category.name}</h3>
          </div>
        ))}
      </div>
    </section>
  );
}
