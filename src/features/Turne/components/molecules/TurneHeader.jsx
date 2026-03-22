export const TurneHeader = ({ titulo, subtitulo }) => (
    <div className="mb-4">
        <h2 className="font-bold text-[var(--text-primary)] text-lg">{titulo}</h2>
        {subtitulo && <p className="text-sm text-[var(--text-muted)] mt-1">{subtitulo}</p>}
    </div>
);
