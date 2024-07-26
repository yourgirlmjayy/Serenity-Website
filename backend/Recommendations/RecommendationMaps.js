const RecommendationMap = {
    'Running': {
        'positive': {
            'sunny': ["Jogging", "Hiking", "Outdoor yoga", "Biking in a scenic area", "Playing frisbee"],
            'rainy': ["Running on a treadmill", "Indoor yoga", "Strength training at the gym", "Swimming in an indoor pool", "Dance workout"],
            'cold': ["Using an indoor track", "Home workout", "Ice skating", "Skiing"],
        },
        'negative': {
            'sunny': ["Take a walk in nature to lift your spirits", "Spend time with friends and family", "Have a picnic", "Go for a run in a peaceful area", "Listen to uplifting music"],
            'rainy': ["Write in your journal to express your feelings", "Try some indoor gardening", "Cook a comforting meal", "Watch a funny movie", "Talk to a friend"],
            'cold': ["Listen to your favorite music", "Bake some comfort food", "Do some indoor exercises", "Read a good book", "Watch your favorite shows"],
        },
        'neutral': {
            'sunny': ["Jogging", "Hiking", "Outdoor yoga", "Biking", "Playing frisbee"],
            'rainy': ["Running on a treadmill", "Indoor yoga", "Strength training at the gym", "Swimming", "Dance workout"],
            'cold': ["Indoor track", "Home workout", "Ice skating", "Skiing", "Have a movie marathon with hot chocolate"],
        }
    },
    'Friends': {
        'positive': {
            'sunny': ["Go on a walk with friends", "Have a picnic in the park with friends", "Play sports with friends", "Visit a beach with friends", "Have a BBQ party with friends"],
            'rainy': ["Watch movies with friendsr", "Play board games with friends", "Cook a meal with friends", "Visit an indoor attraction with friends", "Do a group workout with friends"],
            'cold': ["Host a movie marathon", "Play indoor games", "Cook a warm meal together", "Visit a cozy café with friends", "Have a book club meeting with friends"],
        },
        'negative': {
            'sunny': ["Have a heart-to-heart conversation", "Go for a relaxing walk", "Do a fun activity together", "Visit a calming place", "Listen to uplifting music together"],
            'rainy': ["Watch a feel-good movie", "Cook a comforting meal together", "Play indoor games", "Have a relaxing tea session", "Do a craft project together"],
            'cold': ["Watch a comforting movie", "Cook a warm meal together", "Do indoor activities", "Visit a cozy café", "Read books together"],
        },
        'neutral': {
            'sunny': ["Go for a walk together", "Have a picnic in the park", "Play a sport outside", "Visit a beach", "Have a BBQ party"],
            'rainy': ["Watch movies together", "Play board games", "Cook a meal with family", "Visit an indoor attraction with family", "Do a group workout with family"],
            'cold': ["Host a movie marathon", "Play indoor games", "Cook a warm meal together", "Visit a cozy café", "Have a book club meeting"],
        }
    },
    'Gaming': {
        'positive': {
            'sunny': ["Host a gaming tournament", "Try a new VR game", "Play outdoor games like Pokémon Go", "Attend a gaming convention", "Create a gaming YouTube channel"],
            'rainy': ["Have a retro gaming marathon", "Play online escape rooms", "Try a new gaming genre", "Participate in online gaming forums", "Host a virtual gaming party"],
            'cold': ["Try a new gaming platform", "Play co-op games with friends", "Create a gaming blog", "Participate in gaming contests", "Watch gaming documentaries"],
        },
        'negative': {
            'sunny': ["Play calming games like Minecraft", "Try a new relaxing gaming genre", "Take a break from gaming", "Practice gaming-related mindfulness", "Read gaming-related books"],
            'rainy': ["Play solo games like puzzles or card games", "Try a new calming gaming experience", "Watch calming gaming streams", "Take a gaming detox", "Practice self-care"],
            'cold': ["Try a new calming gaming genre", "Play games with a calming atmosphere", "Take breaks and do stretches", "Practice gaming-related meditation", "Read gaming-related comics"],
        },
        'neutral': {
            'sunny': ["Try a new game", "Play games with friends", "Attend a gaming meetup", "Watch gaming streams", "Read gaming news"],
            'rainy': ["Play games with a strong narrative", "Try a new gaming series", "Participate in online gaming communities", "Watch gaming walkthroughs", "Read gaming reviews"],
            'cold': ["Try a new gaming mode", "Play games with a unique mechanic", "Participate in gaming beta tests", "Watch gaming trailers", "Read gaming forums"],
        }
    },
    'Reading': {
        'positive': {
            'sunny': ["Host a book club in a park", "Read a new genre outdoors", "Attend a literary festival", "Create a reading challenge", "Write book reviews"],
            'rainy': ["Discover new authors online", "Read a book with a friend over video call", "Explore different genres", "Create a reading nook", "Join online book clubs"],
            'cold': ["Read classic literature by the fireplace", "Attend a book reading event", "Try audiobooks with a new narrator", "Create a reading journal", "Host a virtual book club"],
        },
        'negative': {
            'sunny': ["Read self-help books", "Practice reading mindfulness", "Read uplifting memoirs", "Write in a journal", "Create a vision board"],
            'rainy': ["Read comforting poetry", "Try guided meditation with reading", "Read inspirational essays", "Practice gratitude journaling", "Listen to calming audiobooks"],
            'cold': ["Read heartwarming fiction", "Try reading with a weighted blanket", "Read motivational biographies", "Practice self-care through reading", "Listen to soothing audiobooks"],
        },
        'neutral': {
            'sunny': ["Read in a new outdoor location", "Try a new reading app", "Read a book with a unique format", "Attend a book signing event", "Explore different reading habits"],
            'rainy': ["Read a book with a strong plot twist", "Try reading with a new font style", "Read a book with a unique narrative voice", "Explore different genres", "Listen to an engaging audiobook"],
            'cold': ["Read a classic book with a new perspective", "Try reading with a new lighting setup", "Read a book with a thought-provoking theme", "Explore different reading environments", "Listen to a captivating audiobook"],
        }
    },
    'Cooking': {
        'positive': {
            'sunny': ["Grill outdoors", "Make fresh salads", "Bake desserts", "Try a new recipe", "Host a cooking party"],
            'rainy': ["Bake comfort foods", "Cook soups and stews", "Try new recipes", "Cook a fancy dinner", "Make hot drinks"],
            'cold': ["Bake comfort foods", "Cook hearty meals", "Make hot drinks", "Try new baking recipes", "Cook a warm dessert"],
        },
        'negative': {
            'sunny': ["Cook simple meals", "Try new recipes", "Cook with friends", "Bake something sweet", "Make comfort food"],
            'rainy': ["Cook comfort foods", "Try new recipes", "Bake something sweet", "Cook with friends", "Make hot drinks"],
            'cold': ["Cook comfort foods", "Bake something sweet", "Make hot drinks", "Try new recipes", "Cook with friends"],
        },
        'neutral': {
            'sunny': ["Grill outdoors", "Make fresh salads", "Bake desserts", "Try a new recipe", "Host a cooking party"],
            'rainy': ["Bake comfort foods", "Cook soups and stews", "Try new recipes", "Cook a fancy dinner", "Make hot drinks"],
            'cold': ["Bake comfort foods", "Cook hearty meals", "Make hot drinks", "Try new baking recipes", "Cook a warm dessert"],
        }
    },
    'Family': {
        'positive': {
            'sunny': ["Have a picnic in the park", "Go on a family hike", "Play outdoor games", "Visit a zoo or farm", "Have a BBQ"],
            'rainy': ["Have a movie day at home", "Play board games", "Cook a meal together", "Visit an indoor play area", "Do arts and crafts"],
            'cold': ["Have a movie night", "Cook a warm meal together", "Play indoor games", "Visit a museum", "Read books together"],
        },
        'negative': {
            'sunny': ["Go for a walk together", "Have a picnic", "Do a fun activity together", "Visit a calming place", "Listen to music together"],
            'rainy': ["Watch a feel-good movie", "Cook a comforting meal", "Play indoor games", "Have a relaxing tea session", "Do a craft project together"],
            'cold': ["Watch a comforting movie", "Cook a warm meal", "Do indoor activities", "Visit a cozy café", "Read books together"],
        },
        'neutral': {
            'sunny': ["Have a picnic in the park", "Go on a family hike", "Play outdoor games", "Visit a zoo or farm", "Have a BBQ"],
            'rainy': ["Have a movie day at home", "Play board games", "Cook a meal together", "Visit an indoor play area", "Do arts and crafts"],
            'cold': ["Have a movie night", "Cook a warm meal together", "Play indoor games", "Visit a museum", "Read books together"],
        }
    },
    'Date': {
        'positive': {
            'sunny': ["Go for a picnic", "Take a walk in the park", "Visit a beach", "Go hiking", "Have an outdoor dinner"],
            'rainy': ["Go to a café", "Have a movie date", "Cook a meal together", "Visit a museum", "Do an indoor activity"],
            'cold': ["Have a cozy indoor date", "Cook a warm meal together", "Watch a romantic movie", "Visit an indoor attraction", "Have a game night"],
        },
        'negative': {
            'sunny': ["Take a relaxing walk", "Visit a calming place", "Have a heart-to-heart conversation", "Do a fun activity together", "Listen to music together"],
            'rainy': ["Watch a feel-good movie", "Cook a comforting meal", "Visit an indoor attraction", "Do a craft project together", "Play indoor games"],
            'cold': ["Watch a comforting movie", "Cook a warm meal", "Do indoor activities", "Visit a cozy café", "Read books together"],
        },
        'neutral': {
            'sunny': ["Go for a picnic", "Take a walk in the park", "Visit a beach", "Go hiking", "Have an outdoor dinner"],
            'rainy': ["Go to a café", "Have a movie date", "Cook a meal together", "Visit a museum", "Do an indoor activity"],
            'cold': ["Have a cozy indoor date", "Cook a warm meal together", "Watch a romantic movie", "Visit an indoor attraction", "Have a game night"],
        }
    },
    'Party': {
        'positive': {
            'sunny': ["Host a BBQ", "Have a beach party", "Play outdoor games", "Go to an outdoor event", "Have a garden party"],
            'rainy': ["Host an indoor party", "Play board games", "Have a dance party", "Cook together", "Watch movies"],
            'cold': ["Host a cozy indoor party", "Cook a warm meal together", "Play indoor games", "Have a dance party", "Watch a movie"],
        },
        'negative': {
            'sunny': ["Have a small gathering", "Do a fun activity together", "Visit a calming place", "Have a heart-to-heart conversation", "Listen to music together"],
            'rainy': ["Watch a feel-good movie", "Cook a comforting meal", "Visit an indoor attraction", "Play indoor games", "Do a craft project together"],
            'cold': ["Watch a comforting movie", "Cook a warm meal", "Do indoor activities", "Visit a cozy café", "Read books together"],
        },
        'neutral': {
            'sunny': ["Host a BBQ", "Have a beach party", "Play outdoor games", "Go to an outdoor event", "Have a garden party"],
            'rainy': ["Host an indoor party", "Play board games", "Have a dance party", "Cook together", "Watch movies"],
            'cold': ["Host a cozy indoor party", "Cook a warm meal together", "Play indoor games", "Have a dance party", "Watch a movie"],
        }
    },
    'Relax': {
        'positive': {
            'sunny': ["Take a nap in a hammock", "Read a book in the park", "Do some yoga outdoors", "Sunbathe", "Have a relaxing picnic"],
            'rainy': ["Take a warm bath", "Read a book by the window", "Do some indoor yoga", "Listen to calming music", "Watch a relaxing movie"],
            'cold': ["Take a warm bath", "Read a book by the fireplace", "Do some indoor yoga", "Listen to calming music", "Watch a relaxing movie"],
        },
        'negative': {
            'sunny': ["Take a walk in nature", "Listen to calming music outdoors", "Do some outdoor yoga", "Have a quiet picnic", "Read a book in the park"],
            'rainy': ["Take a warm bath", "Read a comforting book", "Do some indoor yoga", "Listen to calming music", "Watch a feel-good movie"],
            'cold': ["Take a warm bath", "Read a comforting book", "Do some indoor yoga", "Listen to calming music", "Watch a feel-good movie"],
        },
        'neutral': {
            'sunny': ["Take a nap in a hammock", "Read a book in the park", "Do some yoga outdoors", "Sunbathe", "Have a relaxing picnic"],
            'rainy': ["Take a warm bath", "Read a book by the window", "Do some indoor yoga", "Listen to calming music", "Watch a relaxing movie"],
            'cold': ["Take a warm bath", "Read a book by the fireplace", "Do some indoor yoga", "Listen to calming music", "Watch a relaxing movie"],
        }
    },
    'Sweets': {
        'positive': {
            'sunny': ["Have ice cream", "Bake cookies", "Make a fruit salad", "Enjoy a smoothie", "Have a chocolate treat"],
            'rainy': ["Bake cookies", "Have a hot chocolate", "Make a cake", "Enjoy some comfort food", "Have a sweet treat"],
            'cold': ["Bake cookies", "Have a hot chocolate", "Make a cake", "Enjoy some comfort food", "Have a sweet treat"],
        },
        'negative': {
            'sunny': ["Enjoy a small treat", "Share sweets with friends", "Have a fruit-based dessert", "Try a new sweet recipe", "Enjoy a smoothie"],
            'rainy': ["Have a hot chocolate", "Bake some comforting cookies", "Share sweets with friends", "Enjoy a sweet treat", "Make a comforting dessert"],
            'cold': ["Have a hot chocolate", "Bake some comforting cookies", "Share sweets with friends", "Enjoy a sweet treat", "Make a comforting dessert"],
        },
        'neutral': {
            'sunny': ["Have ice cream", "Bake cookies", "Make a fruit salad", "Enjoy a smoothie", "Have a chocolate treat"],
            'rainy': ["Bake cookies", "Have a hot chocolate", "Make a cake", "Enjoy some comfort food", "Have a sweet treat"],
            'cold': ["Bake cookies", "Have a hot chocolate", "Make a cake", "Enjoy some comfort food", "Have a sweet treat"],
        }
    },
    'Fast Food': {
        'positive': {
            'sunny': ["Have a burger outdoors", "Eat at a fast food place with outdoor seating", "Have a picnic with fast food", "Order takeout and eat in a park", "Enjoy fast food at a beach"],
            'rainy': ["Order fast food and watch a movie", "Have fast food at home", "Order delivery and play games", "Have fast food indoors with friends", "Try a new fast food place"],
            'cold': ["Order fast food and stay cozy indoors", "Have fast food at home", "Order delivery and watch a movie", "Try a new fast food place", "Enjoy fast food with hot drinks"],
        },
        'negative': {
            'sunny': ["Have fast food as a treat", "Share fast food with friends", "Eat fast food in a relaxing place", "Have a small portion", "Try a new fast food item"],
            'rainy': ["Order fast food and have a cozy night", "Share fast food with friends", "Have a small portion", "Order fast food and watch a movie", "Try a new fast food item"],
            'cold': ["Order fast food and have a cozy night", "Share fast food with friends", "Have a small portion", "Order fast food and watch a movie", "Try a new fast food item"],
        },
        'neutral': {
            'sunny': ["Have a burger outdoors", "Eat at a fast food place with outdoor seating", "Have a picnic with fast food", "Order takeout and eat in a park", "Enjoy fast food at a beach"],
            'rainy': ["Order fast food and watch a movie", "Have fast food at home", "Order delivery and play games", "Have fast food indoors with friends", "Try a new fast food place"],
            'cold': ["Order fast food and stay cozy indoors", "Have fast food at home", "Order delivery and watch a movie", "Try a new fast food place", "Enjoy fast food with hot drinks"],
        }
    },
    'Home-made': {
        'positive': {
            'sunny': ["Cook a fresh meal", "Make a salad", "Grill outdoors", "Bake a dessert", "Cook a new recipe"],
            'rainy': ["Cook comfort food", "Bake something sweet", "Make soup", "Cook a fancy meal", "Try a new recipe"],
            'cold': ["Cook a hearty meal", "Bake comfort food", "Make soup", "Cook a warm dessert", "Try a new recipe"],
        },
        'negative': {
            'sunny': ["Cook a simple meal", "Bake something sweet", "Try a new recipe", "Cook with friends", "Make a smoothie"],
            'rainy': ["Cook comfort food", "Bake something sweet", "Make soup", "Try a new recipe", "Cook with friends"],
            'cold': ["Cook a hearty meal", "Bake something sweet", "Make soup", "Try a new recipe", "Cook with friends"],
        },
        'neutral': {
            'sunny': ["Cook a fresh meal", "Make a salad", "Grill outdoors", "Bake a dessert", "Cook a new recipe"],
            'rainy': ["Cook comfort food", "Bake something sweet", "Make soup", "Cook a fancy meal", "Try a new recipe"],
            'cold': ["Cook a hearty meal", "Bake comfort food", "Make soup", "Cook a warm dessert", "Try a new recipe"],
        }
    },
    'Vegan': {
        'positive': {
            'sunny': ["Make a fresh salad", "Grill vegetables", "Cook a vegan BBQ", "Make a smoothie", "Bake a vegan dessert"],
            'rainy': ["Cook vegan comfort food", "Bake vegan cookies", "Make a vegan soup", "Try a new vegan recipe", "Cook a vegan stew"],
            'cold': ["Cook a vegan stew", "Bake vegan comfort food", "Make a vegan soup", "Try a new vegan recipe", "Cook a warm vegan meal"],
        },
        'negative': {
            'sunny': ["Make a simple vegan meal", "Bake vegan cookies", "Try a new vegan recipe", "Cook with friends", "Make a vegan smoothie"],
            'rainy': ["Cook vegan comfort food", "Bake vegan cookies", "Make a vegan soup", "Try a new vegan recipe", "Cook with friends"],
            'cold': ["Cook a vegan stew", "Bake vegan comfort food", "Make a vegan soup", "Try a new vegan recipe", "Cook with friends"],
        },
        'neutral': {
            'sunny': ["Make a fresh salad", "Grill vegetables", "Cook a vegan BBQ", "Make a smoothie", "Bake a vegan dessert"],
            'rainy': ["Cook vegan comfort food", "Bake vegan cookies", "Make a vegan soup", "Try a new vegan recipe", "Cook a vegan stew"],
            'cold': ["Cook a vegan stew", "Bake vegan comfort food", "Make a vegan soup", "Try a new vegan recipe", "Cook a warm vegan meal"],
        }
    },
    'Cycling': {
        'positive': {
            'sunny': ["Cycle in the park", "Go on a bike trail", "Cycle by the beach", "Join a cycling group", "Explore a new area on your bike"],
            'rainy': ["Cycle at the gym", "Do a spin class", "Use a stationary bike at home", "Cycle in an indoor facility", "Try a virtual cycling tour"],
            'cold': ["Cycle at the gym", "Do a spin class", "Use a stationary bike at home", "Cycle in an indoor facility", "Try a virtual cycling tour"],
        },
        'negative': {
            'sunny': ["Take a relaxing bike ride", "Cycle in a peaceful area", "Join a casual cycling group", "Cycle by the beach", "Listen to music while cycling"],
            'rainy': ["Cycle at the gym", "Do a spin class", "Use a stationary bike at home", "Cycle in an indoor facility", "Try a virtual cycling tour"],
            'cold': ["Cycle at the gym", "Do a spin class", "Use a stationary bike at home", "Cycle in an indoor facility", "Try a virtual cycling tour"],
        },
        'neutral': {
            'sunny': ["Cycle in the park", "Go on a bike trail", "Cycle by the beach", "Join a cycling group", "Explore a new area on your bike"],
            'rainy': ["Cycle at the gym", "Do a spin class", "Use a stationary bike at home", "Cycle in an indoor facility", "Try a virtual cycling tour"],
            'cold': ["Cycle at the gym", "Do a spin class", "Use a stationary bike at home", "Cycle in an indoor facility", "Try a virtual cycling tour"],
        }
    },
    'Swimming': {
        'positive': {
            'sunny': ["Swim at the beach", "Swim in an outdoor pool", "Join a swimming group", "Try open water swimming", "Have a pool party"],
            'rainy': ["Swim in an indoor pool", "Do a water aerobics class", "Swim at the gym", "Try a virtual swimming workout", "Do swimming exercises at home"],
            'cold': ["Swim in an indoor pool", "Do a water aerobics class", "Swim at the gym", "Try a virtual swimming workout", "Do swimming exercises at home"],
        },
        'negative': {
            'sunny': ["Take a relaxing swim", "Swim in a peaceful area", "Join a casual swimming group", "Swim at the beach", "Listen to music while swimming"],
            'rainy': ["Swim in an indoor pool", "Do a water aerobics class", "Swim at the gym", "Try a virtual swimming workout", "Do swimming exercises at home"],
            'cold': ["Swim in an indoor pool", "Do a water aerobics class", "Swim at the gym", "Try a virtual swimming workout", "Do swimming exercises at home"],
        },
        'neutral': {
            'sunny': ["Swim at the beach", "Swim in an outdoor pool", "Join a swimming group", "Try open water swimming", "Have a pool party"],
            'rainy': ["Swim in an indoor pool", "Do a water aerobics class", "Swim at the gym", "Try a virtual swimming workout", "Do swimming exercises at home"],
            'cold': ["Swim in an indoor pool", "Do a water aerobics class", "Swim at the gym", "Try a virtual swimming workout", "Do swimming exercises at home"],
        }
    },
    'Walking': {
        'positive': {
            'sunny': ["Walk in the park", "Go on a nature walk", "Walk by the beach", "Join a walking group", "Explore a new area on foot"],
            'rainy': ["Walk at the gym", "Do a walking workout at home", "Walk in an indoor facility", "Try a virtual walking tour", "Do indoor walking exercises"],
            'cold': ["Walk at the gym", "Do a walking workout at home", "Walk in an indoor facility", "Try a virtual walking tour", "Do indoor walking exercises"],
        },
        'negative': {
            'sunny': ["Take a relaxing walk", "Walk in a peaceful area", "Join a casual walking group", "Walk by the beach", "Listen to music while walking"],
            'rainy': ["Walk at the gym", "Do a walking workout at home", "Walk in an indoor facility", "Try a virtual walking tour", "Do indoor walking exercises"],
            'cold': ["Walk at the gym", "Do a walking workout at home", "Walk in an indoor facility", "Try a virtual walking tour", "Do indoor walking exercises"],
        },
        'neutral': {
            'sunny': ["Walk in the park", "Go on a nature walk", "Walk by the beach", "Join a walking group", "Explore a new area on foot"],
            'rainy': ["Walk at the gym", "Do a walking workout at home", "Walk in an indoor facility", "Try a virtual walking tour", "Do indoor walking exercises"],
            'cold': ["Walk at the gym", "Do a walking workout at home", "Walk in an indoor facility", "Try a virtual walking tour", "Do indoor walking exercises"],
        }
    },
    'Sports': {
        'positive': {
            'sunny': ["Play soccer", "Play basketball", "Play tennis", "Play volleyball", "Play baseball"],
            'rainy': ["Play indoor soccer", "Play indoor basketball", "Play indoor tennis", "Play indoor volleyball", "Play indoor baseball"],
            'cold': ["Play indoor soccer", "Play indoor basketball", "Play indoor tennis", "Play indoor volleyball", "Play indoor baseball"],
        },
        'negative': {
            'sunny': ["Play a casual game", "Join a friendly sports group", "Play a relaxing sport", "Play soccer", "Play basketball"],
            'rainy': ["Play indoor sports", "Join a friendly sports group", "Play a relaxing sport", "Play soccer", "Play basketball"],
            'cold': ["Play indoor sports", "Join a friendly sports group", "Play a relaxing sport", "Play soccer", "Play basketball"],
        },
        'neutral': {
            'sunny': ["Play soccer", "Play basketball", "Play tennis", "Play volleyball", "Play baseball"],
            'rainy': ["Play indoor soccer", "Play indoor basketball", "Play indoor tennis", "Play indoor volleyball", "Play indoor baseball"],
            'cold': ["Play indoor soccer", "Play indoor basketball", "Play indoor tennis", "Play indoor volleyball", "Play indoor baseball"],
        }
    }
};

module.exports = { RecommendationMap };