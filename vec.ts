class Vec {
    public x: number;
    public y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
    neg() {
        return Vec.mult(this, -1);
    }
    add(v: Vec) {
        this.x += v.x;
        this.y += v.y;
        return this;
    }
    sub(v: Vec) {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    }
    mult(scale: number) {
        this.x *= scale;
        this.y *= scale;
        return this;
    }
    div(scale: number) {
        this.x /= scale;
        this.y /= scale;
        return this;
    }
    dot(v: Vec) {
        return (v.x * this.x) + (v.y * this.y);
    }
    sqrMag() {
        return this.dot(this);
    }
    mag() {
        return Math.sqrt(this.sqrMag());
    }
    normalized() {
        const mag = this.mag();
        return new Vec(this.x / mag, this.y / mag);
    }
    static add(u: Vec, v: Vec) {
        return new Vec(u.x + v.x, u.y + v.y);
    }
    static sub(u: Vec, v: Vec) {
        return new Vec(u.x - v.x, u.y - v.y);
    }
    static mult(v: Vec, scale: number) {
        return new Vec(v.x * scale, v.y * scale);
    }
    static div(v: Vec, scale: number) {
        return new Vec(v.x / scale, v.y / scale);
    }
    static dist(u: Vec, v: Vec) {
        return Vec.sub(u, v).mag();
    }
    static sqrDist(u: Vec, v: Vec) {
        return Vec.sub(u, v).sqrMag();
    }
    static dot(u: Vec, v: Vec) {
        return u.dot(v);
    }
    static cross(u: Vec, v: Vec) {
        return u.x * v.y - u.y * v.x
    }
}
