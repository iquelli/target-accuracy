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
    }

    draw()
    {
        this.img.resize(this.radius, this.radius); // so image fits circle

        // Draw category circle
        //const mask1 = createGraphics(this.radius, this.radius);
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