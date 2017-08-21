var keys = require("./keys.js");
var t_witter = require('twitter');
var Twitter = new t_witter(keys.twitterKeys);
var s_potify = require('node-spotify-api');
var Spotify = new s_potify (keys.spotifyKeys);
var OMDB = require('request');
var fs = require("fs");
var title = process.argv[3];

function showTweets(){
  var screenName = {screen_name: 'unknownartistic'};
  Twitter.get('statuses/user_timeline', screenName, function(error, tweets, response){
    if(!error){
      for(var i = 0; i<tweets.length; i++){
        var date = tweets[i].created_at;
        console.log("@unknownartistic: " + tweets[i].text + " Created On: " + date.substring(0, 19));
        console.log("-----------------------");
       
      }
    }else{
      console.log('Error occurred');
    }
  });
}


function spotifyHelper(err, data){
  if(err){
    console.log("Spotify Error");
    console.log("Spotify Error");
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
      output += "Nothing Find";
    }
    console.log(output);
    console.log(output + "\n");
  }
}

function useSpotify(name){
  if(name !== undefined){
    Spotify.search({
      type: "track",
      query: name,
      limit: 1
    }, spotifyHelper);
  }
  else{
    Spotify.search({
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
      if(rater.Source === "Internet Movie Database"){
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
  }
  else{
    console.log("OMDB error");
    log("OMDB error\n");
  }
}

function getAMovie(title){
  if(title !== undefined){
    var query = "http://www.omdbapi.com/?apikey=40e9cece&t=" + title;
    OMDB(query, movieHelper);
  }
  else{
    request("http://www.omdbapi.com/?apikey=40e9cece&t=Mr.Nobody", movieHelper);
  }
}

function doStuff(){
  fs.readFile("./random.txt", "utf8",function(error, data){
    if(error){
      console.log("An error occurred. Does random.txt exist?");
      console.log("\nAn error occurred. Does random.txt exist?\n");
      process.exit(-1);
    }
    else{
      data = data.split(" ");
      main(data[0], data[1], data[2]);
    }
  });
}

function main(command, parameter = process.argv[3], parameter2 = process.argv[4]){
  switch(command){
    case("spotify-this"):
      console.log(command + " " + parameter);
      useSpotify(parameter);
      break;
    case("movie-this"):
      console.log(command + " " + parameter);
      getAMovie(parameter);
      break;
    case("do-what-it-says"):
      console.log(command);
      doStuff()
      case("my-tweets"):
      console.log(command);
      showTweets()
      break
  }
}
//This is where the code starts
main(process.argv[2]);