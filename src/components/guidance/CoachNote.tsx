import GuidanceCallout from '@/components/ui/GuidanceCallout';
import { GuidanceNote } from '@/lib/engines/guidance-generator';

interface CoachNoteProps {
  notes: GuidanceNote[];
}

export default function CoachNote({ notes }: CoachNoteProps) {
  if (notes.length === 0) return null;

  return (
    <div className="space-y-2">
      {notes.map((note, i) => (
        <GuidanceCallout key={i} title={note.title} variant={note.variant}>
          {note.message}
        </GuidanceCallout>
      ))}
    </div>
  );
}
