class Target
{
  constructor(x, y, w, h, l, id, colour, c, img)
  {
    this.x      = x;
    this.y      = y;
    this.width  = w;
    this.height = h;
    this.label  = l;
    this.id     = id;
    this.colour = colour;
    this.category = c; // 0 se for 0, 1 se for A, 2 se for B, etc
    this.img = img;
  }
  
  // Checks if a mouse click took place
  // within the target
  clicked(mouse_x, mouse_y)
  {
    return dist(this.x, this.y, mouse_x, mouse_y) < this.width / 2;
  }
  
  // Draws the target (i.e., a circle)
  // and its label
  draw()
  {
    // Draw target
    fill(this.colour);             
    rect(this.x-this.width/2, this.y-this.height/2, this.width, this.height, 40);
    
    this.img.resize(this.height*0.90, this.height*0.90)
    image(this.img, this.x-(this.width/4) , this.y-this.height*0.95);
    
    // Draw label
    textFont("Helvetica", 18);
    fill(color(0)); //a preto ve-se melhor
    textAlign(CENTER, TOP);
    text(this.label, this.x, this.y);
  }
}