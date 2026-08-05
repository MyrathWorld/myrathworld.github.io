import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
const books = defineCollection({ loader: glob({ pattern: '**/*.md', base: './src/content/books', generateId: ({ entry }) => entry.replace(/\.md$/, '') }), schema: z.object({ bookId:z.string(), bookTitle:z.string(), bookLabel:z.string(), slug:z.string(), label:z.string(), title:z.string(), order:z.number(), minutes:z.number(), pdf:z.string(), published:z.boolean().default(true) }) });
export const collections = { books };
