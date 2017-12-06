var xhr = new XMLHttpRequest();
xhr.open('post', 'http://localhost:5678/api', true);
xhr.withCredentials = true;
xhr.setRequestHeader('content-type', 'application/json');
xhr.send(null);

fetch('http://localhost:5678/api', {
    method: 'post',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        name: 'Hubot',
        login: 'hubot',
    })
});

fetch('http://localhost:5678/api', {
  method: 'post',
  mode: 'cors',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  body: 'name=user&login=pwd'
});
