class CalorieTracker {
    constructor() {
        // Retrieve calorie limit, total calories, meals, and workouts from storage
        this._calorieLimit = Storage.getCalorieLimit();
        this._totalCalories = Storage.getTotalCalories();
        this._meals = Storage.getMeals();
        this._workouts = Storage.getWorkouts();

        // Display initial calorie limit and total calories
        this._displayCaloriesLimit();
        this._displayCaloriesTotal();

        // Display consumed calories, burned calories, remaining calories, and progress bar
        this._displayCaloriesConsumed();
        this._displayCaloriesBurned();
        this._displayCaloriesRemaining();
        this._displayCaloriesProgress();

        // Set the calorie limit input value to the stored value
        document.getElementById('limit').value = this._calorieLimit;
    }

    // Public Methods/API //

    // Add a new meal to the tracker
    addMeal(meal) {
        this._meals.push(meal); // Add the meal to the meals array
        this._totalCalories += meal.calories; // Update the total calorie count
        Storage.updateTotalCalories(this._totalCalories); // Update the total calories in storage
        Storage.saveMeal(meal); // Save the meal to storage
        this._displayNewMeal(meal); // Display the newly added meal in the UI
        this._render(); // Update the UI
    }

    // Add a new workout to the tracker
    addWorkout(workout) {
        this._workouts.push(workout); // Add the workout to the workouts array
        this._totalCalories -= workout.calories; // Update the total calorie count
        Storage.updateTotalCalories(this._totalCalories); // Update the total calories in storage
        Storage.saveWorkout(workout); // Save the workout to storage
        this._displayNewWorkout(workout); // Display the newly added workout in the UI
        this._render(); // Update the UI
    }

    // Remove a meal from the tracker based on its ID
    removeMeal(id) {
        const index = this._meals.findIndex((meal) => meal.id === id);

        if (index !== -1) {
            const meal = this._meals[index];
            this._totalCalories -= meal.calories; // Update the total calorie count
            Storage.updateTotalCalories(this._totalCalories); // Update the total calories in storage
            this._meals.splice(index, 1); // Remove the meal from the meals array
            Storage.removeMeal(id); // Remove the meal from storage
            this._render(); // Update the UI
        }
    }

    // Remove a workout from the tracker based on its ID
    removeWorkout(id) {
        const index = this._workouts.findIndex((workout) => workout.id === id);

        if (index !== -1) {
            const workout = this._workouts[index];
            this._totalCalories += workout.calories; // Update the total calorie count
            Storage.updateTotalCalories(this._totalCalories); // Update the total calories in storage
            this._workouts.splice(index, 1); // Remove the workout from the workouts array
            Storage.removeWorkout(id); // Remove the workout from storage
            this._render(); // Update the UI
        }
    }

     // Reset the tracker by clearing all data and storage
     reset() {
        this._totalCalories = 0; // Reset the total calorie count
        this._meals = []; // Clear the meals array
        this._workouts = []; // Clear the workouts array
        Storage.clearAll(); // Clear all data in storage
        this._render(); // Update the UI
    }

    // Set the daily calorie limit
    setLimit(calorieLimit) {
        this._calorieLimit = calorieLimit; // Update the calorie limit
        Storage.setCalorieLimit(calorieLimit); // Update the calorie limit in storage
        this._displayCaloriesLimit(); // Display the updated calorie limit in the UI
        this._render(); // Update the UI
    }

    // Load saved meals and workouts from storage and display them in the UI
    loadItems() {
        this._meals.forEach((meal) => this._displayNewMeal(meal));
        this._workouts.forEach((workout) => this._displayNewWorkout(workout));
    }


    // Private Methods //

    // Display the total calorie count in the UI
    _displayCaloriesTotal() {
        const totalCaloriesEl = document.getElementById('calories-total');
        totalCaloriesEl.innerHTML = this._totalCalories;
    }

    // Display the calorie limit in the UI
    _displayCaloriesLimit() {
        const calorieLimitEl = document.getElementById('calories-limit');
        calorieLimitEl.innerHTML = this._calorieLimit;
    }

    // Display the consumed calories in the UI
    _displayCaloriesConsumed() {
        const caloriesConsumedEl = document.getElementById('calories-consumed');
        const consumed = this._meals.reduce((total, meal) => total + meal.calories, 0);
        caloriesConsumedEl.innerHTML = consumed;
    }

    // Display the burned calories in the UI
    _displayCaloriesBurned() {
        const caloriesBurnedEl = document.getElementById('calories-burned');
        const burned = this._workouts.reduce((total, workout) => total + workout.calories, 0);
        caloriesBurnedEl.innerHTML = burned;
    }

