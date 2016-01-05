var Field = function() {
    this.draw = function() {
        // The background.
        background(0,0,0);
    
        // Dividing line between star and light curve.
        stroke(50, 50, 50);
        strokeWeight(1);
        line(0,200,400,200);
    };
};

var Star = function() {
    this.draw = function() {
        fill(255, 240, 194);
        noStroke();
        ellipse(200,100,150,150);
    };
};

var Planet = function() {
    var self = this;
    self.color = color(255, 0, 0);
    
    self.x = 50;
    self.y = 100;
    self.size = 20;
    
    self.draw = function() {
        noStroke();
        fill(self.color);
        ellipse(self.x, self.y, self.size, self.size);
    };
    
    self.illuminate = function(degrees) {
        // Illuminate the planet based on it's orbital position
        // 0 degrees = far left side of star; 
        // 180 degrees = far right side of star;
        noStroke();
        fill(255, 255, 255);
        
        if ( degrees < 90 || degrees > 270) {
            // Illuminate the right half of the planet when the planet
            // is on the left side of the star.
            arc(self.x,self.y, self.size, self.size, -90, 90);
        } else {
            // Illuminate the left half of the planet when the planet
            // is on the right side of the star.
            arc(self.x,self.y, self.size, self.size, 90, 270);
        }

        if (degrees >= 180) {
            fill(255, 255, 255);
            
        } else {
            fill(self.color);
            
        }
        var cover_ellipse_percent = 1 - abs(degrees % 180 - 90)/90;
        ellipse(self.x, self.y, cover_ellipse_percent*self.size, self.size);

    };
    
};


var field = new Field();
field.draw();

var star = new Star(); 
var planet = new Planet();
planet.draw();


frameRate(100);
var step = 0 ;

draw = function() {
    planet.x = (200-planet.size/2)*sin(step - 90) + 200;
    field.draw();
    if (step % 360 > 180) {
        planet.draw();
        planet.illuminate(step % 360);
        star.draw();
    } else {
        star.draw();
        planet.draw();
        planet.illuminate(step % 360);
    }
    
    step += 1;
    
    
};

