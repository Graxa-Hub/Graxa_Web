export function AddButton(props) {
    return (
        <button
            onClick={props.click}
            className="bg-blue-500 hover:bg-blue-700 hover:shadow-xl text-white font-medium py-3 px-6 rounded-sm transition-all duration-300 w-fill h-12"
        >
            {props.text}
        </button>
    )
}
