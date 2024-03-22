document.addEventListener("DOMContentLoaded", () => {
   
  const form = document.getElementById("patientForm");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    // Capturar los datos del paciente del formulario
    const patientData = {
      fullName: document.getElementById("fullName").value,
      dateOfBirth: document.getElementById("dateOfBirth").value,
      gender: document.getElementById("gender").value,
      motive: document.getElementById("motive").value,
      temperature: document.getElementById("temperature").value,
      height: document.getElementById("height").value,
      weight: document.getElementById("weight").value,
      oxygen_sat: document.getElementById("oxygen_sat").value,
    };

    console.log(patientData);
    calculateAge(patientData.dateOfBirth);

    // Filtrar los diagnósticos basados en los criterios
    filterDiagnoses(patientData);
  });

  function fetchApi(){
    fetch("https://api.editandoideas.com/technical-test/cat__cie_sis.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error en la solicitud de la API");
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
    })
    .catch((error) => console.error(error));
  }

  //funcion para calcular la edad
    function calculateAge(dateOfBirth) {
        const currentDate = new Date();
        const birthDate = new Date(dateOfBirth);
        let age = currentDate.getFullYear() - birthDate.getFullYear();
        const month = currentDate.getMonth() - birthDate.getMonth();
        if (month < 0 || (month === 0 && currentDate.getDate() < birthDate.getDate())) {
        age--;
        }
        console.log(age);
        return age;
    }

    //funcion para salcular limites de edad usando nomenclatura horas de nacido, dias de nacido, meses de nacido, años de nacido



  // Función para filtrar los diagnósticos
  function filterDiagnoses(data) {
    fetchApi();
    if(data.gender === 'MUJER'){
        data.filter((diagnosis) => {
            return diagnosis === (lsex === 'MUJER' || lsex === 'AMBOS');
        })
    } 
  }

  // Función para verificar si la edad es superior al límite
  function isAgeAboveLimit(age, limit) {

  
  }

  // Función para verificar si la edad es inferior al límite
  function isAgeBelowLimit(age, limit) {
   
  }
});
