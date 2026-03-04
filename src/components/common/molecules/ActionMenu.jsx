export function ActionMenu({ isOpen, items, className = "" }) {
    if (!isOpen) return null

    return (
        <div className="absolute top-14 right-4 z-30">
            <div className={`cursor-pointer absolute right-0 gap-3 bg-white border border-gray-300 flex flex-col justify-center items-center rounded-lg shadow-lg py-1 min-w-50 min-h-25 shadow-2xl z-10 ${className}`}>
                {items.map((item, index) => {
                    const Icon = item.icon
                    return (
                        <button
                            key={index}
                            onClick={(e) => item.onClick(e)}
                            className="w-full cursor-pointer flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                            <Icon className="w-4 h-4" />
                            {item.label}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
