'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { StreamableValue } from 'ai/rsc'
import { useStreamableText } from '@/lib/hooks/use-streamable-text'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { generateReplacements } from '@/app/actions'
import { generateAnnotatedTextMap } from '@/lib/generateAnnotatedText'
import { Card, CardContent, CardHeader } from './ui/card'
import importDynamic from 'next/dynamic'
import { MDXEditorMethods } from '@mdxeditor/editor'

const Editor = importDynamic(() => import('./mdx-editor'), {
  // Make sure we turn SSR off
  ssr: false
})

import { AfterLine, compilePatches } from '@/lib/compilePatches'

// Force the page to be dynamic and allow streaming responses up to 30 seconds
export const dynamic = 'force-dynamic'
export const maxDuration = 30

function replaceWithMarkdownStrong(
  text: string,
  searchTerm: string,
  replaceWith: string
) {
  return text.replace(
    searchTerm,
    // `<mark className="bg-purple-100">${replaceWith}</mark>`
    replaceWith
  )
}

const applyPatches = (text: string, replacements: string) => {
  const patches = compilePatches(replacements)
  const annotated = generateAnnotatedTextMap(text)

  let result = ''
  patches
    .filter(
      patch =>
        patch.type === 'replace' ||
        patch.type === 'deleteLine' ||
        patch.type === 'deleteSentence'
    )
    .forEach(patch => {
      if (patch.type === 'replace') {
        const { lineIndex, sentenceIndex, pattern, replacementText } = patch
        const sentence = annotated.get(lineIndex)?.get(sentenceIndex)

        if (sentence) {
          const nextText = replaceWithMarkdownStrong(
            sentence,
            pattern,
            replacementText
          )

          annotated.get(lineIndex)!.set(sentenceIndex, nextText)
        }
      } else if (patch.type === 'deleteLine') {
        annotated.delete(patch.lineIndex)
      } else if (patch.type === 'deleteSentence') {
        const line = annotated.get(patch.lineIndex)
        line?.delete(patch.sentenceIndex)
      }
    })

  const maxIndex = Math.max(...Array.from(annotated.keys()))

  const lineAddPatches = patches.filter(
    patch => patch.type === 'afterLine'
  ) as AfterLine[]

  let index = 1
  while (index <= maxIndex) {
    if (annotated.has(index)) {
      const sentences = Array.from(annotated.get(index)!.values())
      result += sentences.join(' ') + '\n'
    } else {
      result += '\n'
    }

    if (lineAddPatches.some(patch => patch.lineIndex === index)) {
      const linePatch = lineAddPatches.filter(
        patch => patch.lineIndex === index
      )
      linePatch.forEach(patch => {
        result += patch!.text + '\n'
      })
    }
    index += 1
  }

  return result
}

export function FindAndReplace() {
  const editorRef = useRef<MDXEditorMethods>(null)

  const [input, setInput] = useState(`
# Introduction to Concise Communication

Welcome to the introductory module of our course on Concise Communication. In today's fast-paced world, the ability to communicate clearly and succinctly is more valuable than ever. Whether in professional settings, academic environments, or personal interactions, conveying your message effectively and efficiently can make a significant difference. This course, led by communication expert Alex Lyon, is designed to equip you with the skills and techniques needed to master the art of concise communication.

## Course Overview

This course is structured into several key modules, each focusing on a different aspect of concise communication:

* [Understanding Long-Windedness](/understanding-long-windedness): Identifying the common pitfalls of over-explanation and redundancy.
* [Crafting Concise Messages](/crafting-concise-messages): Techniques for developing clear, impactful messages.
* [Organizing Thoughts Clearly](/organizing-thoughts-clearly): Strategies for structuring your ideas efficiently.
* [Mastering Effective Pauses](/mastering-effective-pauses): Using pauses to enhance understanding and retention.
* [Eliminating Fillers](/eliminating-fillers): Reducing unnecessary words and phrases from your speech.
* [Using Confident Nonverbals](/using-confident-nonverbals): Communicating effectively through body language.

## Learning Objectives

By the end of this course, you will be able to:

* Understand the importance and benefits of concise communication in various contexts.
* Identify and eliminate common habits that lead to long-windedness.
* Craft messages that are clear, precise, and impactful.
* Organize your thoughts and ideas in a coherent and efficient manner.
* Use pauses and nonverbal cues effectively to enhance your communication.

## What You Can Expect

Under the guidance of Alex Lyon, you will engage in a series of interactive lessons, practical exercises, and real-world examples to hone your communication skills. Each module is designed to build upon the previous one, ensuring a comprehensive understanding of concise communication. By the end of this course, you will have the tools and confidence needed to communicate your ideas effectively, making a lasting impression on your audience.

Embark on this journey to become a more effective communicator, and discover the power of concise communication today.
  `)
  const [instruction, setInstructions] = useState('')

  const [result, setResult] = useState<string | StreamableValue<string>>('')

  const submit = async (customInstruct?: string) => {
    const result = await generateReplacements({
      input,
      instruction: customInstruct || instruction
    })

    if (customInstruct) setInstructions(customInstruct)

    setResult(result)
  }

  const text = useStreamableText(result)

  const replaced = useMemo(() => {
    return applyPatches(input, text)
  }, [text, input])

  useEffect(() => {
    if (replaced) {
      editorRef.current?.setMarkdown(replaced)
    }
  }, [replaced])

  return (
    <div className="grid gap-4 grid-cols-12 p-12 w-full">
      <div className="col-span-3">
        <div className="sticky top-24">
          <div className="rounded-lg bg-gray-300 p-4 dark:bg-gray-900">
            <div className="mt-4 flex flex-col gap-2">
              {[
                'Fix grammar errors',
                'Use keywords "concise and clear"',
                'Anonymize',
                'Make Alex bold',
                'Add John Doe next to Alex Lyon',
                'Add conclusion',
                'Add one course overview bullet point'
              ].map((instruction, index) => (
                <Button
                  key={index}
                  variant="secondary"
                  size="sm"
                  className="rounded-full bg-gray-100 px-3 py-1 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                  onClick={() => {
                    submit(instruction)
                  }}
                >
                  {instruction}
                </Button>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-2">
              <Input
                value={instruction}
                onChange={e => setInstructions(e.target.value)}
                className="bg-white  dark:bg-gray-800"
              />
              <Button variant="default" size="sm" onClick={() => submit()}>
                Submit
              </Button>
            </div>
          </div>
          <Card className="mt-8">
            <CardHeader>Patches</CardHeader>
            <CardContent>
              <div className="mt-4 flex flex-col gap-2 overflow-auto">
                <pre className="text-xs">{text}</pre>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="col-span-9 flex flex-col items-start">
        <Card className="w-auto">
          <CardContent className="py-8">
            <Editor
              editorRef={editorRef}
              markdown={replaced}
              onChange={setInput}
              className="prose prose-2xl break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
