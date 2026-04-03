import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="container">
      <div className="panel stack">
        <h1>User Basic Features</h1>
        <p>Trang goc cho cum user va role.</p>
        <div className="inline-actions">
          <Link to="/user/password" className="button">
            User Password
          </Link>
          <Link to="/admin/dashboard" className="button">
            Admin Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
