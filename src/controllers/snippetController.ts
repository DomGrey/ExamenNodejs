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
    const {
      language,
      tags,
      page = 1,
      limit = 10,
      sort = "createdAt",
      order = "desc",
    } = req.query;

    // Build filter object
    let filter: any = {};

    // Case-insensitive filtering by language
    if (language) {
      filter.language = new RegExp(language as string, "i"); // 'i' makes it case-insensitive
    }

    // Case-insensitive filtering by tags (supports multiple tags)
    if (tags) {
      const tagArray = (tags as string)
        .split(",")
        .map((tag) => tag.trim().toLowerCase()); // Convert to array and trim
      filter.tags = { $in: tagArray }; // MongoDB query to check if any tag matches
    }

    // Pagination - determine the skip and limit values
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const limitValue = parseInt(limit as string);

    // Sorting - dynamic sort based on query parameters
    const sortOrder = order === "desc" ? -1 : 1; // Default is descending if order is 'desc'

    // Fetch snippets based on the filter, pagination, and sorting
    const snippets = await Snippet.find(filter)
      .skip(skip)
      .limit(limitValue)
      .sort({ [sort]: sortOrder });

    // Get the total count of snippets for pagination
    const totalSnippets = await Snippet.countDocuments(filter);

    // Filter out expired snippets
    const now = Date.now();
    const filteredSnippets = snippets.filter(
      (snippet) =>
        !snippet.expiresIn ||
        new Date(snippet.createdAt).getTime() + snippet.expiresIn * 1000 > now
    );

    // Decode code from base64 to UTF-8
    filteredSnippets.forEach(
      (snippet) =>
        (snippet.code = Buffer.from(snippet.code, "base64").toString("utf-8"))
    );

    // Send the response with pagination details
    res.json({
      totalSnippets,
      totalPages: Math.ceil(totalSnippets / limitValue),
      currentPage: parseInt(page as string),
      snippets: filteredSnippets,
    });
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
