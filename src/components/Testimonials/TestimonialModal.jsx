import React, { useEffect, useState } from "react";
import { X, Upload, Save } from "lucide-react";

export default function TestimonialModal({
  isOpen,
  onClose,
  onSave,
  testimonial,
  isLoading,
}) {
  const [form, setForm] = useState({
    image: null,
    name: "",
    description: "",
    university: "",
    program: "",
    text: "",
    youtubeLink: "",
  });
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (testimonial) {
      setForm({
        image: null,
        name: testimonial.name || "",
        description: testimonial.description || "",
        university: testimonial.university || "",
        program: testimonial.program || "",
        text: testimonial.text || "",
        youtubeLink: testimonial.youtubeLink || "",
      });
      setPreview(testimonial.image?.url || null);
    } else {
      setForm({
        image: null,
        name: "",
        description: "",
        university: "",
        program: "",
        text: "",
        youtubeLink: "",
      });
      setPreview(null);
    }
  }, [testimonial, isOpen]);

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm((p) => ({ ...p, image: file }));
      const reader = new FileReader();
      reader.onload = (ev) => setPreview(ev.target?.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    console.log(form.program);
    if (form.image) fd.append("image", form.image);
    fd.append("name", form.name);
    fd.append("description", form.description);
    fd.append("university", form.university);
    fd.append("program", form.program);
    fd.append("text", form.text);
    fd.append("youtubeLink", form.youtubeLink);
    await onSave(fd, form);
    console.log(fd.get("program"));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {testimonial ? "Edit" : "Create"} Testimonial
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            <div>
              {!preview ? (
                <div className="flex justify-center">
                  <label
                    htmlFor="image-upload"
                    className="group cursor-pointer"
                  >
                    <div className="w-40 h-40 md:w-48 md:h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center bg-gray-50 hover:border-gray-400">
                      <Upload className="h-8 w-8 text-gray-400 mb-2" />
                      <span className="text-sm text-blue-600 group-hover:text-blue-500">
                        Click to upload
                      </span>
                      <span className="text-xs text-gray-500">
                        PNG, JPG up to 10MB
                      </span>
                    </div>
                  </label>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    required={!testimonial}
                  />
                </div>
              ) : (
                <div className="relative w-40 h-40 md:w-48 md:h-48 mx-auto">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-lg border border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPreview(null);
                      setForm((p) => ({ ...p, image: null }));
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-4 mt-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, name: e.target.value }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  University
                </label>
                <input
                  type="text"
                  value={form.university}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, university: e.target.value }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Program
              </label>
              <input
                type="text"
                value={form.program}
                onChange={(e) =>
                  setForm((p) => ({ ...p, program: e.target.value }))
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                YouTube Link
              </label>
              <input
                type="text"
                value={form.youtubeLink}
                onChange={(e) =>
                  setForm((p) => ({ ...p, youtubeLink: e.target.value }))
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <input
              type="text"
              value={form.description}
              onChange={(e) =>
                setForm((p) => ({ ...p, description: e.target.value }))
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Text (HTML allowed)
            </label>
            <textarea
              value={form.text}
              onChange={(e) => setForm((p) => ({ ...p, text: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-32"
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center space-x-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              <Save size={16} />
              <span>{testimonial ? "Update" : "Create"} Testimonial</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
