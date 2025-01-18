const PrimaryButton = ({ children, className, onClick }) => {
  return (
    <button onClick={onClick} className={`primary-btn ${className}`}>
      {children}
    </button>
  );
};
export default PrimaryButton;
