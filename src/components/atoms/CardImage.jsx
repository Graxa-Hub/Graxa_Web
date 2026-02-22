export function CardImage({ src, alt }) {
    return (
        <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
            {src ? (
                <img
                    src={src}
                    alt={alt}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                        e.target.src = 'https://placehold.co/400x300/e2e8f0/64748b?text=Sem+Foto';
                    }}
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                    <span className="text-gray-400 font-medium text-sm">Sem foto</span>
                </div>
            )}
        </div>
    )
}
