let coin = class {
    constructor(gl, pos,r) {
        this.positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        var n =50;
        var PI = 3.14159265359;
        this.angle =0;
        this.positions=[];
        for (var i=0;i<n;i++){
            this.positions[9*i] =0.0;
		    this.positions[9*i+1] =0.0;
		    this.positions[9*i+2] =0.0;
		
		    this.positions[9*i+3] =0.0;
		    this.positions[9*i+4] =r*Math.cos(2*(PI/n)*i);
		    this.positions[9*i+5] =r*Math.sin(2*(PI/n)*i);
		
		    this.positions[9*i+6] =0.0;
		    this.positions[9*i+7] =r*Math.cos(2*((i+1)%n)*(PI/n));
		    this.positions[9*i+8] =r*Math.sin(2*((i+1)%n)*(PI/n));
        }
        
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.positions), gl.STATIC_DRAW);
        this.pos = pos;
        // Now set up the texture coordinates for the faces.    
        

  // Now set up the texture coordinates for the faces.

  const textureCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
  //for every triangle we add
  var textureCoordinates = [];
  for(var i=0;i<4*n;i++){
      textureCoordinates.push(0.0);
      textureCoordinates.push(0.0);
      textureCoordinates.push(1.0);
      textureCoordinates.push(0.0);
      textureCoordinates.push(1.0);
      textureCoordinates.push(1.0);
      textureCoordinates.push(0.0);
      textureCoordinates.push(1.0);
  }
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates),
                gl.STATIC_DRAW);

  // Build the element array buffer; this specifies the indices
  // into the vertex arrays for each face's vertices.

  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

  // This array defines each face as two triangles, using the
  // indices into the vertex array to specify each triangle's
  // position.
  var indices = [];
  for(var i=0;i<4*n;i++){
      indices.push(i);
  }
//   const indices = [
//     0,  1,  2,      0,  2,  3,    // front
//     4,  5,  6,      4,  6,  7,    // back
//     8,  9,  10,     8,  10, 11,   // top
//     12, 13, 14,     12, 14, 15,   // bottom
//     16, 17, 18,     16, 18, 19,   // right
//     20, 21, 22,     20, 22, 23,   // left
//   ];

  // Now send the element array to GL

  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(indices), gl.STATIC_DRAW);


        this.buffer = {
            position: this.positionBuffer,
            textureCoord: textureCoordBuffer,
            indices: indexBuffer,
        }
    }
    rotate(){
        
    }
    drawBase(gl,projectionMatrix,programInfo,deltaTime,texture){
        const modelViewMatrix = mat4.create();
        var PI = 3.14159265359;
        this.angle += 5*PI/180;
        mat4.translate(
            modelViewMatrix,
            modelViewMatrix,
            this.pos
        );
          mat4.rotate(modelViewMatrix,  // destination matrix
              modelViewMatrix,  // matrix to rotate
              this.angle,     // amount to rotate in radians
              [0, 1, 0]);       // axis to rotate around (axis)
        {
            const numComponents = 3;
            const type = gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer.position);
            gl.vertexAttribPointer(
                programInfo.attribLocations.vertexPosition,
                numComponents,
                type,
                normalize,
                stride,
                offset);
            gl.enableVertexAttribArray(
                programInfo.attribLocations.vertexPosition);
          }
        
          // Tell WebGL how to pull out the texture coordinates from
          // the texture coordinate buffer into the textureCoord attribute.
          {
            const numComponents = 2;
            const type = gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer.textureCoord);
            gl.vertexAttribPointer(
                programInfo.attribLocations.textureCoord,
                numComponents,
                type,
                normalize,
                stride,
                offset);
            gl.enableVertexAttribArray(
                programInfo.attribLocations.textureCoord);
          }
        
          // Tell WebGL which indices to use to index the vertices
          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffer.indices);
        
          // Tell WebGL to use our program when drawing
        
          gl.useProgram(programInfo.program);
        
          // Set the shader uniforms
        
          gl.uniformMatrix4fv(
              programInfo.uniformLocations.projectionMatrix,
              false,
              projectionMatrix);
          gl.uniformMatrix4fv(
              programInfo.uniformLocations.modelViewMatrix,
              false,
              modelViewMatrix);
        
          // Specify the texture to map onto the faces.
        
          // Tell WebGL we want to affect texture unit 0
          gl.activeTexture(gl.TEXTURE0);
        
          // Bind the texture to texture unit 0
          gl.bindTexture(gl.TEXTURE_2D, texture);
        
          // Tell the shader we bound the texture to texture unit 0
          gl.uniform1i(programInfo.uniformLocations.uSampler, 0);
        
          {
            const vertexCount = 150;
            const type = gl.UNSIGNED_SHORT;
            const offset = 0;
            gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
          }
        
    }

}