const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      minlength: 3,
      maxlength: 20,
    },
    password: {   
      type: String,
      required: true,
      minlength: 8,
      maxlength: 100,
    },
    deleted_at: {
      type: Date,
      default: null,  // This will be null if the user is not deleted
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',  // Automatically adds createdAt and updatedAt fields
    },  // Automatically adds createdAt and updatedAt fields
  }
);

// Method to mark a user as deleted (soft delete)
UserSchema.methods.softDelete = function () {
  this.deletedAt = new Date(); // Set the deletedAt field to the current timestamp
  return this.save();
};

// Method to restore a soft-deleted user
UserSchema.methods.restore = function () {
  this.deletedAt = null;  // Set deletedAt back to null to restore the user
  return this.save();
};

// Query to find users that are not soft-deleted (deletedAt is null)
UserSchema.statics.findNotDeleted = function () {
  return this.find({ deletedAt: { $eq: null } });  // Only returns users where deletedAt is null
};
UserSchema.statics.findDeleted = function () {
  return this.find({ deletedAt: { $ne: null } });  // Only returns users where deletedAt is null
};

const Users = mongoose.models.Users || mongoose.model('Users', UserSchema, 'app_users');
export default Users;

