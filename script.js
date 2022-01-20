const API_URL = "https://api.dictionaryapi.dev/api/v2/entries/en/";

const tabsContainer = document.querySelector(".tab");
const tablinks = document.getElementsByClassName("tablinks");
const tabContentContainer = document.querySelector(".tabContentContainer");
const tabcontents = document.getElementsByClassName("tabcontent");

const container = document.querySelector(".container");
const displayContainer = document.querySelector(".display");
const inputField = document.querySelector(".input-field");
const er = document.querySelector(".err");

const renderSynonyms = function (arr) {
  let markup = "";
  arr.forEach((item, i) => {
    markup += `<button class="btn--synonyms">${item}</button>${
      i === 5 ? "<br/>" : ""
    }`;
  });
  return markup;
};

document.addEventListener("submit", function (e) {
  e.preventDefault();

  if (!inputField.value) return;
  findQuery(inputField.value);
  container.classList.add("hidden-container");
  displayContainer.classList.remove("display");
  displayContainer.classList.add("show-display");
});

const findQuery = function (query) {
  getJSON(query)
    .then((data) => {
      if (!data) throw new Error("Enter Valid Query!");
      er.style.display = "none";
      tabsContainer.innerHTML = "";
      tabContentContainer.innerHTML = "";

      data.forEach((item, i) => {
        const markup = `<button class="tablinks" data-value=${i}>${item.partOfSpeech}</button>`;
        tabsContainer.insertAdjacentHTML("afterbegin", markup);

        let definition = item.definitions[0].definition;
        let example = item.definitions[0].example;
        let synonyms = item.definitions[0].synonyms;

        const markup2 = `<div class="tabcontent-${i} tabcontent">
        <p><b>definition :</b>${definition}</p>
        <p><b>${example ? "example :" : ""}</b>${example ? example : ""}</p>
        <p><b>${synonyms.length !== 0 ? "synonyms :" : ""}</b>${
          synonyms.length !== 0 ? renderSynonyms(synonyms.slice(0, 10)) : ""
        }</p>
      </div>`;

        tabContentContainer.insertAdjacentHTML("afterbegin", markup2);
      });
      // console.log(document.querySelector(".tabcontent-0"));
      document.querySelector(".tabcontent-0").style.display = "block";
      tabsContainer.children[0].classList.add("active");
    })
    .catch((err) => {
      tabsContainer.innerHTML = "";
      tabContentContainer.innerHTML = "";
      er.innerHTML = "";
      const errMarkup = `<p>
      ${err.message}
      </p>`;
      er.style.display = "block";
      er.insertAdjacentHTML("afterbegin", errMarkup);
      console.log(err);
    });
};

const getJSON = async function (query) {
  try {
    const res = await fetch(`${API_URL}${query}`);
    const [{ meanings }] = await res.json();
    return meanings;
  } catch (err) {
    throw new Error("Can not be able to find the data!");
  }
};

tabsContainer.addEventListener("click", function (e) {
  const btn = e.target;
  if (btn.classList.contains("tablinks")) openTabContent(btn);
});

function openTabContent(e) {
  Array.from(tabcontents).forEach((item) => {
    item.style.display = "none";
  });
  Array.from(tablinks).forEach((item) => {
    item.classList.remove("active");
  });
  document.querySelector(`.tabcontent-${e.dataset.value}`).style.display =
    "block";
  e.classList.add("active");
}

tabContentContainer.addEventListener("click", function (e) {
  if (e.target.classList.contains("btn--synonyms")) {
    // console.log();
    inputField.value = e.target.textContent;
    findQuery(e.target.textContent);
  }
});
