import axios from 'axios';
import YTSearch from 'youtube-search-api';
import YoutubePlayer from 'react-youtube';
import { useState } from 'react';


const API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY
function Youtube() {
  const [player, setPlayer] = useState();
  const [term, setTerm] = useState('');
  const [results, setResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [videoId, setVideoId] = useState('');

  const opts = useState({
    height: '390',
    width: '640',
    playerVars: {
      autoplay: 1,
      mute: 1,
      start: 0
    }
  })[0];

  const onReady = (event) => {
    setPlayer(event.target);
  }

  const seek = (event) => {
    player.seekTo(9);
  }

  const printChange = (event) => {
    console.log(event.target);
  }

  const typing = (e) => {
    setTerm(e.target.value);
    axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${term}&key=${API_KEY}`)
    .then((res) => {
      console.log(res);
      console.log(res.data);
      const list = [];
      for (const i of res.data.items){
        console.log(i.id.videoId);
        console.log(i.snippet.thumbnails.default);
        console.log(i.snippet.title);
        let ply = {}
        ply.id = i.id.videoId;
        ply.thumb = i.snippet.thumbnails.default;
        ply.title = i.snippet.title;
        list.push(ply);
      }
      console.log(list);
      console.log('pushing');
      setResults(list);
    })
    .catch((err) => {
      console.log(err);
    });
  }

  const submitSearch = (event) => {
    console.log(term);
    console.log(API_KEY);
    event.preventDefault();
    axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${term}&key=${API_KEY}`)
    .then((res)=>{
      console.log(res);
      console.log(res.data);
      const list = [];
      for (const i of res.data.items){
        console.log(i.id.videoId);
        console.log(i.snippet.thumbnails.default);
        console.log(i.snippet.title);
        let ply = {}
        ply.id = i.id.videoId;
        ply.thumb = i.snippet.thumbnails.default;
        ply.title = i.snippet.title;
        list.push(ply);
      }
      console.log(list);
      console.log('pushing');
      setResults(list);
    })
    .catch((err)=>{
      console.log(err);
    });
  }

  const displayResults = results.map((r, i)=>{
    return (
        <article key={i} onClick={() => setVideoId(r.id)}>
          <img src={r.thumb} />
          { r.title }
        </article>
    )
  })

  return (
    <div>
      <form onSubmit={submitSearch}>
        <input type='text' value={term} placeholder='Search Youtube' onChange={typing} />
        <input type='submit'></input>
      </form>
      {displayResults}
      <YoutubePlayer videoId={videoId} opts={opts} onReady={onReady} onStateChange={printChange} />
      <button onClick={seek}>seek</button>
    </div>
  );
}

export default Youtube;