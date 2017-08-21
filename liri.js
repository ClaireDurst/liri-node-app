var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var OMDB = require('request');
var keys = require("./keys.js");
var fs = require("fs");

var command = process.argv[2];
var requestname = process.argv[3];

console.log(command)


function spotifyHelper(err, data){
  if(err){
    console.log("Spotify error");
    log("spotify error");
  }
  else{
    var output = ""
    output += "Artist(s): ";
    for(artist of data.tracks.items[0].artists){
      output += artist.name + " ";
    }
    output += "\nAlbum: " + data.tracks.items[0].album.name;
    output += "\nSong Name: " + data.tracks.items[0].name;
    output += "\nPreview URL: ";
    if(data.tracks.items[0].preview_url !== null){
      output += data.tracks.items[0].preview_url;
    }
    else {
      output += "No preview found.";
    }
    console.log(output);
    log(output + "\n");
  }
}

function useSpotify(name){
  var spotify = new Spotify(keys.spotifyKeys);
  if(name !== undefined){
    spotify.search({
      type: "track",
      query: name,
      limit: 1
    }, spotifyHelper);
  }
  else{
    spotify.search({
      type: "track",
      query: "The Sign",
      limit: 1
    }, spotifyHelper);
  }
}

function movieHelper(err, response, body){
  if (!err && response.statusCode == 200){
    var output = "";
    body = JSON.parse(body);
    output += "Title: " + body.Title;
    output += "\nYear: " + body.Year;
    for(var rater of body.Ratings){
      if(rater.Source === "IMDB"){
        output += "\nIMDB Rating: " + rater.Value;
      }
      else if(rater.Source === "Rotten Tomatoes"){
        output += "\nRotten Tomatoes Rating: " + rater.Value;
      }
    }
    output += "\nCountry: " + body.Country;
    output += "\nLanguage: " + body.Language;
    output += "\nActors: " + body.Actors;
    output += "\nPlot: " + body.Plot;
    console.log(output);
    log(output + "\n");
  }
  else{
    console.log("OMDB error.");
    log("OMDB error.\n");
  }
}

function getAMovie(title){
  if(title !== undefined){
    var query = "http://www.omdbapi.com/?apikey=40e9cece&t=" + title;
    request(query, movieHelper);
  }
  else{
    request("http://www.omdbapi.com/?apikey=40e9cece&t=Mr.Nobody", movieHelper);
  }
}

//This is where the code starts
main(process.argv[2]);