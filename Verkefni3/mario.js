/////////////////////////////////////////////////////////////////
//    S�nid�mi � T�lvugraf�k
//     S�nir notkun � lyklabor�satbur�um til a� hreyfa spa�a
//
//    Hj�lmt�r Hafsteinsson, jan�ar 2022
/////////////////////////////////////////////////////////////////
var canvas;
var gl;
var ymove = 0;
var ymove1 = 0;
var verticesStart;
var xmove = 0;
var vertices;
var pengeRand;
var pengeVertices;
var hopp = false;


window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.8, 0.8, 0.8, 1.0 );

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

     vertices = [
        vec2( -0.1, -0.9 ),
        vec2( -0.1, -0.74 ),
        vec2(  0.1, -0.82 )
    ];
    verticesStart = JSON.parse(JSON.stringify(vertices));
    pengeVertices = [
       vec2( -0.04, -0.04 ),
       vec2( -0.04, 0.04 ),
       vec2(  0.04, 0.04 ),
       vec2(  0.04, -0.04 )
   ];
      penge();

    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, 2*4*7, gl.DYNAMIC_DRAW );

    // Associate out shader variables with our data buffer
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    // Event listener for keyboard
    window.addEventListener("keydown", function(e){
        switch( e.keyCode ) {
            case 37:	// vinstri �r
                xmove = -0.04;
                break;
            case 39:	// h�gri �r
                xmove = 0.04;
                break;
            case 38:	// hopp �r
                hopp = true;
                ymove = 0.02;
                break;
            default:
                xmove = 0.0;
        }
        for(i=0; i<3; i++) {
            vertices[i][0] += xmove;
        }
        xmove = 0;
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(vertices));
        gl.bufferSubData(gl.ARRAY_BUFFER, 2*4*3, flatten(pengeVertices));
    } );
    locColor = gl.getUniformLocation( program, "litur" );
    locPenge = gl.getUniformLocation( program, "pengePosition" );
    locIsPenge = gl.getUniformLocation( program, "isPenge" );
    render();
}
function jump() {
  if (ymove1 >= 0){
    ymove-= 0.001;
    ymove1 += ymove;
    for(i=0; i<3; i++) {
        vertices[i][1] = ymove1+verticesStart[i][1];
    }
  }
  else {
    ///hopp = false;
    ymove1 = 0.0;
    ymove = 0.0;
  }
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(vertices));
}
function penge(){
  pengeRand = vec2(Math.random()*1.8-0.9,Math.random()*-0.9);

}
function collision(){
  midja = scale(1/3.0,add(add(vertices[0], vertices[1]),vertices[2]));
  if (length(add(midja,negate(pengeRand))) <= 0.2){
    penge();
  }
  console.log(verticesStart[0][1]);
}


function render() {

    gl.clear( gl.COLOR_BUFFER_BIT );
    jump();
    collision();
    gl.uniform1i( locIsPenge, false);
    gl.uniform4fv( locColor, vec4(1.0,0.0,0.0,1.0));
    gl.drawArrays( gl.TRIANGLE_FAN, 0, 3 );

    gl.uniform4fv( locColor, vec4(1.0,1.0,0.0,1.0));
    gl.uniform1i( locIsPenge, true);
    gl.uniform2fv( locPenge, pengeRand);
    gl.drawArrays( gl.TRIANGLE_FAN, 3, 4 );
    window.requestAnimFrame(render);
}
