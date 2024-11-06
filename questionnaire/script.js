document.addEventListener("DOMContentLoaded", function () {
  const responses = [];

  const questions = document.querySelectorAll(".quest__answer");

  questions.forEach((form, index) => {
    const questionText = form.closest(".quest").querySelector(".quest__title").textContent;

    const otherOption = Array.from(form.querySelectorAll("input[type='radio'], input[type='checkbox']")).find(
      (input) => input.parentElement.textContent.includes("Other")
    );

    if (otherOption) {
      const otherInput = document.createElement("input");
      otherInput.type = "text";
      otherInput.className = "input-other";
      otherInput.style.display = "none";
      form.appendChild(otherInput);

      otherOption.addEventListener("change", function () {
        otherInput.style.display = otherOption.checked ? "block" : "none";
      });

      const otherRadios = form.querySelectorAll("input[type='radio'], input[type='checkbox']");
      otherRadios.forEach((radio) => {
        radio.addEventListener("change", function () {
          if (!otherOption.checked) {
            otherInput.style.display = "none";
          }
        });
      });
    }
  });

  document.querySelector(".quest__button").addEventListener("click", function () {
    responses.length = 0;

    questions.forEach((form, index) => {
      const questionText = form.closest(".quest").querySelector(".quest__title").textContent;
      const response = { question: questionText, answer: "" };

      const checkedOption = form.querySelector("input[type='radio']:checked, input[type='checkbox']:checked");

      if (checkedOption) {
        response.answer = checkedOption.parentElement.textContent.trim();

        if (checkedOption.parentElement.textContent.includes("Other")) {
          const otherInput = form.querySelector(".other-input");
          if (otherInput && otherInput.value.trim() !== "") {
            response.answer += `: ${otherInput.value.trim()}`;
          }
        }
      } else {
        const textInput = form.querySelector("textarea") || form.querySelector("input[type='email']");
        if (textInput) response.answer = textInput.value.trim();
      }

      responses.push(response);
    });

    console.log("Responses from form:", responses);
  });
});
