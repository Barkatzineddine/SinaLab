const partadmin = document.querySelector(".admin-list")
const partdoctor = document.querySelector(".doctor-list")
const searchbox = document.querySelector(".search-admin-doc")



var listdoctor = [];
   var listadmin = [];

  fetch('http://localhost:8000/api-medecins')
  .then(response => response.json())
  .then(data => {

    listdoctor = data;
    
     
 
  })
  .catch(error => console.error(error));

  fetch('http://localhost:8000/api-patients')
  .then(response => response.json())
  .then(data => {

    listadmin = data;
    
     
 
  })
  .catch(error => console.error(error));


  function printdoctor(info) {
    const data = info.map(
      (item) =>
        `<article>
            <div>
                <img alt="" src="../homeperson.svg">
                <h3>${item.username}</h3>
            </div>
            <div>
            <button onclick="envoyermsg(${item._id})"><img alt="" src="../send36.svg"/></button>
            </div>
        </article>`)
        partdoctor.innerHTML = data
    
  }
  function printadmin(info) {
    const data = info.map(
      (item) =>
        `<article>
            <div>
                <img alt="" src="../homeperson.svg">
                <h3>${item.username}</h3>
            </div>
            <div>
            <button onclick="envoyermsg(${item._id})"><i class='bx bxs-send' style='color:#740606'  ></i></button>
            </div>
        </article>`)
        partadmin.innerHTML = data
    
  }
  searchbox.addEventListener("keyup",e =>{
    let table ="";
    let table2 =""
   const value = e.target.value.toLowerCase()
   
    listdoctor.forEach(item=>{
      if (item.username.includes(value)) {
        table+=`<article>
        <div>
            <img alt="" src="../homeperson.svg">
            <h3>${item.username}</h3>
        </div>
        <div>
        <button onclick="envoyermsg(${item._id})">envoyer</button>
        </div>
    </article>`
      }
    }
    )
   
    listadmin.forEach(item=>{
      if (item.username.includes(value)) {
        table2+=`<article>
        <div>
            <img alt="" src="../homeperson.svg">
            <h3>${item.username}</h3>
        </div>
        <div>
        <button onclick="envoyermsg(${item._id})">envoyer</button>
        </div>
    </article>`
      }
    })
    partadmin.innerHTML = table2
    partdoctor.innerHTML = table
  })
  printdoctor(listdoctor);
  printadmin(listadmin);