export function AddButton(props) {
    return (
        <button
            onClick={props.click}
            className="btn-primary w-full h-11"
        >
            {props.text}
        </button>
    )
}
