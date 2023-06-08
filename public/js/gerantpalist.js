


function search(){
  let searchBar = document.querySelector(".search-pa-doc").value.toUpperCase();
  let patientsListe = document.querySelector('.gerantpatlist-section-part3');
  let patient = document.querySelectorAll(".patient");
  let patientUsername = document.querySelectorAll(".patient h3")
  console.log(searchBar)
  console.log(patient)
    console.log(patientUsername)

  for(let i=0 ; i<patientUsername.length; i++){
    if(patientUsername[i].innerHTML.toUpperCase().indexOf(searchBar) >=0){
      patient[i].style.display ="";
    }else{
      patient[i].style.display ="none";
    }
  }
}



