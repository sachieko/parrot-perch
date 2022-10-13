function ChangeChannel (props) {
  return (
    <div>
      <form onSubmit={props.onClick}>
        <label> Enter Channel:
          <input type='text' value={props.value} onChange={props.onChange} />
        </label>
        <input type='submit' value="submit" />
      </form>
    </div>
  )
};

export default ChangeChannel;
