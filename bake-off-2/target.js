// Target class (position and width)
class Target
{
  constructor(x, y, w, h, l, id, colour)//ACRESCETEI COR E ALTURA DO ALVO
  {
    this.x      = x;
    this.y      = y;
    this.width  = w;
    this.height = h;
    this.label  = l;
    this.id     = id;
    this.colour = colour
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
    // Draw target --MUDEI DE CIRCULO PRA RETANGULO E AJUSTEI A POSICAO
    fill(this.colour);             
    rect(this.x-this.width/2, this.y-this.height/2, this.width, this.height, 20); //20-> round edges
    
    // Draw label
    textFont("Arial", 12);
    fill(color(255,255,255));
    textAlign(CENTER, CENTER); //CENTREI ISTO
    text(this.label, this.x, this.y);
  }
}