    // Display the remaining calories in the UI
    _displayCaloriesRemaining() {
        const caloriesRemainingEl = document.getElementById('calories-remaining');
        const progressEl = document.getElementById('calorie-progress');
        const remaining = this._calorieLimit - this._totalCalories;
        caloriesRemainingEl.innerHTML = remaining;

        // Update the UI based on the remaining calories
        if (remaining <= 0) {
            caloriesRemainingEl.parentElement.parentElement.classList.remove('bg-light');
            caloriesRemainingEl.parentElement.parentElement.classList.add('bg-danger');
            progressEl.classList.remove('bg-success');
            progressEl.classList.add('bg-danger');
        } else {
            caloriesRemainingEl.parentElement.parentElement.classList.remove('bg-danger');
            caloriesRemainingEl.parentElement.parentElement.classList.add('bg-light');
            progressEl.classList.remove('bg-danger');
            progressEl.classList.add('bg-success');
        }
    }

    // Display the progress bar based on the total calories and calorie limit
    _displayCaloriesProgress() {
        const progressEl = document.getElementById('calorie-progress');
        const percentage = (this._totalCalories / this._calorieLimit) * 100;
        const width = Math.min(percentage, 100);
        progressEl.style.width = `${width}%`;
    }

     // Display a newly added meal in the UI
    _displayNewMeal(meal) {
        const mealsEl = document.getElementById('meal-items');
        const mealEl = document.createElement('div');
        mealEl.classList.add('card', 'my-2');
        mealEl.setAttribute('data-id', meal.id);
        mealEl.innerHTML = `
        <div class="card-body">
                <div class="d-flex align-items-center justify-content-between">
                  <h4 class="mx-1">${meal.name}</h4>
                  <div
                    class="fs-1 bg-primary text-white text-center rounded-2 px-2 px-sm-5"
                  >
                    ${meal.calories}
                  </div>
                  <button class="delete btn btn-danger btn-sm mx-2">
                    <i class="fa-solid fa-xmark"></i>
                  </button>
                </div>
              </div>
        `;

        mealsEl.appendChild(mealEl);
    }

    // Display a newly added workout in the UI
    _displayNewWorkout(workout) {
        const workoutsEl = document.getElementById('workout-items');
        const workoutEl = document.createElement('div');
        workoutEl.classList.add('card', 'my-2');
        workoutEl.setAttribute('data-id', workout.id);
        workoutEl.innerHTML = `
        <div class="card-body">
                <div class="d-flex align-items-center justify-content-between">
                  <h4 class="mx-1">${workout.name}</h4>
                  <div
                    class="fs-1 bg-secondary text-white text-center rounded-2 px-2 px-sm-5"
                  >
                    ${workout.calories}
                  </div>
                  <button class="delete btn btn-danger btn-sm mx-2">
                    <i class="fa-solid fa-xmark"></i>
                  </button>
                </div>
              </div>
        `;

        workoutsEl.appendChild(workoutEl);
    }

    // Update the UI by calling various display methods
    _render() {
        this._displayCaloriesTotal();
        this._displayCaloriesConsumed();
        this._displayCaloriesBurned();
        this._displayCaloriesRemaining();
        this._displayCaloriesProgress();
    }
}

// Class representing a Meal
class Meal {
    constructor(name, calories) {
        this.id = Math.random().toString(16).slice(2); // Generate a random ID for the meal
        this.name = name; // Set the name of the meal
        this.calories = calories; // Set the number of calories in the meal
    }
}

// Class representing a Workout
class Workout {
    constructor(name, calories) {
        this.id = Math.random().toString(16).slice(2); // Generate a random ID for the workout
        this.name = name; // Set the name of the workout
        this.calories = calories; // Set the number of calories burned in the workout
    }
}

// Class representing the Storage functionality
class Storage {
    // Get the daily calorie limit from storage
    static getCalorieLimit(defaultLimit = 2000) {
        let calorieLimit;
        if (localStorage.getItem('calorieLimit') === null) {
            calorieLimit = defaultLimit;
        } else {
            calorieLimit = +localStorage.getItem('calorieLimit');
        }
        return calorieLimit;
    }

    // Set the daily calorie limit in storage
    static setCalorieLimit(calorieLimit) {
        localStorage.setItem('calorieLimit', calorieLimit);
    }

    // Get the total calories from storage
    static getTotalCalories(defaultCalories = 0) {
        let totalCalories;
        if (localStorage.getItem('totalCalories') === null) {
            totalCalories = defaultCalories;
        } else {
            totalCalories = +localStorage.getItem('totalCalories');
        }
        return totalCalories;
    }

    // Update the total calories in storage
    static updateTotalCalories(calories) {
        localStorage.setItem('totalCalories', calories);
    }

    // Get the stored meals from storage
    static getMeals() {
        let meals;
        if (localStorage.getItem('meals') === null) {
            meals = [];
        } else {
            meals = JSON.parse(localStorage.getItem('meals'));
        }
        return meals;
    }

    // Save a meal to storage
    static saveMeal(meal) {
        const meals = Storage.getMeals();
        meals.push(meal);
        localStorage.setItem('meals', JSON.stringify(meals));
    }

    // Remove a meal from storage based on its ID
    static removeMeal(id) {
        const meals = Storage.getMeals();
        meals.forEach((meal, index) => {
            if (meal.id === id) {
                meals.splice(index, 1);
            }
        });

        localStorage.setItem('meals', JSON.stringify(meals));
    }

