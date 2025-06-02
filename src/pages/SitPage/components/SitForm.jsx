import React from "react";
import "./SitForm.css";

function SitForm() {
  return (
    <div className="sit-form">
      <h2>Sit and Relax</h2>
      <form>
        <label htmlFor="name">Name</label>
        <input type="text" id="name" placeholder="Enter your name" />

        <label htmlFor="message">Message</label>
        <textarea id="message" placeholder="Write your message here"></textarea>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default SitForm;