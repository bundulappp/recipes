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
  const container = element('div', { class: 'container' }, [
    element('h1', {}, ['My Recipes']),
    element('button', { class: 'btn btn-primary', onClick: onShow }, [
      'Show Recipes',
    ]),
    element('div', { id: 'recipeList' }),
  ]);
  return container;
}

export function setupApp(root) {
  let isVisible = false;

  function handleShow(event) {
    isVisible = !isVisible;
    const list = event.target.parentNode.querySelector('#recipeList');
    const recipeList = getRecipes();
    recipeList.forEach((element) => {
      const recipeCard = createRecipeCard(element);
      list.appendChild(recipeCard);
    });

    if (isVisible) {
      const recipesList = getRecipes();
    } else {
      list.innerText = '';
    }
  }

  root.appendChild(createContainer({ onShow: handleShow }));
  return root;
}

export function createRecipeCard(recipe) {
  const cardContainer = document.createElement('div');
  cardContainer.className =
    'd-flex justify-content-center align-items-center mx-auto p-4';

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
