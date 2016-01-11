/** 
 * Transit Method
 * A visauzliation of an exosolar planet "transiting" a distant star
 * and a similated light curve which shows the brightness of that star
 * as the planet passes between us (Earth) and it's parent star.
 * 
 * Some Assumptions:
 * - The planet's orbit is perfectly circular
 * - The Star's intensity is uniform across it's apparent "disc" (In reality,
 *   because the star is spherical it's apparent brightness is greater
 *   toward the center of it's "disc")
 * - The Star's intensity does not fluxtuate
 * - There are no other light sources (and we don't count the light reflecting
 *   off the planet)
 *
 * Configuration - feel free to modify these values.
 * @param {int} STAR_DIAMETER - the diameter of the star
 * @param {int} PLANET_DIAMETER - the diameter of the planet
 * @param {int} AXIS_MAGNIFICATION - the "zoom" on the y-axis
 * @param {int} RATE - how fast the animation should run
 */
var STAR_DIAMETER = 100;
var PLANET_DIAMETER = 20;
var AXIS_MAGNIFICATION = 1;
var RATE = 2000;

/** These values below should probably not be changed. */
var AXIS_COLOR = color(217, 217, 217);
var Y_AXIS_TOP = 275;
var Y_AXIS_BOTTOM = 380;

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
        line(30, 250, 30, Y_AXIS_BOTTOM);
        triangle(27, 250, 30, 243, 33, 250);
        
        /** Put a tick mark at 100%. */
        text('1.00', 2, 279);
        line(27, 275, 30, 275);
        
        /** Put another tick mark one-third of the way down. */
        var heightOfAxis = Y_AXIS_BOTTOM - Y_AXIS_TOP;
        var thirdDown = heightOfAxis/3 + Y_AXIS_TOP;
        line(27, thirdDown, 30, thirdDown);
        var thirdDownAmount = 1 - (1/3)/AXIS_MAGNIFICATION;
        text(thirdDownAmount.toFixed(2), 2, thirdDown + 4);
        
        /** Put another tick mark two-thirds of the way down. */
        var twoThirdsDown = 2*heightOfAxis/3 + Y_AXIS_TOP;
        line(27, twoThirdsDown, 30, twoThirdsDown);
        var twoThirdsDownAmount = 1 - (2/3)/AXIS_MAGNIFICATION;
        text(twoThirdsDownAmount.toFixed(2), 2, twoThirdsDown + 4);
    };

    /** Draw the x-axis of the Light Curve. */
    self.xAxis = function() {
        strokeWeight(1);
        fill(AXIS_COLOR);
        stroke(AXIS_COLOR);
        line(30, Y_AXIS_BOTTOM, 350, Y_AXIS_BOTTOM);
        triangle(350, Y_AXIS_BOTTOM-3, 357, Y_AXIS_BOTTOM, 350, Y_AXIS_BOTTOM+3);
        text('Time', 175, Y_AXIS_BOTTOM + 13);
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
        self.D = STAR_DIAMETER;
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
        self.D = PLANET_DIAMETER;
        fill(self.color);
        ellipse(self.x, self.y, self.D, self.D);
    };
    
    /**
     * Illuminate the planet based on it's orbital position.
     * @param {float} degrees - the oribital position of the planet
     */
    self.illuminate = function(degrees) {
        noStroke();
        var illuminatedColor = color(136, 212, 235);
        fill(illuminatedColor);
        
        /** 
         * If the planet is on the "right" of the star, illuminate the left
         * side of the planet (and vice-versa).
         */
        if ( degrees < 90 || degrees > 270) {
            arc(self.x,self.y, self.D, self.D, -90, 90);
        } else {
            arc(self.x,self.y, self.D, self.D, 90, 270);
        }

        if (degrees >= 180) {
            fill(illuminatedColor);
        } else {
            fill(self.color);
        }

        /**
         * Drawing an "arc" is not sufficient to show an accurately illuminated
         * planet; we also need to cover the planet with an ellipse. That
         * ellipse is dark on the near side of the star, and "bright" on the
         * far side of the star.
         */
        var coverEllipsePercent = 1 - abs(degrees % 180 - 90)/90;
        ellipse(self.x, self.y, coverEllipsePercent*self.D, self.D);
    };
};


/** The distance formula */
var distanceFormula = function(x1, y1, x2, y2) {
    return sqrt(sq(x1 - x2) + sq(y1 - y2));
};

/** Area of a circle */
var circleArea = function(r) {
    return sq(r)*Math.PI;
};

/**
 * The light curve plot shown at the bottom of the field.
 */
var LightCurve = function() {
    var self = this;
    self.ymax = Y_AXIS_TOP;
    self.ymin = Y_AXIS_BOTTOM;
    self.xmin = 32;
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
        stroke(46, 41, 138);
        point(self.x, self.y);

        /** Draw the "current" position with a lighter point. */
        stroke(255, 255, 255);
        self.y = self.getY(S, P, x);
        self.x = ((x/4 % 360))/(1.2) + self.xmin;
        point(self.x, self.y);
    };
    
    /** 
     * For a given Star and Planet configuration, determine the correct y-value
     * for this light curve. 
     * @param {Object} S - a Star instance.
     * @param {Object} P - a Planet instance.
     * @param {int} x - the current x-value of the Light Curve.
     */
    self.getY = function(S, P, x) {
        var maxLight = circleArea(S.D/2);
        var percentLight;
        if (x % 360 > 180) {
            /**
             * If the planet is on the far side of the star, it isn't blocking
             * any light.
             */
            var percentLight = 0;
        } else {
            var lightBlocked = self.areaOfIntersection(S, P);
            var percentLight = lightBlocked / maxLight;
        }
        return AXIS_MAGNIFICATION*percentLight*(self.ymin-self.ymax) + self.ymax;
    };
    
    /** 
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
        var d = distanceFormula(S.x, S.y, P.x, P.y);
        
        if ((Rs + Rp) < d) {
            return 0;
        } else if ((d + Rp) < Rs) {
            return circleArea(Rp);
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


/** 
 * Initiate the animation by creating new instanecs of the Field, 
 * Star, Planet and LightCurve.
 */
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
