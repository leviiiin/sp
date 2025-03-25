document.addEventListener("DOMContentLoaded", function () {
  const toggleContainer = document.querySelector(".toggleContainer");
  const individualsPlans = document.getElementById("individualsPlans");
  const teamsPlans = document.getElementById("teamsPlans");
  const teamsFeaturesTitle = document.getElementById("TeamsFeaturesTitle");
  const individualsFeaturesTitle = document.getElementById("IndividualsFeaturesTitle")
  const teamsFeature = document.getElementById('TeamsFeature');
  const teamsFeatureDWM = document.getElementById('TeamsFeatureDWM');
  const individualsDWMTitle = document.getElementById("IndividualsDWMTitle");
  const teamsDWMTitle = document.getElementById("TeamsDWMTitle");
  const textDWM = document.getElementById("TextDWM");
  const listDWM = document.getElementById("ListDWM");




  toggleContainer.addEventListener("click", function (event) {
    if (event.target.textContent === "Individuals") {
      individualsPlans.style.display = "flex";
      teamsPlans.style.display = "none";

      individualsFeaturesTitle.style.display = 'block';
      teamsFeaturesTitle.style.display = "none";
      teamsFeature.style.display = "none";
      teamsFeatureDWM.style.display = "none";

      individualsDWMTitle.style.display = 'block';
      teamsDWMTitle.style.display = "none";
      textDWM.style.display = 'block';
      listDWM.style.display = 'block';
    } else if (event.target.textContent === "Teams") {
      individualsPlans.style.display = "none";
      teamsPlans.style.display = "flex";

      individualsFeaturesTitle.style.display = 'none';
      teamsFeaturesTitle.style.display = "block";
      teamsFeature.style.display = "flex";
      teamsFeatureDWM.style.display = "flex";

      individualsDWMTitle.style.display = 'none';
      teamsDWMTitle.style.display = "block";
      textDWM.style.display = 'none';
      listDWM.style.display = 'none';
    }
  });
});