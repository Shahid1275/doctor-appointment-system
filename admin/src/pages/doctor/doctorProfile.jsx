import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getProfileData,
  updateProfileData,
} from "../../redux/features/doctors/doctorSlice";
import { toast } from "react-toastify";

const DoctorProfile = () => {
  const dispatch = useDispatch();
  const { dtoken, profileData, loading, error } = useSelector(
    (state) => state.doctor
  );
  const { currencySymbol } = useSelector((state) => state.app);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    if (dtoken) {
      dispatch(getProfileData());
    }
  }, [dtoken, dispatch]);

  useEffect(() => {
    if (profileData) {
      setFormData({
        name: profileData.name || "",
        degree: profileData.degree || "",
        speciality: profileData.speciality || "",
        experience: profileData.experience || "",
        about: profileData.about || "",
        fees: profileData.fees || "",
        address1: profileData.address?.address1 || "",
        address2: profileData.address?.address2 || "",
        available: profileData.available || false,
      });
    }
  }, [profileData]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: profileData.name || "",
      degree: profileData.degree || "",
      speciality: profileData.speciality || "",
      experience: profileData.experience || "",
      about: profileData.about || "",
      fees: profileData.fees || "",
      address1: profileData.address?.address1 || "",
      address2: profileData.address?.address2 || "",
      available: profileData.available || false,
    });
  };

  const handleSave = () => {
    if (!profileData?._id) {
      toast.error("Doctor ID not available. Please reload the profile.");
      return;
    }

    const updatedData = {
      name: formData.name,
      degree: formData.degree,
      speciality: formData.speciality,
      experience: formData.experience,
      about: formData.about,
      fees: parseFloat(formData.fees) || 0,
      address: {
        address1: formData.address1,
        address2: formData.address2,
      },
      available: formData.available,
    };

    dispatch(updateProfileData(updatedData))
      .unwrap()
      .then(() => {
        setIsEditing(false);
        dispatch(getProfileData()); // Refresh profile data after successful update
      })
      .catch((err) => {
        console.error("Update failed:", err);
      });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-8 p-4 sm:p-6 min-h-screen transition-all duration-300">
      {loading && (
        <div className="flex justify-center items-center h-64">
          <svg
            className="animate-spin h-10 w-10 text-blue-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        </div>
      )}
      {error && (
        <p className="text-red-500 text-center text-lg font-medium">
          Error: {error}
        </p>
      )}
      {profileData && formData ? (
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 transition-all duration-300 hover:shadow-2xl">
          {/* Header: Image and Name */}
          <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
            <div className="flex-shrink-0">
              {profileData.image ? (
                <img
                  src={profileData.image}
                  alt={profileData.name || "Doctor Profile"}
                  className="w-40 h-40 sm:w-48 sm:h-48 rounded-full object-cover border-4 border-blue-100 transition-transform duration-300 hover:scale-105"
                />
              ) : (
                <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-lg font-medium">
                  No Image
                </div>
              )}
            </div>
            <div className="text-center sm:text-left">
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="text-2xl sm:text-3xl font-bold text-gray-800 border-b border-gray-300 focus:outline-none focus:border-blue-500 w-full py-1"
                />
              ) : (
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                  {profileData.name || "N/A"}
                </h1>
              )}
              {isEditing ? (
                <div className="flex gap-2 mt-1">
                  <input
                    type="text"
                    name="degree"
                    value={formData.degree}
                    onChange={handleChange}
                    placeholder="Degree"
                    className="text-lg text-gray-600 border-b border-gray-300 focus:outline-none focus:border-blue-500 py-1"
                  />
                  <input
                    type="text"
                    name="speciality"
                    value={formData.speciality}
                    onChange={handleChange}
                    placeholder="Speciality"
                    className="text-lg text-gray-600 border-b border-gray-300 focus:outline-none focus:border-blue-500 py-1"
                  />
                </div>
              ) : (
                <p className="text-lg text-gray-600 mt-1">
                  {profileData.degree || ""} - {profileData.speciality || ""}
                </p>
              )}
              {isEditing ? (
                <input
                  type="text"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  placeholder="Experience"
                  className="text-sm text-gray-500 border-b border-gray-300 focus:outline-none focus:border-blue-500 w-full py-1 mt-1"
                />
              ) : (
                <p className="text-sm text-gray-500 mt-1">
                  {profileData.experience
                    ? `${profileData.experience} Experience`
                    : "N/A"}
                </p>
              )}
            </div>
          </div>

          {/* Details Section */}
          <div className="mt-8 space-y-6">
            {/* About */}
            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                About
              </h2>
              {isEditing ? (
                <textarea
                  name="about"
                  value={formData.about}
                  onChange={handleChange}
                  rows="4"
                  className="w-full text-gray-600 border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500 resize-y"
                />
              ) : (
                <p className="text-gray-600 leading-relaxed">
                  {profileData.about || "No information provided"}
                </p>
              )}
            </div>

            {/* Appointment Fee */}
            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                Appointment Fee
              </h2>
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">{currencySymbol}</span>
                  <input
                    type="number"
                    name="fees"
                    value={formData.fees}
                    onChange={handleChange}
                    className="text-gray-600 border-b border-gray-300 focus:outline-none focus:border-blue-500 py-1"
                  />
                </div>
              ) : (
                <p className="text-gray-600">
                  {currencySymbol}
                  {profileData.fees || "N/A"}
                </p>
              )}
            </div>

            {/* Address */}
            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                Address
              </h2>
              {isEditing ? (
                <>
                  <input
                    type="text"
                    name="address1"
                    value={formData.address1}
                    onChange={handleChange}
                    placeholder="Address Line 1"
                    className="w-full text-gray-600 border-b border-gray-300 focus:outline-none focus:border-blue-500 py-1 mb-2"
                  />
                  <input
                    type="text"
                    name="address2"
                    value={formData.address2}
                    onChange={handleChange}
                    placeholder="Address Line 2"
                    className="w-full text-gray-600 border-b border-gray-300 focus:outline-none focus:border-blue-500 py-1"
                  />
                </>
              ) : (
                <>
                  <p className="text-gray-600">
                    {profileData.address?.address1 || "N/A"}
                  </p>
                  <p className="text-gray-600 mt-1">
                    {profileData.address?.address2 || "N/A"}
                  </p>
                </>
              )}
            </div>

            {/* Availability */}
            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                Availability
              </h2>
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="availability"
                    name="available"
                    checked={formData.available}
                    onChange={handleChange}
                    className="h-5 w-5 accent-blue-600 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="availability"
                    className="text-gray-600 text-sm font-medium"
                  >
                    {formData.available ? "Available" : "Unavailable"}
                  </label>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span
                    className={`h-5 w-5 rounded border-2 ${
                      profileData.available
                        ? "border-blue-600 bg-blue-100"
                        : "border-gray-300 bg-gray-100"
                    } flex items-center justify-center`}
                  >
                    {profileData.available && (
                      <svg
                        className="w-4 h-4 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </span>
                  <span className="text-gray-600 text-sm font-medium">
                    {profileData.available ? "Available" : "Unavailable"}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-8 flex justify-end gap-4">
            {isEditing ? (
              <>
                <button
                  onClick={handleCancel}
                  className="px-6 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Save
                </button>
              </>
            ) : (
              <button
                onClick={handleEdit}
                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Edit
              </button>
            )}
          </div>
        </div>
      ) : (
        !loading && (
          <p className="text-gray-500 text-center text-lg">
            No profile data available
          </p>
        )
      )}
    </div>
  );
};

export default DoctorProfile;
