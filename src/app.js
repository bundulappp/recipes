import { getRecipes } from './recipes.js';

function element(tag, attributes = {}, children = []) {
  const element = document.createElement(tag);

  Object.entries(attributes).forEach(([key, value]) => {
    if (key.startsWith('on')) {
      const eventName = key.toLowerCase().substring(2);
      element.addEventListener(eventName, value);
    } else {
      element.setAttribute(key, value);
    }
  });

  children.forEach((child) => {
    if (typeof child === 'string') {
      element.appendChild(document.createTextNode(child));
    } else {
      element.appendChild(child);
    }
  });
  return element;
}

function createContainer({ onShow }) {
  const container = element(
    'div',
    { class: 'container d-flex flex-column align-items-center' },
    [
      element('h1', {}, ['My Recipes']),
      element('button', { class: 'btn btn-primary mb-5', onClick: onShow }, [
        'Show Recipes',
      ]),
      element('div', { id: 'recipeList' }),
    ]
  );
  return container;
}

export function setupApp(root) {
  let isVisible = false;

  function handleShow(event) {
    isVisible = !isVisible;
    const list = event.target.parentNode.querySelector('#recipeList');
    list.className = 'd-flex flex-wrap justify-content-center';
    if (isVisible) {
      const recipeList = getRecipes();
      recipeList.forEach((element) => {
        const recipeCard = createRecipeCard(element);
        list.appendChild(recipeCard);
      });
    } else {
      list.innerText = '';
    }
  }

  root.appendChild(createContainer({ onShow: handleShow }));
  return root;
}

export function createRecipeCard(recipe) {
  const cardContainer = document.createElement('div');
  cardContainer.className = 'mx-2 mb-5';

  const card = document.createElement('div');
  card.className = 'card';
  card.style.width = '18rem';

  const cardBody = document.createElement('div');
  cardBody.className = 'card-body';

  const cardTitle = document.createElement('h5');
  cardTitle.className = 'card-title';
  cardTitle.innerText = recipe.name;

  const ingredientsTitle = document.createElement('p');
  ingredientsTitle.innerText = 'Ingredients:';
  const ingredientsList = document.createElement('ul');
  ingredientsList.className = 'list-group list-group-flush';

  recipe.ingredients.forEach((ingredient) => {
    const ingredientItem = document.createElement('li');
    ingredientItem.className = 'list-group-item';
    ingredientItem.innerText = `${ingredient.item} - ${ingredient.quantity}`;
    ingredientsList.appendChild(ingredientItem);
  });

  const instructionsTitle = document.createElement('p');
  instructionsTitle.className = 'mt-3';
  instructionsTitle.innerText = 'Instructions';

  const instructionsText = document.createElement('p');
  instructionsText.className = 'card-text';
  instructionsText.innerText = recipe.instructions.join(' ');

  cardBody.appendChild(cardTitle);
  cardBody.appendChild(ingredientsTitle);
  cardBody.appendChild(ingredientsList);
  cardBody.appendChild(instructionsTitle);
  cardBody.appendChild(instructionsText);

  card.appendChild(cardBody);
  cardContainer.appendChild(card);

  return cardContainer;
}