    // Get the stored workouts from storage
    static getWorkouts() {
        let workouts;
        if (localStorage.getItem('workouts') === null) {
            workouts = [];
        } else {
            workouts = JSON.parse(localStorage.getItem('workouts'));
        }
        return workouts;
    }

    // Save a workout to storage
    static saveWorkout(workout) {
        const workouts = Storage.getWorkouts();
        workouts.push(workout);
        localStorage.setItem('workouts', JSON.stringify(workouts));
    }

    // Remove a workout from storage based on its ID
    static removeWorkout(id) {
        const workouts = Storage.getWorkouts();
        workouts.forEach((workout, index) => {
            if (workout.id === id) {
                workouts.splice(index, 1);
            }
        });

        localStorage.setItem('workouts', JSON.stringify(workouts));
    }


    // Clear all stored data in storage
    static clearAll() {
        localStorage.removeItem('totalCalories'); // Remove the stored total calories
        localStorage.removeItem('meals'); // Remove the stored meals
        localStorage.removeItem('workouts'); // Remove the stored workouts


        //Include if you want to clear the daily calorie limit
        // localStorage.clear();
    }
}

// Class representing the main application
class App {
    constructor() {
        this._tracker = new CalorieTracker(); // Create a new instance of the CalorieTracker class
        this._loadEventListeners(); // Set up event listeners
        this._tracker.loadItems(); // Load saved items from storage
    }

    // Set up event listeners
    _loadEventListeners() {
        // Event listener for the meal form submission
        document.getElementById('meal-form').addEventListener('submit', this._newItem.bind(this, 'meal'));

        // Event listener for the workout form submission
        document.getElementById('workout-form').addEventListener('submit', this._newItem.bind(this, 'workout'));

        // Event listener for deleting a meal or workout
        document.getElementById('meal-items').addEventListener('click', this._removeItem.bind(this, 'meal'));
        document.getElementById('workout-items').addEventListener('click', this._removeItem.bind(this, 'workout'));

        // Event listener for filtering meals or workouts
        document.getElementById('filter-meals').addEventListener('keyup', this._filterItems.bind(this, 'meal'));
        document.getElementById('filter-workouts').addEventListener('keyup', this._filterItems.bind(this, 'workout'));

        // Event listener for resetting the tracker
        document.getElementById('reset').addEventListener('click', this._reset.bind(this));

        // Event listener for setting the calorie limit
        document.getElementById('limit-form').addEventListener('submit', this._setLimit.bind(this));
    }

    // Handle adding a new item (meal or workout)
    _newItem(type, e) {
        e.preventDefault();

        const name = document.getElementById(`${type}-name`);
        const calories = document.getElementById(`${type}-calories`);

        // Validate inputs
        if (name.value === '' || calories.value === '') {
            alert('Please fill in all fields');
            return;
        }

        if (type === 'meal') {
            const meal = new Meal(name.value, +calories.value); // Create a new instance of the Meal class
            this._tracker.addMeal(meal); // Add the meal to the tracker
        } else {
            const workout = new Workout(name.value, +calories.value); // Create a new instance of the Workout class
            this._tracker.addWorkout(workout); // Add the workout to the tracker
        }

        name.value = '';
        calories.value = '';

        const collapseItem = document.getElementById(`collapse-${type}`);
        const bsCollapse = new bootstrap.Collapse(collapseItem, {
            toggle: true
        });
    }

    // Handle removing a meal or workout
    _removeItem(type, e) {
        if (e.target.classList.contains('delete') || e.target.classList.contains('fa-xmark')) {
            if (confirm('Are you sure?')) {
                const id = e.target.closest('.card').getAttribute('data-id');

                type === 'meal' ? this._tracker.removeMeal(id) : this._tracker.removeWorkout(id);

                e.target.closest('.card').remove();
            }
        }
    }

    // Handle filtering meals or workouts
    _filterItems(type, e) {
        const text = e.target.value.toLowerCase();
        document.querySelectorAll(`#${type}-items .card`).forEach(item => {
            const name = item.firstElementChild.firstElementChild.textContent;

            if (name.toLowerCase().indexOf(text) !== -1) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }

     // Handle resetting the tracker
     _reset() {
        this._tracker.reset(); // Reset the calorie tracker
        document.getElementById('meal-items').innerHTML = ''; // Clear the HTML content of meal items
        document.getElementById('workout-items').innerHTML = ''; // Clear the HTML content of workout items
        document.getElementById('filter-meals').value = ''; // Clear the value of the meal filter input
        document.getElementById('filter-workouts').value = ''; // Clear the value of the workout filter input
    }

    _setLimit(e) {
        e.preventDefault();

        const limit = document.getElementById('limit');

        if (limit.value === '') {
            alert('Please add a limit');
            return;
        }

        this._tracker.setLimit(+limit.value);
        limit.value = '';

        const modalEl = document.getElementById('limit-modal');
        const modal = bootstrap.Modal.getInstance(modalEl);
        modal.hide();
    }
}

const app = new App();