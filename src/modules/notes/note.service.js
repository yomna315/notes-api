import NoteModel from "../../DB/models/note.model.js";
import DBService from "../../DB/db.service.js";

const notesDB = new DBService(NoteModel);

function isOwner(note, userId) {
  return note.userId.toString() === String(userId);
}

// 1. POST /notes
async function createNote(userId, { title, content }) {
  const note = await notesDB.create({ title, content, userId });
  return { status: 201, body: { message: "Note created", note } };
}

// 2. PATCH /notes/:noteId
async function updateNote(noteId, userId, updateData) {
  const note = await notesDB.findById(noteId);
  if (!note) {
    return { status: 404, body: { message: "Note not found" } };
  }
  if (!isOwner(note, userId)) {
    return { status: 403, body: { message: "You are not the owner" } };
  }

  const updated = await notesDB.updateOne({ _id: noteId }, updateData, {
    new: true,
    runValidators: true,
  });

  return { status: 200, body: { message: "updated", note: updated } };
}

// 3. PUT /notes/replace/:noteId
async function replaceNote(noteId, userId, newData) {
  const note = await notesDB.findById(noteId);
  if (!note) {
    return { status: 404, body: { message: "Note not found" } };
  }
  if (!isOwner(note, userId)) {
    return { status: 403, body: { message: "You are not the owner" } };
  }

  // Full document replacement (keep ownership as the logged-in user).
  const replaced = await NoteModel.findOneAndReplace(
    { _id: noteId },
    { ...newData, userId },
    { new: true, runValidators: true },
  );

  return { status: 200, body: { message: "replaced", note: replaced } };
}

// 4. PATCH /notes/all
async function updateAllTitles(userId, title) {
  const result = await notesDB.updateMany({ userId }, { title });
  if (result.matchedCount === 0) {
    return { status: 404, body: { message: "No note found" } };
  }
  return { status: 200, body: { message: "All notes updated" } };
}

// 6. DELETE /notes/:noteId
async function deleteNote(noteId, userId) {
  const note = await notesDB.findById(noteId);
  if (!note) {
    return { status: 404, body: { message: "Note not found" } };
  }
  if (!isOwner(note, userId)) {
    return { status: 403, body: { message: "You are not the owner" } };
  }

  const deleted = await notesDB.deleteOne({ _id: noteId });
  return { status: 200, body: { message: "deleted", note: deleted } };
}

// 7. GET /notes/paginate-sort?page=&limit=
async function paginateSort(userId, page = 1, limit = 5) {
  page = Math.max(Number(page) || 1, 1);
  limit = Math.max(Number(limit) || 5, 1);
  const skip = (page - 1) * limit;

  const notes = await NoteModel.find({ userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return { status: 200, body: notes };
}

// 8. GET /notes/:id
async function getNoteById(noteId, userId) {
  const note = await notesDB.findById(noteId);
  if (!note) {
    return { status: 404, body: { message: "Note not found" } };
  }
  if (!isOwner(note, userId)) {
    return { status: 403, body: { message: "You are not the owner" } };
  }
  return { status: 200, body: note };
}

// 9. GET /notes/note-by-content?content=
async function getNoteByContent(userId, content) {
  const note = await NoteModel.findOne({
    userId,
    content: { $regex: content, $options: "i" },
  });
  if (!note) {
    return { status: 404, body: { message: "No note found" } };
  }
  return { status: 200, body: note };
}

// 10. GET /notes/note-with-user
async function getNotesWithUser(userId) {
  const notes = await NoteModel.find(
    { userId },
    "title userId createdAt",
  ).populate("userId", "email -_id");
  return { status: 200, body: notes };
}

// 11. GET /notes/aggregate?title=
async function aggregateNotesWithUser(userId, title) {
  const mongoose = require("mongoose");

  const match = { userId: new mongoose.Types.ObjectId(userId) };
  if (title) {
    match.title = { $regex: title, $options: "i" };
  }

  const notes = await NoteModel.aggregate([
    { $match: match },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },
    {
      $project: {
        title: 1,
        userId: 1,
        createdAt: 1,
        "user.name": 1,
        "user.email": 1,
      },
    },
  ]);

  return { status: 200, body: notes };
}

// 12. DELETE /notes
async function deleteAllNotes(userId) {
  await notesDB.deleteMany({ userId });
  return { status: 200, body: { message: "Deleted" } };
}

export {
  createNote,
  updateNote,
  replaceNote,
  updateAllTitles,
  deleteNote,
  paginateSort,
  getNoteById,
  getNoteByContent,
  getNotesWithUser,
  aggregateNotesWithUser,
  deleteAllNotes,
};
