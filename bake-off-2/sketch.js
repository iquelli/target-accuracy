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
const GRID_ROWS           = 3;      // We divide our non fruit targets in a 2x3 grid
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
const NUMBER_CATEGORIES = 9;
const NUMBER_TARGETS = 80;

// Categories
const A_K = [20, 5, 6, 11, 21, 12, 0, 1, 22, 7];
const L_Pe = [8, 9, 10, 13, 15, 16, 17, 18, 19];
const Pi_W = [23, 2, 24, 25, 26, 3, 4, 27, 14];
const Condimentos = [71, -1,-1, 70, 63, 64, 69, 68];
const TomateVerduras = [58, 76, 77, 78, 79, 65, 62, 60];
const OutrosVegetais = [59, 61, 66, 75, 67, 73, 74, 72];
const Sumos = [28, 34, 33, 36, 31, 29, 32, 30, 35];
const Leite = [37, 42, 41, 50, 39, 44, 47, 51, 40, 38];
const IogurteNatas = [45, 48, 49, 43, 46, 57, 56, 55, 52, 54, 53];

// List of Categories
let catList = [A_K, L_Pe, Pi_W, TomateVerduras, OutrosVegetais, Condimentos,Sumos, Leite, IogurteNatas]

// Lists
let targets                = [];     // Target list
let categories             = [];     // Category List
let images                 = [];     // Images list
let labels = ["Ola", "Frutas P-", "Maçã/Pera", "Outras Frutas", "Sumos", "Condimentos",
              "Leite", "Outros Vegetais", "Tomates e Vegetais Verdes", "Iogurte/Natas"]

var landscape     // background photo


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
  
  landscape = loadImage('images/bg.png')
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
    background(landscape);        // sets background to white
    
    // Print trial count at the top left-corner of the canvas
    textFont('Helvetica', 16);
    fill(color(255,255,255));
    textAlign(RIGHT, BOTTOM);
    text("Trial " + (current_trial + 1) + " of " + trials.length, 50, 20);

    // Draw all targets and categories
    for (var i = 0; i<NUMBER_CATEGORIES; i++) categories[i].draw();
    for (var i = 0; i<NUMBER_TARGETS; i++) targets[i].draw();

    // Draw the target label to be selected in the current trial
    textFont('Arial', 20);
    fill(color(255,255,255));
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

function createTargets(category_number, cat_x, cat_y, cat_size, width, height)
{

  // Colours
  WHITE = color(0,0,0);
  BLACK = color(255,255,255);
  GREY = color(215,215,215);
  BLUE = color(164, 243, 248);
  DARK_GREEN = color(185,231,169);
  LIGHT_GREEN = color(200,255,157);
  YELLOW = color(246,253,164);
  ORANGE = color(255,217,172);
  PEACH = color(255,190,153);
  RED = color(255,165,169);
  PINK = color(255,165,214);
  PURPLE = color(200,181,255);
  BROWN = color(222,206,194);
  FUSCHIA = color(227,182,285);
  
  let cA_K = [DARK_GREEN,DARK_GREEN, YELLOW, YELLOW, YELLOW, BLUE, BLUE, BLUE, LIGHT_GREEN, LIGHT_GREEN];
  let cL_Pe = [YELLOW, DARK_GREEN, LIGHT_GREEN, LIGHT_GREEN, PEACH, ORANGE, ORANGE, PURPLE, PEACH];
  let cPi_W = [YELLOW, YELLOW, PURPLE, FUSCHIA, RED, RED, RED, ORANGE, BLUE];
  let cCondimentos = [GREY, -1,-1, YELLOW, YELLOW, YELLOW, GREY, GREY];
  let cTomateVerduras = [DARK_GREEN, RED, RED, RED, DARK_GREEN, DARK_GREEN, DARK_GREEN, DARK_GREEN];
  let cOutrosVegetais = [PURPLE, ORANGE, GREY, RED, YELLOW, BROWN, BROWN, BROWN];
  let cSumos = [YELLOW, RED, PEACH, LIGHT_GREEN, LIGHT_GREEN, ORANGE, FUSCHIA, FUSCHIA, BLUE];
  let cLeite = [GREY, GREY, GREY, GREY, BLUE, BLUE, BLUE, BLUE, BLUE, BLUE];
  let cIogurteNatas = [GREY,GREY, FUSCHIA, FUSCHIA, FUSCHIA, LIGHT_GREEN, LIGHT_GREEN, LIGHT_GREEN, 
                    LIGHT_GREEN, LIGHT_GREEN, LIGHT_GREEN];
  
  
  let colList = [cA_K, cL_Pe, cPi_W, cTomateVerduras, cOutrosVegetais, cCondimentos,cSumos, cLeite, cIogurteNatas]
  
  let target_y, target_x;
  let cs;//num of targets in category pra por as coisas uniformemente a volta do circulo
    if (category_number===0||category_number===7){
      cs=10;
    }
    if (category_number===1||category_number===2 || category_number===6){
      cs=9;
    }
    if (category_number===4||category_number===3||category_number===5){
      cs=8;
    }
    if (category_number===8){
      cs=11;
    }
  
  for(var i = 0; i < cs; i++) {

    // ALGORITMO PARA CALCULAR DIFERENTES POSIÇÕES AQUI
    target_x = cat_x+cat_size*(0.055*3*cs)*cos(-(cs-i*(2*PI/cs))+5.5*PI/8);
    target_y = cat_y+cat_size*(0.016*5*cs)*sin(-(cs-i*(2*PI/cs))+5.5*PI/8);

    let label_id = catList[category_number][i];
    let col_id = colList[category_number][i];
    
    if (label_id!=-1){
      let target_label = legendas.getString(label_id, 0);
      let target = new Target(target_x, target_y, width, height,target_label, label_id,col_id);
      targets.push(target);
    }
  }
}

function createCategories(circle_size, horizontal_gap, vertical_gap, target_width, target_height)
{
    h_margin = horizontal_gap / (GRID_COLUMNS - 1);
    v_margin = vertical_gap / (GRID_ROWS - 1);
  
    let i = 0;
    // sets the categories (which is a 3x3 grid)
    for(let r = 0; r < GRID_ROWS; r++) 
    {
      for (let c = 0; c < GRID_COLUMNS; c++) 
      {
        let category_x = 200 + circle_size%2 + (circle_size%2 + h_margin)*c;
        let category_y = 140 + circle_size%2 + (v_margin)*r;

        createTargets(r+3*c, category_x+circle_size*0.5, category_y+circle_size*0.5, circle_size, target_width, target_height); //pra enviar como referencia o centro

        i++;
        let category = new Category(category_x, category_y, circle_size, images[i-1], labels[i-1]); 
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
    let circle_size    = 2.5;                                // size of category's circle

    let target_width    = 2.2;                                // sets the target size (will be converted to cm when passed to createTargets)
    let target_height    = 0.8; //ALTURA DO ALVO 
    let horizontal_gap = screen_width - 1.1*target_width * GRID_COLUMNS;// empty space in cm across the x-axis (based on 10 targets per row)
    let vertical_gap   = screen_height - 1.5*target_height * GRID_ROWS;  // empty space in cm across the y-axis (based on 8 targets per column)

    // Creates and positions the UI targets according to the white space defined above (in cm!)
    // 80 represent some margins around the display (e.g., for text)
    createCategories(circle_size * PPCM, horizontal_gap * PPCM - 200, vertical_gap * PPCM - 200, target_width * PPCM, target_height * PPCM);

    // Starts drawing targets immediately after we go fullscreen
    draw_targets = true;
  }
}