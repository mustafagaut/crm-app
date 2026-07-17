const Contact = require('../models/Contact');

exports.getContacts = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search || '';

    const query = {
      user: req.user._id,
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
      ],
    };

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

exports.createContact = async (req, res) => {
  try {
    const contact = await Contact.create({ ...req.body, user: req.user._id });

    res.status(201).json({
      success: true,
      message: 'Contact created successfully',
      data: { contact },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create contact', errors: [error.message] });
  }
};

exports.updateContact = async (req, res) => {
  try {
    const contact = await Contact.findOne({ _id: req.params.id, user: req.user._id });

    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact not found' });
    }

    Object.assign(contact, req.body);
    await contact.save();

    res.json({
      success: true,
      message: 'Contact updated successfully',
      data: { contact },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update contact', errors: [error.message] });
  }
};

exports.deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact not found' });
    }

    res.json({
      success: true,
      message: 'Contact deleted successfully',
      data: {},
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete contact', errors: [error.message] });
  }
};
