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
const NUMBER_CATEGORIES = 19;
const NUMBER_TARGETS = 80;
const SELECTED = 2;
const UNSELECTED = 1;
let curr_selected_cat = -1;        // current selected category
var initial_screen;
var wrong_answer;
var right_answer;

// Categories
const Zero= [38, 53]
const A= [20, 58, 59,5, 28];
const B= [6, 41, 48, 76, 42, 50, 68, 37, 45];
const C= [60, 62, 11, 34, 61, 52, 21];
const F= [39, 33];
const G= [12, 63, 64, 0, 1];
const K= [22, 7];
const L= [65, 8, 9];
const M= [10, 55, 13, 31, 71, 36, 66];
const N= [15];
const O= [44, 43, 16, 29];
const P= [17, 18, 30, 24, 19, 32, 23, 2, 56, 70, 25];
const R= [75, 3, 26, 73, 69, 4];
const S= [46, 35, 49, 51, 47, 40, 27, 74];
const T= [77];
const V= [57, 78];
const W= [14, 72];
const Y= [67, 54];
const Z= [79];

// List of Categories
let catList = [Zero,A, B, C, F, G, K, L, M, N, O, P, R,S,T,V, W, Y, Z];

// Lists
let images                 = [];  //images list
let targets                = [];     // Target list
let categories             = [];     // Category List
let catlabels = ["0%", "A", "B", "C", 
                "F", "G", "K", "L", "M", "N", "O","P","R", "S", "T", "V" , "W", "Y", "Z"];
let num_targets_cat=[2,5,9,7,2,5,2,3,7,1,4,11,6,8,1,2,2,2,1];  // number of targets per category


// Ensures important data is loaded before the program starts
function preload()
{
  legendas = loadTable('legendas.csv', 'csv', 'header');
  for (let i = 0; i<NUMBER_TARGETS; i++) 
    images[i] = loadImage('images/'+i+ '.png');
    
  initial_screen = loadImage('images/initial-screen.png');
  
  wrong_answer = loadSound('sounds/wrong-answer.mp3');
  right_answer = loadSound('sounds/right-answer.mp3');
  
}

// Runs once at the start
function setup()
{
  createCanvas(700, 500);    // window size in px before we go into fullScreen()
  frameRate(60);             // frame rate (DO NOT CHANGE!)
  
  randomizeTrials();                       // randomize the trial order at the start of execution
  drawUserIDScreen(initial_screen);        // draws the user start-up screen (student ID and display size)
}

