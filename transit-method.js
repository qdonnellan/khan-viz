/** 
 *  Transit Method
 *  A visauzliation of an exosolar planet "transiting" a distant star
 *  and a similated light curve which shows the broghtness of that star
 *  as the planet passes between us (Earth) and it's parent star.
 */
var STAR_DIAMETER = 200;
var PLANET_DIAMETER = 50;

var RATE = 1000;

var AXIS_COLOR = color(255, 255, 255);


/**
 * Field is the background of the animation.
 */
var Field = function() {
    var self = this;

    /** Draws the starting background. Only call this once. */
    self.drawOnce = function() {
        background(0,0,0);
        self.yAxis();
        self.xAxis();
    };

    /** Draw repaints part of the field to cover up old animations. */
    self.draw = function() {
        fill(0, 0, 0);
        stroke(0,0,0);
        strokeWeight(0);
        rect(0,0,400,200);
    };

    /** Draw the y-axis of the Light Curve. */
    self.yAxis = function() {
        strokeWeight(1);
        fill(AXIS_COLOR);
        stroke(AXIS_COLOR);
        line(30, 250, 30, 375);
        triangle(27, 250, 30, 243, 33, 250);
        pushMatrix();
        rotate(-90);
        translate(-340,-475);
        text('Intensity', 0, 500);
        popMatrix();
    };

    /** Draw the x-axis of the Light Curve. */
    self.xAxis = function() {
        strokeWeight(1);
        fill(AXIS_COLOR);
        stroke(AXIS_COLOR);
        line(30, 375, 350, 375);
        triangle(350, 372, 357, 375, 350, 379);
        text('Time', 175, 390);
    };
        


};


/**
 * The Star shown in the animation.
 */
var Star = function() {
    var self = this;

    self.x = 200;
    self.y = 100;
    self.D = STAR_DIAMETER;
    self.color = color(255, 255, 240);
    
    /** Draw the Star on the plane as part of the animation. */
    self.draw = function() {
        fill(self.color);
        noStroke();
        ellipse(self.x, self.y, self.D, self.D);
    };
};


/** The Planet shows in the animation.
 *
 */
var Planet = function() {
    var self = this;
    
    self.x = 50;
    self.y = 100;
    self.D = PLANET_DIAMETER;
    self.color = color(10, 13, 46);
    
    /** Draw this planet as part of the animation. */
    self.draw = function() {
        noStroke();
        fill(self.color);
        ellipse(self.x, self.y, self.D, self.D);
    };
    
    /**
     * Illuminate the planet based on it's orbital position.
     * @param {float} degrees - the oribital position of the planet
     */
    self.illuminate = function(degrees) {
        noStroke();
        var illuminated_color = color(136, 212, 235);
        fill(illuminated_color);
        
        /** 
         * If the planet is on the "right" of the star, illuminate the left
         * side of the planet (and vice-versa).
         */
        if ( degrees < 90 || degrees > 270) {
            arc(self.x,self.y, self.size, self.size, -90, 90);
        } else {
            arc(self.x,self.y, self.size, self.size, 90, 270);
        }

        if (degrees >= 180) {
            fill(illuminated_color);
        } else {
            fill(self.color);
        }

        /**
         * Drawing an "arc" is not sufficient to show an accurately illuminated
         * planet; we also need to cover the planet with an ellipse. That
         * ellipse is dark on the near side of the star, and "bright" on the
         * far side of the star.
         */
        var cover_ellipse_percent = 1 - abs(degrees % 180 - 90)/90;
        ellipse(self.x, self.y, cover_ellipse_percent*self.size, self.size);
    };
};

/**
 * The light curve plot shown at the bottom of the field.
 */
var LightCurve = function() {
    var self = this;
    self.ymax = 275;
    self.xmin = 31;
    self.x = self.xmin;
    self.y = self.ymax;
    
    /** 
     * Plot a point on the light curve. 
     * @param {Object} S - a Star instance.
     * @param {Object} P - a Planet instance.
     * @param {int} x - the current x-value of the Light Curve.
     */
    self.plot = function(S, P, x) {
        strokeWeight(1);
        
        /** Cover up previous position with a dark point. */
        stroke(28, 18, 168);
        point(self.x, self.y);

        /** Draw the "current" position with a lighter point. */
        stroke(255, 255, 255);
        self.y = self.getY(S, P, x);
        self.x = x/6 + self.xmin;
        point(self.x, self.y);
    };
    
    /** 
     * For a given Star and Planet configuration, determine the correct y-value
     * for this light curve. 
     * @param {Object} S - a Star instance.
     * @param {Object} P - a Planet instance.
     * @param {int} x - the current x-value of the Light Curve.
     */)
    self.getY = function(S, P, x) {
        var maxLight = Math.PI*pow(S.D/2, 2);
        var percentLight;
        if (x % 360 > 180) {
            /**
             * If the planet is on the far side of the star, it isn't blocking
             * any light.
             */
            var percentLight = 1;
        } else {
            var lightBlocked = self.areaOfIntersection(S, P);
            var percentLight = (maxLight + lightBlocked) / maxLight;
        }
        return percent_light*self.ymax;
    };
    
    /* 
     * Determine the apparent intersections of the Planet's and Star's discs, 
     * based on their current positions and sizes.
     * Uses this method: 
     *     http://mathworld.wolfram.com/Circle-CircleIntersection.html
     *
     * @param {Object} S - a Star instance.
     * @param {Object} P - a Planet instance.
     */
    self.areaOfIntersection = function(S, P) {
        var Rs = S.D/2;
        var Rp = P.D/2;
        
        /** The distance between the centers. */
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


/** Initiate the animation. */
var field = new Field();
var star = new Star(); 
var planet = new Planet();
var light_curve = new LightCurve();

field.drawOnce();
frameRate(RATE);
var step = 0;

/** Animate! */
draw = function() {
    planet.x = (200-planet.D/2)*sin(step - 90) + 200;
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
    
    light_curve.plot(star, planet, step);
    step += 0.5;
}; 
