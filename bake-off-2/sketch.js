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

// Categories
const Zero= [38, 53]
const A= [20, 28, 58, 59, 5];
const B= [6, 76, 68, 45, 37, 42, 41, 50, 48];
const C= [60, 11, 61, 34, 52, 21, 62];
const F= [39, 33];
const G= [12, 63, 64, 0, 1];
const K= [22, 7];
const L= [65, 8, 9];
const M= [36, 10, 31, 55, 13, 71, 66];
const N= [15];
const O= [44, 43, 16, 29];
const P= [17, 18, 19, 32, 30, 56, 23, 2, 70, 24, 25];
const R= [75, 3, 26, 73, 69, 4];
const S= [27, 35, 46, 47, 51, 49, 40, 74];
const T= [77];
const V= [57, 78];
const W= [14, 72];
const Y= [67, 54];
const Z= [79];

// List of Categories TODO ALTERAR
let catList = [Zero, A,B,C,F, G, K, L, M, N, O, P, R, S, T, V, W, Y, Z]

// Lists
let targets                = [];     // Target list
let categories             = [];     // Category List
let catlabels = ["0","A", "B", "C", "F" , "G", "K", "L ", "M", "N", "O", "P", 
                "R", "S", "T", "V", "W", "Y", "Z"];
let num_targets_cat=[2,5,9,7,2,5,2,3,7,1,4,11,6,8,1,2,2,2,1]; // number of targets per category


