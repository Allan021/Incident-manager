'use client'

import { memo, useCallback, useRef } from 'react'
import { PublishButton } from './PublishButton'

export const UpdateComposer = memo(function UpdateComposer({
  onPublish,
}: {
  onPublish: (message: string) => Promise<boolean>
}) {
  const formRef = useRef<HTMLFormElement>(null)

  const action = useCallback(
    async (formData: FormData) => {
      const message = String(formData.get('message') ?? '').trim()
      if (!message) return
      formRef.current?.reset()
      const ok = await onPublish(message)
      if (!ok) {
        const field = formRef.current?.elements.namedItem('message')
        if (field instanceof HTMLTextAreaElement) field.value = message
      }
    },
    [onPublish],
  )

  return (
    <form
      ref={formRef}
      action={action}
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 10,
        padding: 18,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      <label htmlFor="message" style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>
        Post an update
      </label>
      <textarea
        id="message"
        name="message"
        rows={3}
        required
        maxLength={2000}
        placeholder="What changed? What's the next step?"
        style={{
          background: 'var(--bg)',
          border: '1px solid var(--border-strong)',
          borderRadius: 7,
          color: 'var(--text)',
          font: 'inherit',
          fontSize: 13.5,
          padding: '10px 12px',
          resize: 'vertical',
          lineHeight: 1.5,
        }}
      />
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <PublishButton />
      </div>
    </form>
  )
})
