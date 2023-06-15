let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});



function addToyInfoToCard(
  name = "Jacob",
  toyImageUrl = 'https://d1e6xbptvrg0sy.cloudfront.net/images/2016/10/19/gonzales_DSC_1588.jpg?width=300',
  toyId = 1,
  likes = 0
){
  const h2 = document.createElement('h2')
  h2.innerHTML = name

  const img = document.createElement('img')
  img.src = toyImageUrl
  img.className = 'toy-avatar'

  const p = document.createElement('p')
  p.innerHTML = `${likes} likes`

  const button = document.createElement('button')
  button.className = "like-btn"
  button.id = toyId
  button.innerHTML = 'Like ❤️'
  button.addEventListener('click', (e) => {
    e.preventDefault()
    //console.log("like button has been clicked")
    increaseToyLikes(e)
  })

  const div = document.createElement('div')
  div.className = 'card'
  div.appendChild(h2)
  div.appendChild(img)
  div.appendChild(p)
  div.appendChild(button)

  const toyCollection = document.getElementById("toy-collection")
  toyCollection.appendChild(div)
};

function fetchAndysToys() {
  fetch('http://localhost:3000/toys')
  .then(response => response.json())
  .then(data => {
    data.forEach(toy => {
      //console.log(toy)
      addToyInfoToCard(toy.name, toy.image, toy.id, toy.likes )
    });
  })
};

function addNewToy() {
  const form = document.querySelector(".add-toy-form")
  form.addEventListener('submit', event => {
    event.preventDefault();
    let name = event.target[0].value
    let url = event.target[1].value

    fetch('http://localhost:3000/toys', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },    
      body: JSON.stringify({
        "name": name, //"Jessie",
        "image": url, //"https://vignette.wikia.nocookie.net/p__/images/8/88/Jessie_Toy_Story_3.png/revision/latest?cb=20161023024601&path-prefix=protagonist",
        "likes": 0
      })
    });

    fetch('http://localhost:3000/toys')
    .then(response => response.json())
    .then(data => {
      let listLeng= data.length + 1
      fetch(`http://localhost:3000/toys/${listLeng}`)
      .then(response => response.json())
      .then(data => {
        addToyInfoToCard(data.name, data.image, data.id, data.likes)
      })
    })
  })
};

function increaseToyLikes(e) {
  let newNumberOfLikes = parseInt(e.target.previousElementSibling.innerText) + 1;
  let id = e.target.id

  fetch(`http://localhost:3000/toys/${id}`, {
    method: 'PATCH',
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },    
    body: JSON.stringify({
      "likes": newNumberOfLikes
    })
  })
  .then(response => response.json())
  .then(data => {
    const toylikes = document.getElementById('toy-collection').getElementsByClassName('card')[`${id - 1}`].querySelector("p")
    toylikes.innerHTML = `${data.likes} likes`
  })
};





















addNewToy()
fetchAndysToys()