// Ensures important data is loaded before the program starts
function preload()
{
  legendas = loadTable('legendas.csv', 'csv', 'header');
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
    background(color(200));        // sets background to white
    
    // Print trial count at the top left-corner of the canvas
    textFont('Helvetica', 16);
    fill(color(255,255,255));
    textAlign(RIGHT, BOTTOM);
    text("Trial " + (current_trial + 1) + " of " + trials.length, 50, 20);

    // Draw all targets and categories
    for (var i = 0; i<NUMBER_CATEGORIES; i++) categories[i].draw();

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
  if (draw_targets)                           ///TIVE QUE ALTERAR AQUII
  {
    for (var i = 0; i < targets.length; i++)
    {
      for (var j=0; j< targets[i].length; j++){
      // Check if the user clicked over one of the targets
      if (targets[i][j].clicked(mouseX, mouseY)) 
      {
        // Checks if it was the correct target
        if (targets[i][j].id === trials[current_trial]) hits++;
        else misses++;
        
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

function createTargets(displaycenter_x, displaycenter_y, width, height)
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

  const cZero= [GREY, GREY] //Cores atribuidas
  const cA= [GREY,GREY, GREY, GREY, GREY];
  const cB= [GREY, GREY, GREY, GREY, GREY, GREY, GREY, GREY, GREY];
  const cC= [GREY, GREY, GREY, GREY, GREY, GREY, GREY];
  const cF= [GREY, GREY];
  const cG= [GREY, GREY, GREY, GREY, GREY];
  const cK= [GREY, GREY];
  const cL= [GREY, GREY, GREY];
  const cM= [GREY, GREY, GREY, GREY, GREY, GREY, GREY];
  const cN= [GREY];
  const cO= [GREY, GREY, GREY, GREY];
  const cP= [GREY,GREY,GREY,GREY,GREY,GREY,GREY,GREY,GREY,GREY,GREY];
  const cR= [GREY, GREY, GREY, GREY, GREY, GREY];
  const cS= [GREY, GREY, GREY, GREY, GREY, GREY, GREY, GREY];
  const cT= [GREY];
  const cV= [GREY, GREY];
  const cW= [GREY, GREY];
  const cY= [GREY, GREY];
  const cZ= [GREY];
    
  let colList = [cZero, cA, cB, cC, cF, cG, cK, cL, cM, cN, cO, cP, cR, cS, cT, cV, cW, cY, cZ];
  let buffer =[];
  let center_size = 2;
  
  let target_y, target_x;

  let horizontal_gap = width/2;
  let vertical_gap = height/2;
  let threecolumns=(3*width+horizontal_gap*2); // 3 collumn disposition
  let fourcolumns=(4*width+horizontal_gap*3);
  let tworows=(2*height+vertical_gap) // 2 lines disposition
  let threerows=(3*height+vertical_gap*2);

  for(var i=0; i < NUMBER_CATEGORIES; i++) 
  {
    let num = num_targets_cat[i];
    for(var j=1; j<=num; j++)
    {
      switch (num) {

        case 1: // in the center
          target_y = displaycenter_y;
          target_x = displaycenter_x;
          break;

        case 2: // side by side;
        case 3: // triangle
        case 4: // square
          target_x = displaycenter_x+center_size*cos(-(j*(2*PI/num)));
          target_y = displaycenter_y+center_size*sin(-(j*(2*PI/num)));
          break;

        case 5: // square with one in the center
        case 7: // hexagono with one in with center  
          if (j===Math.floor(num/2)+1){
            target_y = displaycenter_y;
            target_x = displaycenter_x;
          }
          else{
            target_x = displaycenter_x+center_size*cos(-(j-(j%(Math.floor(num/2)))*(2*PI/num-1)));
            target_y = displaycenter_y+center_size*sin(-(j-(j%(Math.floor(num/2)))*(2*PI/num-1)));
          }
          break;

        case 6:
        case 9:  
          target_x = displaycenter_x-((width*3+horizontal_gap*2)/2)+(width + vertical_gap)*((j-1)/3);
          target_y = displaycenter_y-((height*(num%3)+horizontal_gap*((num%3)-1))/2)+(height+vertical_gap)*((j-1)%3);
          break;
        
        case 8: // 2*4
          if (j<5){
            target_y = displaycenter_y-tworows/2;
            target_x = displaycenter_x-fourcolumns/2+(j-1*(width+horizontal_gap));
          }
          if (j>=5 && j<=8){
            target_y = displaycenter_y-threerows/2+(height+vertical_gap);
            target_x = displaycenter_x-threecolumns/2+((j-5)*(width+horizontal_gap));
          }
          break;
        
        case 11: // 1*4+1*3+1*4
          if (j<5){
            target_y = displaycenter_y-threerows/2;
            target_x = displaycenter_x-fourcolumns/2+(j-1*(width+horizontal_gap));
          }
          if (j>=5 && j<8){
            target_y = displaycenter_y-threerows/2+(height+vertical_gap);
            target_x = displaycenter_x-threecolumns/2+((j-5)*(width+horizontal_gap));
          }
          if (j>7 && j<=11){
            target_y = displaycenter_y-threerows/2+(2*(height+vertical_gap));
            target_x = displaycenter_x-fourcolumns/2+((j-8)*(width+horizontal_gap));
          }
          break;
      } 

        // creates target
        let label_id = catList[i][j-1];
        let col_id = colList[i][j-1];

        let target_label = legendas.getString(label_id, 0);
        
        let target = new Target(target_x, target_y, width, height,target_label, label_id, col_id, i);
        buffer.push(target);
    }
    targets.push(buffer);
    buffer = [];
  }
}

// creates an array with all the categories
function createCategories(circle_size, screen_width, screen_height, big_circle_size, target_width, target_height)
{
    let big_circle_x = screen_width/2;
    let big_circle_y = screen_height/2;
    let cs = NUMBER_CATEGORIES;

    for (var i = 0; i < NUMBER_CATEGORIES; i++)
    {
      // calculates positions
      cat_x = big_circle_x+big_circle_size*(0.055*3*cs)*cos(-(cs-i*(2*PI/cs))+5.5*PI/8);
      cat_y = big_circle_y+big_circle_size*(0.016*5*cs)*sin(-(cs-i*(2*PI/cs))+5.5*PI/8);
      
      // adds category
      let category = new Category(cat_x, cat_y, circle_size, catlabels[i], 1, targets[i]);
      categories.push(category);
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

    let cat_size    = 2.5;                                // size of category's circle
    let big_circle_size = 15;  
    let target_width    = 2.2;                               
    let target_height    = 0.8;                           // size of circle that the categories surround

    // Creates and positions the UI targets according to the white space defined above (in cm!)
    createTargets(screen_width/2, screen_height/2, target_width*PPCM, target_height*PPCM); // creates targets list
    createCategories(cat_size * PPCM, screen_width, screen_height, big_circle_size * PPCM, target_height *PPCM, target_width*PPCM); 

    // Starts drawing targets immediately after we go fullscreen
    draw_targets = true;
  }
}