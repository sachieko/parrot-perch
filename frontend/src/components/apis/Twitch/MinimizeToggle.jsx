const MinimizeToggle = (props) => {
  if (props.bool) {
    return (<><i className="fa-solid fa-minus"/> <i className="fa-regular fa-comment" /></>);
  }
  return (<><i className="fa-solid fa-plus" /> <i className="fa-regular fa-comment" /></>);
};

export default MinimizeToggle;