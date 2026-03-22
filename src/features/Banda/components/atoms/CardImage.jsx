export const CardImage = ({ src, alt }) => (
    <div className="aspect-[4/3] bg-[var(--surface-hover)] overflow-hidden">
        {src ? <img src={src} alt={alt} className="w-full h-full object-cover" /> : (
            <div className="w-full h-full flex items-center justify-center">
                <span className="text-[var(--text-muted)] text-sm">Sem foto</span>
            </div>
        )}
    </div>
);
