import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ContactModal from './ContactModal';

// ContactModal only imports the `Contact` type from ContactsPage (type-only,
// erased at compile time), but if your Jest transform doesn't strip that
// import cleanly it will try to load the full ContactsPage module (and its
// own imports, e.g. Vite's import.meta.env). Mocking it here keeps this
// test isolated to ContactModal itself. Safe to remove if it's not needed
// in your setup.
jest.mock('../pages/ContactsPage', () => ({}), { virtual: true });

describe('ContactModal', () => {
  const onClose = jest.fn();
  const onSubmit = jest.fn();

  const existingContact: any = {
    _id: 'c1',
    name: 'Jane Doe',
    email: 'jane@example.com',
    phone: '1234567890',
    company: 'Acme Corp',
    status: 'Prospect',
    notes: 'Existing notes',
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  const getInputs = () => ({
    name: screen.getByPlaceholderText('John Doe') as HTMLInputElement,
    email: screen.getByPlaceholderText('john@example.com') as HTMLInputElement,
    phone: screen.getByPlaceholderText('+1 (555) 000-0000') as HTMLInputElement,
    company: screen.getByPlaceholderText('Acme Corp') as HTMLInputElement,
    status: screen.getByRole('combobox') as HTMLSelectElement,
    notes: screen.getByPlaceholderText(
      /Enter engagement descriptions/i
    ) as HTMLTextAreaElement,
  });

  const fillValidForm = () => {
    const { name, email, phone, company } = getInputs();
    fireEvent.change(name, { target: { value: 'John Smith' } });
    fireEvent.change(email, { target: { value: 'john@smith.com' } });
    fireEvent.change(phone, { target: { value: '5551234567' } });
    fireEvent.change(company, { target: { value: 'Initech' } });
  };

  it('renders nothing when isOpen is false', () => {
    const { container } = render(
      <ContactModal
        isOpen={false}
        onClose={onClose}
        onSubmit={onSubmit}
        initialData={null}
      />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('shows "Add Contact" with a blank form when there is no initialData', () => {
    render(
      <ContactModal
        isOpen={true}
        onClose={onClose}
        onSubmit={onSubmit}
        initialData={null}
      />
    );
    expect(screen.getByText('Add Contact')).toBeInTheDocument();
    const { name, status } = getInputs();
    expect(name.value).toBe('');
    expect(status.value).toBe('Lead');
    expect(
      screen.getByRole('button', { name: /create contact/i })
    ).toBeInTheDocument();
  });

  it('shows "Edit Contact" and pre-fills the form when initialData is provided', () => {
    render(
      <ContactModal
        isOpen={true}
        onClose={onClose}
        onSubmit={onSubmit}
        initialData={existingContact}
      />
    );
    expect(screen.getByText('Edit Contact')).toBeInTheDocument();
    const { name, email, phone, company, status, notes } = getInputs();
    expect(name.value).toBe('Jane Doe');
    expect(email.value).toBe('jane@example.com');
    expect(phone.value).toBe('1234567890');
    expect(company.value).toBe('Acme Corp');
    expect(status.value).toBe('Prospect');
    expect(notes.value).toBe('Existing notes');
    expect(
      screen.getByRole('button', { name: /update details/i })
    ).toBeInTheDocument();
  });

  it('calls onClose when the X icon button is clicked', () => {
    render(
      <ContactModal
        isOpen={true}
        onClose={onClose}
        onSubmit={onSubmit}
        initialData={null}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /close modal/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when Cancel is clicked', () => {
    render(
      <ContactModal
        isOpen={true}
        onClose={onClose}
        onSubmit={onSubmit}
        initialData={null}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /^cancel$/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('blocks submission and shows errors when required fields are empty', () => {
    render(
      <ContactModal
        isOpen={true}
        onClose={onClose}
        onSubmit={onSubmit}
        initialData={null}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /create contact/i }));

    expect(screen.getByText('Name field cannot be empty.')).toBeInTheDocument();
    expect(screen.getByText('Email field cannot be empty.')).toBeInTheDocument();
    expect(screen.getByText('Phone field cannot be empty.')).toBeInTheDocument();
    expect(screen.getByText('Company field cannot be empty.')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('rejects a name shorter than 3 characters', () => {
    render(
      <ContactModal
        isOpen={true}
        onClose={onClose}
        onSubmit={onSubmit}
        initialData={null}
      />
    );
    fireEvent.change(getInputs().name, { target: { value: 'Al' } });
    fireEvent.click(screen.getByRole('button', { name: /create contact/i }));
    expect(
      screen.getByText('Name must be at least 3 characters long.')
    ).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('rejects a malformed email address', () => {
    render(
      <ContactModal
        isOpen={true}
        onClose={onClose}
        onSubmit={onSubmit}
        initialData={null}
      />
    );
    fireEvent.change(getInputs().email, { target: { value: 'not-an-email' } });
    fireEvent.click(screen.getByRole('button', { name: /create contact/i }));
    expect(
      screen.getByText('Please enter a valid email address.')
    ).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('rejects a phone number shorter than 10 characters', () => {
    render(
      <ContactModal
        isOpen={true}
        onClose={onClose}
        onSubmit={onSubmit}
        initialData={null}
      />
    );
    fireEvent.change(getInputs().phone, { target: { value: '12345' } });
    fireEvent.click(screen.getByRole('button', { name: /create contact/i }));
    expect(
      screen.getByText('Phone number must be at least 10 digits.')
    ).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('clears a field error as soon as that field is edited', () => {
    render(
      <ContactModal
        isOpen={true}
        onClose={onClose}
        onSubmit={onSubmit}
        initialData={null}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /create contact/i }));
    expect(screen.getByText('Name field cannot be empty.')).toBeInTheDocument();

    fireEvent.change(getInputs().name, { target: { value: 'Someone' } });
    expect(
      screen.queryByText('Name field cannot be empty.')
    ).not.toBeInTheDocument();
  });

  it('submits the form with the entered values when everything is valid', () => {
    render(
      <ContactModal
        isOpen={true}
        onClose={onClose}
        onSubmit={onSubmit}
        initialData={null}
      />
    );
    fillValidForm();
    fireEvent.change(getInputs().status, { target: { value: 'Customer' } });
    fireEvent.change(getInputs().notes, { target: { value: 'Follow up next week' } });

    fireEvent.click(screen.getByRole('button', { name: /create contact/i }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith({
      name: 'John Smith',
      email: 'john@smith.com',
      phone: '5551234567',
      company: 'Initech',
      status: 'Customer',
      notes: 'Follow up next week',
    });
  });

  it('resets to a blank form when reopened without initialData after being closed', () => {
    const { rerender } = render(
      <ContactModal
        isOpen={true}
        onClose={onClose}
        onSubmit={onSubmit}
        initialData={existingContact}
      />
    );
    expect(getInputs().name.value).toBe('Jane Doe');

    rerender(
      <ContactModal
        isOpen={false}
        onClose={onClose}
        onSubmit={onSubmit}
        initialData={null}
      />
    );
    rerender(
      <ContactModal
        isOpen={true}
        onClose={onClose}
        onSubmit={onSubmit}
        initialData={null}
      />
    );

    expect(getInputs().name.value).toBe('');
  });
});
