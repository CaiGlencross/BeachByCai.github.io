var GameObject2D = function(mesh) { 
  this.mesh = mesh;

  this.position = new Vec3(0, 0, 0); 
  this.orientation = 0; 
  this.scale = new Vec3(1, 1, 1);
  this.mass = 1;
  this.velocity = new Vec3(0,0,0);
  this.acceleration = new Vec3(0,0,0);


  //angular shit
  this.angularVelocity = 0;
  this.angularAcceleration = 0;

  this.modelMatrix = new Mat4(); 
  this.updateModelTransformation(); 





  //edges
  this.bottomEdge = this.position.y-(this.scale.y);
  this.topEdge = this.position.y+(this.scale.y);
  this.rightEdge = this.position.x+(this.scale.x);
  this.leftEdge = this.position.x-(this.scale.x);

};

GameObject2D.prototype.updateModelTransformation = function(){ 
  this.modelMatrix.set(). 
    scale(this.scale). 
    rotate(this.orientation). 
    translate(this.position);

};

GameObject2D.prototype.HUDdraw = function(){ 

  Material.shared.modelViewProjMatrix.set(). 
    mul(this.modelMatrix);

  this.mesh.draw(); 
};


GameObject2D.prototype.draw = function(camera,lightpositionArray, lightpowerdensityArray){ 

    Material.shared.modelViewProjMatrix.set(). 
      mul(this.modelMatrix).mul(camera.viewProjMatrix);

    Material.shared.lightPos[0].set(lightpositionArray[0]);
    Material.shared.lightPowerDensity[0].set(lightpowerdensityArray[0]);

    Material.shared.camPos.set(camera.position);
    Material.shared.camViewProjMatrix.set(camera.viewMatrix);

    var E = new Mat4().set().translate(camera.position).invert();
    var VP=camera.viewProjMatrix.clone().invert();
    var rayDirMatrix = VP.mul(E);

    Material.shared.rayDirMatrix.set(rayDirMatrix);

    this.mesh.draw();
};

GameObject2D.prototype.updateEdges = function(){
if(this.parent==null){
  this.bottomEdge = this.position.y-(this.scale.y);
  this.topEdge = this.position.y+this.scale.y;
  this.rightEdge = this.position.x+this.scale.x;
  this.leftEdge = this.position.x-this.scale.x;
}else{
  this.bottomEdge = (this.parent.position.y+(this.position.y*this.parent.scale.y))-(this.scale.y*this.parent.scale.y);
  this.topEdge = (this.position.y+this.parent.position.y*this.parent.scale.y)+(this.scale.y*this.parent.scale.y);
  this.rightEdge = (this.position.x+this.parent.position.x*this.parent.scale.x)+(this.scale.x*this.parent.scale.x);
  this.leftEdge = (this.position.x+this.parent.position.x*this.parent.scale.x)-(this.scale.x*this.parent.scale.x);

}

}


GameObject2D.prototype.move = function(dt){

	this.velocity.add(this.acceleration.times(dt));
	this.position.add(this.velocity.times(dt));
  this.angularVelocity+=this.angularAcceleration*dt;
  this.orientation+=this.angularVelocity*dt;
	this.updateModelTransformation();

  this.updateEdges();
}
