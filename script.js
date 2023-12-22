document.addEventListener("DOMContentLoaded", function () {
    function fetchRandomMeal() {
        fetch('https://www.themealdb.com/api/json/v1/1/random.php')
     .then(response => response.json())
            .then(data => {
                updateRandomMeal(data.meals[0]);
            })
    .catch(error => console.error('Error fetching random meal:', error));
    }

    function fetchMealsByKeyword(keyword) {
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${keyword}`)
            .then(response => response.json())
            .then(data => {
  updateSearchedMeals(data.meals);
            })
 .catch(error => console.error('Error fetching meals by keyword:', error));
    }

    function updateRandomMeal(meal) {
        var randomMealDiv = document.getElementById('randomrecipe');
        

        if (meal) {
            var mealImage = document.createElement('img');
            mealImage.src = meal.strMealThumb;
            mealImage.alt = meal.strMeal;

            mealImage.addEventListener('click', function () {
                displayMealDetails(meal);
            });

            randomMealDiv.appendChild(mealImage);
        }
    }

    function updateSearchedMeals(meals) {
        var searchedMealsDiv = document.getElementById('smeals');
        searchedMealsDiv.innerHTML = '';

        if (meals) {
            meals.forEach(meal => {
                var mealImage = document.createElement('img');
                mealImage.src = meal.strMealThumb;
                mealImage.alt = meal.strMeal;

                mealImage.style.width = '300px';
                mealImage.style.height = '200px';
                mealImage.style.marginLeft = '15px';
                mealImage.style.padding = '20px';
                mealImage.style.backgroundColor = 'lightgrey';
                mealImage.style.borderRadius = '20%';

                mealImage.addEventListener('click', function () {
                    displayMealDetails(meal);
                });

                searchedMealsDiv.appendChild(mealImage);
            });
        } else {
            searchedMealsDiv.innerHTML = '<p>No results found.</p>';
        }
    }

    function displayMealDetails(meal) {
        var mealDetailsDiv = document.getElementById('rp');
        mealDetailsDiv.innerHTML = `
            <p><strong>${meal.strMeal}</strong></p>
            <p>${meal.strInstructions}</p>
        `;

        displayIngredients(meal);
        openModal();
    }

    function displayIngredients(meal) {
        var modalIngredientsDiv = document.getElementById('modalIngredients');
        modalIngredientsDiv.innerHTML = '';

        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`)
            .then(response => response.json())
            .then(data => {
                var ingredients = getIngredients(data.meals[0]);
                modalIngredientsDiv.innerHTML = '<h2>Ingredients:</h2>' + ingredients;
            })
            .catch(error => console.error('Error fetching ingredients:', error));
    }

    function getIngredients(meal) {
        var ingredients = '';

        for (var i = 1; i <= 20; i++) {
            var ingredient = meal['strIngredient' + i];
            var measure = meal['strMeasure' + i];

            if (ingredient) {
                ingredients += `<p>${measure} ${ingredient}</p>`;
            }
        }

        return ingredients;
    }

    function openModal() {
        var modal = document.getElementById('myModal');
        modal.style.display = 'block';
    }

    function closeModal() {
        var modal = document.getElementById('myModal');
        modal.style.display = 'none';
    }

    fetchRandomMeal();

    document.getElementById('search-button').addEventListener('click', function () {
        var searchInput = document.getElementById('search-bar').value;
        fetchMealsByKeyword(searchInput);
    });

    document.getElementById('search-bar').addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            var searchInput = document.getElementById('search-bar').value;
            fetchMealsByKeyword(searchInput);
        }
    });

    document.querySelector('.close').addEventListener('click', closeModal);

    window.addEventListener('click', function (event) {
        var modal = document.getElementById('myModal');
        if (event.target === modal) {
            closeModal();
        }
    });
});
