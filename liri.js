require("dotenv").config();


var Spotify = require("node-spotify-api");
var keys = require("./keys.js");
var request = require("request");
var moment = require("moment");
var fs = require("fs")

var spotify = new Spotify(keys.spotify);
 
// Gets Spotify info

var getArtistNames = function(artist) {
    return artist.name;
};

var getMeSpotify = function(songName) {
        
    spotify.search({ type: "track", query: songName }, function(err, data) {
        if ( err ) {
            console.log("Error occurred: " + err);
            return;
        }
    
        var songs = data.tracks.items;
    
        for (var i = 0; i < songs.length; i++) {
            console.log(i);
            console.log("artist(s): " + songs[i].artists.map(getArtistNames));
            console.log("song name: " + songs[i].name);
            console.log("preview song: " + songs[i].preview_url);
            console.log("album: " + songs[i].album.name);
            console.log("-----------------------------------");
        }
    });
}

// Gets Movie Info
var getMovieInfo = function(movieName) {
    if (movieName === undefined) {
        movieName = "Mr Nobody";
      }
      
    var urlHit =
      "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=full&tomatoes=true&apikey=5f45f20";
  
    request(urlHit, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        
        var jsonData = JSON.parse(body);
  
        console.log("Title: " + jsonData.Title);
        console.log("Year: " + jsonData.Year);
        console.log("Rated: " + jsonData.Rated);
        console.log("IMDB Rating: " + jsonData.imdbRating);
        console.log("Country: " + jsonData.Country);
        console.log("Language: " + jsonData.Language);
        console.log("Plot: " + jsonData.Plot);
        console.log("Actors: " + jsonData.Actors);
        console.log("Rotten Tomatoes Rating: " + jsonData.Ratings[1].Value);
      }
    });
  };

var getArtistEvent = function(artist) {
    var queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=06b7255e8c8ca9913f24c08e6671f6b6";

    request(queryURL, function(error, response, body) {
        if (!error && response.statusCode === 200) {
        var jsonData = JSON.parse(body);

            if (!jsonData.length) {
                console.log("No results found for " + artist);
                return;
            }

            console.log("Upcoming concerts for " + artist + ":");

            for (var i = 0; i < jsonData.length; i++) {
                var show = jsonData[i];

                //Logs event data
                console.log(
                show.venue.city +
                    "," +
                    (show.venue.region || show.venue.country) +
                    " at " +
                    show.venue.name +
                    " " +
                    moment(show.datetime).format("MM/DD/YYYY")
                );
            }
         }
    });
};

var doWhatItSays = function() {
    fs.readFile("random.txt", "utf8", function(err, data) {
        if (err) throw err;

        var dataArr = data.split(",");

        if (dataArr.length === 2) {
            pick(dataArr[0], dataArr[1]);
        } else if (dataArr.length === 1) {
            pick(dataArr[0]);
        }
    });
}


// Commands to run LIRI
var pick = function(caseData, functionData) {
    switch (caseData) {
    case "concert-this":
      getArtistEvent(functionData);
      break;
    case "spotify-this-song":
      getMeSpotify(functionData);
      break;
    case "movie-this":
      getMovieInfo(functionData);
      break;
    case "do-what-it-says":
      doWhatItSays();
      break;
    default:
      console.log("LIRI doesn't know that");
    }
  };
  
  var runThis = function(argOne, argTwo) {
    pick(argOne, argTwo);
  };
  
  runThis(process.argv[2], process.argv.slice(3).join(" "));