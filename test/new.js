async function fetchAlbums(token) {
    // TODO: Call Web API
    
    const result_albums = await fetch(`https://api.spotify.com/v1/artists/${id}/albums`, {
      method: "GET", headers: { Authorization: `Bearer ${token}` }
  });
  
  return await result_albums.json();
  
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
  
  