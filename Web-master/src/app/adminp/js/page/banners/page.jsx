"use client";

import React, { useState, useEffect } from "react";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaEye,
  FaEyeSlash,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";
import Sidebar from "../../include/sidebar";
import Tab from "../../include/tab";

export default function BannerManagement() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [currentBanner, setCurrentBanner] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image_url: "",
    color: "bg-blue-500",
    is_active: 1,
  });
  const [previewImage, setPreviewImage] = useState(null);

  // Fetch banners
  const fetchBanners = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/banners");
      if (!response.ok) {
        throw new Error("Failed to fetch banners");
      }
      const data = await response.json();
      setBanners(data);
    } catch (error) {
      console.error("Error fetching banners:", error);
      setError("Failed to load banners. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "file" && files.length > 0) {
      // Handle file upload
      setFormData({
        ...formData,
        [name]: files[0],
      });

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(files[0]);
    } else if (type === "checkbox") {
      setFormData({
        ...formData,
        [name]: checked ? 1 : 0,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      image_url: "",
      color: "bg-blue-500",
      is_active: 1,
    });
    setPreviewImage(null);
    setCurrentBanner(null);
  };

  // Open add form
  const handleAddClick = () => {
    resetForm();
    setShowAddForm(true);
    setShowEditForm(false);
  };

  // Open edit form
  const handleEditClick = (banner) => {
    setCurrentBanner(banner);
    setFormData({
      title: banner.title,
      description: banner.description || "",
      image_url: "", // Don't set the file input
      color: banner.color || "bg-blue-500",
      is_active: banner.is_active,
    });
    setPreviewImage(banner.image_url);
    setShowEditForm(true);
    setShowAddForm(false);
  };

  // Submit add form
  const handleAddSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });

      const response = await fetch("/api/banners", {
        method: "POST",
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add banner");
      }

      // Refresh banners list
      fetchBanners();
      setShowAddForm(false);
      resetForm();
    } catch (error) {
      console.error("Error adding banner:", error);
      alert(`Error adding banner: ${error.message}`);
    }
  };

  // Submit edit form
  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (!currentBanner) return;

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        // Only append if there's a value or it's a checkbox
        if (formData[key] !== "" || key === "is_active") {
          formDataToSend.append(key, formData[key]);
        }
      });

      const response = await fetch(`/api/banners/${currentBanner.banner_id}`, {
        method: "PUT",
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update banner");
      }

      // Refresh banners list
      fetchBanners();
      setShowEditForm(false);
      resetForm();
    } catch (error) {
      console.error("Error updating banner:", error);
      alert(`Error updating banner: ${error.message}`);
    }
  };

  // Delete banner
  const handleDeleteClick = async (bannerId) => {
    if (!confirm("Are you sure you want to delete this banner?")) return;

    try {
      const response = await fetch(`/api/banners/${bannerId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete banner");
      }

      // Refresh banners list
      fetchBanners();
    } catch (error) {
      console.error("Error deleting banner:", error);
      alert(`Error deleting banner: ${error.message}`);
    }
  };

  // Toggle banner active status
  const handleToggleActive = async (banner) => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("is_active", banner.is_active === 1 ? 0 : 1);

      const response = await fetch(`/api/banners/${banner.banner_id}`, {
        method: "PUT",
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update banner status");
      }

      // Refresh banners list
      fetchBanners();
    } catch (error) {
      console.error("Error updating banner status:", error);
      alert(`Error updating banner status: ${error.message}`);
    }
  };

  // Move banner position
  const handleMovePosition = async (banner, direction) => {
    const newPosition =
      direction === "up" ? banner.position - 1 : banner.position + 1;

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("position", newPosition);

      const response = await fetch(`/api/banners/${banner.banner_id}`, {
        method: "PUT",
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update banner position");
      }

      // Refresh banners list
      fetchBanners();
    } catch (error) {
      console.error("Error updating banner position:", error);
      alert(`Error updating banner position: ${error.message}`);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-8">
        <Tab />
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Banner Management</h1>
            <button
              onClick={handleAddClick}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center"
            >
              <FaPlus className="mr-2" /> Add New Banner
            </button>
          </div>

          {loading ? (
            <div className="text-center py-4">Loading banners...</div>
          ) : error ? (
            <div className="text-center text-red-500 py-4">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-100 text-gray-700 uppercase text-sm leading-normal">
                    <th className="py-3 px-6 text-left">ID</th>
                    <th className="py-3 px-6 text-left">Image</th>
                    <th className="py-3 px-6 text-left">Title</th>
                    <th className="py-3 px-6 text-left">Description</th>
                    <th className="py-3 px-6 text-center">Status</th>
                    <th className="py-3 px-6 text-center">Position</th>
                    <th className="py-3 px-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-sm">
                  {banners.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="py-4 text-center">
                        No banners found. Add your first banner!
                      </td>
                    </tr>
                  ) : (
                    banners.map((banner) => (
                      <tr
                        key={banner.banner_id}
                        className="border-b border-gray-200 hover:bg-gray-50"
                      >
                        <td className="py-3 px-6">{banner.banner_id}</td>
                        <td className="py-3 px-6">
                          <img
                            src={banner.image_url}
                            alt={banner.title}
                            className="w-20 h-12 object-cover rounded"
                          />
                        </td>
                        <td className="py-3 px-6">{banner.title}</td>
                        <td className="py-3 px-6">{banner.description}</td>
                        <td className="py-3 px-6 text-center">
                          <button
                            onClick={() => handleToggleActive(banner)}
                            className={`p-1 rounded ${
                              banner.is_active === 1
                                ? "text-green-500"
                                : "text-gray-400"
                            }`}
                            title={
                              banner.is_active === 1
                                ? "Active (Click to deactivate)"
                                : "Inactive (Click to activate)"
                            }
                          >
                            {banner.is_active === 1 ? (
                              <FaEye size={18} />
                            ) : (
                              <FaEyeSlash size={18} />
                            )}
                          </button>
                        </td>
                        <td className="py-3 px-6 text-center">
                          <div className="flex justify-center items-center">
                            <button
                              onClick={() => handleMovePosition(banner, "up")}
                              className="p-1 text-blue-500"
                              disabled={banner.position === 1}
                              title="Move up"
                            >
                              <FaArrowUp
                                size={14}
                                className={
                                  banner.position === 1 ? "opacity-30" : ""
                                }
                              />
                            </button>
                            <span className="mx-2">{banner.position}</span>
                            <button
                              onClick={() => handleMovePosition(banner, "down")}
                              className="p-1 text-blue-500"
                              disabled={banner.position === banners.length}
                              title="Move down"
                            >
                              <FaArrowDown
                                size={14}
                                className={
                                  banner.position === banners.length
                                    ? "opacity-30"
                                    : ""
                                }
                              />
                            </button>
                          </div>
                        </td>
                        <td className="py-3 px-6 text-center">
                          <div className="flex justify-center items-center">
                            <button
                              onClick={() => handleEditClick(banner)}
                              className="p-1 text-blue-500 mr-2"
                              title="Edit"
                            >
                              <FaEdit size={18} />
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteClick(banner.banner_id)
                              }
                              className="p-1 text-red-500"
                              title="Delete"
                            >
                              <FaTrash size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Add Banner Form */}
          {showAddForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-6">Add New Banner</h2>
                <form onSubmit={handleAddSubmit}>
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                      rows="3"
                    ></textarea>
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">
                      Banner Image *
                    </label>
                    <input
                      type="file"
                      name="image_url"
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                      accept="image/*"
                      required
                    />
                    {previewImage && (
                      <div className="mt-2">
                        <img
                          src={previewImage}
                          alt="Preview"
                          className="w-full max-h-40 object-contain"
                        />
                      </div>
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">
                      Color Theme
                    </label>
                    <select
                      name="color"
                      value={formData.color}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    >
                      <option value="bg-blue-500">Blue</option>
                      <option value="bg-red-500">Red</option>
                      <option value="bg-green-500">Green</option>
                      <option value="bg-yellow-500">Yellow</option>
                      <option value="bg-purple-500">Purple</option>
                    </select>
                  </div>

                  <div className="mb-6">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="is_active"
                        checked={formData.is_active === 1}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      <span>Active</span>
                    </label>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg mr-2"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                    >
                      Add Banner
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Edit Banner Form */}
          {showEditForm && currentBanner && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-6">Edit Banner</h2>
                <form onSubmit={handleEditSubmit}>
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                      rows="3"
                    ></textarea>
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">
                      Banner Image
                    </label>
                    <input
                      type="file"
                      name="image_url"
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                      accept="image/*"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Leave empty to keep current image
                    </p>
                    {previewImage && (
                      <div className="mt-2">
                        <img
                          src={previewImage}
                          alt="Preview"
                          className="w-full max-h-40 object-contain"
                        />
                      </div>
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">
                      Color Theme
                    </label>
                    <select
                      name="color"
                      value={formData.color}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    >
                      <option value="bg-blue-500">Blue</option>
                      <option value="bg-red-500">Red</option>
                      <option value="bg-green-500">Green</option>
                      <option value="bg-yellow-500">Yellow</option>
                      <option value="bg-purple-500">Purple</option>
                    </select>
                  </div>

                  <div className="mb-6">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="is_active"
                        checked={formData.is_active === 1}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      <span>Active</span>
                    </label>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setShowEditForm(false)}
                      className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg mr-2"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                    >
                      Update Banner
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
