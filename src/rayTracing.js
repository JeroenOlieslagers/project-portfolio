import React from 'react';
import {Vector} from './components/utils'
import {Paper} from '@material-ui/core';

export default class RayTracing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      refractiveIndex: 1.33,
      shootDelay: 300
    };
    this.source = new Vector(null, null);
    this.view = new Vector(null, null);
    this.addMode = false;
    this.objects = [];
    this.normals = [];
    this.frame_on = true;
    this.dist = 0;
    this.recursionDepth = 3;
    this.numberOfRays = 0;
    this.refraction = true;
    this.showNormals = false;
    this.popped = false;
    this.polyDraw = false;
    this.addedFirstVertex = false;
    this.multiRayMode = false;
    this.polyRadius = 50;
    this.polyN = 8;
    this.polyAngle = 0;
    this.multiRayN = 12;
    this.shootMode = false;
  }

  componentDidMount() {
    this.cvs = document.getElementById('canvas');
    this.ctx = this.cvs.getContext('2d');

    this.frame = [new Vector(0, 0), new Vector(0, this.cvs.height),
      new Vector(this.cvs.width, this.cvs.height), new Vector(this.cvs.width, 0)];
    this.frame_normals = [new Vector(1, 0), new Vector(0, 1),
      new Vector(-1, 0), new Vector(0, -1)];

    this.cvs.addEventListener("mousedown", this.clicked);
    this.cvs.addEventListener("mousemove", this.onMouseMove);
    document.addEventListener("keydown", this.addObject);
    document.addEventListener('wheel', this.onScroll);

    this.recursionDepthText = document.getElementById('recursionDepth');
    this.objectsText = document.getElementById('objects');
    this.edgesText = document.getElementById('edges');
    this.frameText = document.getElementById('frame');
    this.raysText = document.getElementById('rays');
    this.refractionText = document.getElementById('refraction');
    this.normalsText = document.getElementById('normals');
    this.polyDrawText = document.getElementById('polyDraw');
    this.multiRayText = document.getElementById('multiRay');
    this.shootModeText = document.getElementById('shootMode');

    this.recursionDepthText.innerHTML = "Recursion depth: " + this.recursionDepth.toString();
    this.objectsText.innerHTML = "Number of objects: " + this.objects.length.toString();
    this.edgesText.innerHTML = "Number of edges: " + this.normals.length.toString();
    this.frameText.innerHTML = "Frame (F): " + (this.frame_on ? "On" : "Off");
    this.raysText.innerHTML = "Number of rays: " + this.numberOfRays.toString();
    this.refractionText.innerHTML = "Refraction (T): " + (this.refraction ? "On" : "Off");
    this.normalsText.innerHTML = "Surface normals (S): " + (this.showNormals ? "On" : "Off");
    this.polyDrawText.innerHTML = "Polygon draw mode (P): " + (this.polyDraw ?
      "On (N="+this.polyN.toString()+", R="+this.polyRadius.toString()+", " +
      "θ="+(this.round((this.polyAngle*(180/Math.PI)%360), 3)).toString()+"°)"  : "Off");
    this.multiRayText.innerHTML = "Multi-ray mode (M): " + (this.multiRayMode ? "On (N:"+this.multiRayN.toString()+")" : "Off");
    this.shootModeText.innerHTML = "Shoot mode (Q): " + (this.shootMode ? "On" : "Off");
  }

  calculateIntersect(a, b, c, d){
    let p = b.vMinus(a);
    let q = c.vMinus(a);
    let r = d.vMinus(c);

    let mu = this.round((p.y*q.x - p.x*q.y) / (p.x*r.y - p.y*r.x), 5);
    let lambda = 0;
    if (p.y === 0) {
      lambda = this.round((q.x + r.x*mu) / p.x, 5);
    }
    else{
      lambda = this.round((q.y + r.y*mu) / p.y, 5);
    }
    if (mu <= 1 && mu >= 0 && lambda > 0) {
      return c.vPlus(r.mult(mu))
    }
  }

  round(x, d) {
    return Math.round(x*Math.pow(10, d))/Math.pow(10, d);
  }



  reflect(a, b){
    return a.vMinus(b.mult(2*a.dot(b)))
  }

  refract(a, b, n){
    a.normalise();

    let cosi = Math.min(Math.max(a.dot(b), -1), 1);
    let etai = 1;
    let etat = n;
    let N = b;
    if (cosi < 0){
      cosi = -cosi;
    }
    else {
      let temp = etai;
      etai = etat;
      etat = temp;
      N = b.mult(-1);
    }
    let eta = etai / etat;
    let k = 1 - (eta * eta) * (1 - (cosi * cosi));
    if (k <= 0){
      return new Vector(0, 0)
    }
    else {
      return a.mult(eta).vPlus(N.mult((eta * cosi) - Math.sqrt(k)))
    }
  }

  drawLine(a, b){
    this.ctx.beginPath();
    this.ctx.moveTo(...a.p);
    this.ctx.lineTo(...b.p);
    this.ctx.closePath();
    this.ctx.strokeStyle = 'rgb(255, 255, 255)';
    this.ctx.stroke();
  }

  drawCircle(a, r){
    this.ctx.beginPath();
    this.ctx.arc(...a.p, r, 0, 2 * Math.PI);
    this.ctx.fillStyle = 'rgb(0, 0, 255)';
    this.ctx.fill();
  }

  drawArrow(a, r, d){
    this.ctx.moveTo(...a.p);
    r.normalise();
    r = r.mult(d);
    let t = r.vPlus(a);
    this.ctx.lineTo(...t.p);
    let angle = Math.atan2(t.y - a.y, t.x - a.x);
    let head1 = new Vector(Math.cos(angle + Math.PI / 6), Math.sin(angle + Math.PI / 6)).mult(d/5);
    let head2 = new Vector(Math.cos(angle - Math.PI / 6), Math.sin(angle - Math.PI / 6)).mult(d/5);
    this.ctx.lineTo(...t.vMinus(head1).p);
    this.ctx.moveTo(...t.p);
    this.ctx.lineTo(...t.vMinus(head2).p);
  }

  drawPolygon(a, r, n, angle, getVector){
    this.ctx.beginPath();
    let theta = Math.PI * (2 / n);
    //angle = angle % theta;
    let segment = 2*r*Math.sin(angle/2);
    let phi = (Math.PI / 8) - (angle / 2);
    let d = 2*r*Math.sin(theta/2);
    let x = a.x - d/2 + segment*Math.cos(phi);
    let y = a.y - r - segment*Math.sin(phi);
    let polyVector = [new Vector(x, y)];
    let polyNormals = [];
    this.ctx.moveTo(x, y);
    for (let i=0; i<n-1; i++){
      x += d * Math.cos(i*theta + angle);
      y += d * Math.sin( i*theta + angle);
      if (getVector) {
        polyVector.push(new Vector(x, y));
        polyNormals.push(this.calculateNormal(polyVector[polyVector.length-2], polyVector[polyVector.length-1]));
      }
      else {
        this.ctx.lineTo(x, y);
      }
    }
    this.ctx.closePath();
    this.ctx.stroke();
    if (getVector) {
      polyNormals.push(this.calculateNormal(polyVector[polyVector.length-1], polyVector[0]));
      return [polyVector, polyNormals]
    }
  }

  recursiveReflection = (start, target, n) => {
    // Takes in the previous reflection point or source and the reflected ray or viewing direction
    // Initialise with source and viewing direction
    // n is recursion depth
    if (n === 0){
      return 1
    }

    // Calculate all intersections
    let intersections = [];
    for (let i=0; i<this.objects.length; i++){
      for (let j=1; j<this.objects[i].length; j++){
        intersections.push(this.calculateIntersect(start, target, this.objects[i][j-1], this.objects[i][j]));
      }
      // Add last intersection (between first and last vertex) if not a line segment
      if (this.objects[i].length > 2) {
        intersections.push(this.calculateIntersect(start, target, this.objects[i][this.objects[i].length-1], this.objects[i][0]));
      }
    }
    if (this.frame.length > 0) {
      for (let i = 1; i < this.frame.length; i++) {
        intersections.push(this.calculateIntersect(start, target, this.frame[i - 1], this.frame[i]));
      }
      intersections.push(this.calculateIntersect(start, target, this.frame[this.frame.length-1], this.frame[0]));
    }

    // Find intersection closest to reflection point
    let minDist = 100000000;
    let nearestIntersectIndex = -1;
    let dist = 0;
    for (let i=0; i<intersections.length; i++){
      if (intersections[i]) {
        dist = intersections[i].vMinus(start).l22;
        if (dist < minDist){
          nearestIntersectIndex = i;
          minDist = dist;
        }
      }
    }
    if (nearestIntersectIndex >= 0) {
      // Draw intersection and reflection ray
      this.drawLine(start, intersections[nearestIntersectIndex]);
      this.numberOfRays++;
      let normal = new Vector(null, null);
      if (nearestIntersectIndex >= this.normals.length) {
        normal = this.frame_normals[nearestIntersectIndex - this.normals.length];
      }
      else {
        normal = this.normals[nearestIntersectIndex]
      }
      if (!normal) {
        normal = this.frame_normals[nearestIntersectIndex - this.normals.length - 1];
      }
      this.drawCircle(intersections[nearestIntersectIndex], 4);
      let reflectedRay = this.reflect(intersections[nearestIntersectIndex].vMinus(start),
        normal).vPlus(intersections[nearestIntersectIndex]);
      if (this.shootMode){
        setTimeout( () => {
          this.recursiveReflection(intersections[nearestIntersectIndex], reflectedRay, n - 1)
        }, this.state.shootDelay);
        if (this.refraction) {
          let refractedRay = this.refract(intersections[nearestIntersectIndex].vMinus(start),
            normal,this.state.refractiveIndex).vPlus(intersections[nearestIntersectIndex]);
          setTimeout(  () => {
            this.recursiveReflection(intersections[nearestIntersectIndex], refractedRay, n - 1)
          }, this.state.shootDelay);
        }
      }
      else {
        this.recursiveReflection(intersections[nearestIntersectIndex], reflectedRay, n - 1);
        if (this.refraction) {
          let refractedRay = this.refract(intersections[nearestIntersectIndex].vMinus(start),
            normal,this.state.refractiveIndex).vPlus(intersections[nearestIntersectIndex]);
          this.recursiveReflection(intersections[nearestIntersectIndex], refractedRay, n - 1);
        }
      }


    }
  };


  calculateNormal(a, b){
    let c = b.vMinus(a);
    let n = new Vector(c.y, -c.x);
    n.normalise();
    return n;
  }

  clicked = (event) =>{
    let rect = this.cvs.getBoundingClientRect();
    if (!this.addMode && !this.polyDraw) {
      this.source.set(event.x - rect.left, event.y - rect.top);
      this.draw();
    }
    else if (this.polyDraw) {
      let poly = this.drawPolygon(new Vector(event.x - rect.left, event.y - rect.top), this.polyRadius, this.polyN, this.polyAngle, true);
      this.objects.push(poly[0]);
      this.normals.push(...poly[1]);
      this.objectsText.innerHTML = "Number of objects: " + this.objects.length.toString();
      this.edgesText.innerHTML = "Number of edges: " + this.normals.length.toString();
    }
    else {
      if (!this.addedFirstVertex) {
        this.objects.push([]);
        this.addedFirstVertex = true;
      }
      this.objects[this.objects.length - 1].push(new Vector(event.x - rect.left, event.y - rect.top));
      if (this.objects[this.objects.length - 1].length > 1) {
        this.normals.push(this.calculateNormal(this.objects[this.objects.length - 1][this.objects[this.objects.length - 1].length - 1],
          this.objects[this.objects.length - 1][this.objects[this.objects.length - 1].length - 2]));
        this.edgesText.innerHTML = "Number of edges: " + this.normals.length.toString();
      }
      this.draw();
    }
  };

  onScroll = (event) =>{
    if (this.polyDraw) {
      if (!(this.polyN === 3 && event.deltaY > 0)){
        this.polyN -= event.deltaY / 200;
        this.polyDrawText.innerHTML = "Polygon draw mode (P): " + (this.polyDraw ?
          "On (N="+this.polyN.toString()+", R="+this.polyRadius.toString()+", " +
          "θ="+(this.round((this.polyAngle*(180/Math.PI)%360), 3)).toString()+"°)"  : "Off");
        this.draw();
      }
    }
    if (this.multiRayMode) {
      if (!(this.multiRayN === 1 && event.deltaY > 0)){
        this.multiRayN -= event.deltaY / 200;
        this.multiRayText.innerHTML = "Multi-ray mode (M): " + (this.multiRayMode ? "On (N:"+this.multiRayN.toString()+")" : "Off");
        this.draw();
      }
    }
  };

  onMouseMove = (event) => {
    if (!(this.addMode && !this.polyDraw)) {
      let rect = this.cvs.getBoundingClientRect();
      this.view.set(event.x - rect.left , event.y - rect.top);
      if (!this.shootMode){
        this.draw();
      }
    }
  };

  addObject = (event) => {
    if (event.keyCode === 65) {
      this.addMode = !this.addMode;
      if (this.addMode) {
        this.addedFirstVertex = false;
        this.draw();
      }
      if (!this.addMode) {
        if (this.objects.length > 0) {
          if (this.objects[this.objects.length - 1].length > 2) {
            this.normals.push(this.calculateNormal(this.objects[this.objects.length - 1][0],
              this.objects[this.objects.length - 1][this.objects[this.objects.length - 1].length - 1]));
            this.edgesText.innerHTML = "Number of edges: " + this.normals.length.toString();
            this.objectsText.innerHTML = "Number of objects: " + this.objects.length.toString();
          } else if (this.objects[this.objects.length - 1].length === 2) {
            this.objectsText.innerHTML = "Number of objects: " + this.objects.length.toString();
          }
          else {
            this.objects.pop();
          }
        }
        this.draw();
      }
    }
    if (event.keyCode === 70) {
      if (this.frame_on){
        this.frame = [];
        this.frame_normals = [];
      }
      else {
        this.frame.push(new Vector(0, 0), new Vector(0, this.cvs.height),
          new Vector(this.cvs.width, this.cvs.height), new Vector(this.cvs.width, 0));
        this.frame_normals.push(new Vector(1, 0), new Vector(0, 1),
          new Vector(-1, 0), new Vector(0, -1));
      }
      this.frame_on = !this.frame_on;
      this.frameText.innerHTML = "Frame (F): " + (this.frame_on ? "On" : "Off");
      this.draw();
    }
    if (event.keyCode === 37) {
      if (this.polyDraw) {
        this.polyAngle -= Math.PI / 16;
        this.polyDrawText.innerHTML = "Polygon draw mode (P): " + (this.polyDraw ?
          "On (N="+this.polyN.toString()+", R="+this.polyRadius.toString()+", " +
          "θ="+(this.round((this.polyAngle*(180/Math.PI)%360), 3)).toString()+"°)"  : "Off");
      }
      this.draw();
    }
    if (event.keyCode === 38) {
      if (this.polyDraw) {
        this.polyRadius += 10;
        this.polyDrawText.innerHTML = "Polygon draw mode (P): " + (this.polyDraw ?
          "On (N="+this.polyN.toString()+", R="+this.polyRadius.toString()+", " +
          "θ="+(this.round((this.polyAngle*(180/Math.PI)%360), 3)).toString()+"°)"  : "Off");
      }
      else {
        this.recursionDepth++;
        this.recursionDepthText.innerHTML = "Recursion depth: " + this.recursionDepth.toString();
      }
      this.draw();
    }
    if (event.keyCode === 39) {
      if (this.polyDraw) {
        this.polyAngle += Math.PI / 16;
        this.polyDrawText.innerHTML = "Polygon draw mode (P): " + (this.polyDraw ?
          "On (N="+this.polyN.toString()+", R="+this.polyRadius.toString()+", " +
          "θ="+(this.round((this.polyAngle*(180/Math.PI)%360), 3)).toString()+"°)"  : "Off");
      }
      this.draw();
    }
    if (event.keyCode === 40) {
      if (this.polyDraw) {
        if (this.polyRadius >= 20) {
          this.polyRadius -= 10;
          this.polyDrawText.innerHTML = "Polygon draw mode (P): " + (this.polyDraw ?
            "On (N="+this.polyN.toString()+", R="+this.polyRadius.toString()+", " +
            "θ="+(this.round((this.polyAngle*(180/Math.PI)%360), 3)).toString()+"°)"  : "Off");
        }
      }
      else {
        if (this.recursionDepth !== 1) {
          this.recursionDepth--;
          this.recursionDepthText.innerHTML = "Recursion depth: " + this.recursionDepth.toString();
        }
      }
      this.draw();
    }
    if (event.keyCode === 82) {
      if (this.polyDraw){
        this.polyRadius = 50;
        this.polyN = 8;
        this.polyAngle = 0;
        this.polyDrawText.innerHTML = "Polygon draw mode (P): " + (this.polyDraw ?
          "On (N="+this.polyN.toString()+", R="+this.polyRadius.toString()+", " +
          "θ="+(this.round((this.polyAngle*(180/Math.PI)%360), 3)).toString()+"°)"  : "Off");
      }
      else {
        this.recursionDepth = 3;
        this.recursionDepthText.innerHTML = "Recursion depth: " + this.recursionDepth.toString();
        this.multiRayN = 12;
        this.multiRayText.innerHTML = "Multi-ray mode (M): " + (this.multiRayMode ? "On (N:"+this.multiRayN.toString()+")" : "Off");
      }
      this.draw();
    }
    if (event.keyCode === 67) {
      this.objects = [];
      this.normals = [];
      this.objectsText.innerHTML = "Number of objects: " + this.objects.length.toString();
      this.edgesText.innerHTML = "Number of edges: " + this.normals.length.toString();
      this.draw();
    }
    if (event.keyCode === 84) {
      this.refraction = !this.refraction;
      this.refractionText.innerHTML = "Refraction (T): " + (this.refraction ? "On" : "Off");
      this.draw();
    }
    if (event.keyCode === 83) {
      this.showNormals = !this.showNormals;
      this.normalsText.innerHTML = "Surface normals (S): " + (this.showNormals ? "On" : "Off");
      if (this.addMode && (!(this.objects.length > 0) || !(this.objects[this.objects.length - 1].length > 0))){
        this.objects.pop();
        this.popped = !this.popped;
      }
      this.draw();
    }
    if (event.keyCode === 80) {
      this.polyDraw = !this.polyDraw;
      this.polyDrawText.innerHTML = "Polygon draw mode (P): " + (this.polyDraw ?
        "On (N="+this.polyN.toString()+", R="+this.polyRadius.toString()+", " +
        "θ="+(this.round((this.polyAngle*(180/Math.PI)%360), 3)).toString()+"°)"  : "Off");
      this.draw();
    }
    if (event.keyCode === 77) {
      this.multiRayMode = !this.multiRayMode;
      this.multiRayText.innerHTML = "Multi-ray mode (M): " + (this.multiRayMode ? "On (N:"+this.multiRayN.toString()+")" : "Off");
      this.draw();
    }
    if (event.keyCode === 81) {
      this.shootMode = !this.shootMode;
      this.shootModeText.innerHTML = "Shoot mode (Q): " + (this.shootMode ? "On" : "Off");
      this.draw();
    }
    if (event.keyCode === 32) {
      if (this.shootMode) {
        this.draw();
      }
    }
  };

  draw_border(){
    this.ctx.clearRect(0, 0, this.cvs.width, this.cvs.height);
    // Draw frame
    if (this.frame.length > 0) {
      this.ctx.beginPath();
      this.ctx.moveTo(...this.frame[0].p);
      for (let i = 1; i < this.frame.length; i++) {
        this.ctx.lineTo(...this.frame[i].p);
      }
      this.ctx.closePath();
      this.ctx.strokeStyle = 'rgb(255, 0, 0)';
      this.ctx.lineWidth = 4;
      this.ctx.stroke();
      this.ctx.strokeStyle = 'rgb(0, 0, 0)';
      this.ctx.lineWidth = 1;
    }
    else {
      this.ctx.lineWidth = 4;
      this.ctx.strokeStyle = 'rgb(255, 255, 255)';
      this.ctx.strokeRect(0, 0, this.cvs.width, this.cvs.height);
      this.ctx.lineWidth = 1;
    }
  }

  drawNormals(){
    let k = 0;
    this.ctx.beginPath();
    for (let i = 0; i < this.objects.length; i++) {
      for (let j = 1; j < this.objects[i].length; j++) {
        this.drawArrow(this.objects[i][j].vPlus(this.objects[i][j-1]).mult(0.5), this.normals[k], 30);
        k++;
      }
      if (this.objects[i].length > 2){
        if (!this.normals[k]) {
          this.drawArrow(this.objects[i][0].vPlus(this.objects[i][this.objects[i].length-1]).mult(0.5),
            this.calculateNormal(this.objects[i][0], this.objects[i][this.objects[i].length - 1]) ,30);
        }
        else {
          this.drawArrow(this.objects[i][0].vPlus(this.objects[i][this.objects[i].length-1]).mult(0.5), this.normals[k], 30);
        }
        k++;
      }
    }
    this.ctx.closePath();
    this.ctx.strokeStyle = 'rgb(255, 255, 255)';
    this.ctx.stroke();
  }

  drawObjects(){
    if (this.objects.length > 0) {
      if (this.objects[this.objects.length - 1].length > 0) {
        for (let i = 0; i < this.objects.length; i++) {
          this.ctx.beginPath();
          this.ctx.moveTo(...this.objects[i][0].p);
          for (let j = 1; j < this.objects[i].length; j++) {
            this.ctx.lineTo(...this.objects[i][j].p);
          }
          this.ctx.closePath();
          this.ctx.strokeStyle = 'rgb(255, 255, 255)';
          this.ctx.stroke();
          if (this.refraction) {
            this.ctx.fillStyle = 'rgba(255,148,0,0.38)';
            this.ctx.fill();
          }
        }
      }
    }
  }

  drawMultiRays(){
    let ray = new Vector(0, 0);
    let angle = Math.PI * (2 / this.multiRayN);
    for (let i=0; i<this.multiRayN; i++) {
      ray = new Vector(this.round(Math.sin(i*angle), 4), -this.round(Math.cos(i*angle), 4));
      this.recursiveReflection(this.view, this.view.vPlus(ray), this.recursionDepth);
    }
  }

  draw(){
    this.draw_border();
    this.numberOfRays = 0;
    // Draw edit mode background
    if (this.addMode){
      this.ctx.fillStyle = 'rgb(0, 0, 255, 0.2)';
      this.ctx.fillRect(2, 2, this.cvs.width-4, this.cvs.height-4);
    }
    // Draw source
    if (!this.multiRayMode) {
      this.drawCircle(this.source, 3);
    }
    // Polygon mode
    if (this.polyDraw) {
      this.drawPolygon(this.view, this.polyRadius, this.polyN, this.polyAngle, false);
    }

    //Draw objects
    this.drawObjects();

    if (this.showNormals){
      this.drawNormals();
    }
    if (this.popped){
      this.objects.push([]);
      this.popped = !this.popped;
    }
    if (!(this.polyDraw)) {
      if (this.multiRayMode){
        this.drawMultiRays();
      }
      else {
        this.recursiveReflection(this.source, this.view, this.recursionDepth);
      }
    }
    this.raysText.innerHTML = "Number of rays: " + this.numberOfRays.toString();
  }


  render() {
    return (
      <Paper className={"rayPaper"}>
        <div style={{height: "5em"}}/>
        <canvas id="canvas" width={0.99*window.innerWidth} height={0.73*window.innerHeight}/>
        <section className="info">
          <div className="row">
            <div className="rtcard" id="recursionDepth"/>
            <div className="rtcard" id="objects"/>
            <div className="rtcard" id="edges"/>
          </div>
          <div className="row">
            <div className="rtcard" id="frame"/>
            <div className="rtcard" id="refraction"/>
            <div className="rtcard" id="normals"/>
          </div>
          <div className="row">
            <div className="rtcard" id="polyDraw"/>
            <div className="refr">
              <label htmlFor="refractiveIndex">Refractive index: </label>
              <input value={this.state.refractiveIndex} placeholder="1.33" id="refractiveIndex"
                     onChange={event=>{this.setState({refractiveIndex: event.target.value})}} />
            </div>
            <div className="rtcard" id="rays"/>
          </div>
          <div className="row">
            <div className="rtcard" id="multiRay"/>
            <div className="refr">
              <div id="shootMode"/>
              <input value={this.state.shootDelay} placeholder="300" id="shootDelay"
                     onChange={event=>{this.setState({shootDelay: event.target.value})}} />
            </div>
          </div>
        </section>
      </Paper>
    );
  }
}

