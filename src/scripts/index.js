import imgArr from "../assets/*.svg"; // Get all the images name in the build
const maxTotalScore = 8; // Keep it multiple of 4 as per UI design
const array = [...Array(maxTotalScore).keys()];
const duplicateArrayLength = [...array, ...array]; // Since we need a pair of two, we will clone each element. 
let finalCardsArray = duplicateArrayLength.sort(() => Math.random() - Math.random()); // Shuffle the sequence of array

// All those global vars! Pheew
let cardsObjects = [];
let turns = [];
let turnsCount = 0;
let score = 0;
let html;
let clickListener = true;

const itemsRenderer = (itemsArray) => {
  let markup = new Array();
  cardsObjects = itemsArray; // This is the most recent state of out object
  itemsArray.map(i => {
    html = `    
      <div id="${i.key}" class="flex-item">
        <img id="${i.key}" class="item-img" src="${imgArr[i.show ? i.img : 'joker']}" />
      </div>
    `;
    markup.push(html);
    html = markup.join("");
  });

  document.getElementById('flex-items').innerHTML = html;
  clickListener = true;
}

const toggleShow = i => ({ ...cardsObjects[i], show: !cardsObjects[i].show });

const won = i => ({ ...cardsObjects[i], show: true, won: true })
  
const init = () => {
  finalCardsArray.map((c, key) => {
    cardsObjects[key] = {
      key,
      img: c+1,
      show: false,
      won: false
    }
  });

  itemsRenderer(cardsObjects);
}

// Listen to click events
document.addEventListener('click', function (event) {
  if (clickListener && event.target && event.target.id && cardsObjects[event.target.id]) {
    let i = event.target.id;
    turns = [...turns, i];

    if (cardsObjects[i].won === true) return; // Don't entertain the click if the pair is already won.

    if (turns.length === 1) {
      cardsObjects[i] = toggleShow(turns[0]);        
      return itemsRenderer(cardsObjects);
    }
    
    if (turns.length === 2) {
      turnsCount++;
      
      if (cardsObjects[turns[0]].img === cardsObjects[turns[1]].img) {
        score++;

        cardsObjects[turns[0]] = won(turns[0]);
        cardsObjects[turns[1]] = won(turns[1]);

        alert(`Yaaay, that's a point!! Score: ${score}, Turns played: ${turnsCount}`);
        
        turns = [];
        return itemsRenderer(cardsObjects);
      } else {
        cardsObjects[i] = toggleShow(i);
        itemsRenderer(cardsObjects); // It didn't match, but we still need to show the card
        const res = cardsObjects.map(c => c.won === true ? { ...c, show: true } : { ...c, show: false }); // Only need to show set of cards that have won
        turns = [];
        clickListener = false; // Don't listen for clicks until the cards are reset
        setTimeout(() => itemsRenderer(res), 2000);
      }
    }
  }

  event.preventDefault(); // Don't follow the link

}, false);

init();