const Log = require('../models/Log');

const logAction = async (action, user, description, metadata = {}) => {
  try {
    const log = new Log({
      action,
      user,
      description,
      metadata
    });
    await log.save();
  } catch (error) {
    console.error('Error saving log:', error.message);
  }
};

module.exports = {logAction};
