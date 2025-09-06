const createElements = (arr) =>
{
  const htmlElements = arr.map(el => `<span class="btn">${el}</span>`);
  return (htmlElements.join(" "));
}

function pronounceWord(word)
{
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN"; // English
  window.speechSynthesis.speak(utterance);
}

const manageSpinner = (status) =>
{
  if (status == true)
  {
    document.getElementById("spinner").classList.remove("hidden");
    document.getElementById("word-container").classList.add("hidden");
  }
  else
  {
    document.getElementById("word-container").classList.remove("hidden");
    document.getElementById("spinner").classList.add("hidden");
  }
};

const loadLessons = () =>
{
  removeActive();
  fetch("https://openapi.programming-hero.com/api/levels/all")
    .then(response => response.json())//Promise of json format
    .then(json => displayLesson(json.data))
};
const removeActive = () =>
{
  const lessonButtons = document.querySelectorAll(".lesson-btn");
  // console.log(lessonButtons);
  lessonButtons.forEach((btn) => btn.classList.remove("active"));
}
const loadLevelWord = (id) =>
{
  manageSpinner(true);
  const url = `https://openapi.programming-hero.com/api/level/${id}`;
  fetch(url)
    .then(response => response.json())
    .then((data) =>
    {
      removeActive();//All active class remove
      const clickBtn = document.getElementById(`lesson-btn${id}`);
      // console.log(clickBtn);
      clickBtn.classList.add("active");//only add click active 
      displayLavelWord(data.data);
    });
}

const loadWordDetail = async (id) =>
{
  const url = (`https://openapi.programming-hero.com/api/word/${id}`);
  const res = await fetch(url);
  const details = await res.json();
  displayWordDetail(details.data);
};
const displayWordDetail = (word) =>
{
  // console.log(word);
  /*

  "data": {
"word": "Eager",
"meaning": "আগ্রহী",
"pronunciation": "ইগার",
"level": 1,
"sentence": "The kids were eager to open their gifts.",
"points": 1,
"partsOfSpeech": "adjective",
"synonyms": [
"enthusiastic",
"excited",
"keen"
],
"id": 5
}

   */
  const detailBox = document.getElementById("details_container")
  detailBox.innerHTML = ` <div class="">
          <h2 class="text-2xl font-bold">${word.word}(<i class="fa-solid fa-microphone-lines"></i>:${word.pronunciation})</h2>
        </div>
        <div class="">
          <h2 class="font-bold">Meaning</h2>
          <p>${word.meaning}</p>
        </div>
        <div class="">
          <h2 class="font-bold">Example</h2>
          <p>${word.sentence}</p>
        </div>
        <div class="font-bold">
          <h2>Synonyms</h2>
          <div>
          ${createElements(word.synonyms)}
          </div>
        </div>`;
  document.getElementById("my_modal_5").showModal();
};
const displayLavelWord = (words) =>
{
  
  const wordContainer = document.getElementById("word-container");
  wordContainer.innerHTML = "";

  if (words.length == 0)
  {
    // alert("NO words detected");
    // return;
    wordContainer.innerHTML = `
         <div class="text-center col-span-full rounded-xl py-10 space-y-6">
         <img class="mx-auto" src="./assets/alert-error.png" alt="">
      <p class="font-medium text-xl text-gray-500 font-bangla">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
      <h3 class="text-4xl font-bold font-bangla">নেক্সট Lesson এ যান</h3>
    </div>
        `;
    manageSpinner(false);
    return;
  }
  /* {
 "id": 80,
 "level": 1,
 "word": "Run",
 "meaning": "দৌড়ানো",
 "pronunciation": "রান"
} */
  words.forEach(word =>
  {
    // console.log(word);
    const card = document.createElement("div");
    card.innerHTML = `
        <div class="bg-gray-300 rounded-xl shadow-sm text-center py-10 px-5 space-y-4">
    <h2 class="font-bold text-2xl">${word.word ? word.word : "Do not find the word"}</h2>
    <p class="font-semibold">Meaning and / Pronunciation</p>
    <div class="font-semibold font-banglan text-2xl">
      ${word.meaning ? word.meaning : "Don't get the word meaning"}/${word.pronunciation ? word.pronunciation : "Do not find the pronunciation"}
    </div>
    <div class="flex justify-between items-center">
      <button onclick="loadWordDetail(${word.id})" class="btn bg-[#1A91FF10] hover:bg-[#1A91FF]"><i class="fa-solid fa-circle-info"></i></button>
      <button onclick="pronounceWord('${word.word}')" class="btn bg-[#1A91FF10] hover:bg-[#1A91FF]"><i class="fa-solid fa-volume-high"></i></button>

    </div>
  </div>
        `;
    wordContainer.append(card);
  });
  manageSpinner(false);
};

const displayLesson = (lessons) =>
{
  // 1.get the container & empty
  const levelContainer = document.getElementById("level-container");
  levelContainer.innerHTML = "";
  // 2.get into every lessons
  for (let lesson of lessons)
  {
    // console.log(lesson);
    // 3.create element
    const btnDiv = document.createElement("div");
    btnDiv.innerHTML = `<button id="lesson-btn${lesson.level_no}"  onclick="loadLevelWord(${lesson.level_no})" class="btn btn-outline btn-primary lesson-btn"><i class="fa-solid fa-book-open"></i>Lesson - ${lesson.level_no}</button>
`; // 4.append into container
    levelContainer.append(btnDiv);
  }
};
loadLessons();

document.getElementById("btn_search").addEventListener("click", () =>
{
  const input = document.getElementById("input_search");
  const searchValue = input.value.trim().toLowerCase();
  console.log(searchValue);

  fetch("https://openapi.programming-hero.com/api/words/all")
    .then(response => response.json())
    .then(data =>
    {
      const allWords = data.data;
      console.log(allWords);
      const filterWord = allWords.filter((word) =>
      
        word.word.toLowerCase().includes(searchValue)
      );
      displayLavelWord(filterWord);
      
    });
})