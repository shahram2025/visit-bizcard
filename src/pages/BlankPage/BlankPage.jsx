import React from "react";
import BlankContent from "./components/BlankContent"; // Correct path
import "./BlankPage.css";

function BlankPage() {
  return (
    <div className="blank-page">
      {/* Remove <Header /> and <Footer /> here */}
      <BlankContent />
    </div>
  );
}

export default BlankPage;