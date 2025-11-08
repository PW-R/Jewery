import app, { initDB } from "./app.js";

const startServer = async () => {
  try {
    await initDB();
    console.log("✅ MongoDB connected and admin ready");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error("❌ Server startup error:", err.message);
    process.exit(1);
  }
};

startServer();
