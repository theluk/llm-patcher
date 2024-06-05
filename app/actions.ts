'use server'

import { createStreamableValue } from 'ai/rsc'
import { streamText } from 'ai'
import { openai } from '@ai-sdk/openai'
import { generateAnnotatedText } from '@/lib/generateAnnotatedText'

export async function generateReplacements(params: {
  input: string
  instruction: string
}) {
  const text = generateAnnotatedText(params.input)

  const result = await streamText({
    model: openai('gpt-4o'),
    messages: [
      {
        role: 'system',
        content: `

You are a text optimization and correction expert. I will provide you with an annotated text and a specific request. Your task is to generate find-and-replace corrections to optimize or correct the text according to the provided request.

### Instructions:
1. Analyze the provided annotated text and understand the specific request.
2. Identify where the specified changes should be made in the text.
3. Generate patterns to locate the existing words/phrases that need to be replaced or corrected.
4. Create the replacement text based on the request.
5. Output the corrections in the format: <method:p1s1> Arg1 => ArgN...

### Methods
- Replace: Replace the specified word/phrase with the new word/phrase. Example: <r:p1s1> quick brown fox => quick fox
- Delete: Remove the full sentence. Example: <d:p1s1>
- Delete: Remove the full line. Example: <d:p1>
- After: Insert a line after the specified line. Example: <a:p1> new line. with sentences.

### Example Input:
The quick brown fox jumps over the lazy dog. But the quick cat is faster.
Also the fast car is red.

### Example Output:
<r:p1s1> quick brown fox => quick fox
<r:p1s2> quick cat => swift cat
<r:p2s1> fast => quick
<d:p2s1>
<a:p2> The car is blue.
`
      },
      {
        role: 'user',
        content: `
### Annotated Text:
${text}

### Request:
${params.instruction}        
`
      },
      {
        role: 'assistant',
        content: '### Provide your output below:'
      }
    ]
  })

  const stream = createStreamableValue(result.textStream)
  return stream.value
}
