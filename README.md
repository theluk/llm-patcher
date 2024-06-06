<h1 align="center">LLM Patcher</h1>

<p align="center">
  An open-source AI find-and-replace workflow template built with Next.js, the Vercel AI SDK and OpenAI.
</p>

## About

Whenever we provide a text to an LLM and ask it to do some changes, it will always stream the full text back to us. This is not ideal for large texts, as it can be slow and expensive. This project aims to solve this problem by providing a way to stream only the changes made by the LLM back to the user.

## Demo

[Live Demo](https://llm-patcher.vercel.app/)

![Demo](/public/demo.gif)

## Features

- [Next.js](https://nextjs.org) App Router
- React Server Components (RSCs), Suspense, and Server Actions
- [Vercel AI SDK](https://sdk.vercel.ai/docs) for streaming chat UI
- Support for OpenAI (default), Anthropic, Cohere, Hugging Face, or custom AI chat models and/or LangChain
- [shadcn/ui](https://ui.shadcn.com)
- Styling with [Tailwind CSS](https://tailwindcss.com)

## How does it work?

1. The user provides a text and a find-and-replace query.
2. The text is split into lines and sentences.
3. Each line and sentence is then prefixed with a identifier that looks like `<l1s1>` for line 1, sentence 1.
4. The LLM is then asked to find-and-replace the query in each line and sentence.
5. The changes are then streamed back to the user in the form of a diff. The diff looks like `<r:l1s1> string to find || string to replace`.

## What this is not for

- This is not for generating text from scratch.
- This is not for summarizing text.
- This is not for translating text.
- This is not for sentiment analysis.
- This is not for chat bots.
- This is not a general purpose drop in replacement for how we use LLMs today.

## What this is for

- This is for finding and replacing text in a large text.
- This is for patching text.
- This is for editing text.
- Use this as tooling for specific workflows that require find-and-replace functionality.
  - For example, this can be used to patch code, documentation, or any other text that requires find-and-replace functionality.
  - Find-and-replace can be used to fix typos, replace words, or even replace entire sentences.
  - Anonymize text by replacing names with placeholders.
  - Replace sensitive information with placeholders.
  - Replace placeholders with actual values.
  - Replace placeholders with code snippets.
  - Replace placeholders with images.
  - Replace placeholders with links.
  - Replace words with SEO keywords.

## Running locally

You will need to use the environment variables [defined in `.env.example`](.env.example) to run use OpenAI.

> Note: You should not commit your `.env` file or it will expose secrets that will allow others to control access to your various OpenAI and authentication provider accounts.

```bash
pnpm install
pnpm dev
```

Your app template should now be running on [localhost:3000](http://localhost:3000/).

## Authors

This project was created by [theluk](https://github.com/theluk)

## Credits

This library was cloned from [Vercel AI Chatbot](https://github.com/vercel/ai-chatbot).
