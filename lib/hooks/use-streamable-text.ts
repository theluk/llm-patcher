import { StreamableValue, readStreamableValue } from 'ai/rsc'
import { useEffect, useRef, useState } from 'react'

export const useStreamableText = (
  content: string | StreamableValue<string>
) => {
  const [rawContent, setRawContent] = useState(
    typeof content === 'string' ? content : ''
  )

  const isStreaming = useRef(false)

  useEffect(() => {
    ;(async () => {
      if (typeof content === 'object') {
        isStreaming.current = true
        for await (const delta of readStreamableValue(content)) {
          if (typeof delta === 'string') {
            setRawContent(delta)
          }
        }
        setTimeout(() => {
          isStreaming.current = false
        }, 1)
      }
    })()
  }, [content])

  return [isStreaming, rawContent] as const
}
