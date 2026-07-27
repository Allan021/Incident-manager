import { Icon } from '@/components/ui'

export type ToastData = { type: 'ok' | 'err'; msg: string }

export function Toast({ toast }: { toast: ToastData }) {
  return (
    <div
      role="status"
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        gap: 9,
        fontSize: 13,
        fontWeight: 500,
        padding: '11px 16px',
        borderRadius: 9,
        boxShadow: '0 12px 32px var(--scrim)',
        background: toast.type === 'err' ? 'var(--danger-surface)' : 'var(--success-surface)',
        border: `1px solid ${toast.type === 'err' ? 'var(--danger-border)' : 'var(--success-border)'}`,
        color: toast.type === 'err' ? 'var(--danger-text)' : 'var(--success-text)',
      }}
    >
      <Icon
        path={
          toast.type === 'err'
            ? 'M8 2.5 14.5 13.5H1.5Z M8 7v2.6 M8 11.7v.01'
            : 'M2.5 8.5 6.5 12.5 13.5 4'
        }
        size={14}
      />
      {toast.msg}
    </div>
  )
}
