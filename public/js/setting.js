const cont = document.querySelector('.setting-part22')
const compte = document.querySelector('.modifier-compte');
const comptepassword = document.querySelector('.modifier-compte');
const comptelangue = document.querySelector('.modifier-langue');
function comptepage() {
    cont.innerHTML = 
    `
    <h3>Modifier le profil</h3>
    <img alt="" src="/homeperson.svg" />

  <form action="/update" method="POST">
    <div class="input-wrapper">
      <label for="username">Nom d’utilisateur</label>
      <input id="username" type="text" name="username" required autofocus/>
    </div>
    <div class="input-wrapper">
      <label for="email">email</label>
      <input id="email" type="email" name="email" required autofocus/>
    </div>
    <div class="input-wrapper">
      <label for="password">Mot de passe</label>
      <input type="text" id="password" name="password" required autofocus/>
    </div>
    <div class="input-wrapper">
      <label for="phone">phone</label>
      <input id="phone" type="number"  name="phone" required autofocus/>
    </div>
    <%if(user.type==="Medecin"){%>
    <div class="input-wrapper">
      <label for="medecin">Mot de passe</label>
      <input id="medecin" type="text"  name="medecin"  autofocus/>
    </div>
    <%}%>

    <button>update</button>
  </form>
    `
}
function passdpage() {
    cont.innerHTML = `
    <h3>Changer le mot de passe </h3>
    <div class="input-wrapper">
      <label for="first">Ancien mot de passe</label>
      <input type="password" />
    </div>
    <div class="input-wrapper">
      <label for="new">Nouveau mot de passe </label>
      <input type="password" />
    </div>
    <div class="input-wrapper">
      <label for="new-pass">Confirmation du nouveau mot de passe</label>
      <input type="password" />
    </div>
    <button>Modifier</button>
    `
}