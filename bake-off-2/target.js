// Target class (position and width)

class Target
{
  constructor(x, y, w, h, l, id)
  {
    this.x      = x;
    this.y      = y;
    this.width  = w;
    this.height = h;
    this.label  = l;
    this.id     = id; 
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
    fill(color(155,155,155));                 
    rect(this.x, this.y, this.width, this.height, round_edge);
    
    // Draw label
    textFont('Roboto', 12);
    fill(color(0,0,0));
    textAlign(CENTER);
    text(this.label, this.x, this.y);
  }
}