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

  /* From "Weekly Dinner Plan" (PDF, Oct 12, 2026). Meat comes from the ButcherBox freezer.
     thaw + thawLead: the evening that many days before dinner, move the meat to the fridge.
     morning: a task for the morning of that dinner. minutes = hands-on time on the night. */
  const planMeals = [
    {
      id: 'm-tacobowls', name: 'Ground Beef Taco Bowls', emoji: '🌯', minutes: 10, appliance: 'Reheat',
      tags: ['quick', 'makeahead', 'kid', 'protein'],
      thaw: '1.5 lb ground beef', thawLead: 2,
      ingredients: [
        ['1.5 lb', 'Ground beef', 'freezer'], ['1 packet', 'Taco seasoning', 'pantry'], ['1 cup dry', 'Rice', 'pantry'],
        ['1 bag', 'Corn', 'frozen'], ['1 can', 'Black beans', 'pantry'], ['', 'Shredded cheese', 'dairy'],
        ['', 'Sour cream', 'dairy'], ['optional', 'Avocado', 'produce']
      ],
      notes: 'Your usual version. Brown the beef with taco seasoning on Sunday and reheat on the night. Cooked taco beef and rice keep 3 to 4 days in the fridge, so the Sunday batch lasts through Tuesday.'
    },
    {
      id: 'm-salsachicken', name: 'Salsa Chicken Bowls or Quesadillas', emoji: '🌶️', minutes: 10, appliance: 'Reheat',
      tags: ['quick', 'makeahead', 'kid', 'protein'],
      ingredients: [
        ['1 jar', 'Mild salsa', 'pantry'], ['', 'Flour tortillas', 'bakery'], ['', 'Shredded cheese', 'dairy'], ['1 cup dry', 'Rice', 'pantry']
      ],
      notes: 'Your usual version, already made. Serve over rice as bowls or in tortillas as quesadillas. Leftovers make easy lunches.'
    },
    {
      id: 'm-steakbites', name: 'Air Fryer Garlic Butter Steak Bites', emoji: '🥩', minutes: 20, appliance: 'Air fryer', serves: 4,
      tags: ['quick', 'airfryer', 'protein'],
      thaw: '1.5 lb steak', thawLead: 2, morning: 'Optional: cube and season the steak',
      ingredients: [
        ['1.5 lb', 'Sirloin or NY strip', 'freezer'], ['1 tbsp', 'Cooking oil', 'pantry'], ['1 tbsp', 'Worcestershire sauce', 'pantry'],
        ['1 tsp', 'Garlic powder', 'pantry'], ['1 tsp', 'Salt', 'pantry'], ['½ tsp', 'Black pepper', 'pantry'],
        ['1 tbsp', 'Butter', 'dairy'], ['12 oz', 'Green beans', 'frozen']
      ],
      steps: [
        'Cut the steak into 1-inch cubes. Toss with the oil, Worcestershire, garlic powder, salt, and pepper. This can be done in the morning.',
        'Air fry the green beans at 400°F for 8 minutes, shaking once. Set aside.',
        'Air fry the steak in a single layer at 400°F for 8 to 10 minutes, shaking halfway. Use 10 minutes for more done.',
        'Toss with the melted butter and serve.'
      ],
      notes: 'Serves 4, about 20 minutes.'
    },
    {
      id: 'm-honeygarlic', name: 'Crockpot Honey Garlic Chicken', emoji: '🍯', minutes: 20, handsOn: '5 min AM, 15 min PM', appliance: 'Crockpot', serves: 4,
      tags: ['quick', 'slow', 'kid', 'protein'],
      thaw: '2 lb chicken thighs', thawLead: 2, morning: 'Thighs and sauce in the crockpot, low 5 to 6 hrs',
      ingredients: [
        ['2 lb', 'Chicken thighs, boneless skinless', 'freezer'], ['⅓ cup', 'Honey', 'pantry'], ['⅓ cup', 'Low-sodium soy sauce', 'pantry'],
        ['2 tbsp', 'Ketchup', 'pantry'], ['4 cloves', 'Garlic', 'produce'], ['1 tbsp', 'Cornstarch', 'pantry'],
        ['12 oz', 'Broccoli florets', 'frozen'], ['1½ cups dry', 'Rice', 'pantry']
      ],
      steps: [
        'Sunday: whisk the honey, soy sauce, ketchup, and minced garlic (or 1 tsp garlic powder) in a jar and refrigerate.',
        'Thursday morning: put the thawed chicken in the crockpot and pour the sauce over. Cook on low 5 to 6 hours or high 3 hours.',
        '30 minutes before dinner: cook the rice and microwave the broccoli.',
        'Remove the chicken and shred it. Stir 1 tbsp cornstarch mixed with 2 tbsp cold water into the sauce and cook on high 10 to 15 minutes until glossy.',
        'Return the chicken to the sauce and serve over rice with broccoli.'
      ],
      notes: 'Serves 4. Never put frozen meat straight into the crockpot. Leftovers make easy lunches.'
    },
    {
      id: 'm-peanutnoodles', name: 'Peanut Noodles with Chicken & Veggies', emoji: '🍜', minutes: 20, appliance: 'Stovetop', serves: 4,
      tags: ['quick', 'kid', 'protein'],
      thaw: '1 lb chicken', thawLead: 1,
      ingredients: [
        ['12 oz', 'Spaghetti or linguine', 'pantry'], ['1 lb', 'Chicken breasts or thighs', 'freezer'], ['1 tbsp', 'Cooking oil', 'pantry'],
        ['16 oz', 'Stir-fry vegetable blend', 'frozen'], ['¾ cup', 'Peanut sauce (premade)', 'pantry']
      ],
      steps: [
        'Boil the pasta, adding the frozen veggies for the last 3 minutes. Save ½ cup pasta water, then drain.',
        'Meanwhile, cut the chicken into bite-size pieces and cook in the oil over medium-high heat for 6 to 8 minutes, or air fry at 400°F for 10 to 12 minutes.',
        'Toss everything with the peanut sauce, adding pasta water to loosen it.'
      ],
      notes: 'Serves 4, about 20 minutes. Cut the noodles short for the toddler.'
    },
    // Ideas for future weeks
    {
      id: 'm-pestosalad', name: 'Pesto Pasta Salad', emoji: '🌿', minutes: 20, appliance: 'Stovetop',
      tags: ['try', 'makeahead', 'kid'],
      ingredients: [['1 lb', 'Pasta', 'pantry'], ['1 jar', 'Pesto', 'pantry'], ['1 tub', 'Mozzarella pearls', 'dairy'], ['1 pint', 'Cherry tomatoes', 'produce']],
      notes: 'Make it the night before. Skip the feta and lemon. Add mozzarella pearls, cherry tomatoes, and leftover chicken.'
    },
    {
      id: 'm-beefchili', name: 'Mild Beef Chili', emoji: '🫘', minutes: 15, appliance: 'Crockpot or Instant Pot',
      tags: ['try', 'slow', 'instantpot', 'freezer', 'protein'],
      thaw: '1.5 lb ground beef', thawLead: 1,
      ingredients: [['1.5 lb', 'Ground beef', 'freezer'], ['2 cans', 'Beans', 'pantry'], ['1 jar', 'Mild chili powder', 'pantry']],
      notes: 'Ground beef, beans, and mild chili powder. Freeze half for a later week.'
    },
    {
      id: 'm-bolognese', name: 'Spaghetti Bolognese', emoji: '🍝', minutes: 20, appliance: 'Crockpot',
      tags: ['try', 'slow', 'kid'],
      thaw: '1 lb ground beef', thawLead: 1,
      ingredients: [['1 lb', 'Ground beef', 'freezer'], ['1 lb', 'Spaghetti', 'pantry'], ['1 jar', 'Marinara sauce', 'pantry'], ['2', 'Carrots', 'produce'], ['1', 'Zucchini', 'produce']],
      notes: 'Grate carrots and zucchini into the sauce. Toddler-friendly pasta night.'
    },
    {
      id: 'm-vegcurry', name: 'Vegetarian Curry', emoji: '🍛', minutes: 15, appliance: 'Instant Pot',
      tags: ['try', 'instantpot', 'kid'],
      ingredients: [['2 cans', 'Chickpeas', 'pantry'], ['2', 'Sweet potatoes', 'produce'], ['1 can', 'Coconut milk', 'pantry'], ['1 jar', 'Mild curry powder', 'pantry'], ['1 bag', 'Frozen mixed veggies', 'frozen'], ['2 cups dry', 'Rice', 'pantry']],
      notes: 'Chickpeas, sweet potato, and coconut milk with mild curry powder. Use frozen veggies.'
    },
    {
      id: 'm-tikka', name: 'Chicken Tikka Masala', emoji: '🥘', minutes: 15, appliance: 'Crockpot or Instant Pot',
      tags: ['try', 'slow', 'instantpot', 'protein'],
      thaw: '2 lb chicken thighs', thawLead: 1,
      ingredients: [['2 lb', 'Chicken thighs', 'freezer'], ['1 jar', 'Mild tikka masala sauce', 'pantry'], ['1 small carton', 'Heavy cream', 'dairy'], ['2 cups dry', 'Rice', 'pantry']],
      notes: 'Chicken thighs in a jarred mild sauce plus a splash of cream. Serve with rice or naan.'
    }
  ];

  const toMeal = m => ({
    ...m,
    fav: !!m.fav,
    ingredients: m.ingredients.map(([qty, name, aisle]) => ({ qty, name, aisle }))
  });

  window.FORKCAST_SEED = {
    // Dated plans loaded once into the app (meals, nights, prep tasks, grocery list)
    planPackages: [
      {
        id: 'weekly-dinner-plan-2026-10-12',
        title: 'Weekly Dinner Plan',
        pdf: 'plans/weekly-dinner-plan-2026-10-12.pdf',
        start: '2026-10-10',
        end: '2026-10-16',
        meals: planMeals.map(toMeal),
        plan: {
          '2026-10-12': 'm-tacobowls',
          '2026-10-13': 'm-salsachicken',
          '2026-10-14': 'm-steakbites',
          '2026-10-15': 'm-honeygarlic',
          '2026-10-16': 'm-peanutnoodles'
        },
        tasks: [
          { date: '2026-10-11', when: 'evening', text: 'Brown the ground beef with taco seasoning' },
          { date: '2026-10-11', when: 'evening', text: 'Cook 2 cups dry rice (covers Mon and Tue)' },
          { date: '2026-10-11', when: 'evening', text: 'Mix the honey garlic sauce in a jar' }
        ],
        // [name, qty, aisle, for meal]
        groceries: [
          ['Ground beef', '1.5 lb', 'freezer', 'm-tacobowls'],
          ['Chicken thighs, boneless skinless', '2 lb', 'freezer', 'm-honeygarlic'],
          ['Sirloin or NY strip', '1.5 lb', 'freezer', 'm-steakbites'],
          ['Chicken breasts or thighs', '1 lb', 'freezer', 'm-peanutnoodles'],
          ['Broccoli florets', '12 oz', 'frozen', 'm-honeygarlic'],
          ['Green beans', '12 oz', 'frozen', 'm-steakbites'],
          ['Stir-fry vegetable blend', '16 oz', 'frozen', 'm-peanutnoodles'],
          ['Corn', '1 bag', 'frozen', 'm-tacobowls'],
          ['Rice', '', 'pantry', ''],
          ['Spaghetti or linguine', '12 oz', 'pantry', 'm-peanutnoodles'],
          ['Taco seasoning', '1 packet', 'pantry', 'm-tacobowls'],
          ['Mild salsa', '1 jar', 'pantry', 'm-salsachicken'],
          ['Black beans', '1 can', 'pantry', 'm-tacobowls'],
          ['Low-sodium soy sauce', '', 'pantry', 'm-honeygarlic'],
          ['Honey', '', 'pantry', 'm-honeygarlic'],
          ['Worcestershire sauce', '', 'pantry', 'm-steakbites'],
          ['Ketchup', '', 'pantry', 'm-honeygarlic'],
          ['Cornstarch', '', 'pantry', 'm-honeygarlic'],
          ['Garlic powder', '', 'pantry', 'm-steakbites'],
          ['Cooking oil', '', 'pantry', ''],
          ['Shredded cheese', '', 'dairy', ''],
          ['Sour cream', '', 'dairy', 'm-tacobowls'],
          ['Butter', '', 'dairy', 'm-steakbites'],
          ['Flour tortillas', '', 'bakery', 'm-salsachicken'],
          ['Garlic', '1 head', 'produce', 'm-honeygarlic'],
          ['Avocado', 'optional', 'produce', 'm-tacobowls']
        ]
      }
    ],
    defrostTip: 'Forgot to defrost? Put the sealed ButcherBox pack in a bowl of cold water for 30 to 60 minutes, changing the water every 30 minutes. Never put frozen meat straight into the crockpot.',
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
      { id: 'freezer', label: 'From the freezer (ButcherBox)' },
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
      { id: 'slow', label: 'Crockpot' },
      { id: 'airfryer', label: 'Air fryer' },
      { id: 'instantpot', label: 'Instant Pot' },
      { id: 'makeahead', label: 'Make-ahead' },
      { id: 'sheetpan', label: 'Sheet pan' },
      { id: 'grill', label: 'Grill' },
      { id: 'freezer', label: 'Freezer-friendly' },
      { id: 'try', label: 'To try' }
    ],
    emojis: ['🌮', '🐟', '🍝', '🥩', '🍲', '🍕', '🍗', '🍤', '🍔', '🥞', '🥗', '🥦', '🥪', '🧀', '🥣', '🐠',
      '🌯', '🍛', '🍜', '🥘', '🍣', '🌭', '🥙', '🍖', '🫕', '🥟', '🍱', '🥓', '🍳', '🌶️', '🥔', '🍚']
  };
})();
