import imgArr from "../assets/*.svg";
const maxTotalScore = 8; // Keep it multiple of 4 as per design
const array = [...Array(maxTotalScore).keys()];
const duplicateArrayLength = [...array, ...array];
let finalCardsArray = duplicateArrayLength.sort(() => Math.random() - Math.random());

let cardsObjects = [];
let turns = [];
let turnsCount = 0;
let score = 0;
let html;
let clickListener = true;

const itemsRenderer = (itemsArray) => {
  cardsObjects = itemsArray;
  let markup = new Array();
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

// const toggleDisplay = (i) => {
//   return { ...cardsObjects[turns[0]], show: !cardsObjects[turns[0]].show };
// }

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

  document.addEventListener('click', function (event) {
    if (clickListener && event.target && event.target.id && cardsObjects[event.target.id]) {
      let i = event.target.id;
      turns = [...turns, i];

      if (cardsObjects[i].won === true) return;

      if (turns.length === 1) {
        toggleDisplay(turns[0]);
        cardsObjects[i] = {
          ...cardsObjects[turns[0]],
          show: !cardsObjects[turns[0]].show
        };
        
        itemsRenderer(cardsObjects);
        return;
      }
      
      if (turns.length === 2) {
        turnsCount++;
        if (cardsObjects[turns[0]].img === cardsObjects[turns[1]].img) {
          score++;

          cardsObjects[turns[0]] = {
            ...cardsObjects[turns[0]],
            show: true,
            won: true
          };

          cardsObjects[turns[1]] = {
            ...cardsObjects[turns[1]],
            show: true,
            won: true
          };

          alert(`Yaaay, that's a point!! Score: ${score}, Turns: ${turnsCount}`);

          turns = [];
          itemsRenderer(cardsObjects);
        } else {

          cardsObjects[i] = {
            ...cardsObjects[i],
            show: !cardsObjects[i].show
          };
          
          itemsRenderer(cardsObjects);

          const res = cardsObjects.map(c => c.won === true ? {
            ...c,
            show: true
          } : {
            ...c,
            show: false
          });
          
          turns = [];
          clickListener = false; // Don't listen for clicks until the cards are reset
          setTimeout(() => itemsRenderer(res), 2000);
        }
      }
    }
  
    // Don't follow the link
    event.preventDefault();
  
  }, false);

}

init();