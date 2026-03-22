import { MapPin } from "lucide-react";
export const EventList = ({ dadosEvento }) => (
    <div>
        <h1 className="text-xl font-bold text-[var(--text-primary)] mb-2">{dadosEvento.titulo}</h1>
        <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-[var(--text-muted)]" />
            <p className="text-sm text-[var(--text-secondary)]">{dadosEvento.nomeLocal}</p>
        </div>
    </div>
);
