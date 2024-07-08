const{ PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function populateDatabase() {
    try {
      const categories = [
        {
          category: 'Sleep',
          options: [
            {option: 'Good sleep', icon: 'faBed'},
            {option: 'Moderate sleep', icon: 'faBed'},
            {option: 'Bad sleep', icon: 'faBedPulse'},
            {option: 'No sleep', icon: 'faBedPulse'}
          ]
        },
  
        {
          category: 'Social',
          options: [
            {option: 'Friends', icon: 'faUserGroup'},
            {option: 'Family', icon: 'faPeopleRoof'},
            {option: 'Date', icon: 'faHeart'},
            {option: 'Party', icon: 'faChampagneGlasses'},
            {option: 'Alone', icon: 'faUser'}
          ]
        },
  
        {
          category: 'Hobbies',
          options: [
            {option: 'TV', icon: 'faTV'},
            {option: 'Reading', icon: 'faBook'},
            {option: 'Gaming', icon: 'faGamepad'},
            {option: 'Relax', icon: 'faCouch'}
          ]
        },
  
        {
          category: 'Food',
          options: [
            {option: 'Sweets', icon: 'faIceCream'},
            {option: 'Fast Food', icon: 'faBurger'},
            {option: 'Restaurant', icon: 'faUtensils'},
            {option: 'Home-made', icon: 'faBowlRice'},
            {option: 'Vegan', icon: 'faCarrot'}
          ]
        },
  
        {
          category: 'Weather',
          options: [
            {option: 'Sunny', icon: 'faSun'},
            {option: 'Rainy', icon: 'faCloudRain'},
            {option: 'Windy', icon: 'faWind'}
          ]
        },
  
        {
          category: 'Exercise',
          options: [
            {option: 'Cycling', icon: 'faBicycle'},
            {option: 'Swimming', icon: 'faPersonSwimming'},
            {option: 'Walking', icon: 'faPersonWalking'},
            {option: 'Running', icon: 'faPersonRunning'},
            {option: 'Sports', icon: 'faBaseball'}
          ]
        }
      ];
      
      for (const category of categories) {
        await prisma.activityCategory.create({
          data: {
            category : category.category,
            options: {
              create: category.options
            }
          }
        });
      };
      } catch (error) {
        console.error('Error poulating database:', error);
      }
}
module.exports = populateDatabase;