import mongoose, { Schema } from 'mongoose';

export type EntryType = {
  _id?: string;
  tag: string | null;
  content: string;
  entry_date_time: string;
  user_id: any;
  deleted_at: string | null;
  created_at: string;
  updated_at: string | null;
}

export function formatDate(d: any) {
  const date = new Date(d);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  const milliseconds = String(date.getUTCMilliseconds()).padStart(3, '0');
  const timezoneOffset = date.getTimezoneOffset();
  const sign = timezoneOffset > 0 ? '-' : '+';
  const absOffset = Math.abs(timezoneOffset);
  const offsetHours = String(Math.floor(absOffset / 60)).padStart(2, '0');
  const offsetMinutes = String(absOffset % 60).padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}${sign}${offsetHours}:${offsetMinutes}`;

  return formattedDate;
  // return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
export function getSoftDeleteDate() {
  const date = new Date(Date.now());
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');
  const milliseconds = String(date.getUTCMilliseconds()).padStart(3, '0');
  const timezoneOffset = date.getTimezoneOffset();
  const sign = timezoneOffset > 0 ? '-' : '+';
  const absOffset = Math.abs(timezoneOffset);
  const offsetHours = String(Math.floor(absOffset / 60)).padStart(2, '0');
  const offsetMinutes = String(absOffset % 60).padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}${sign}${offsetHours}:${offsetMinutes}`;

  return formattedDate;
}

const EntrySchema = new Schema<EntryType>({
  tag: {
    type: String,
    default: '',
    required: false,
  },
  content: {
    type: String,
    default: '',
  },
  entry_date_time: {
    type: String,
    required: true,
    default: formatDate(new Date())
  },
  user_id: {
    type: String,
    ref: "app_users",
    required: true
  },
  deleted_at: {
    type: String,
    default: null,
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
});

EntrySchema.methods.softDelete = function (date: Date) {
  this.deleted_at = formatDate(date);
  return this.save();
};

EntrySchema.methods.restore = function () {
  this.deleted_at = null;
  return this.save();
};

EntrySchema.statics.findNotDeleted = function () {
  return this.find({ deleted_at: { $eq: null } });
};

EntrySchema.statics.findDeleted = function () {
  return this.find({ deleted_at: { $ne: null } });
};

const Entries = mongoose.models.Entries || mongoose.model("Entries", EntrySchema, 'entries');
export default Entries;
