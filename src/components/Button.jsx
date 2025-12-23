import "./Button.css";

function Button({ text, onClick, outline }) {
  return (
    <button
      className={outline ? "btn outline" : "btn"}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      {text}
    </button>
  );
}
export default Button;