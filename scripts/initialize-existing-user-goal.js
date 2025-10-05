// Script to initialize default goal for existing users who don't have one
// Run this with: node scripts/initialize-existing-user-goal.js

const userId = 'user_33e9j0LNB0oQPioPYS5tSvnwFT2'; // Replace with your user ID

async function initializeGoal() {
  try {
    const response = await fetch('http://localhost:3000/api/goals/initialize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId
      })
    });

    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Successfully created default goal:');
      console.log(JSON.stringify(data.goal, null, 2));
    } else {
      console.error('❌ Error:', data.error);
    }
  } catch (error) {
    console.error('❌ Failed to initialize goal:', error.message);
  }
}

initializeGoal();
