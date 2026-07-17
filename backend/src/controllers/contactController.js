const Contact = require('../models/Contact');
const { createAuditLog } = require('../utils/logger'); // Injected for Admin tracking requirements

// @desc    Get all contacts for the logged-in user
// @route   GET /api/contacts
// @access  Protected
exports.getContacts = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search || '';

    // 1. Establish base isolation scope: Admins see all, regular users see only their own
    let query = req.user.role === 'Admin' ? {} : { user: req.user._id };

    // 2. ONLY inject the $or condition array if the user actually typed a search string
    if (search.trim() !== '') {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Contact.countDocuments(query);
    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      success: true,
      message: 'Contacts fetched successfully',
      data: {
        contacts,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch contacts', errors: [error.message] });
  }
};

// @desc    Create a new contact
// @route   POST /api/contacts
// @access  Protected
exports.createContact = async (req, res) => {
  try {
    const contact = await Contact.create({ ...req.body, user: req.user._id });

    // TRIGGER AUDIT LOG
    await createAuditLog(
      req.user.email,
      'ADD_CONTACT',
      `Added contact "${contact.name}" (${contact.company || 'No Company'})`
    );

    res.status(201).json({
      success: true,
      message: 'Contact created successfully',
      data: { contact },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create contact', errors: [error.message] });
  }
};

// @desc    Update an existing contact
// @route   PUT /api/contacts/:id
// @access  Protected
exports.updateContact = async (req, res) => {
  try {
    // Admins can search and update any record globally, standard users remain scoped to their own
    const lookupQuery = req.user.role === 'Admin' 
      ? { _id: req.params.id } 
      : { _id: req.params.id, user: req.user._id };

    const contact = await Contact.findOne(lookupQuery);

    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact not found' });
    }

    const oldStatus = contact.status;
    const newStatus = req.body.status || oldStatus;

    Object.assign(contact, req.body);
    await contact.save();

    // Construct custom text payload explaining the change
    let updateDetails = `Updated contact profile details for "${contact.name}"`;
    if (oldStatus !== newStatus) {
      updateDetails += ` (Pipeline status transitioned from '${oldStatus}' to '${newStatus}')`;
    }

    // TRIGGER AUDIT LOG
    await createAuditLog(req.user.email, 'EDIT_CONTACT', updateDetails);

    res.json({
      success: true,
      message: 'Contact updated successfully',
      data: { contact },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update contact', errors: [error.message] });
  }
};

// @desc    Remove a contact record
// @route   DELETE /api/contacts/:id
// @access  Protected
exports.deleteContact = async (req, res) => {
  try {
    // Admins can target any record globally, standard users remain scoped to their own
    const lookupQuery = req.user.role === 'Admin' 
      ? { _id: req.params.id } 
      : { _id: req.params.id, user: req.user._id };

    const contact = await Contact.findOneAndDelete(lookupQuery);

    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact not found' });
    }

    // TRIGGER AUDIT LOG
    await createAuditLog(
      req.user.email,
      'DELETE_CONTACT',
      `Permanently deleted contact "${contact.name}" from company reference "${contact.company || 'N/A'}"`
    );

    res.json({
      success: true,
      message: 'Contact deleted successfully',
      data: {},
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete contact', errors: [error.message] });
  }
};