import React, { useEffect, useState } from "react";
import { X } from "lucide-react"; // Imported for mobile/desktop close icon
import { Contact } from "../pages/ContactsPage";

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  status: string;
  notes: string;
}

interface FormErrors {
  name: string;
  email: string;
  phone: string;
  company: string;
}

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: ContactFormData) => Promise<void> | void;
  initialData: Contact | null;
}

const emptyForm: ContactFormData = {
  name: "",
  email: "",
  phone: "",
  company: "",
  status: "Lead",
  notes: "",
};

const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [form, setForm] = useState<ContactFormData>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({
    name: "",
    email: "",
    phone: "",
    company: "",
  });

  useEffect(() => {
    if (isOpen) {
      setForm(initialData ? { ...emptyForm, ...initialData } : emptyForm);
      setErrors({ name: "", email: "", phone: "", company: "" });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (field: keyof FormErrors | 'status' | 'notes', value: string): void => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (field in errors && errors[field as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors: FormErrors = { name: "", email: "", phone: "", company: "" };

    if (!form.name.trim()) {
      newErrors.name = "Name field cannot be empty.";
      isValid = false;
    } else if (form.name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters long.";
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim()) {
      newErrors.email = "Email field cannot be empty.";
      isValid = false;
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = "Please enter a valid email address.";
      isValid = false;
    }

    if (!form.phone.trim()) {
      newErrors.phone = "Phone field cannot be empty.";
      isValid = false;
    } else if (form.phone.trim().length < 10) {
      newErrors.phone = "Phone number must be at least 10 digits.";
      isValid = false;
    }

    if (!form.company.trim()) {
      newErrors.company = "Company field cannot be empty.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(form);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-0 sm:p-4 backdrop-blur-sm">
      {/* 
        Responsive Modal Container:
        Mobile: Full width, full height screen layer (p-0)
        Desktop: Bound max-width overlay (sm:max-w-3xl sm:rounded-2xl)
      */}
      <div className="flex flex-col h-full w-full bg-slate-900 border-0 sm:h-auto sm:max-w-3xl sm:rounded-2xl sm:border sm:border-slate-800 shadow-2xl overflow-y-auto max-h-screen">
        
        {/* Header Section */}
        <div className="flex items-center justify-between border-b border-slate-800 p-5 sm:p-6 shrink-0">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
              Pipeline Management
            </p>
            <h2 className="mt-1 text-xl sm:text-2xl font-bold text-white">
              {initialData ? "Edit Contact" : "Add Contact"}
            </h2>
          </div>

          {/* Action Close Icon — Fixed to be highly clickable across all layouts */}
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-800 bg-slate-950/40 p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Form Body */}
        <form
          autoComplete="off"
          onSubmit={handleSubmit}
          noValidate
          className="flex-1 flex flex-col justify-between p-5 sm:p-6 space-y-6"
        >
          <div className="grid gap-5 md:grid-cols-2 w-full">
            {/* Name Input */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className={`w-full rounded-xl border bg-slate-950 px-4 py-3 text-sm text-slate-100 placeholder-slate-600 outline-none transition focus:ring-1 ${
                  errors.name
                    ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20"
                    : "border-slate-800 focus:border-cyan-500 focus:ring-cyan-500/20"
                }`}
                placeholder="John Doe"
              />
              {errors.name && (
                <p className="mt-1.5 text-xs font-medium text-rose-400">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email Input */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className={`w-full rounded-xl border bg-slate-950 px-4 py-3 text-sm text-slate-100 placeholder-slate-600 outline-none transition focus:ring-1 ${
                  errors.email
                    ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20"
                    : "border-slate-800 focus:border-cyan-500 focus:ring-cyan-500/20"
                }`}
                placeholder="john@example.com"
              />
              {errors.email && (
                <p className="mt-1.5 text-xs font-medium text-rose-400">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Phone Input */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Phone Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className={`w-full rounded-xl border bg-slate-950 px-4 py-3 text-sm text-slate-100 placeholder-slate-600 outline-none transition focus:ring-1 ${
                  errors.phone
                    ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20"
                    : "border-slate-800 focus:border-cyan-500 focus:ring-cyan-500/20"
                }`}
                placeholder="+1 (555) 000-0000"
              />
              {errors.phone && (
                <p className="mt-1.5 text-xs font-medium text-rose-400">
                  {errors.phone}
                </p>
              )}
            </div>

            {/* Company Input */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Company <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={form.company}
                onChange={(e) => handleChange("company", e.target.value)}
                className={`w-full rounded-xl border bg-slate-950 px-4 py-3 text-sm text-slate-100 placeholder-slate-600 outline-none transition focus:ring-1 ${
                  errors.company
                    ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20"
                    : "border-slate-800 focus:border-cyan-500 focus:ring-cyan-500/20"
                }`}
                placeholder="Acme Corp"
              />
              {errors.company && (
                <p className="mt-1.5 text-xs font-medium text-rose-400">
                  {errors.company}
                </p>
              )}
            </div>

            {/* Status Dropdown */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Pipeline Status
              </label>
              <select
                value={form.status}
                onChange={(e) => handleChange("status", e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20"
              >
                <option value="Lead">Lead</option>
                <option value="Prospect">Prospect</option>
                <option value="Customer">Customer</option>
              </select>
            </div>

            {/* Notes Textarea */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Internal Account Notes
              </label>
              <textarea
                rows={window.innerWidth < 640 ? 3 : 4}
                value={form.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-100 placeholder-slate-600 outline-none transition focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20 resize-none"
                placeholder="Enter engagement descriptions, pipeline history, or follow-up timelines..."
              />
            </div>
          </div>

          {/* Action Footer Actions Row */}
          <div className="flex flex-col-reverse gap-2.5 pt-4 border-t border-slate-800 sm:flex-row sm:justify-end sm:gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-xl border border-slate-800 bg-slate-950/40 px-5 py-3 text-sm font-medium text-slate-400 transition hover:bg-slate-800 hover:text-white sm:w-auto"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="w-full rounded-xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 active:scale-[0.99] sm:w-auto shadow-lg shadow-cyan-500/10"
            >
              {initialData ? "Update Details" : "Create Contact"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactModal;