const MinimizeToggle = (props) => {
  if (props.bool) {
    return (<><i className="fa-solid fa-window-minimize"/> <i class="fa-regular fa-comment" /></>);
  }
  return (<><i className="fa-solid fa-plus" /> <i class="fa-regular fa-comment" /></>);
};

export default MinimizeToggle;