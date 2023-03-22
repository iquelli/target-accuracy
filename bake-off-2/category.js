// Category Class 

// TODO adicionar método para adicionar target
class Category
{
    constructor(x, y, r, i, l)
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
        let mask1 = createGraphics(this.radius, this.radius);
        mask1.circle(this.radius%2, this.radius%2, this.radius - 10);
        this.img.mask(mask1);
        image(this.img, this.x, this.y);
       
        // Draw label
        textFont('Roboto', 32);
        fill(color(0,0,0));
        textStyle(BOLD);
        text(this.label, this.x, this.y + this.y%2 + this.y%3);
    }
}