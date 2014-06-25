/*
 * This class is a model of a single coordinate
 * in 2d space. It also may be treated as a
 * mathematical 2d vector.
 */
function Point(x, y)
{
    this.x = x || 0;
    this.y = y || 0;
};

/*
 * Given points 'a' and 'b', return a new Point
 * from the sum.
 */
Point.Add = function(a, b) {
    return new Point(a.x + b.x, a.y + b.y);
}

/*
 * Given points 'a' and 'b', return a new Point
 * from the difference.
 */
Point.Subtract = function(a, b) {
    return new Point(a.x - b.x, a.y - b.y);
};

/*
 * Return the Dot Product of the following two
 * vectors.
 */
Point.DotProduct = function(a, b)
{
    return ((a.x * b.x) + (a.y * b.y));
};

/*
 * Return the Cross Product of the following
 * two vectors.
 */
Point.CrossProduct = function(a, b)
{
    return ((a.x * b.y) - (a.y * b.x));
};

/*
 * Return the distance (magnitude) of the vector
 * from the origin.
 *
 * Be aware that this method uses an inefficient
 * trig function, and should be used sparingly.
 */
Point.Magnitude = function(p) {
    return Math.sqrt((v.x * v.x) + (v.y * v.y));
};

/*
 * Return the normal along a given vector.
 */
Point.Normal = function(p) {
    mag = Point.Magnitude(p);
    return new Point(p.x / mag, p.y / mag );
};

/*
 * Returns a vector that is perpendicular in a
 * clockwise orientation.
 */
Point.PerpendicularCW = function(p) {
    return new Point(-p.y, p.x);
};

/*
 * Returns a vector that is perpendicular in a
 * CCW orientation.
 */
Point.PerpendicularCCW = function(p) {
    return new Point(p.y, -p.x);
};
