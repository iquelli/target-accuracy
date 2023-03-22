// Bakeoff #2 -- Seleção em Interfaces Densas
// IPM 2022-23, Período 3
// Entrega: até dia 31 de Março às 23h59 através do Fenix
// Bake-off: durante os laboratórios da semana de 10 de Abril

// p5.js reference: https://p5js.org/reference/

// Database (CHANGE THESE!)
const GROUP_NUMBER        = 37;      // Add your group number here as an integer (e.g., 2, 3)
const RECORD_TO_FIREBASE  = false;  // Set to 'true' to record user results to Firebase

// Pixel density and setup variables (DO NOT CHANGE!)
let PPI, PPCM;
const NUM_OF_TRIALS       = 12;      // The numbers of trials (i.e., target selections) to be completed
const GRID_ROWS           = 2;      // We divide our non fruit targets in a 2x3 grid
const GRID_COLUMNS        = 3;     // We divide our non fruit targets in a 2x3 grid
let continue_button;
let legendas;                       // The item list from the "legendas" CSV

// Metrics
let testStartTime, testEndTime;     // time between the start and end of one attempt (8 trials)
let hits 			      = 0;      // number of successful selections
let misses 			      = 0;      // number of missed selections (used to calculate accuracy)
let database;                       // Firebase DB  

// Study control parameters
let draw_targets          = false;  // used to control what to show in draw()
let trials;                         // contains the order of targets that activate in the test
let current_trial         = 0;      // the current trial number (indexes into trials array above)
let attempt               = 0;      // users complete each test twice to account for practice (attemps 0 and 1)

// Common variables
const NUMBER_CATEGORIES = 10; 

// Colours
//let WHITE = color(0,0,0);
//let BLACK = color(255,255,255);
//let GREY = color(215,215,215);
//let BLUE = color(164, 243, 248);
//let DARK_GREEN = color(185,231,169);
//let LIGHT_GREEN = color(200,255,157);
//let YELLOW = color(246,253,164);
//let ORANGE = color(255,217,172);
//let PEACH = color(255,190,153);
//let RED = color(255,165,169);
//let PINK = color(255,165,214);
//let PURPLE = color(200,181,255);
//let BROWN = color(222,206,194);
//let FUSCHIA = color(227,182,285);

// Lists
let targets                = [];     // Target list
let categories             = [];     // Category List
let images                 = [];     // Images list
let labels = ["Citrinos", "Frutas P-", "Maçã/Pera", "Outras Frutas", "Sumos", "Condimentos",
              "Leite", "Outros Vegetais", "Tomates e Vegetais Verdes", "Iogurte/Natas"]

// Ensures important data is loaded before the program starts
function preload()
{
  legendas = loadTable('legendas.csv', 'csv', 'header');

  // loads images
  for (let i = 0; i<NUMBER_CATEGORIES; i++)
  {
    let number = i + 1;
    images[i] = loadImage('images/category' + number + '.jpg');
  }
}

// Runs once at the start
function setup()
{
  createCanvas(700, 500);    // window size in px before we go into fullScreen()
  frameRate(60);             // frame rate (DO NOT CHANGE!)
  
  randomizeTrials();         // randomize the trial order at the start of execution
  drawUserIDScreen();        // draws the user start-up screen (student ID and display size)
}

// Runs every frame and redraws the screen
function draw()
{
  if (draw_targets && attempt < 2)
  {     
    // The user is interacting with the 6x3 target grid
    background(color(255,255,255));        // sets background to white
    
    // Print trial count at the top left-corner of the canvas
    textFont('Roboto', 16);
    fill(color(0,0,0));
    textAlign(LEFT);
    text("Trial " + (current_trial + 1) + " of " + trials.length, 50, 20);

    // Draw all targets
    for (var i = 0; i<NUMBER_CATEGORIES; i++) categories[i].draw();

    // Draw the target label to be selected in the current trial
    textFont('Roboto', 20);
    textAlign(CENTER);
    text(legendas.getString(trials[current_trial],0), width/2, height - 20);
  }
}

// Print and save results at the end of 54 trials
function printAndSavePerformance()
{
  // DO NOT CHANGE THESE! 
  let accuracy			= parseFloat(hits * 100) / parseFloat(hits + misses);
  let test_time         = (testEndTime - testStartTime) / 1000;
  let time_per_target   = nf((test_time) / parseFloat(hits + misses), 0, 3);
  let penalty           = constrain((((parseFloat(95) - (parseFloat(hits * 100) / parseFloat(hits + misses))) * 0.2)), 0, 100);
  let target_w_penalty	= nf(((test_time) / parseFloat(hits + misses) + penalty), 0, 3);
  let timestamp         = day() + "/" + month() + "/" + year() + "  " + hour() + ":" + minute() + ":" + second();
  
  textFont('Roboto', 18);
  background(color(0,0,0));   // clears screen
  fill(color(255,255,255));   // set text fill color to white
  textAlign(LEFT);
  text(timestamp, 10, 20);    // display time on screen (top-left corner)
  
  textAlign(CENTER);
  text("Attempt " + (attempt + 1) + " out of 2 completed!", width/2, 60); 
  text("Hits: " + hits, width/2, 100);
  text("Misses: " + misses, width/2, 120);
  text("Accuracy: " + accuracy + "%", width/2, 140);
  text("Total time taken: " + test_time + "s", width/2, 160);
  text("Average time per target: " + time_per_target + "s", width/2, 180);
  text("Average time for each target (+ penalty): " + target_w_penalty + "s", width/2, 220);

  // Saves results (DO NOT CHANGE!)
  let attempt_data = 
  {
        project_from:       GROUP_NUMBER,
        assessed_by:        student_ID,
        test_completed_by:  timestamp,
        attempt:            attempt,
        hits:               hits,
        misses:             misses,
        accuracy:           accuracy,
        attempt_duration:   test_time,
        time_per_target:    time_per_target,
        target_w_penalty:   target_w_penalty,
  }
  
  // Send data to DB (DO NOT CHANGE!)
  if (RECORD_TO_FIREBASE)
  {
    // Access the Firebase DB
    if (attempt === 0)
    {
      firebase.initializeApp(firebaseConfig);
      database = firebase.database();
    }
    
    // Add user performance results
    let db_ref = database.ref('G' + GROUP_NUMBER);
    db_ref.push(attempt_data);
  }
}

