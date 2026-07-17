import { useEffect, useState } from "react";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  company: "",
  status: "Lead",
  notes: "",
};

const ContactModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [form, setForm] = useState(emptyForm);
  
  // State to hold custom error messages for each field
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
  });

  useEffect(() => {
    if (isOpen) {
      setForm(initialData ? { ...emptyForm, ...initialData } : emptyForm);
      // Reset errors whenever the modal opens
      setErrors({ name: "", email: "", phone: "", company: "" });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear the error message dynamically as the user types
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  // Custom validation handler
  const validateForm = () => {
    let isValid = true;
    const newErrors = { name: "", email: "", phone: "", company: "" };

    // Name check
    if (!form.name.trim()) {
        newErrors.name = "Name field cannot be empty.";
        isValid = false;
    } else if (form.name.trim().length < 3) {
        newErrors.name = "Name must be at least 3 characters long.";
        isValid = false;
    }

    // Email check with regex matching
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim()) {
      newErrors.email = "Email field cannot be empty.";
      isValid = false;
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = "Please enter a valid email address.";
      isValid = false;
    }

    // Phone check
    if (!form.phone.trim()) {
      newErrors.phone = "Phone field cannot be empty.";
      isValid = false;
    } else if (form.phone.trim().length < 10) {
      newErrors.phone = "Phone number must be at least 10 digits.";
      isValid = false;
    }

    // Company check
    if (!form.company.trim()) {
      newErrors.company = "Company field cannot be empty.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Only run submission if our custom validator approves
    if (validateForm()) {
      onSubmit(form);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-3xl rounded-3xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-gray-200 p-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-600">
              Contact
            </p>

            <h2 className="mt-2 text-3xl font-bold text-gray-900">
              {initialData ? "Edit Contact" : "Add Contact"}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-gray-300 px-5 py-2 text-gray-600 transition hover:bg-gray-100"
          >
            Close
          </button>
        </div>

        {/* Body */}
        <form
          autoComplete="off"
          onSubmit={handleSubmit}
          noValidate // Bypasses default HTML5 validation popups completely
          className="space-y-6 p-6"
        >
          <div className="grid gap-5 md:grid-cols-2">
            {/* Name Input */}
            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Name <span className="text-red-500">*</span>
              </label>

              <input
                type="text"
                autoComplete="off"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className={`w-full rounded-xl border bg-white px-4 py-3 text-gray-900 placeholder-gray-400 outline-none transition focus:ring-4 ${
                  errors.name
                    ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-100"
                }`}
                placeholder="John Doe"
              />
              {errors.name && (
                <p className="mt-1.5 text-xs font-medium text-red-500 animate-fadeIn">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email Input */}
            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Email <span className="text-red-500">*</span>
              </label>

              <input
                type="email"
                autoComplete="off"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className={`w-full rounded-xl border bg-white px-4 py-3 text-gray-900 placeholder-gray-400 outline-none transition focus:ring-4 ${
                  errors.email
                    ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-100"
                }`}
                placeholder="john@example.com"
              />
              {errors.email && (
                <p className="mt-1.5 text-xs font-medium text-red-500 animate-fadeIn">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Phone Input */}
            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Phone <span className="text-red-500">*</span>
              </label>

              <input
                type="text"
                autoComplete="off"
                value={form.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className={`w-full rounded-xl border bg-white px-4 py-3 text-gray-900 placeholder-gray-400 outline-none transition focus:ring-4 ${
                  errors.phone
                    ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-100"
                }`}
                placeholder="+91 9876543210"
              />
              {errors.phone && (
                <p className="mt-1.5 text-xs font-medium text-red-500 animate-fadeIn">
                  {errors.phone}
                </p>
              )}
            </div>

            {/* Company Input */}
            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Company <span className="text-red-500">*</span>
              </label>

              <input
                type="text"
                autoComplete="off"
                value={form.company}
                onChange={(e) => handleChange("company", e.target.value)}
                className={`w-full rounded-xl border bg-white px-4 py-3 text-gray-900 placeholder-gray-400 outline-none transition focus:ring-4 ${
                  errors.company
                    ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-100"
                }`}
                placeholder="Google"
              />
              {errors.company && (
                <p className="mt-1.5 text-xs font-medium text-red-500 animate-fadeIn">
                  {errors.company}
                </p>
              )}
            </div>

            {/* Status Dropdown */}
            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Status
              </label>

              <select
                value={form.status}
                onChange={(e) => handleChange("status", e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              >
                <option value="Lead">Lead</option>
                <option value="Prospect">Prospect</option>
                <option value="Customer">Customer</option>
              </select>
            </div>

            {/* Notes Textarea */}
            <div className="md:col-span-2">
              <label className="mb-2 block font-medium text-gray-700">
                Notes
              </label>

              <textarea
                rows={5}
                autoComplete="off"
                value={form.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                placeholder="Add notes..."
              />
            </div>
          </div>

          {/* Footer Control Buttons */}
          <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-6 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-gray-300 px-6 py-3 font-medium text-gray-700 transition hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              {initialData ? "Update Contact" : "Save Contact"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactModal;