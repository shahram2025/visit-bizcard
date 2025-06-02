import React, { useState } from "react";
import { FaChevronLeft } from "react-icons/fa";
import ProfileImageUpload from "./ProfileImageUpload";
import FormInput from "./FormInput";
import FormSelect from "./FormSelect";
import FormTextarea from "./FormTextarea";
import BusinessCardUpload from "./BusinessCardUpload";
import MapComponent from "./MapComponent";
import SaveButton from "./SaveButton";
import ContinueButton from "../Buttons/ContinueButton";
import "./UserProfile.css";

function UserProfile({ 
  onClose, 
  setFrontImage, 
  setBackImage, 
  profileImage, 
  setProfileImage,
  setShowUserProfile,
  setShowCardCreator
}) {
  const [frontCardImage, setFrontCardImage] = useState(null);
  const [backCardImage, setBackCardImage] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [addressLocation, setAddressLocation] = useState("");
  const [showAdditionalFields, setShowAdditionalFields] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    businessType: "",
    company: "",
    position: "",
    websiteAddress: "",
    email: "",
    note: "",
  });
  const [currentStep, setCurrentStep] = useState(1);

  // Enhanced image upload handler with validation
  const handleImageUpload = (e, setImage) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.match('image.*')) {
      alert('Please select an image file (JPEG, PNG)');
      return;
    }

    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      alert('Image size should be less than 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setImage(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  // Unified handlers using the new handleImageUpload
  const handleProfileImageUpload = (e) => handleImageUpload(e, setProfileImage);
  const handleFrontCardUpload = (e) => handleImageUpload(e, setFrontCardImage);
  const handleBackCardUpload = (e) => handleImageUpload(e, setBackCardImage);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Only proceed if front image exists
    if (!frontCardImage) {
      alert("Please upload at least the front side of your business card");
      return;
    }
    setFrontImage(frontCardImage);
    setBackImage(backCardImage || frontCardImage); // Use front image if back isn't provided
    onClose();
  };

  const handleContinue = () => {
    if (currentStep === 1 && !formData.fullName.trim()) {
      alert("Please enter your full name.");
      return;
    }
    if (currentStep === 2 && !formData.phoneNumber.trim()) {
      alert("Please enter your phone number.");
      return;
    }
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleCreateDigitalCard = () => {
    onClose();
    setShowUserProfile(false);
    setShowCardCreator(true);
  };

  return (
    <>
      <div className={`user-profile-overlay ${onClose ? "visible" : ""}`} onClick={onClose} />

      <div className={`user-profile-panel ${onClose ? "visible" : ""}`}>
        <button className="close-panel-btn" onClick={onClose}>
          &times;
        </button>

        {/* Profile Image Upload - Now properly connected */}
        <ProfileImageUpload
          profileImage={profileImage}
          handleProfileImageUpload={handleProfileImageUpload}
        />

        <div className="step-guide">
          <h2>Upload your paper business card in 3 steps</h2>

          {currentStep === 1 && (
            <>
              <p className="step">
                <span className="step-number">Step 1:</span> What's your name?
              </p>
              <FormInput
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleInputChange}
                required
              />
              <ContinueButton 
                onClick={handleContinue} 
                disabled={!formData.fullName.trim()} 
              />
            </>
          )}

          {currentStep === 2 && (
            <>
              <button className="back-button" onClick={handleBack}>
                <FaChevronLeft className="back-icon" />
                Back
              </button>
              <p className="step">
                <span className="step-number">Step 2:</span> What phone number should the world call you on?
              </p>
              <FormInput
                type="tel"
                name="phoneNumber"
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                required
              />

              <button
                type="button"
                className="additional-info-toggle"
                onClick={() => setShowAdditionalFields(!showAdditionalFields)}
              >
                Additional Info
                <span className={`chevron ${showAdditionalFields ? "open" : ""}`}>▼</span>
              </button>

              {showAdditionalFields && (
                <div className="additional-fields">
                  <FormSelect
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleInputChange}
                    options={[
                      { value: "", label: "Select Business Type" },
                      { value: "finance", label: "Finance" },
                      { value: "technology", label: "Technology" },
                      // Add more options as needed
                    ]}
                  />
                  <FormInput
                    type="text"
                    name="company"
                    placeholder="Company"
                    value={formData.company}
                    onChange={handleInputChange}
                  />
                  <FormInput
                    type="text"
                    name="position"
                    placeholder="Position"
                    value={formData.position}
                    onChange={handleInputChange}
                  />
                  <FormInput
                    type="url"
                    name="websiteAddress"
                    placeholder="Website"
                    value={formData.websiteAddress}
                    onChange={handleInputChange}
                  />
                  <FormInput
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                  <FormInput
                    type="text"
                    placeholder="Address / Location"
                    value={addressLocation}
                    onChange={(e) => setAddressLocation(e.target.value)}
                  />
                  <button
                    type="button"
                    className="find-location-btn"
                    onClick={() => setShowMap(!showMap)}
                  >
                    {showMap ? "Hide Map" : "Find on Map"}
                  </button>
                  {showMap && <MapComponent setAddressLocation={setAddressLocation} />}
                  <FormTextarea
                    name="note"
                    placeholder="Add notes (optional)"
                    value={formData.note}
                    onChange={handleInputChange}
                  />
                </div>
              )}

              <ContinueButton
                onClick={handleContinue}
                disabled={!formData.phoneNumber.trim()}
              />
            </>
          )}

          {currentStep === 3 && (
            <>
              <button className="back-button" onClick={handleBack}>
                <FaChevronLeft className="back-icon" />
                Back
              </button>
              <p className="step">
                <span className="step-number">Step 3:</span> Upload your paper business card.
              </p>
              <BusinessCardUpload
                label="Front Side"
                id="frontUpload"
                image={frontCardImage}
                onChange={handleFrontCardUpload}
                required
              />
              <BusinessCardUpload
                label="Back Side"
                id="backUpload"
                image={backCardImage}
                onChange={handleBackCardUpload}
              />
              
              <div className="button-group">
                <button 
                  type="button"
                  className="create-digital-btn"
                  onClick={handleCreateDigitalCard}
                >
                  Create Digital Card Instead
                </button>
                <SaveButton 
                  onClick={handleSubmit}
                  disabled={!frontCardImage}
                >
                  Save Profile
                </SaveButton>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default UserProfile;