// Runs every frame and redraws the screen
function draw()
{
  if (draw_targets && attempt < 2)
  {     
    // The user is interacting with the 6x3 target grid
    background(color(225, 255, 255));
            // sets background to white
    
    // calculates progress
    let progress = round((current_trial) / 12 * 100);
    
    // Draw the progress bar background
    fill(255);
    rect(width/2 - 200, 20, 300, 50, 50);

    // Draw the progress bar
    fill(0, 200, 0);
    rect(width/2 - 200, 20, progress*3, 50, 50);


    // Draw all targets and categories
    for (var i = 0; i<NUMBER_CATEGORIES; i++) categories[i].draw();
    
    fill(color(0));
    rect(width/2-75, height-50, 150, 100);

    // Draw the target label to be selected in the current trial
    textFont('Arial', 20);
    fill(color(255,255,255));
    textAlign(CENTER, BOTTOM);
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
    if(curr_selected_cat != -1)  // checks if at least one category is selected
    {
      for (var j=0; j< targets[curr_selected_cat].length; j++){
      // Check if the user clicked over one of the targets of the selected category
        if (targets[curr_selected_cat][j].clicked(mouseX, mouseY)) 
        {
        // Checks if it was the correct target
          if (targets[curr_selected_cat][j].id === trials[current_trial]) {
            right_answer.play();
            hits++;
          } 
          else {
            misses++;
            wrong_answer.play();
          }
        
          current_trial++;                 // Move on to the next trial/target
          break;
        }
      }
    }

    for (var i = 0; i < NUMBER_CATEGORIES; i++)
    {
      if(categories[i].clicked(mouseX, mouseY))
      {
        categories[i].changeType(SELECTED);  // selects category
        curr_selected_cat = i;       // current selected category

        // makes sure no other categories are selected
        for(var j = 0; j < NUMBER_CATEGORIES; j++) {
          if(j != i) {
            categories[j].changeType(UNSELECTED);
          }
        }

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

function createTargets(displaycenter_x, displaycenter_y, width, height, big_circle_size)
{
  // Colours
  WHITE = color(255);
  BLACK = color(0);
  GREY = color(215,215,215);
  GREY2= color(155)
  BLUE = color(115, 213, 255);
  V_BLUE = color(24, 223, 255);
  MAGENTA = color(224,95,255);
  V_YELLOW = color(255,233,36);
  DARK_GREEN = color(205,251,189);
  LIGHT_GREEN = color(220,255,177);
  YELLOW = color(255,255,184);
  ORANGE = color(255,237,192);
  PEACH = color(255,190,153);
  RED = color(255,185,189);
  PINK = color(255,205,244);
  PURPLE = color(220,201,255);
  BROWN = color(242,226,214);
  FUSCHIA = color(247,202,255);

  const cZero= [V_BLUE, WHITE] //Cores atribuidas
  const cA= [YELLOW ,LIGHT_GREEN, PURPLE, BROWN, MAGENTA];
  const cB= [YELLOW,  V_BLUE,  V_YELLOW, PINK, V_BLUE,  V_YELLOW, ORANGE,  V_BLUE,  WHITE];
  const cC= [LIGHT_GREEN, DARK_GREEN, YELLOW, MAGENTA, ORANGE, WHITE, FUSCHIA];
  const cF= [V_BLUE, MAGENTA];
  const cG= [DARK_GREEN, BROWN, PEACH, FUSCHIA, LIGHT_GREEN];
  const cK= [YELLOW, LIGHT_GREEN];
  const cL= [DARK_GREEN, YELLOW, LIGHT_GREEN];
  const cM= [LIGHT_GREEN, WHITE, DARK_GREEN, MAGENTA, RED, MAGENTA, GREY];
  const cN= [ORANGE];
  const cO= [WHITE, WHITE, ORANGE, ORANGE];
  const cP= [LIGHT_GREEN,BROWN,MAGENTA,PURPLE,PEACH,MAGENTA,YELLOW,FUSCHIA,WHITE,RED,DARK_GREEN];
  const cR= [RED, PEACH, PEACH, RED, YELLOW, ORANGE];
  const cS= [WHITE, MAGENTA, V_YELLOW, V_YELLOW, V_BLUE,  V_BLUE, ORANGE, BROWN];
  const cT= [RED];
  const cV= [WHITE, RED];
  const cW= [LIGHT_GREEN, BROWN];
  const cY= [YELLOW, WHITE];
  const cZ= [DARK_GREEN];
    
  let colList = [cZero, cA, cB, cC, cF, cG, cK, cL, cM, cN, cO,cP, cR, cS, cT, cV, cW, cY, cZ];
  let buffer =[];
  
  for(var i=0; i < NUMBER_CATEGORIES; i++){
  
    let num = num_targets_cat[i];
    let target_x, target_y;
    for(var j=1; j<=num; j++)
    {
      if (((i)%4)===0||((i)%4)===1){
        target_x = (0.35* big_circle_size)+1.5*width;  
      }
      else{target_x = (0.35* big_circle_size) * 4 + displaycenter_x*(2/2.75)+ width/3;}
      target_y = (0.35* big_circle_size) * Math.floor(i/4) + big_circle_size/1.25;
      
      switch (num) {
        case 1:
          if (((i)%4)===0||((i)%4)===1){
          target_x += 1.1*width*((j)%2);
          }
          break;
        case 2: // side by side;
          target_x += 1.1*width*((j-1)%2);
          break;
        case 3: // triangle
          target_y += 1.5*height*(Math.floor((j-1)%3))-1.5*height;
          break;
        case 4: // square
          target_x += 1.1*width*((j-1)%2);
          target_y += 1.5*height*(Math.floor((j-1)/2))-0.5*height;
          break;
        case 5:
        case 6:
        case 7:
          target_x += 1.1*width*((j-1)%2);
          target_y += 1.5*height*(Math.floor((j-1)/2));
          if (i>3){ 
            target_y-=1.5*height;
            if (num===7) target_y-=0.5*height;
          }
          break;
        case 8:
          target_x += 1.1*width*((j-1)%2);
          target_y += 1.5*height*(Math.floor((j-1)/2))-3*height;
          break;
        case 9:
          target_x += 1.1*width*((j-1)%3);
          target_y += 1.5*height*(Math.floor((j-1)/3));
          if (i>3) target_y-=1.5*height;
        break;
        case 11:
          target_x += 1.1*width*((j-1)%3);
          target_y += 1.5*height*(Math.floor((j-1)/3))-2*height;
        break;
          
      }
        // creates target
        let label_id = catList[i][j-1];
        let col_id = colList[i][j-1];

        let target_label = legendas.getString(label_id, 0);
        
        let target = new Target(target_x, target_y, width, height,target_label, label_id, col_id, i, images[label_id]);
        buffer.push(target);
    }
    targets.push(buffer);
    buffer = [];
  }
}

// creates an array with all the categories
function createCategories(circle_size, screen_width, screen_height, big_circle_size)
{
  let i=0;
  while(i<20){
      // calculates positions
    for (var r = 0; r < 5; r++)
    {
      for (var c = 0; c < 4; c++)
      {
        let cat_x = (0.35* big_circle_size) * c + screen_width/2.65;  // give it some margin from the left border
        let cat_y = (0.35* big_circle_size) * r + big_circle_size/1.25;
      
      
        // adds category
        let category = new Category(cat_x, cat_y, circle_size, catlabels[i], 1, targets[i], r);
        categories.push(category);
        i++;
      }
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
    screen_width   = display.width * 2.54;             // screen width
    let screen_height  = display.height * 2.54;            // screen height

    let cat_size    = 2;                                // size of category's circle
    let big_circle_size = 6; 
    let target_width    = 3;                              
    let target_height    = 1.5;                          // size of circle that the categories surround

    // Creates and positions the UI targets according to the white space defined above (in cm!)
    createTargets(screen_width/2 * PPCM , screen_height/2 * PPCM , target_width*PPCM, target_height*PPCM, big_circle_size * PPCM); // creates targets list
    createCategories(cat_size * PPCM, screen_width * PPCM, screen_height * PPCM, big_circle_size * PPCM);  // creates categories list

    // Starts drawing targets immediately after we go fullscreen
    draw_targets = true;
  }
}