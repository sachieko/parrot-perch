
const Result = function(props) {
  const { id, thumb, title, onClick } = props;
  
  return (
    <article onClick={(e) => onClick(e, id)}>
      <img alt='thumbnail' style={{ height: '4em' }} src={thumb} />
      {title}
    </article>
  )
};

export default Result;
