export function AddButton(props) {
  return (
    <button onClick={props.click} className="btn-primary py-3 px-7">
      {props.text}
    </button>
  );
}
