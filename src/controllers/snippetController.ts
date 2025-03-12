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
    const now = Date.now();
    const snippets = await Snippet.find();
    const filteredSnippets = snippets.filter(
      (snippet) =>
        !snippet.expiresIn ||
        new Date(snippet.createdAt).getTime() + snippet.expiresIn * 1000 > now
    );
    filteredSnippets.forEach(
      (snippet) =>
        (snippet.code = Buffer.from(snippet.code, "base64").toString("utf-8"))
    );
    res.json(filteredSnippets);
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

    const now = Date.now();
    if (
      snippet.expiresIn &&
      new Date(snippet.createdAt).getTime() + snippet.expiresIn * 1000 < now
    ) {
      return res.status(404).json({ message: "Snippet expired" });
    }

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

export const updateSnippet = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, code, language, tags } = req.body;
    const encodedCode = Buffer.from(code).toString("base64");
    const updatedSnippet = await Snippet.findByIdAndUpdate(
      id,
      { title, code: encodedCode, language, tags },
      { new: true }
    );
    if (!updatedSnippet)
      return res.status(404).json({ message: "Snippet not found" });
    res.json(updatedSnippet);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Something went wrong" });
    }
  }
};

export const deleteSnippet = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedSnippet = await Snippet.findByIdAndDelete(id);
    if (!deletedSnippet)
      return res.status(404).json({ message: "Snippet not found" });
    res.json({ message: "Snippet deleted successfully" });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Something went wrong" });
    }
  }
};
