import { Request, Response } from "express";
import Snippet from "../models/snippetModel";

export const createSnippet = async (req: Request, res: Response) => {
  try {
    const { title, code, language, tags, expiresIn } = req.body;
    const encodedCode = Buffer.from(code).toString("base64");
    const snippet = new Snippet({
      title,
      code: encodedCode,
      language,
      tags,
      expiresIn,
    });
    await snippet.save();
    res.status(201).json(snippet);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Something went wrong" });
    }
  }
};

export const getSnippets = async (req: Request, res: Response) => {
  try {
    const snippets = await Snippet.find();
    snippets.forEach(
      (snippet) =>
        (snippet.code = Buffer.from(snippet.code, "base64").toString("utf-8"))
    );
    res.json(snippets);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Something went wrong" });
    }
  }
};

export const getSnippetById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const snippet = await Snippet.findById(id);
    if (!snippet) return res.status(404).json({ message: "Snippet not found" });
    snippet.code = Buffer.from(snippet.code, "base64").toString("utf-8");
    res.json(snippet);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Something went wrong" });
    }
  }
};
