import connectionDB from "./DB/connectionDB.js";

import usersRouter from "./modules/users/user.controller.js";
import notesRouter from "./modules/notes/note.controller.js";

import { globalErrorHandler } from "./common/middleware/error-handling.middleware.js";

function bootstrap(app, express) {
  connectionDB();

  app.use(express.json());

  app.use("/users", usersRouter);
  app.use("/notes", notesRouter);

  app.use((req, res) => {
    res.status(404).json({
      message: "Route not found",
    });
  });

  app.use(globalErrorHandler);
}

export default bootstrap;
