import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          // Reject titles that are entirely uppercase (e.g. "FIRST NOTE").
          // If the value has no letters at all, it passes (nothing to check).
          const hasLetters = /[a-zA-Z]/.test(value);
          if (!hasLetters) return true;
          return value !== value.toUpperCase();
        },
        message: (props) => `"${props.value}" must not be entirely uppercase`,
      },
    },
    content: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }, // adds createdAt & updatedAt automatically
);

export default mongoose.model("Note", noteSchema);
