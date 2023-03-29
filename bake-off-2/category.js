// Category Class 

class Category
{
    constructor(x, y, r, l, t, tgts)
    {
        this.x = x;
        this.y = y;
        this.radius = r;
        this.label = l;
        this.type = t;  // to know whether to draw it as selected or as unselected circle
        this.targets = tgts;
    }

    // Checks if a mouse click took place
    // within the category
    clicked(mouse_x, mouse_y)
    {
        return dist(this.x, this.y, mouse_x, mouse_y) < this.radius / 2;
    }

    draw()
    {
        switch (this.type)
        {
            case 1:  // not selected
                // Draw category circle
                fill(color(125));
                circle(this.x, this.y, this.radius);
       
                // Draw label
                textFont('Roboto', 40);
                fill(color(255,255,255));
                textAlign(CENTER, CENTER);
                text(this.label, this.x, this.y);
                break;
            
            case 2:  // selected
                fill(color(164, 243, 248));
                circle(this.x, this.y, this.radius);

                // Draw label
                textFont('Roboto', 70);
                fill(color(255,255,255));
                textAlign(CENTER, CENTER);
                text(this.label, this.x, this.y);
                
                // Draws the targets
                this.targets.forEach((target) => target.draw());
                break;
        }
    }

    changeType(t) 
    {
        this.type = t;
    }
}