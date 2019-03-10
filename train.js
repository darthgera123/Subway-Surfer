let train = class {
    constructor(gl, pos, height, width, depth) {
        this.positionBuffer = gl.createBuffer();
        this.height = height;
        this.width = width;
        this.depth = depth;
        this.static =0;
        this.angle=0;
        this.uGray=0;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        this.positions = [
            // Front face
            -height, -width, depth,
            height, -width, depth,
            height, width, depth,
            -height, width, depth,
            //Back Face
            -height, -width, -depth,
            height, -width, -depth,
            height, width, -depth,
            -height, width, -depth,
            //Top Face
            -height, width, -depth,
            height, width, -depth,
            height, width, depth,
            -height, width, depth,
            //Bottom Face
            -height, -width, -depth,
            height, -width, -depth,
            height, -width, depth,
            -height, -width, depth,
            //Left Face
            -height, -width, -depth,
            -height, width, -depth,
            -height, width, depth,
            -height, -width, depth,
            //Right Face
            height, -width, -depth,
            height, width, -depth,
            height, width, depth,
            height, -width, depth,
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.positions), gl.STATIC_DRAW);
        this.pos = pos;
  // Now set up the texture coordinates for the faces.

  const textureCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);

  const textureCoordinates = [
    // Front
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Back
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Top
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Bottom
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Right
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Left
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
  ];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates),
                gl.STATIC_DRAW);

  // Build the element array buffer; this specifies the indices
  // into the vertex arrays for each face's vertices.

  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

  // This array defines each face as two triangles, using the
  // indices into the vertex array to specify each triangle's
  // position.

  const indices = [
    0,  1,  2,      0,  2,  3,    // front
    4,  5,  6,      4,  6,  7,    // back
    8,  9,  10,     8,  10, 11,   // top
    12, 13, 14,     12, 14, 15,   // bottom
    16, 17, 18,     16, 18, 19,   // right
    20, 21, 22,     20, 22, 23,   // left
  ];

  // Now send the element array to GL

  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(indices), gl.STATIC_DRAW);


        this.buffer = {
            position: this.positionBuffer,
            textureCoord: textureCoordBuffer,
            indices: indexBuffer,
        }
    }
    drawBase(gl,projectionMatrix,programInfo,deltaTime,texture){
        const modelViewMatrix = mat4.create();
        mat4.translate(
            modelViewMatrix,
            modelViewMatrix,
            this.pos
        );
        var PI = 3.14159265359;
        this.angle = this.angle*PI/180;
        mat4.rotate(modelViewMatrix,  // destination matrix
            modelViewMatrix,  // matrix to rotate
            this.angle,     // amount to rotate in radians
            [0, 0, 1]);       // axis to rotate around (axis)
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
          gl.uniform1i(programInfo.uniformLocations.uGray, this.uGray);
          {
            const vertexCount = 36;
            const type = gl.UNSIGNED_SHORT;
            const offset = 0;
            gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
          }
          gl.uniform1i(programInfo.uniformLocations.uGray, 0);
        
    }
    retFrontFace(){
        var temp = this.pos;
        temp = [temp[0]-this.height,temp[1],temp[2]];
        return temp;
    }
    retHeight(){
        return this.height;
    }
    moveTrain(){
        if(this.static)
            this.pos[0] -= 0.5;
        //this.setPosition();
    }

}