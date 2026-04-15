import { useEffect, useState } from "react";
import axios from "axios";

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", price: "", description: "", image: "" });
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("/api/products");
      setProducts(res.data || []);
    } catch (err) {
      setError("Unable to load products. Check backend status.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addProduct = async () => {
    setError("");
    setStatus("");

    if (!form.name || !form.price) {
      setError("Product name and price are required.");
      return;
    }

    setLoading(true);
    try {
      await axios.post("/api/products", { ...form, price: Number(form.price) });
      setStatus("Product added successfully.");
      setForm({ name: "", price: "", description: "", image: "" });
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add product.");
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    setError("");
    setStatus("");
    setLoading(true);

    try {
      await axios.delete(`/api/products/${id}`);
      setStatus("Product deleted.");
      fetchProducts();
    } catch (err) {
      setError("Unable to delete product.");
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((product) => {
    const query = search.toLowerCase();
    return (
      product.name.toLowerCase().includes(query) ||
      (product.description || "").toLowerCase().includes(query) ||
      String(product.price).includes(query)
    );
  });

  return (
    <main className="admin-shell page-shell">
      <section className="admin-panel-header">
        <div>
          <p className="eyebrow">Admin dashboard</p>
          <h1>Product Management</h1>
          <p className="hero-copy">
            Monitor product inventory, add new items, and keep your shop catalog up to date.
          </p>
        </div>

        <div className="stats-grid">
          <article className="dashboard-card">
            <p>Total products</p>
            <strong>{products.length}</strong>
          </article>
          <article className="dashboard-card">
            <p>Visible items</p>
            <strong>{filteredProducts.length}</strong>
          </article>
        </div>
      </section>

      <section className="admin-actions-grid">
        <div className="dashboard-card admin-form-card">
          <h2>Add new product</h2>
          {status && <div className="status-message">{status}</div>}
          {error && <div className="status-message status-error">{error}</div>}

          <div className="form-grid">
            <label>Name</label>
            <input
              className="form-input"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Product name"
            />

            <label>Price</label>
            <input
              className="form-input"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              placeholder="Price"
            />

            <label>Description</label>
            <textarea
              className="form-input"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Short description"
            />

            <label>Image URL</label>
            <input
              className="form-input"
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              placeholder="Image URL"
            />
          </div>

          <button className="button-primary" onClick={addProduct} disabled={loading}>
            {loading ? "Saving..." : "Add product"}
          </button>
        </div>

        <div className="dashboard-card admin-list-card">
          <div className="list-header">
            <h2>Product catalog</h2>
            <input
              className="form-input"
              placeholder="Search products"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {loading && <div className="status-message">Loading products…</div>}
          {!loading && filteredProducts.length === 0 && (
            <div className="status-message">No matching products found.</div>
          )}

          <div className="product-table">
            {filteredProducts.map((product) => (
              <div key={product._id} className="product-row">
                <div className="product-meta">
                  <img
                    src={
                      product.image ||
                      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80"
                    }
                    alt={product.name}
                    className="product-thumb"
                  />
                  <div>
                    <h3>{product.name}</h3>
                    <p>{product.description}</p>
                  </div>
                </div>

                <div className="product-actions">
                  <span className="product-price">₹{product.price}</span>
                  <button className="button-secondary" onClick={() => deleteProduct(product._id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
