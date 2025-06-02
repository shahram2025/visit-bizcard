import React, { useState, useRef, useEffect } from "react";
import { FaChevronLeft } from "react-icons/fa";
import ProfileImageUpload from "./ProfileImageUpload";
import FormInput from "./FormInput";
import FormSelect from "./FormSelect";
import FormTextarea from "./FormTextarea";
import BusinessCardUpload from "./BusinessCardUpload";
import MapComponent from "./MapComponent";
import SaveButton from "./SaveButton";
import ContinueButton from "../Buttons/ContinueButton";
import "./AddContactPanel.css";

const AddContactPanel = ({ isOpen, onClose, onAddMember, onNewProfession }) => {
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
  
  const [profileImage, setProfileImage] = useState("");
  const [frontCardImage, setFrontCardImage] = useState(null);
  const [backCardImage, setBackCardImage] = useState(null);
  const [addressLocation, setAddressLocation] = useState("");
  const [showMap, setShowMap] = useState(false);
  const [showAdditionalFields, setShowAdditionalFields] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const panelRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    return () => {
      [frontCardImage, backCardImage].forEach(image => {
        if (image && typeof image === 'string' && image.startsWith('blob:')) {
          URL.revokeObjectURL(image);
        }
      });
    };
  }, [frontCardImage, backCardImage]);

  const resetForm = () => {
    setFormData({
      fullName: "",
      phoneNumber: "",
      businessType: "",
      company: "",
      position: "",
      websiteAddress: "",
      email: "",
      note: "",
    });
    setProfileImage("");
    setFrontCardImage(null);
    setBackCardImage(null);
    setAddressLocation("");
    setShowMap(false);
    setShowAdditionalFields(false);
    setCurrentStep(1);
    setIsSubmitting(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleImageUpload = (setter) => (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setter(event.target.result); // Store as data URL
        };
        reader.readAsDataURL(file);
      } else {
        alert('Please upload a valid image file (JPEG, PNG, etc.)');
        e.target.value = ''; // Reset the input
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBusinessTypeChange = (e) => {
    const { value } = e.target;
    setFormData(prev => ({ ...prev, businessType: value }));
    
    if (value && value !== "other") {
      const formattedValue = value.replace(/_/g, ' ');
      onNewProfession?.(formattedValue);
    }
  };

  const handleContinue = () => {
    if (currentStep === 1 && !formData.fullName.trim()) {
      alert("Please enter full name");
      return;
    }
    if (currentStep === 2 && !formData.phoneNumber.trim()) {
      alert("Please enter phone number");
      return;
    }
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!frontCardImage) {
      alert("Please upload front side business card");
      return;
    }

    setIsSubmitting(true);

    try {
      // If the image is a blob URL, convert it to a data URL
      let finalFrontImage = frontCardImage;
      let finalBackImage = backCardImage;

      if (frontCardImage.startsWith('blob:')) {
        finalFrontImage = await convertBlobToDataURL(frontCardImage);
      }

      if (backCardImage && backCardImage.startsWith('blob:')) {
        finalBackImage = await convertBlobToDataURL(backCardImage);
      }

      const newMember = {
        ...formData,
        id: Date.now(),
        frontCardImage: finalFrontImage,
        backCardImage: finalBackImage || null,
        avatar: profileImage || "/default-avatar.jpg",
        addressLocation: addressLocation,
        contact: formData.phoneNumber,
        timestamp: new Date().toISOString()
      };

      onAddMember(newMember);
      handleClose();
    } catch (error) {
      console.error("Error saving member:", error);
      alert("Failed to save profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const convertBlobToDataURL = async (blobUrl) => {
    const response = await fetch(blobUrl);
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  };

  if (!isOpen) return null;

  return (
    <>
      <div className={`add-contact-overlay ${isOpen ? "visible" : ""}`} onClick={handleClose} />
      <div className={`add-contact-panel ${isOpen ? "visible" : ""}`} ref={panelRef}>
        <button className="close-panel-btn" onClick={handleClose}>&times;</button>

        <ProfileImageUpload
          profileImage={profileImage}
          handleProfileImageUpload={handleImageUpload(setProfileImage)}
        />

        <div className="step-guide">
          <h2>Add New Member</h2>

          {currentStep === 1 && (
            <>
              <p className="step">
                <span className="step-number">Step 1:</span> What's your full name?
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
                <span className="step-number">Step 2:</span> What's your phone number?
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
                    onChange={handleBusinessTypeChange}
                    onNewCategory={(profession) => {
                      if (profession && profession.trim() !== "") {
                        setFormData(prev => ({ ...prev, businessType: profession }));
                        onNewProfession?.(profession);
                      }
                    }}
                    required
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
                <span className="step-number">Step 3:</span> Upload your business card
              </p>

              <div className="business-cards-container">
                <BusinessCardUpload
                  label="Front Side"
                  id="frontUpload"
                  image={frontCardImage}
                  onChange={handleImageUpload(setFrontCardImage)}
                  required
                />
                <BusinessCardUpload
                  label="Back Side"
                  id="backUpload"
                  image={backCardImage}
                  onChange={handleImageUpload(setBackCardImage)}
                />
              </div>

              <SaveButton 
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Profile"}
              </SaveButton>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default AddContactPanel;