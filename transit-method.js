var setUp = function() {
    background(0,0,0);
    stroke(50, 50, 50);
    strokeWeight(1);
    line(0,200,400,200);
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
    
    self.illuminate = function(percent) {
        noStroke();
        fill(255, 255, 255);
        
        var illuminated_size;
        arc(self.x,self.y, self.size, self.size, -90, 90);
        
        // Cover up arch
        if (percent > 50) {
            fill(255, 255, 255);
            illuminated_size = ((percent-50)/100)*self.size;
        } else {
            fill(self.color);
            illuminated_size = ((50-percent)/50)*self.size;
        }
        ellipse(self.x, self.y, illuminated_size, self.size);
    };
    
};


setUp();

var star = new Star();
var planet = new Planet();

frameRate(100);
var n = 0;

draw = function() {
    var animation_percent = n % 100;
    planet.illuminate(animation_percent);
    n += 1;
};




