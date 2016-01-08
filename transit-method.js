// Settings.
var STAR_SIZE = 100;
var PLANET_SIZE = 20;
var RATE = 100;

var Field = function() {
    this.draw_once = function() {
        background(0,0,0);
        strokeWeight(2);
        fill(255, 255, 255);
        text('Light Curve', 10, 220);
        fill(153, 153, 153);
        text('Amount of light reaching us as we look at the star', 10, 235);
    };

    this.draw = function() {
        // The background.
        fill(0, 0, 0);
        stroke(0,0,0);
        strokeWeight(0);
        rect(0,0,400,200);
    };
};

var Star = function() {
    var self = this;
    self.x = 200;
    self.y = 100;
    self.size = STAR_SIZE;
    self.color = color(255, 255, 240);
    
    this.draw = function() {
        fill(self.color);
        noStroke();
        ellipse(self.x,self.y,self.size,self.size);
    };
};

var Planet = function() {
    var self = this;
    self.color = color(10, 13, 46);
    
    self.x = 50;
    self.y = 100;
    self.size = PLANET_SIZE;
    
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
        var illuminated_color = color(136, 212, 235);
        fill(illuminated_color);
        
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
            fill(illuminated_color);
        } else {
            fill(self.color);
        }
        var cover_ellipse_percent = 1 - abs(degrees % 180 - 90)/90;
        ellipse(self.x, self.y, cover_ellipse_percent*self.size, self.size);
    };
};


var LightCurve = function() {
    var self = this;
    self.ymax = 250;
    self.x = 0;
    self.y = self.ymax;
    
    self.plot_point = function(S, P, x) {
        strokeWeight(1);
        // First, paint the "old y" a different color
        stroke(28, 18, 168);
        point(self.x, self.y);
        
        // Now get a new point and paint it the "focus" color
        self.y = self.get_y_value(S, P, x);
        self.x = x/6;
        
        stroke(255, 255, 255);
        point(self.x, self.y);
    };
    
    self.get_y_value = function(S, P, x) {
        // For a given "x" value, return a "y" value.
        var max_light = Math.PI*pow(S.size/2, 2);
        var percent_light;
        if (x % 360 > 180) {
            var percent_light = 1;
        } else {
            var light_blocked = self.area_of_intersection(S, P);
            var percent_light = (max_light + light_blocked) / max_light;
        }
        return percent_light*self.ymax;
    };
    
    self.area_of_intersection = function(S, P) {
        // Find the total area of intersection between a Star (S) and a Planet (P).
        var Rs = S.size/2;
        var Rp = P.size/2;
        
        // The distance between the centers.
        var d = sqrt(sq(S.x - P.x) + sq(S.y - P.y));
        
        if ((Rs + Rp) < d) {
            return 0;
        } else if ((d + Rp) < Rs) {
            return sq(Rp)*Math.PI;
        } else {
            angleMode = 'radians';
            var arg1 = sq(Rp)*acos((sq(d)+sq(Rp)-sq(Rs))/(2*d*Rp));
            var arg2 = sq(Rs)*acos((sq(d)+sq(Rs)-sq(Rp))/(2*d*Rs));
            var arg3 = sqrt((Rp+Rs-d)*(d+Rp-Rs)*(d+Rs-Rp)*(d+Rp+Rs))/2;
            angleMode = 'degrees';
            return arg1 + arg2 - arg3;
        }
        
    };
    
    

};


var field = new Field();
field.draw_once();

var star = new Star(); 
var planet = new Planet();
var light_curve = new LightCurve();

frameRate(RATE);
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
    
    light_curve.plot_point(star, planet, step);
    step += 0.5;
}; 
