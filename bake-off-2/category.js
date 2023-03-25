// Category Class 

class Category
{
    constructor(x, y, r, i, l, t)
    {
        this.x = x;
        this.y = y;
        this.radius = r;
        this.label = l;
        this.type = t;  // to know whether to draw it as selected or as unselected circle
    }

    // Checks if a mouse click took place
    // within the category
    clicked(mouse_x, mouse_y)
    {
        return dist(this.x, this.y, mouse_x, mouse_y) < this.radius / 2;
    }

    draw()
    {
        switch (t)
        {
            case 1:  // not selected
                // Draw category circle
                fill(color(155,155,155));
                circle(this.x, this.y, this.radius);
       
                // Draw label
                textFont('Roboto', 32);
                fill(color(255,255,255));
                textAlign(CENTER);
                text(this.label, this.x, this.y);
            
            case 2:  // selected
                fill(color(164, 243, 248));
                circle(this.x, this.y, this.radius + 10);

                // Draw label
                textFont('Roboto', 46);
                fill(color(255,255,255));
                textAlign(CENTER);
                text(this.label, this.x, this.y);
        }
    }

    changeType(t) 
    {
        this.type = t;
    }
}