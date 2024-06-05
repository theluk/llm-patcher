'use client'

// InitializedMDXEditor.tsx
import type { ForwardedRef } from 'react'
import {
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  MDXEditor as MDXEditorComponent,
  type MDXEditorMethods,
  type MDXEditorProps,
  toolbarPlugin,
  jsxPlugin,
  linkPlugin,
  codeMirrorPlugin,
  codeBlockPlugin,
  linkDialogPlugin,
  JsxComponentDescriptor,
  diffSourcePlugin,
  frontmatterPlugin,
  tablePlugin,
  imagePlugin
} from '@mdxeditor/editor'
import '@mdxeditor/editor/style.css'
import { MdxEditorToolbar } from './mdx-editor-toolbar'

// Only import this to the next file
export default function MDXEditor({
  editorRef,
  components,
  imagePluginOptions,
  ...props
}: { editorRef?: ForwardedRef<MDXEditorMethods> | null } & MDXEditorProps & {
    components?: JsxComponentDescriptor[]
    imagePluginOptions?: Parameters<typeof imagePlugin>[0]
  }) {
  return (
    <MDXEditorComponent
      plugins={[
        toolbarPlugin({ toolbarContents: () => <MdxEditorToolbar /> }),
        listsPlugin(),
        quotePlugin(),
        headingsPlugin(),
        linkPlugin(),
        linkDialogPlugin(),
        imagePlugin(imagePluginOptions),
        tablePlugin(),
        thematicBreakPlugin(),
        frontmatterPlugin(),
        codeBlockPlugin({ defaultCodeBlockLanguage: 'txt' }),

        codeMirrorPlugin({
          codeBlockLanguages: {
            js: 'JavaScript',
            css: 'CSS',
            txt: 'text',
            tsx: 'TypeScript',
            ts: 'TypeScript',
            jsx: 'JSX',
            html: 'HTML',
            json: 'JSON',

            bash: 'Bash',
            md: 'Markdown',
            sh: 'Shell',
            yml: 'YAML',
            yaml: 'YAML',

            graphql: 'GraphQL',
            sql: 'SQL',
            python: 'Python',
            ruby: 'Ruby',
            go: 'Go',
            java: 'Java',
            php: 'PHP',
            swift: 'Swift',
            c: 'C',
            cpp: 'C++',
            cs: 'C#',
            rust: 'Rust',
            r: 'R',
            d: 'D',
            dart: 'Dart',
            kotlin: 'Kotlin',
            scala: 'Scala',
            perl: 'Perl',
            lua: 'Lua',
            shell: 'Shell',
            powershell: 'PowerShell',
            dockerfile: 'Dockerfile',
            makefile: 'Makefile'
          }
        }),
        diffSourcePlugin({ viewMode: 'rich-text', diffMarkdown: 'boo' }),
        markdownShortcutPlugin(),
        jsxPlugin({
          jsxComponentDescriptors: [...(components ?? [])]
        })
      ]}
      {...props}
      ref={editorRef}
    />
  )
}
