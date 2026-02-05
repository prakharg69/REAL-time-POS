import React, { useState } from "react";
import axios from "axios";

function SastaSpotify() {
  const [query, setQuery] = useState("");
  const [songs, setSongs] = useState([]);
  const [lyrics, setLyrics] = useState("");
  const [currentSong, setCurrentSong] = useState(null);
  const [loadingLyrics, setLoadingLyrics] = useState(false);

  // 🎵 Search songs
  const searchSongs = async () => {
    try {
      const res = await axios.get("https://itunes.apple.com/search", {
        params: {
          term: query,
          media: "music",
          limit: 12,
        },
      });
      setSongs(res.data.results);
      setLyrics("");
      setCurrentSong(null);
    } catch {
      alert("Failed to fetch songs 😢");
    }
  };

  // 🎤 Fetch lyrics (mostly works for English)
  const getLyrics = async (artist, title) => {
    try {
      setLoadingLyrics(true);
      setLyrics("");

      const res = await axios.get(
        `https://api.lyrics.ovh/v1/${artist}/${title}`
      );

      setLyrics(
        res.data.lyrics ||
          "Lyrics not available for this song 😢"
      );
    } catch {
      setLyrics(
        "Lyrics not available (common for Bollywood songs) 😢"
      );
    } finally {
      setLoadingLyrics(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-white p-6">
      <h1 className="text-3xl font-bold text-center mb-6">
        🎧 Sasta Spotify
      </h1>

      {/* 🔍 Search */}
      <div className="flex gap-3 max-w-xl mx-auto mb-8">
        <input
          type="text"
          placeholder="Search songs (Bollywood / English)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 px-4 py-2 rounded-lg bg-zinc-800 outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          onClick={searchSongs}
          className="px-5 py-2 rounded-lg bg-green-500 text-black font-semibold hover:bg-green-400"
        >
          Search
        </button>
      </div>

      {/* 🎵 Songs Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {songs.map((song) => (
          <div
            key={song.trackId}
            className="bg-zinc-800 rounded-xl p-4 hover:scale-105 transition"
          >
            <img
              src={song.artworkUrl100}
              alt=""
              className="rounded-lg mx-auto"
            />

            <h3 className="mt-3 text-sm font-semibold truncate">
              {song.trackName}
            </h3>
            <p className="text-xs text-zinc-400 truncate">
              {song.artistName}
            </p>

            {/* ▶️ Play Preview */}
            {song.previewUrl && (
              <button
                onClick={() => setCurrentSong(song)}
                className="mt-3 w-full text-sm py-1.5 rounded-lg bg-blue-500 text-black hover:bg-blue-400"
              >
                ▶️ Play Preview
              </button>
            )}

            {/* 🎤 Lyrics */}
            <button
              onClick={() =>
                getLyrics(song.artistName, song.trackName)
              }
              className="mt-2 w-full text-sm py-1.5 rounded-lg bg-green-500 text-black hover:bg-green-400"
            >
              Get Lyrics 🎤
            </button>
          </div>
        ))}
      </div>

      {/* 🎧 Audio Player */}
      {currentSong && (
        <div className="fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-700 p-4">
          <p className="text-sm mb-1">
            Now Playing:{" "}
            <span className="font-semibold">
              {currentSong.trackName}
            </span>{" "}
            – {currentSong.artistName}
          </p>
          <audio
            src={currentSong.previewUrl}
            controls
            autoPlay
            className="w-full"
          />
        </div>
      )}

      {/* 🎶 Lyrics */}
      {loadingLyrics && (
        <p className="text-center mt-6">Loading lyrics...</p>
      )}

      {lyrics && (
        <div className="mt-8 max-w-3xl mx-auto bg-zinc-900 p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-4">🎶 Lyrics</h2>
          <pre className="whitespace-pre-wrap text-sm text-zinc-300">
            {lyrics}
          </pre>
        </div>
      )}
    </div>
  );
}

export default SastaSpotify;