// Mouse button was pressed - lets test to see if hit was in the correct target
function mousePressed() 
{
  // Only look for mouse releases during the actual test
  // (i.e., during target selections)
  if (draw_targets)
  {
    for (var i = 0; i < legendas.getRowCount(); i++)
    {
      // Check if the user clicked over one of the targets
      if (targets[i].clicked(mouseX, mouseY)) 
      {
        // Checks if it was the correct target
        if (targets[i].id === trials[current_trial]) hits++;
        else misses++;
        
        current_trial++;                 // Move on to the next trial/target
        break;
      }
    }
    
    // Check if the user has completed all trials
    if (current_trial === NUM_OF_TRIALS)
    {
      testEndTime = millis();
      draw_targets = false;          // Stop showing targets and the user performance results
      printAndSavePerformance();     // Print the user's results on-screen and send these to the DB
      attempt++;                      
      
      // If there's an attempt to go create a button to start this
      if (attempt < 2)
      {
        continue_button = createButton('START 2ND ATTEMPT');
        continue_button.mouseReleased(continueTest);
        continue_button.position(width/2 - continue_button.size().width/2, height/2 - continue_button.size().height/2);
      }
    }
    // Check if this was the first selection in an attempt
    else if (current_trial === 1) testStartTime = millis(); 
  }
}

// Evoked after the user starts its second (and last) attempt
function continueTest()
{
  // Re-randomize the trial order
  randomizeTrials();
  
  // Resets performance variables
  hits = 0;
  misses = 0;
  
  current_trial = 0;
  continue_button.remove();
  
  // Shows the targets again
  draw_targets = true; 
}

function createCategories(circle_size, horizontal_gap, vertical_gap)
{
    // Define the margins between targets by dividing the white space 
    // for the number of targets minus one
    let h_margin = horizontal_gap / (GRID_COLUMNS);
    let v_margin = vertical_gap / (GRID_ROWS - 1);

    // sets the first row of circles (which is a 1x4 grid)
    for(var c = 0; c <= GRID_COLUMNS; c++) 
    {
      let category_x = 40 + circle_size%2 + circle_size*c;
      let category_y = 40 + circle_size%2;

      let category = new Category(category_x, category_y, circle_size, images[c], labels[c]);
      categories.push(category)
    }

    // Define the margins between targets by dividing the white space 
    // for the number of targets minus one
    h_margin = horizontal_gap / (GRID_COLUMNS -1);

    var i = 3;
    // sets the second and third row of circles (which is a 2x3 grid)
    for(var r = 1; r < GRID_ROWS + 1; r++) 
    {
      for (var c = 0; c < GRID_COLUMNS; c++) 
      {
        let category_x = 40 + circle_size%2 + circle_size*c;
        let category_y = 40 + circle_size%2 + circle_size*r;

        i++;
        let category = new Category(category_x, category_y, circle_size, images[i], labels[i]);
        categories.push(category);
      }
    }

}

// Is invoked when the canvas is resized (e.g., when we go fullscreen)
function windowResized() 
{    
  if (fullscreen())
  {
    // DO NOT CHANGE THESE!
    resizeCanvas(windowWidth, windowHeight);
    let display        = new Display({ diagonal: display_size }, window.screen);
    PPI                = display.ppi;                      // calculates pixels per inch
    PPCM               = PPI / 2.54;                       // calculates pixels per cm

    // Make your decisions in 'cm', so that targets have the same size for all participants
    // Below we find out out white space we can have between 2 cm targets
    let screen_width   = display.width * 2.54;             // screen width
    let screen_height  = display.height * 2.54;            // screen height
    let target_width    = 2;                                // sets the target size (will be converted to cm when passed to createTargets)
    let target_height    = 1; //ALTURA DO ALVO 
    let horizontal_gap = screen_width - target_width * GRID_COLUMNS;// empty space in cm across the x-axis (based on 10 targets per row)
    let vertical_gap   = screen_height - target_height * GRID_ROWS;  // empty space in cm across the y-axis (based on 8 targets per column)

    let circle_size    = 4;                                // size of category's circle
    let target_size    = 2; 

    // Creates and positions the UI targets according to the white space defined above (in cm!)
    // 80 represent some margins around the display (e.g., for text)
    createCategories(circle_size * PPCM, horizontal_gap * PPCM - 80, vertical_gap * PPCM - 80);

    // Starts drawing targets immediately after we go fullscreen
    draw_targets = true;
  }
}