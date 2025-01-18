const PrimaryOutlineButton = ({ children, className, onClick }) => {
  return (
    <button onClick={onClick} className={`primary-outlined-btn ${className}`}>
      {children}
    </button>
  );
};
export default PrimaryOutlineButton;
