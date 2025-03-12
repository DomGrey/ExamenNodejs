import express from "express";
import {
  createSnippet,
  getSnippets,
  getSnippetById,
} from "../controllers/snippetController";
const router = express.Router();

router.post("/", createSnippet);
router.get("/", getSnippets);
router.get("/:id", getSnippetById);

export default router;
