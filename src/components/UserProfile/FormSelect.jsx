import React, { useState } from "react";
import "./FormSelect.css";

const FormSelect = ({ name, value, onChange, required, onNewCategory }) => {
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [otherValue, setOtherValue] = useState("");

  const handleSelectChange = (e) => {
    const selectedValue = e.target.value;
    onChange(e);
    
    if (selectedValue === "other") {
      setShowOtherInput(true);
      if (otherValue) {
        onChange({ target: { name, value: `other:${otherValue}` } });
        onNewCategory?.(otherValue);
      }
    } else {
      setShowOtherInput(false);
      if (selectedValue && selectedValue !== "") {
        onNewCategory?.(selectedValue.replace(/_/g, ' '));
      }
    }
  };

  const handleOtherInputChange = (e) => {
    const value = e.target.value;
    setOtherValue(value);
    onChange({ target: { name, value: `other:${value}` } });
  };

  const handleOtherInputBlur = () => {
    if (otherValue.trim() !== "") {
      onNewCategory?.(otherValue);
    }
  };

  const professionCategories = [
    {
      group: "A",
      options: [
        { value: "accountant", label: "Accountant" },
        { value: "actor", label: "Actor" },
        { value: "architect", label: "Architect" },
        { value: "artist", label: "Artist" },
        { value: "attorney", label: "Attorney" },
      ]
    },
    {
      group: "B",
      options: [
        { value: "baker", label: "Baker" },
        { value: "banker", label: "Banker" },
        { value: "barber", label: "Barber" },
        { value: "beauty_blogger", label: "Beauty Blogger" },
        { value: "biologist", label: "Biologist" },
        { value: "brand_strategist", label: "Brand Strategist" },
        { value: "business_consultant", label: "Business Consultant" },
      ]
    },
    {
      group: "C",
      options: [
        { value: "carpenter", label: "Carpenter" },
        { value: "chef", label: "Chef" },
        { value: "chiropractor", label: "Chiropractor" },
        { value: "coach", label: "Coach (Life/Career/Business)" },
        { value: "content_creator", label: "Content Creator" },
        { value: "copywriter", label: "Copywriter" },
        { value: "cosmetologist", label: "Cosmetologist" },
        { value: "cybersecurity_specialist", label: "Cybersecurity Specialist" },
      ]
    },
    {
      group: "D",
      options: [
        { value: "data_analyst", label: "Data Analyst" },
        { value: "dentist", label: "Dentist" },
        { value: "designer", label: "Designer (Graphic/Web/Fashion)" },
        { value: "digital_marketer", label: "Digital Marketer" },
        { value: "doctor", label: "Doctor (Physician)" },
      ]
    },
    {
      group: "E-F",
      options: [
        { value: "electrician", label: "Electrician" },
        { value: "engineer", label: "Engineer" },
        { value: "entrepreneur", label: "Entrepreneur" },
        { value: "event_planner", label: "Event Planner" },
        { value: "financial_advisor", label: "Financial Advisor" },
        { value: "fitness_trainer", label: "Fitness Trainer" },
        { value: "florist", label: "Florist" },
        { value: "freelancer", label: "Freelancer (General)" },
        { value: "fundraiser", label: "Fundraiser" },
      ]
    },
    {
      group: "G-L",
      options: [
        { value: "gardener", label: "Gardener/Landscaper" },
        { value: "graphic_designer", label: "Graphic Designer" },
        { value: "hair_stylist", label: "Hair Stylist" },
        { value: "handyman", label: "Handyman" },
        { value: "health_coach", label: "Health Coach" },
        { value: "hr_specialist", label: "HR Specialist" },
        { value: "illustrator", label: "Illustrator" },
        { value: "influencer", label: "Influencer" },
        { value: "interior_designer", label: "Interior Designer" },
        { value: "it_consultant", label: "IT Consultant" },
        { value: "jewelry_designer", label: "Jewelry Designer" },
        { value: "journalist", label: "Journalist" },
        { value: "lawyer", label: "Lawyer (Attorney)" },
        { value: "life_coach", label: "Life Coach" },
        { value: "logistics_manager", label: "Logistics Manager" },
      ]
    },
    {
      group: "M-P",
      options: [
        { value: "makeup_artist", label: "Makeup Artist" },
        { value: "marketing_manager", label: "Marketing Manager" },
        { value: "massage_therapist", label: "Massage Therapist" },
        { value: "mechanic", label: "Mechanic" },
        { value: "musician", label: "Musician" },
        { value: "nutritionist", label: "Nutritionist" },
        { value: "online_coach", label: "Online Coach" },
        { value: "optometrist", label: "Optometrist" },
        { value: "painter", label: "Painter (Artist)" },
        { value: "personal_trainer", label: "Personal Trainer" },
        { value: "pharmacist", label: "Pharmacist" },
        { value: "photographer", label: "Photographer" },
        { value: "physical_therapist", label: "Physical Therapist" },
        { value: "plumber", label: "Plumber" },
        { value: "podcaster", label: "Podcaster" },
        { value: "programmer", label: "Programmer" },
        { value: "psychologist", label: "Psychologist" },
      ]
    },
    {
      group: "R-Z",
      options: [
        { value: "real_estate_agent", label: "Real Estate Agent" },
        { value: "recruiter", label: "Recruiter" },
        { value: "researcher", label: "Researcher" },
        { value: "sales_representative", label: "Sales Representative" },
        { value: "seo_specialist", label: "SEO Specialist" },
        { value: "social_media_manager", label: "Social Media Manager" },
        { value: "software_developer", label: "Software Developer" },
        { value: "speech_therapist", label: "Speech Therapist" },
        { value: "student", label: "Student (Networking)" },
        { value: "teacher", label: "Teacher" },
        { value: "tutor", label: "Tutor" },
        { value: "travel_agent", label: "Travel Agent" },
        { value: "videographer", label: "Videographer" },
        { value: "virtual_assistant", label: "Virtual Assistant" },
        { value: "voice_actor", label: "Voice Actor" },
        { value: "web_designer", label: "Web Designer" },
        { value: "wedding_planner", label: "Wedding Planner" },
        { value: "writer", label: "Writer (Author/Copywriter)" },
        { value: "yoga_instructor", label: "Yoga Instructor" },
        { value: "youtuber", label: "YouTuber" },
      ]
    },
    {
      group: "Other",
      options: [
        { value: "other", label: "Other Profession" },
      ]
    }
  ];

  const parsedValue = value?.startsWith("other:") ? "other" : value;

  return (
    <div className="form-group form-select-container">
      <div className="select-wrapper">
        <select
          name={name}
          value={parsedValue}
          onChange={handleSelectChange}
          required={required}
          className="form-select-dropdown"
        >
          <option value="" disabled>Select a profession</option>
          {professionCategories.map((category, index) => (
            <optgroup label={category.group} key={index}>
              {category.options.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled || false}
                >
                  {option.label}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      {showOtherInput && (
        <div className="other-input-container">
          <input
            type="text"
            value={otherValue || (value?.startsWith("other:") ? value.split(":")[1] : "")}
            onChange={handleOtherInputChange}
            onBlur={handleOtherInputBlur}
            placeholder="Enter your specific profession"
            className="other-input"
            required={required}
          />
        </div>
      )}
    </div>
  );
};

export default FormSelect;