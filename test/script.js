var client_id = 'c00fff71c5114d1f929149df578e3cf8';
var redirect_uri = 'http://localhost:3000/callback';
var client_secret = '0780c7e25c364e8ab37209b0dfcbd86d'
const id = '2dIgFjalVxs4ThymZ67YCE';
const app = express();
import express from "express";
import request from 'request';
import crypto  from 'crypto';
import cors from 'cors';
import querystring from 'querystring';
import cookieParser from 'cookie-parser';
import { dirname } from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import { access } from "fs";
var stateKey = 'spotify_auth_state';
const __dirname = dirname(fileURLToPath(import.meta.url));
const port = 3000;
app.use(bodyParser.urlencoded({ extended: true }));
const generateRandomString = (length) => {
    return crypto
    .randomBytes(60)
    .toString('hex')
    .slice(0, length);
  }
  app.use(express.static(__dirname))
   .use(cors())
   .use(cookieParser());
 
   app.get('/login', function(req, res) {

    var state = generateRandomString(16);
    res.cookie(stateKey, state);
  
    // your application requests authorization
    var scope = 'user-read-private user-read-email';
    res.redirect('https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: 'code',
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        state: state
      }));
     
  });
app.get('/callback', function(req, res) {

    // your application requests refresh and access tokens
    // after checking the state parameter
  
    var code = req.query.code || null;
    var state = req.query.state || null;
    var storedState = req.cookies ? req.cookies[stateKey] : null;
  
    if (state === null || state !== storedState) {
      res.redirect('/#' +
        querystring.stringify({
          error: 'state_mismatch'
        }));
    } else {
      res.clearCookie(stateKey);
      var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
          code: code,
          redirect_uri: redirect_uri,
          grant_type: 'authorization_code'
        },
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          Authorization: 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
        },
        json: true
      };
  
      request.post(authOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {
  
          var access_token = body.access_token,
              refresh_token = body.refresh_token;
  
          var options = {
            url: 'https://api.spotify.com/v1/me',
            headers: { 'Authorization': 'Bearer ' + access_token },
            json: true
          };
          
          // use the access token to access the Spotify Web API
          request.get(options, function(error, response, body) {
            console.log(body.uri);
          });
          
          // we can also pass the token to the browser to make requests from there
          res.redirect('/?' +
            querystring.stringify({
              access_token: access_token,
              refresh_token: refresh_token
            }));
        } else {
          res.redirect('/#' +
            querystring.stringify({
              error: 'invalid_token'
            }));
        }
      });
    }
  });
  app.get('/refresh_token', function(req, res) {

    var refresh_token = req.query.refresh_token;
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      headers: { 
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64')) 
      },
      form: {
        grant_type: 'refresh_token',
        refresh_token: refresh_token
      },
      json: true
    };
  
    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        var access_token = body.access_token,
            refresh_token = body.refresh_token;
        res.send({
          'access_token': access_token,
          'refresh_token': refresh_token
        });
      }
    });
  });
  async function fetchAlbums(token) {
    // TODO: Call Web API
    
    var options = {
      url: `https://api.spotify.com/v1/artists/${id}/albums`,
      headers: { 'Authorization': 'Bearer ' + token },
      json: true
    };
    
    // use the access token to access the Spotify Web API
    const result_albums=request.get(options, function(error, response, body) {
      //console.log(body.items[0]);
      var result_albums=body.items;
      
    });
    console.log(result_albums.json());
    
  
    return result_albums;
  }
  
  async function fetchProfile(token) {
    // TODO: Call Web API
  
      const result = await fetch("https://api.spotify.com/v1/me", {
          method: "GET", headers: { Authorization: `Bearer ${token}` }
      });
  
      return await result.json();
  
  }
  
  async function populateUI(albums) {
    // TODO: Update UI with profile data
    
    let parent = document.querySelector('template#strays-template');
    parent=parent.content.querySelector('ul')
    
    //parent=parent.getElementsByTagName("ul")[0];
    //console.log(parent.firstElementChild);
    console.log(parent)
    for(let i=0; i< albums.items.length; i++){
      console.log(albums)
      const li = document.createElement(`li`);
      const a = document.createElement('a');
      a.setAttribute('href', `/${i}/`);
      li.appendChild(a)
      const node = document.createTextNode(albums.items[i].name);
      let stuff=a.appendChild(node);
      //parent.appendChild(stuff);
      parent.after(li);
      console.log(li)
      const album = await fetchAlbum(currentToken.access_token, albums.items[i].id)
      let result =await fetch('/1/index.html', {
        method: "POST", 
        body: JSON.stringify({album:'hi', title:"hi"}),
        completed: false,
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      })
    }
  
  
  }
  
  async function fetchAlbum(token, album_id) {
    let albums= fetchAlbums(token);
    
    
  const result_album= await fetch(`https://api.spotify.com/v1/albums/${album_id}`, {
    method: "GET", headers: { Authorization: `Bearer ${token}` }
  });
  
  
  return await result_album.json();
  }
  
  
  
   
  
  app.get('/', (req, res) =>{
    
    res.render('index.ejs', {data:req.query.access_token})
  });
  app.post('/', (req, res) =>{
    /* var access_token=req.query.access_token
    var options = {
      url: `https://api.spotify.com/v1/artists/${id}`,
      headers: { 'Authorization': 'Bearer ' + access_token },
      json: true
    };
    var access_token=req.body.access_token;
    
    // use the access token to access the Spotify Web API
    const result_albums=request.get(options, function(error, response, body) {
      //console.log(body.items[0]);
      var artist=body;
     console.log(artist)
      res.render('index.ejs', {artist:artist, access_token:access_token});
    });
 */
    console.log(req.body.access_token);

    res.render('index.ejs', {data:req.query.access_token})
  });
  app.post('/access', (req, res) =>{
    var options = {
      url: `https://api.spotify.com/v1/artists/${id}/albums`,
      headers: { 'Authorization': 'Bearer ' + req.body.access_token },
      json: true
    };
    var access_token=req.body.access_token;
    
    // use the access token to access the Spotify Web API
    const result_albums=request.get(options, function(error, response, body) {
      //console.log(body.items[0]);
      var albums=body.items;
     // console.log(albums[0])
      res.render('info.ejs', {albums:albums, access_token:access_token});
    });
    

  });
 
  app.get('/access', function(req, res){
    //fetchAlbums(r)
    console.log(req.body.access_token);
    res.render('info.ejs');
  })
  app.get('/album', function(req, res){
   
    res.render("album.ejs")
  });
  app.post('/album', function(req, res){
    var album_id=req.body.album_id;
    var access_token = req.body.access_token;
    
    var options = {
      url: `https://api.spotify.com/v1/albums/${album_id}`,
      headers: { 'Authorization': 'Bearer ' + access_token },
      json: true
    };
    
    // use the access token to access the Spotify Web API
    const result_albums=request.get(options, function(error, response, body) {
      //console.log(body.items[0]);
      var album=body;
      
      res.render('album.ejs', {album:album, access_token:access_token});
    });
    

  });
    
  app.get('/track', function(req, res){
   
    res.render("track.ejs")
  });
  app.post('/track', function(req, res){
    var track_id=req.body.track_id;
    var access_token = req.body.access_token;
    console.log(access_token)
    var options = {
      url: `https://api.spotify.com/v1/tracks/${track_id}`,
      headers: { 'Authorization': 'Bearer ' + access_token },
      json: true
    };
    
    // use the access token to access the Spotify Web API
    const result_albums=request.get(options, function(error, response, body) {
      //console.log(body.items[0]);
      var track=body;
      res.render('track.ejs', {track:track, access_token:access_token});
    });
    

  });
  app.listen(port, () => {
    console.log(`Server running on port ${port}.`);
  });