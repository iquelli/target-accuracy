// Category Class 

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
        mask1.circle(this.radius%2, this.radius%2, this.radius);
        this.img.mask(mask1);
        image(img, this.x, this.y);
       
        // Draw label
        textFont('Roboto', 12);
        fill(color(0,0,0));
        textStyle(BOLD);
        textAlign(CENTER, BOTTOM);
        text(this.label, this.x, this.y);
    }
}