// Target class (position and width)

class Target
{
  constructor(x, y, w, h, l, id, colour, c)
  {
    this.x      = x;
    this.y      = y;
    this.width  = w;
    this.height = h;
    this.label  = l;
    this.id     = id;
    this.colour = colour;
    this.category = c; // 0 se for 0, 1 se for A, 2 se for B, etc
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
    rect(this.x-this.width/2, this.y-this.height/2, this.width, this.height, 20);
    
    // Draw label
    textFont("Helvetica", 13);
    fill(color(0)); //a preto ve-se melhor
    textAlign(CENTER, CENTER);
    text(this.label, this.x, this.y);
  }
}