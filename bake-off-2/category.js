// Category Class 

// TODO adicionar método para adicionar target
class Category
{
    constructor(x, y, r, i, l, n, tw, th)
    {
        this.x = x;
        this.y = y;
        this.radius = r;
        this.img = i;
        this.label = l;
        this.number = n;
        this.t_width = tw;
        this.t_height = th;
    }

    createTargets(targets, target_width, target_height, category_x, category_y, category_number) //Como cada um pode ter uma cor diferente
    { //TODO ver posiçoes relativas;
        // Colours
        let WHITE = color(0,0,0);
        let BLACK = color(255,255,255);
        let GREY = color(215,215,215);
        let BLUE = color(164, 243, 248);
        let DARK_GREEN = color(185,231,169);
        let LIGHT_GREEN = color(200,255,157);
        let YELLOW = color(246,253,164);
        let ORANGE = color(255,217,172);
        let PEACH = color(255,190,153);
        let RED = color(255,165,169);
        let PINK = color(255,165,214);
        let PURPLE = color(200,181,255);
        let BROWN = color(222,206,194);
        let FUSCHIA = color(227,182,285);

        //FRUTAS A_K
        if(category_number==1){

        target = new Target(category_x, category_y, target_width, target_height,"Anjou", 20, colour);
            targets.push(target);
        target = new Target(category_x, category_y, target_width, target_height, "Avocado",5, colour);
            targets.push(target);
        target = new Target(category_x, category_y, target_width, target_height, "Banana",6, colour);
            targets.push(target);
        target = new Target(category_x, category_y, target_width, target_height, "Cantaloupe",11, colour);
        targets.push(target);
        target = new Target(category_x, category_y, target_width, target_height, "Conference",21, colour);
        targets.push(target);
        target = new Target(category_x, category_y, target_width, target_height, "Galia Melon",12, colour);
            targets.push(target);
        target = new Target(category_x, category_y, target_width, target_height, "Golden",0, colour);
            targets.push(target);
        target = new Target(category_x, category_y, target_width, target_height, "Granny Smith",1, colour);
            targets.push(target);
        target = new Target(category_x, category_y, target_width, target_height, "Kaiser",22, colour);
        targets.push(target);
        target = new Target(category_x, category_y, target_width, target_height, "Kiwi",7, colour);
        targets.push(target);
        }

        //FRUTAS L_Pe
        if(category_number==2){
        target = new Target(category_x, category_y, target_width, target_height, "Lemon",8, colour);
            targets.push(target);
        target = new Target(category_x, category_y, target_width, target_height, "Lime",9, colour);
            targets.push(target);
        target = new Target(category_x, category_y, target_width, target_height, "Mango",10, colour);
            targets.push(target);
        target = new Target(category_x, category_y, target_width, target_height, "Melon",13, colour);
        targets.push(target);
        target = new Target(category_x, category_y, target_width, target_height, "Nectarine",15, colour);
        targets.push(target);
        target = new Target(category_x, category_y, target_width, target_height, "Orange",16, colour);
            targets.push(target);
        target = new Target(category_x, category_y, target_width, target_height, "Papaya",17, colour);
            targets.push(target);
        target = new Target(category_x, category_y, target_width, target_height, "Passion Fruit",18, colour);
            targets.push(target);
        target = new Target(category_x, category_y, target_width, target_height, "Peach",19, colour);
        targets.push(target);
        }

        //FRUTAS PI_W
        if(category_number==3){
        target = new Target(category_x, category_y, target_width, target_height, "Pineapple",23, colour);
            targets.push(target);
        target = new Target(category_x, category_y, target_width, target_height, "Pink Lady",2, colour);
            targets.push(target);
        target = new Target(category_x, category_y, target_width, target_height, "Plum",24, colour);
            targets.push(target);
        target = new Target(category_x, category_y, target_width, target_height, "Pomegranate",25, colour);
        targets.push(target);
        target = new Target(category_x, category_y, target_width, target_height, "Red Grapefruit",26, colour);
        targets.push(target);
        target = new Target(category_x, category_y, target_width, target_height, "Red Delicious",3, colour);
            targets.push(target);
        target = new Target(category_x, category_y, target_width, target_height, "Royal Gala",4, colour);
            targets.push(target);
        target = new Target(category_x, category_y, target_width, target_height, "Satsumas",27, colour);
            targets.push(target);
        target = new Target(category_x, category_y, target_width, target_height, "Watermelon",14, colour);
        targets.push(target);
        }

        //Condimentos
        if(category_number==4){
        target = new Target(category_x, category_y, target_width, target_height, "Garlic",68, colour);
            targets.push(target);
        target = new Target(category_x, category_y, target_width, target_height, "Ginger",71, colour);
            targets.push(target);
        target = new Target(category_x, category_y, target_width, target_height, "Piri Piri",69, colour);
            targets.push(target);
        target = new Target(category_x, category_y, target_width, target_height, "Bell Pepper",63, colour);
        targets.push(target);
        target = new Target(category_x, category_y, target_width, target_height, "Mild Pepper",64, colour);
        targets.push(target);
        target = new Target(category_x, category_y, target_width, target_height, "Rocoto Pepper",70, colour);
            targets.push(target);
        }
        //Tomate_Verduras
        if(category_number==5){
        target = new Target(category_x, category_y, target_width, target_height, "Beef Tomato",76, colour);
            targets.push(target);
        target = new Target(category_x, category_y, target_width, target_height, "Tomato",77, colour);
            targets.push(target);
        target = new Target(category_x, category_y, target_width, target_height, "Vine Tomato",78, colour);
            targets.push(target);
        target = new Target(category_x, category_y, target_width, target_height,"Asparagus" ,58, colour);
        targets.push(target);
        target = new Target(category_x, category_y, target_width, target_height, "Cabbage",60, colour);
        targets.push(target);
        target = new Target(category_x, category_y, target_width, target_height, "Cucumber",62, colour);
            targets.push(target);
        target = new Target(category_x, category_y, target_width, target_height, "Leek",65, colour);
            targets.push(target);
        target = new Target(category_x, category_y, target_width, target_height, "Zucchini",79, colour);
            targets.push(target);
        }

        //Outros Vegetais
        if(category_number==6){
        target = new Target(category_x, category_y, target_width, target_height, "Aubergine",59, colour);
            targets.push(target);
        target = new Target(category_x, category_y, target_width, target_height, "Carrots",61, colour);
            targets.push(target);
        target = new Target(category_x, category_y, target_width, target_height, "Mushrooms",66, colour);
            targets.push(target);
        target = new Target(category_x, category_y, target_width, target_height, "Red Beet",75, colour);
        targets.push(target);
        target = new Target(category_x, category_y, target_width, target_height, "Yellow Onion",67, colour);
        targets.push(target);
        target = new Target(category_x, category_y, target_width, target_height, "Red Potato",73, colour);
            targets.push(target);
        target = new Target(category_x, category_y, target_width, target_height, "Sweet Potato",74, colour);
            targets.push(target);
        target = new Target(category_x, category_y, target_width, target_height, "White Potato",72, colour);
            targets.push(target);
        }

        //Sumos
        if(category_number==7){
        target = new Target(category_x, category_y, target_width, target_height, "Apple Juice",28, colour);
            targets.push(target);
        target = new Target(category_x, category_y, target_width, target_height, "Cherry Juice",34, colour);
            targets.push(target);
        target = new Target(category_x, category_y, target_width, target_height, "Fresh Juice",33, colour);
            targets.push(target);
        target = new Target(category_x, category_y, target_width, target_height, "Mandarin Juice",36, colour);
        targets.push(target);
        target = new Target(category_x, category_y, target_width, target_height, "Mango Juice",31, colour);
        targets.push(target);
        target = new Target(category_x, category_y, target_width, target_height, "Orange Juice",29, colour);
            targets.push(target);
        target = new Target(category_x, category_y, target_width, target_height, "Peach Juice",32, colour);
            targets.push(target);
        target = new Target(category_x, category_y, target_width, target_height, "Pear Juice",30, colour);
            targets.push(target);
        target = new Target(category_x, category_y, target_width, target_height, "Smoothie",35, colour);
        targets.push(target);
        }

        //Leite
        if(category_number==8){
            target = new Target(category_x, category_y, target_width, target_height, "Bio Fat Milk",37, colour);
            targets.push(target);
            target = new Target(category_x, category_y, target_width, target_height,"Bio Milk" ,42, colour);
                targets.push(target);
            target = new Target(category_x, category_y, target_width, target_height, "Bio Skim Milk",41, colour);
                targets.push(target);
            target = new Target(category_x, category_y, target_width, target_height, "Bio Soy Milk",50, colour);
            targets.push(target);
            target = new Target(category_x, category_y, target_width, target_height, "Fat Milk",39, colour);
            targets.push(target);
            target = new Target(category_x, category_y, target_width, target_height, "Oat Milk",44, colour);
                targets.push(target);
            target = new Target(category_x, category_y, target_width, target_height, "Sour Milk",47, colour);
                targets.push(target);
            target = new Target(category_x, category_y, target_width, target_height, "Soy Milk",51, colour);
                targets.push(target);
            target = new Target(category_x, category_y, target_width, target_height, "Standard Milk",40, colour);
            targets.push(target);
            target = new Target(category_x, category_y, target_width, target_height, "0% Milk",38, colour);
            targets.push(target);
        }
        
        //Iogurte
        if(category_number==9){
        target = new Target(category_x, category_y, target_width, target_height, "Bio Cream",45, colour);
            targets.push(target);
        target = new Target(category_x, category_y, target_width, target_height, "Bio Soyghurt",48, colour);
            targets.push(target);
        target = new Target(category_x, category_y, target_width, target_height, "Oatghurt",43, colour);
            targets.push(target);
        target = new Target(category_x, category_y, target_width, target_height, "Sour Cream",46, colour);
        targets.push(target);
        target = new Target(category_x, category_y, target_width, target_height, "Yogurth",54, colour);
        targets.push(target);
        target = new Target(category_x, category_y, target_width, target_height, "0% Yogurth",53, colour);
            targets.push(target);
        target = new Target(category_x, category_y, target_width, target_height, "Cherry Yogurth",52, colour);
            targets.push(target);
        target = new Target(category_x, category_y, target_width, target_height, "Mango Yogurth",55, colour);
            targets.push(target);
        target = new Target(category_x, category_y, target_width, target_height, "Pear Yogurth",56, colour);
        targets.push(target);
        target = new Target(category_x, category_y, target_width, target_height, "Vanilla Yogurth",57, colour);
        targets.push(target);
        target = new Target(category_x, category_y, target_width, target_height, "Soygurth",49, colour);
        targets.push(target);
        }  

    }


    draw()
    {  
        let targets = [];
        this.createTargets(targets,this.t_width, this.t_height, this.x, this.y, this.number)

        for (i=0; i<targets.length(); i++){  //Imprime os targets todos (da categoria)
            targets[i].draw();
        }
      
        this.img.resize(this.radius, this.radius); // so image fits circle

        // Draw category circle
        //let mask1 = createGraphics(this.radius, this.radius);
        //mask1.circle(this.radius%2, this.radius%2, this.radius - 10);
        //this.img.mask(mask1);
        image(this.img, this.x , this.y);
       
        // Draw label
        textFont('Roboto', 32);
        fill(color(0,0,0));
        textStyle(BOLD);
        text(this.label, this.x+this.radius*0.5, this.y + this.radius*1.2);
        textAlign(CENTER);
    }
}