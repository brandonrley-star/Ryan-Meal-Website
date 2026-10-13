/* Forkcast starter data: family dinners, staples, aisles. Loaded before app.js. */
(function () {
  // Ingredient shorthand: [quantity, name, aisle]
  const meals = [
    {
      id: 'm-fajitas', name: 'Sheet-Pan Chicken Fajitas', emoji: '🌮', minutes: 30,
      tags: ['sheetpan', 'kid', 'protein'], fav: true,
      ingredients: [
        ['2 lb', 'Chicken breast', 'meat'], ['3', 'Bell peppers', 'produce'], ['1', 'Red onion', 'produce'],
        ['1 pack', 'Flour tortillas', 'bakery'], ['1 cup', 'Shredded cheese', 'dairy'], ['1 tub', 'Sour cream', 'dairy'],
        ['2', 'Avocados', 'produce'], ['1 packet', 'Fajita seasoning', 'pantry'], ['2', 'Limes', 'produce']
      ],
      notes: 'Slice the peppers thin so they char at 425°F. Cut a plain strip of chicken for the toddler before seasoning.'
    },
    {
      id: 'm-salmon', name: 'Honey Garlic Salmon & Rice', emoji: '🐟', minutes: 25,
      tags: ['quick', 'protein'], fav: true,
      ingredients: [
        ['1.5 lb', 'Salmon fillets', 'meat'], ['1 head', 'Broccoli', 'produce'], ['2 cups', 'Jasmine rice', 'pantry'],
        ['1 head', 'Garlic', 'produce'], ['1 bottle', 'Honey', 'pantry'], ['1 bottle', 'Soy sauce', 'pantry']
      ],
      notes: 'Bake at 400°F for 12 to 14 minutes. Flake a small piece into rice for little hands.'
    },
    {
      id: 'm-spaghetti', name: 'Spaghetti & Meatballs', emoji: '🍝', minutes: 40,
      tags: ['kid', 'freezer'],
      ingredients: [
        ['1 lb', 'Spaghetti', 'pantry'], ['1.5 lb', 'Ground beef', 'meat'], ['1 jar', 'Marinara sauce', 'pantry'],
        ['1 cup', 'Breadcrumbs', 'pantry'], ['2', 'Eggs', 'dairy'], ['1 wedge', 'Parmesan', 'dairy'], ['1 bag', 'Side salad', 'produce']
      ],
      notes: 'Double the meatballs and freeze half on a sheet pan for a future night.'
    },
    {
      id: 'm-steak', name: 'Steak, Potatoes & Green Beans', emoji: '🥩', minutes: 35,
      tags: ['protein', 'grill'],
      ingredients: [
        ['2 lb', 'Sirloin steak', 'meat'], ['2 lb', 'Baby potatoes', 'produce'], ['1 lb', 'Green beans', 'produce'],
        ['1 stick', 'Butter', 'dairy'], ['1 bunch', 'Fresh rosemary', 'produce']
      ],
      notes: 'Pull at 130°F for medium rare and rest 5 minutes. Mash a few potatoes with butter for the kids.'
    },
    {
      id: 'm-chili', name: 'Turkey Chili', emoji: '🍲', minutes: 45,
      tags: ['slow', 'protein', 'freezer'],
      ingredients: [
        ['2 lb', 'Ground turkey', 'meat'], ['2 cans', 'Kidney beans', 'pantry'], ['2 cans', 'Diced tomatoes', 'pantry'],
        ['1', 'Yellow onion', 'produce'], ['1 packet', 'Chili seasoning', 'pantry'], ['1 cup', 'Shredded cheese', 'dairy'],
        ['1 box', 'Cornbread mix', 'pantry']
      ],
      notes: 'Slow cooker on low for 6 hours or stovetop for 45 minutes. Freezes well in quart bags.'
    },
    {
      id: 'm-pizza', name: 'Homemade Pizza Night', emoji: '🍕', minutes: 35,
      tags: ['kid'], fav: true,
      ingredients: [
        ['2', 'Pizza dough balls', 'bakery'], ['1 jar', 'Pizza sauce', 'pantry'], ['2 cups', 'Shredded mozzarella', 'dairy'],
        ['1 pack', 'Turkey pepperoni', 'meat'], ['1 pack', 'Mushrooms', 'produce'], ['1 bag', 'Baby spinach', 'produce']
      ],
      notes: 'Let everyone top their own section. Bake on the lowest rack at 475°F.'
    },
    {
      id: 'm-tenders', name: 'Crispy Chicken Tenders & Sweet Potato Fries', emoji: '🍗', minutes: 35,
      tags: ['kid', 'sheetpan', 'protein'],
      ingredients: [
        ['2 lb', 'Chicken tenderloins', 'meat'], ['3', 'Sweet potatoes', 'produce'], ['1 cup', 'Panko', 'pantry'],
        ['2', 'Eggs', 'dairy'], ['1 bag', 'Baby carrots', 'produce'], ['1 bottle', 'Ranch', 'pantry']
      ],
      notes: 'Air fryer works too: 400°F for 10 minutes, flip halfway.'
    },
    {
      id: 'm-friedrice', name: 'Shrimp Fried Rice', emoji: '🍤', minutes: 20,
      tags: ['quick', 'protein'],
      ingredients: [
        ['1.5 lb', 'Shrimp', 'meat'], ['3 cups', 'Cooked rice', 'pantry'], ['1 bag', 'Frozen peas & carrots', 'frozen'],
        ['4', 'Eggs', 'dairy'], ['1 bunch', 'Green onions', 'produce'], ['1 bottle', 'Soy sauce', 'pantry']
      ],
      notes: 'Day-old rice fries best. Scramble the eggs first, then set aside.'
    },
    {
      id: 'm-burgers', name: 'Burgers & Corn on the Cob', emoji: '🍔', minutes: 30,
      tags: ['grill', 'kid'],
      ingredients: [
        ['2 lb', 'Ground beef', 'meat'], ['1 pack', 'Burger buns', 'bakery'], ['1 pack', 'Sliced cheddar', 'dairy'],
        ['4 ears', 'Sweet corn', 'produce'], ['1 head', 'Lettuce', 'produce'], ['2', 'Tomatoes', 'produce']
      ],
      notes: 'Make one small patty without seasoning salt for the little one.'
    },
    {
      id: 'm-breakfast', name: 'Breakfast for Dinner', emoji: '🥞', minutes: 20,
      tags: ['quick', 'kid'], fav: true,
      ingredients: [
        ['1 box', 'Pancake mix', 'pantry'], ['1 dozen', 'Eggs', 'dairy'], ['1 pack', 'Turkey sausage links', 'meat'],
        ['1 pint', 'Blueberries', 'produce'], ['1 bottle', 'Maple syrup', 'pantry'], ['1 bunch', 'Bananas', 'produce']
      ],
      notes: 'Mash banana into a few pancakes for an easy toddler win.'
    },
    {
      id: 'm-greek', name: 'Greek Chicken Bowls', emoji: '🥗', minutes: 30,
      tags: ['protein'],
      ingredients: [
        ['2 lb', 'Chicken thighs', 'meat'], ['1 cup', 'Quinoa', 'pantry'], ['1', 'English cucumber', 'produce'],
        ['1 pint', 'Cherry tomatoes', 'produce'], ['1 tub', 'Tzatziki', 'dairy'], ['1 block', 'Feta', 'dairy'], ['1 pack', 'Pita bread', 'bakery']
      ],
      notes: 'Marinate the thighs in lemon, garlic and oregano for at least 20 minutes.'
    },
    {
      id: 'm-beefbroc', name: 'Beef & Broccoli', emoji: '🥦', minutes: 25,
      tags: ['quick', 'protein'],
      ingredients: [
        ['1.5 lb', 'Flank steak', 'meat'], ['2 heads', 'Broccoli', 'produce'], ['2 cups', 'Jasmine rice', 'pantry'],
        ['1 bottle', 'Oyster sauce', 'pantry'], ['1 knob', 'Ginger', 'produce']
      ],
      notes: 'Slice the steak against the grain while partly frozen for thin, tender strips.'
    },
    {
      id: 'm-pulledpork', name: 'Slow Cooker Pulled Pork Sliders', emoji: '🥪', minutes: 20,
      tags: ['slow', 'kid', 'protein'],
      ingredients: [
        ['3 lb', 'Pork shoulder', 'meat'], ['1 bottle', 'BBQ sauce', 'pantry'], ['1 pack', 'Slider buns', 'bakery'],
        ['1 bag', 'Coleslaw mix', 'produce'], ['1 can', 'Baked beans', 'pantry']
      ],
      notes: 'Twenty minutes of hands-on time in the morning, low for 8 hours. Leftovers make great tacos.'
    },
    {
      id: 'm-macsausage', name: 'Mac & Cheese with Chicken Sausage', emoji: '🧀', minutes: 25,
      tags: ['quick', 'kid'],
      ingredients: [
        ['1 lb', 'Elbow pasta', 'pantry'], ['1 pack', 'Chicken sausage', 'meat'], ['2 cups', 'Shredded cheddar', 'dairy'],
        ['2 cups', 'Milk', 'dairy'], ['1 bag', 'Frozen peas', 'frozen']
      ],
      notes: 'Stir the peas in at the end. Toddler favorite.'
    },
    {
      id: 'm-soup', name: 'Chicken Noodle Soup', emoji: '🥣', minutes: 40,
      tags: ['slow', 'kid', 'freezer'],
      ingredients: [
        ['2 lb', 'Chicken thighs', 'meat'], ['1 bag', 'Egg noodles', 'pantry'], ['2 cartons', 'Chicken broth', 'pantry'],
        ['3', 'Carrots', 'produce'], ['3 stalks', 'Celery', 'produce'], ['1', 'Yellow onion', 'produce'], ['1', 'Crusty bread', 'bakery']
      ],
      notes: 'Cook the noodles separately so leftovers do not turn mushy.'
    },
    {
      id: 'm-fishtacos', name: 'Crispy Fish Tacos', emoji: '🐠', minutes: 25,
      tags: ['quick'],
      ingredients: [
        ['1.5 lb', 'Cod fillets', 'meat'], ['1 pack', 'Corn tortillas', 'bakery'], ['1 bag', 'Coleslaw mix', 'produce'],
        ['2', 'Limes', 'produce'], ['1 bunch', 'Cilantro', 'produce'], ['1 jar', 'Salsa', 'pantry']
      ],
      notes: 'Chipotle mayo: mayo, lime juice and a spoon of adobo sauce.'
    }
  ];

  window.FORKCAST_SEED = {
    meals: meals.map(m => ({
      ...m,
      fav: !!m.fav,
      ingredients: m.ingredients.map(([qty, name, aisle]) => ({ qty, name, aisle }))
    })),
    // Grocery staples shown as one-tap chips
    staples: [
      ['Milk', 'dairy'], ['Eggs', 'dairy'], ['Bananas', 'produce'], ['Bread', 'bakery'],
      ['Greek yogurt', 'dairy'], ['Berries', 'produce'], ['Coffee', 'pantry'], ['Chicken breast', 'meat'],
      ['Diapers', 'baby'], ['Wipes', 'baby'], ['Formula', 'baby'], ['Baby food pouches', 'baby'],
      ['Puffs', 'baby'], ['Paper towels', 'household'], ['Dish soap', 'household']
    ],
    aisles: [
      { id: 'produce', label: 'Produce' },
      { id: 'meat', label: 'Meat & Seafood' },
      { id: 'dairy', label: 'Dairy & Eggs' },
      { id: 'bakery', label: 'Bakery' },
      { id: 'pantry', label: 'Pantry' },
      { id: 'frozen', label: 'Frozen' },
      { id: 'baby', label: 'Baby & Kids' },
      { id: 'household', label: 'Household' },
      { id: 'other', label: 'Other' }
    ],
    tags: [
      { id: 'quick', label: 'Under 30 min' },
      { id: 'kid', label: 'Toddler-approved' },
      { id: 'protein', label: 'High protein' },
      { id: 'slow', label: 'Slow cooker' },
      { id: 'sheetpan', label: 'Sheet pan' },
      { id: 'grill', label: 'Grill' },
      { id: 'freezer', label: 'Freezer-friendly' }
    ],
    emojis: ['🌮', '🐟', '🍝', '🥩', '🍲', '🍕', '🍗', '🍤', '🍔', '🥞', '🥗', '🥦', '🥪', '🧀', '🥣', '🐠',
      '🌯', '🍛', '🍜', '🥘', '🍣', '🌭', '🥙', '🍖', '🫕', '🥟', '🍱', '🥓', '🍳', '🌶️', '🥔', '🍚']
  };
})();
