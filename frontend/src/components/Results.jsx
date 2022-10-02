import React from "react";

import Channel from "./Channel";

export default function Results(props) {
  const { results } = props;

  return results.map(stream => {
    return <Channel key={stream.id} {...stream} />;
  });
}
