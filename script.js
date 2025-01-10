/* VARIABLES */
let catcher, strawberry, rotten;
let score = 0;
let backgroundImg, catcherImg, fallingObjectImg, rottenImg;
let gameState = "INTRO"; // Start with the introductory screen
let currentLevel = 1; // Level tracking variable
let playButton;

/* PRELOAD LOADS FILES */
function preload() {
  backgroundImg = loadImage("assets/backgroundImg.jpg");
  catcherImg = loadImage("assets/catcherImg.png");
  fallingObjectImg = loadImage("assets/fallingObjectImg.png");
  rottenImg = loadImage("assets/rottenImg.png"); // Load the rotten fruit image
}

/* SETUP RUNS ONCE */
function setup() {
  createCanvas(400, 400);

  // Resize the images
  backgroundImg.resize(400, 400);
  catcherImg.resize(60, 0);
  fallingObjectImg.resize(40, 0);
  rottenImg.resize(40, 0); // Resize the rotten fruit image

  // Create catcher
  catcher = new Sprite(catcherImg, 200, 380, 100, 20, "k");
  catcher.color = color(139, 69, 19); // changed to brown color

  // Create strawberry
  strawberry = new Sprite(fallingObjectImg, 100, 0, 10);
  strawberry.color = color(220, 20, 60); // strawberry red color
  strawberry.vel.y = 4;
  strawberry.rotationLock = true;

  // Create rotten fruit
  rotten = new Sprite(rottenImg, random(width), 0, 10); // Create rotten fruit sprite
  rotten.color = color(0, 128, 0); // some green color
  rotten.vel.y = 4; // Vertical velocity only
  rotten.vel.x = 0; // Ensure no horizontal movement
  rotten.rotationLock = true;

  // Create play button
  playButton = createButton('Play');
  playButton.position(width / 2 - 15, height / 2);
  playButton.mousePressed(startIntro);
}

let levelConfigs = [
  { speed: 4, targetScore: 5 },  // Level 1 config
  { speed: 6, targetScore: 10 }, // Level 2 config
  { speed: 8, targetScore: 15 }, // Level 3 config
];

/* DRAW LOOP REPEATS */
function draw() {
  background(224, 224, 224);

  if (gameState === "INTRO") {
    drawIntroScreen();
  } else if (gameState === "PLAYING") {
    drawGameScreen();
  } else if (gameState === "LEVEL_UP") {
    drawLevelUpScreen();
  } else if (gameState === "WIN") {
    drawWinScreen();
  } else if (gameState === "END") {
    drawEndScreen();
  }
}

function drawIntroScreen() {
  background(200); // Plain grey background
  textSize(16);
  fill(0);
  textAlign(CENTER, CENTER);
  text("The main character, Elsa, got lost in the forest\nwith her family. Help her out by collecting\n30 strawberries. You lose points if you\ncatch rotten strawberries. She hopes\nyou will help her out!", width / 2, height / 2 - 100);
  playButton.show();
}

function drawGameScreen() {
  playButton.hide();

  // Draw background image
  image(backgroundImg, 0, 0);

  // If strawberry reaches bottom, move back to random position at top without changing score
  if (strawberry.y >= height) {
    strawberry.y = 0;
    strawberry.x = random(width);
    strawberry.vel.y = levelConfigs[currentLevel - 1].speed; // Adjust speed based on level
  }

  // If rotten fruit reaches bottom, move back to random position at top without changing score
  if (rotten.y >= height) {
    rotten.y = 0;
    rotten.x = random(width);
    rotten.vel.y = levelConfigs[currentLevel - 1].speed; // Adjust speed based on level
  }

  // Ensure rotten fruit doesn't move horizontally
  rotten.vel.x = 0; // Horizontal velocity is zero to ensure straight fall

  // Check if score is below zero and end game if it is
  if (score < 0) {
    gameState = "END";
  }

  // Check if the player has reached the target score to move to the next level
  if (score >= levelConfigs[currentLevel - 1].targetScore) {
    currentLevel++;
    if (currentLevel > levelConfigs.length) {
        gameState = "WIN"; // Player wins the game
    } else {
        gameState = "LEVEL_UP"; // Move to next level
    }
  }

  // Move catcher
  if (kb.pressing("left")) {
    catcher.vel.x = -10; // Increased speed
  } else if (kb.pressing("right")) {
    catcher.vel.x = 10; // Increased speed
  } else {
    catcher.vel.x = 0;
  }

  // Stop catcher at edges of screen
  if (catcher.x < 50) {
    catcher.x = 50;
  } else if (catcher.x > 350) {
    catcher.x = 350;
  }

  // If strawberry collides with catcher, move back to random position at top and increase score
  if (strawberry.collides(catcher)) {
    strawberry.y = 0;
    strawberry.x = random(width);
    strawberry.vel.y = levelConfigs[currentLevel - 1].speed + 3; // consistent speed
    strawberry.direction = "down";
    score = score + 1;
  }

  // If rotten fruit collides with catcher, move back to random position at top and decrease score
  if (rotten.collides(catcher)) {
    rotten.y = 0;
    rotten.x = random(width);
    rotten.vel.y = levelConfigs[currentLevel - 1].speed + 3; // consistent speed
    score = score - 1;
  }

  // Draw the score to screen in red color
  fill(255, 0, 0); // Red color
  textSize(20);
  text("Score = " + score, 55, 30);
  text("Level = " + currentLevel, width - 100, 30); // Display level

  allSprites.debug = mouse.pressing();
}

function drawLevelUpScreen() {
  background(200); // Plain grey background
  fill(0);
  textSize(20);
  textAlign(CENTER, CENTER);
  text("Level Up!", width / 2, height / 2 - 20);
  text("Click to continue", width / 2, height / 2 + 20);
  playButton.show();
  playButton.mousePressed(startLevel);
}

function drawWinScreen() {
  background(200); // Plain grey background
  fill(0);
  textSize(16);
  textAlign(CENTER, CENTER);
  text("Congratulations! You collected 30 strawberries and you saved Elsa and her family. Great job and stay hopeful! <3", width / 2 - 150, height / 2 - 100, 300, 200);
}

function startIntro() {
  gameState = "INTRO";
  playButton.mousePressed(startGame);
}

function startGame() {
  gameState = "PLAYING";
  score = 0; // Reset score for a new game
  currentLevel = 1; // Start at level 1
  resetGame(); // Reset positions of catcher and strawberry
  loop(); // Restart the draw loop
}

function startLevel() {
  gameState = "PLAYING";
  score = 0; // Reset score for the new level
  resetGame();
}

function resetGame() {
  // Reset positions of catcher, strawberry, and rotten fruit
  catcher.x = 200;
  catcher.y = 380;
  strawberry.y = 0;
  strawberry.x = random(width);
  strawberry.vel.y = levelConfigs[currentLevel - 1].speed;
  rotten.y = 0;
  rotten.x = random(width);
  rotten.vel.y = levelConfigs[currentLevel - 1].speed;
}

function endGame() {
  gameState = "END";
  noLoop(); // Stop the draw loop
}

function drawEndScreen() {
  background(200); // Plain grey background
  fill(255, 0, 0);
  textSize(15);
  textAlign(CENTER, CENTER);
  text("Game over! Click anywhere to restart the game", width / 2, height / 2);
}

function mousePressed() {
  if (gameState === "END") {
    startGame(); // Restart the game if it's over and the screen is clicked
  } else if (gameState === "LEVEL_UP") {
    startLevel(); // Start the next level when the screen is clicked
  }
}