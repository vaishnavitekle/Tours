import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom"; 

export default function AddTourForm({ onSubmit }) {
  const navigate = useNavigate(); 
  const fileInputRef = useRef(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    image: "",
    price: "",
  });
  const [previewUrl, setPreviewUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check if the file is an image
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      e.target.value = ''; // Reset the file input
      return;
    }

    // Check file size (2MB max)
    const maxSize = 2*2048*2028; // 2MB
    if (file.size > maxSize) {
      alert('File size must be less than 2MB');
      e.target.value = ''; // Reset the file input
      return;
    }

    // Create preview URL
    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);
    
    // Store file in form state
    setForm(prev => ({
      ...prev,
      image: file,
      imageName: file.name
    }));
  };

  const update = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.price || !form.image || !form.description) {
      alert("Please fill all fields.");
      return;
    }

    setIsUploading(true);

    try {
      // Create FormData for the entire form
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('price', form.price);
      formData.append('image', form.image); // Append the file directly

      const response = await fetch('http://localhost:8000/api/tours', {
        method: 'POST',
        body: formData, // Send as FormData
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to create tour');
      }

      // Reset form after successful submission
      setForm({
        title: "",
        description: "",
        image: "",
        price: "",
      });
      setPreviewUrl("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      navigate("/");
    } catch (error) {
      console.error("Error:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form className="add-form" onSubmit={submit}>
      <h2>Add New Tour</h2>
      <div className="field">
        <label htmlFor="title">Tour Title</label>
        <input 
          id="title"
          name="title" 
          value={form.title} 
          onChange={update} 
          placeholder="Enter tour title"
          required
        />
      </div>
      
      <div className="field">
        <label htmlFor="price">Price ($)</label>
        <input
          id="price"
          name="price"
          type="number"
          step="0.01"
          min="0"
          value={form.price}
          onChange={update}
          placeholder="Enter price"
          required
        />
      </div>
      
      <div className="field">
        <label htmlFor="image">Tour Image</label>
        <input
          id="image"
          name="image"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          ref={fileInputRef}
          required
        />
        {previewUrl && (
          <div className="image-preview">
            <img 
              src={previewUrl} 
              alt="Preview" 
              style={{ 
                maxWidth: '100%', 
                maxHeight: '200px', 
                marginTop: '10px',
                borderRadius: '4px'
              }} 
            />
          </div>
        )}
      </div>
      
      <div className="field">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          rows={4}
          value={form.description}
          onChange={update}
          placeholder="Enter tour description"
          required
        />
      </div>
      
      <button 
        className="btn primary" 
        type="submit"
        disabled={isUploading}
      >
        {isUploading ? 'Uploading...' : 'Add Tour'}
      </button>
    </form>
  );
}
