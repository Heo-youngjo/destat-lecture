import { User2Icon } from 'lucide-react';

type MessageBubbleProps = {
  sender?: boolean;
};

export default function MessageBubble({ sender = false }: MessageBubbleProps) {
  return (
    <div className={sender ? 'flex justify-end' : 'flex justify-start'}>
      <div
        className={
          sender
            ? 'flex max-w-[82%] flex-row items-end gap-2'
            : 'flex max-w-[82%] flex-row items-start gap-2'
        }
      >
        {!sender && <User2Icon className="mt-1 size-4 shrink-0 text-foreground/70" />}
        <div className={sender ? 'flex flex-col items-end text-right' : 'flex flex-col'}>
          <h1 className="text-[11px] font-extrabold">Nickname</h1>
          <span
            className={
              sender
                ? 'rounded-2xl bg-primary/18 px-3 py-1.5 text-xs text-foreground'
                : 'text-xs text-muted-foreground'
            }
          >
            this is a sample message
          </span>
        </div>
        {sender && <User2Icon className="mt-1 size-4 shrink-0 text-foreground/70" />}
      </div>
    </div>
  );
}
