import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DeleteModal from './DeleteModal';

describe('DeleteModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    onConfirm: jest.fn(),
    contactName: 'Jane Doe',
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders nothing when isOpen is false', () => {
    const { container } = render(
      <DeleteModal {...defaultProps} isOpen={false} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders the dialog when isOpen is true', () => {
    render(<DeleteModal {...defaultProps} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Delete Contact')).toBeInTheDocument();
  });

  it('displays the given contact name in the confirmation message', () => {
    render(<DeleteModal {...defaultProps} contactName="Jane Doe" />);
    expect(screen.getByText(/"Jane Doe"/)).toBeInTheDocument();
  });

  it('falls back to "this contact" when contactName is null', () => {
    render(<DeleteModal {...defaultProps} contactName={null} />);
    expect(screen.getByText(/"this contact"/)).toBeInTheDocument();
  });

  it('falls back to "this contact" when contactName is undefined', () => {
    render(<DeleteModal {...defaultProps} contactName={undefined} />);
    expect(screen.getByText(/"this contact"/)).toBeInTheDocument();
  });

  it('calls onClose when Cancel is clicked', () => {
    render(<DeleteModal {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    expect(defaultProps.onConfirm).not.toHaveBeenCalled();
  });

  it('calls onConfirm when Confirm Delete is clicked', () => {
    render(<DeleteModal {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: /confirm delete/i }));
    expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1);
    expect(defaultProps.onClose).not.toHaveBeenCalled();
  });

  it('has correct accessibility attributes', () => {
    render(<DeleteModal {...defaultProps} />);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });
});
