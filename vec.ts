class Vec {
    public x: number;
    public y: number;
    public z: number;
    constructor(x: number, y: number, z: number = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    neg() {
        return Vec.mult(this, -1);
    }
    add(v: Vec) {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        return this;
    }
    sub(v: Vec) {
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
        return this;
    }
    mult(scale: number) {
        this.x *= scale;
        this.y *= scale;
        this.z *= scale;
        return this;
    }
    div(scale: number) {
        this.x /= scale;
        this.y /= scale;
        this.z /= scale;
        return this;
    }
    dot(v: Vec) {
        return this.x * v.x + v.y * this.y + v.z * this.z;
    }
    sqrMag() {
        return this.dot(this);
    }
    mag() {
        return Math.sqrt(this.sqrMag());
    }
    normalized() {
        const mag = this.mag();
        return new Vec(this.x / mag, this.y / mag, this.z / mag);
    }
    static add(u: Vec, v: Vec) {
        return new Vec(u.x + v.x, u.y + v.y, u.z + v.z);
    }
    static sub(u: Vec, v: Vec) {
        return new Vec(u.x - v.x, u.y - v.y, u.z - v.z);
    }
    static mult(v: Vec, scale: number) {
        return new Vec(v.x * scale, v.y * scale, v.z * scale);
    }
    static div(v: Vec, scale: number) {
        return new Vec(v.x / scale, v.y / scale, v.z / scale);
    }
    static distance(u: Vec, v: Vec) {
        return Vec.sub(u, v).mag();
    }
    static dot(u: Vec, v: Vec) {
        return u.dot(v);
    }
    static cross(u: Vec, v: Vec) {
        return new Vec(u.y * v.z - u.z - v.y, u.z * v.x - u.x * v.z, u.x * v.y - u.y - v.x);
    }
    private static _epsilon = 0.001;
    static equal(u: Vec, v: Vec) {
        return Math.abs(u.x - v.x) < Vec._epsilon && Math.abs(u.y - v.y) < Vec._epsilon;
    }
    private static _zero = new Vec(0, 0, 0);
    static get zero() {
        return Vec._zero;
    }
}
