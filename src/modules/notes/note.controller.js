import express from "express";
import {
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
} from "./note.service.js";
import { asyncHandler } from "../../common/middleware/error-handling.middleware.js";

const router = express.Router();

// 1. POST /notes?id=<userId>
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { status, body } = await createNote(req.query.id, req.body);
    res.status(status).json(body);
  }),
);

// 4. PATCH /notes/all?id=<userId>
router.patch(
  "/all",
  asyncHandler(async (req, res) => {
    const { status, body } = await updateAllTitles(
      req.query.id,
      req.body.title,
    );
    res.status(status).json(body);
  }),
);

// 2. PATCH /notes/:noteId?id=<userId>
router.patch(
  "/:noteId",
  asyncHandler(async (req, res) => {
    const { status, body } = await updateNote(
      req.params.noteId,
      req.query.id,
      req.body,
    );
    res.status(status).json(body);
  }),
);

// 3. PUT /notes/replace/:noteId?id=<userId>
router.put(
  "/replace/:noteId",
  asyncHandler(async (req, res) => {
    const { status, body } = await replaceNote(
      req.params.noteId,
      req.query.id,
      req.body,
    );
    res.status(status).json(body);
  }),
);

// 12. DELETE /notes?id=<userId>
router.delete(
  "/",
  asyncHandler(async (req, res) => {
    const { status, body } = await deleteAllNotes(req.query.id);
    res.status(status).json(body);
  }),
);

// 6. DELETE /notes/:noteId?id=<userId>
router.delete(
  "/:noteId",
  asyncHandler(async (req, res) => {
    const { status, body } = await deleteNote(req.params.noteId, req.query.id);
    res.status(status).json(body);
  }),
);

// 7. GET /notes/paginate-sort?page=&limit=&id=<userId>
router.get(
  "/paginate-sort",
  asyncHandler(async (req, res) => {
    const { status, body } = await paginateSort(
      req.query.id,
      req.query.page,
      req.query.limit,
    );
    res.status(status).json(body);
  }),
);

// 9. GET /notes/note-by-content?content=&id=<userId>
router.get(
  "/note-by-content",
  asyncHandler(async (req, res) => {
    const { status, body } = await getNoteByContent(
      req.query.id,
      req.query.content,
    );
    res.status(status).json(body);
  }),
);

// 10. GET /notes/note-with-user?id=<userId>
router.get(
  "/note-with-user",
  asyncHandler(async (req, res) => {
    const { status, body } = await getNotesWithUser(req.query.id);
    res.status(status).json(body);
  }),
);

// 11. GET /notes/aggregate?title=&id=<userId>
router.get(
  "/aggregate",
  asyncHandler(async (req, res) => {
    const { status, body } = await aggregateNotesWithUser(
      req.query.id,
      req.query.title,
    );
    res.status(status).json(body);
  }),
);

// 8. GET /notes/:id?id=<userId>
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const { status, body } = await getNoteById(req.params.id, req.query.id);
    res.status(status).json(body);
  }),
);

export default router;
