const part3 = document.querySelector(".partientlist-section-part3");
const startDate = document.getElementById('startDate');
const endDate = document.getElementById('endDate');
function filterDateArray() {
    const dates = ["2023-03-13","2023-02-13","2023-01-13","2023-04-11","2022-04-13","2022-05-13","2021-05-13","2022-01-13","2022-01-11","2020-05-13"].sort().reverse()
    filteredDate = dates.sort.filter(dateFilter)
    function dateFilter(date) {
        return date >= startDate.value && date <= endDate.value;
    }
    const items = filteredDate.map(item =>`<article>
    <div>
        <h3>Resultat du jour ${item}</h3>
        <p>Pour télécharger le rapport d'analyse au format PDF, veuillez cliquer sur le bouton ci-joint</p>
    </div>
    <button>votre resultat</button>
    </article>`)
    part3.innerHTML = items
    console.log(startDate)
    console.log(endDate)
   

}
